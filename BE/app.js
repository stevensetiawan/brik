"use strict"
require('dotenv').config();
const express = require('express');
const app = express();
const passport = require('passport');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const { ValidationError } = require('express-validation')
const cookieParser = require('cookie-parser')
const compress = require('compression');
const methodOverride = require('method-override');
const session = require("express-session");
const helmet = require('helmet');
const path = require('path');
const cors = require('cors');
const router = require('./routes');
const { logs, redisConfig } = require('./config/vars');
const error = require('./middlewares/error');

// enable this if you run behind a proxy (e.g. nginx)
app.set('trust proxy', 1);

// request logging. dev: console | production: file
app.use(morgan(logs));

app.use(cookieParser()); // read cookies (needed for auth)

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// gzip compression
app.use(compress());

// lets you use HTTP verbs such as PUT or DELETE
// in places where the client doesn't support it
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet());

const {
  createClient
} = require("redis")
const RedisStore = require("connect-redis").default

app.enable("trust proxy")

app.get('/', (req, res) => {
  res.status(200).send({
    status: 'success',
    message: "Testing"
  })
})

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))
app.use(express.static(path.join(__dirname + '/public')))

const redisClient = createClient({
  host: redisConfig.redis_host,
  port: redisConfig.redis_port,
  // url: 'redis://redis:6379',
  legacyMode: false
})
redisClient.connect().catch(console.error)

app.use(
  session({
    store: new RedisStore({
      client: redisClient,
      ttl: 864000,
      logErrors: true
    }),
    secret: process.env.SECRET,
    resave: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000
    },
    unset: 'destroy',
    saveUninitialized: true
  })
)

// initialize Passport
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/v1', router)

app.use(function(err, req, res, next) {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(err)
  }

  return res.status(500).json(err)
})
// if error is not an instanceOf APIError, convert it.
app.use(error.converter);

// catch 404 and forward to error handler
app.use(error.notFound);

// error handler, send stacktrace only during development
app.use(error.handler);

module.exports = app