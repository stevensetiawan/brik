'use strict';
const passport = require('passport');
const localStrategy = require('passport-local').Strategy
const JWTstrategy = require('passport-jwt').Strategy
const ExtractJWT = require('passport-jwt').ExtractJwt
const isValidPassword = require('../helpers/bcrypt').checker
const jwt = require('jsonwebtoken')
const { sendResponse } = require('../helpers/response');
const {User} = require("../models");
const redis = require('../config/redis_connector');

// Setup work and export for the JWT passport strategy
passport.serializeUser((req, user, done) => {
  done(null, user)
})

passport.deserializeUser((req, user, done) => {
  done(null, user)
})

passport.use(
  'signup',
  new localStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    async (req, email, password, done) => {
      try {
        const user = await User.insert(req.body)
        return done(null, user)
      } catch (error) {
        done(error);
      }
    }
  )
)

passport.use(
  'login',
  new localStrategy({
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        const user = await User.findOneByUsername({
          email
        })
        
        if (!user) {
          console.log("user not found");
          return done(null, false, {
            message: 'User not found'
          })
        }

        if(user.is_locked){
          return done(null, false, {
            message: 'Your Account is Locked, Please Contact Administrator'
          })
        }
        
        const validate = await isValidPassword(password, user?.password)
        console.log(validate,'ini validate');


        if (!validate) {
          const invalid_loogin_counter = parseInt(user.invalid_login_count)  +1;
          await User.count_invalid_count(user?.id, invalid_loogin_counter);

          if(invalid_loogin_counter >= 3){
            await User.lockedAccount(user?.id);
            return done(null, false, {
              message: 'Wrong Password, Your Account is Locked, Please Contact Administrator'
            })
          }else{
            return done(null, false, {
              message: 'Wrong Password'
            })
          }
      
        }
        const updateLastLogin = await User.updateLastUserLogin(user?.id);

        return done(null, user, {
          message: 'Logged in Successfully'
        })
      } catch (error) {
        return done(error);
      }
    }
  )
)

exports.auth = async (req, res, next) => {
  passport.authenticate(
    'login',
    async (err, user, info) => {
      try {
        if (err) {
          console.log(err,'ini error')
          const error = new Error('An error occurred.');
          return next(error);
        } else if (!user) {
          const error = new Error(info.message);
          return next(error);
        }

        req.login(
          user, {
            session: true
          },
          async (error) => {
            if (error) return next(error);
            const body = {
              id: user.id,
              email: user.email,
              role: user.role,
              name : user.name
            }
            user.token = await jwt.sign(
              {
                user: body
              }, process.env.SECRET, 
              {
                expiresIn: 60000
              }
            );

            const result = {
              err: null,
              message: info.message,
              data: user,
              code: 200
            }
            return sendResponse(result, res);
          }
        );
      } catch (error) {
        return next(error);
      }
    }
  )(req, res, next)
}

exports.register = async (req, res, next) => {
  passport.authenticate(
    'signup', async (err, user, info) => {
      try {
        if (err || !user) {
          const error = new Error('An error occurred.')
          return next(error)
        }

        req.login(
          user, {
            session: true
          },
          async (error) => {
            if (error) return next(error)
            const body = {
              email: user.email,
              role: user.role
            }
            const token = await jwt.sign({
              user: body
            }, process.env.SECRET, {
              expiresIn: 60000
            })
            
            return res.json({
              token
            })
          }
        )
      } catch (error) {
        return next(error);
      }
    }
  )(req, res, next)
}

passport.use(
  new JWTstrategy({
      secretOrKey: process.env.SECRET,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
    },
    async (token, done) => {
      try {
        let expiration_date = new Date(token.exp * 1000)
        if (expiration_date < new Date()) {
          return done(null, false)
        }
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
)

exports.logout = async (req, res, next) => {
  try {

    console.log("logout dari authentication:", req.session);
    console.log("req.cookies['jwt']: ",req.cookies['jwt'])
    // console.log("req.logout:", req.logOut());
    
  
  
    // Remove session data on server-side
    req.logout(function(err) {
      if (err) { return next(err); }
        req.session.destroy((err) => {
          if (err) {
            return next(err);
          }
          res.clearCookie('connect.sid');
          console.log("logout dari authentication:", req.session);
        });
        
        const result = {
          err: null,
          message: "logout success",
          data: "logout success",
          code: 200
        }
        return sendResponse(result, res);
    });
   
  } catch (error) {
    console.log("error >>>", error)
    return next(error);
  }
}

// exports.logout = async (req, res, next) => {
//   console.log("admin logout");
//   try {

//     if (req.isAuthenticated()) {
//         console.log("logout dari authentication:", req.session);
//         req.logout(function(err) {
//           if (err) { return next(err); }
           
//         });
     
        
//           // req.flushdb(function(err) {
//           //   if (err) { return next(err); }
//           //     console.log(err)
//           // });

//         res.clearCookie('connect.sid')
//         const result = {
//           err: null,
//           message: "logout success",
//           data: "logout success",
//           code: 200
//         }
//           return res.status(200).send(result);
//           // return sendResponse(result, res);
//             // redis.flushdb()
      
//     } else {
//         console.log("logout dari  tidak authentication");
//     }


//   } catch (error) {
//     console.log("error >>>", error)
//     return next(error);
//   }
// };
