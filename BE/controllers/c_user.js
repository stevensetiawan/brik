"use strict"
const { User } = require('../models');
const { sendResponse, paginationResponse } = require('../helpers/response');

exports.create_new_user = async (req, res, next) => {
  try {
      const res_insert = await User.insert(req.body);
      const result = {
        message: "success create new data",
        code: 200,
        data: res_insert
      }
      return sendResponse(result, res) 
  } catch (error) {
    return next(error);
  }
};

exports.getUserByUsername = async (req, res, next) => {
  try {
    const data = {
      "email" :  req.params.email
    }
    const user = await User.findOneByUsername(data)
    if (user) {
      const result = {
        data: user,
        code: 200
      }
      return sendResponse(result, res);
      
    } else {
      const error = new Error("User Id Not Found");
      return next(error);
    }
  } catch (err) {
    return next(err);
  }
};

exports.getUserId = async (req, res, next) => {
  try {
   
    const data = {
      id: req.params.id
    }
    const user = await User.findOneById(data)
    if (user) {
      const result = {
        data: user,
        code: 200
      }
      return sendResponse(result, res);
      
    } else {
      const error = new Error("User Id Not Found");
      return next(error);
    }
    

  } catch (err) {
    return next(err);
  }
};

exports.list = async(req, res, next)=>{
  
    let start = req.body.start
    let length = req.body.length 
    let direction = req.body.order[0].dir
    let search = req.body.search.value
    let ret = await db_admin_legal.getList({
        start: parseInt(start),
        length: parseInt(length),
        search: search,
        direction: direction,
    })
    let count = await User.getCountList({
        start: parseInt(start),
        length: parseInt(length),
        search: search,
        direction: direction,
    })
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify({
        data: ret,
        recordsTotal: count,
        recordsFiltered: count,
    }));
};

exports.getUsers = async (req, res, next) => {

  try {
  

    const showentry = parseInt (req.query.showentry); //rows
    const page = parseInt(req.query.page); //page ke berapa
    const order = req.query.order; //desc asc
    const key = req.query.key; //field for orders
    const search = req.query.search;
     
    // List Data 
    const resList  = await User.getDataPagination(showentry, page, order, key, search); 

    const result = {
      code : 200,
      data : resList
    
    }
     
    return paginationResponse(result, res);
     
  } catch (err) {
    console.log(err);
    return next(err);
  }
     
};

exports.getAllUser = async (req, res, next) => {

  try {
    
    // List Data 
    const resList  = await User.getAllUser(); 

    const result = {
      code : 200,
      data : resList
    
    }

    return sendResponse(result, res);
     
  } catch (err) {
    console.log(err);
    return next(err);
  }
     
};

exports.updateUser = async (req, res, next) => {
  try {
    const id = req.params.id
    
    const user = await User.findOneById({ id: id})
    if (user) {
      const payload = req.body
      const updateUser = await User.UpdateDataUser(
        id, payload
      )
     
      const result = {
        code: 200,
        message: "Success Updated Data User",
        data: updateUser
      }
      return sendResponse(result, res);
      
      
    } else {
      const error = new Error("User Not Found");
      return next(error);
    }    
  } catch (err) {
    return res.status(409).send({
      message: err.message || "Error to update data User"
    })
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    
    const id = req.params.id
    const res_del = await User.findByIdAndRemove(id)

    if (res_del == "success") {
      const result = {
        message: "Success Deleted User",
        code: 200
      }
      return sendResponse(result, res);
    } else {
      const error = new Error("User Id Not Found");
      return next(error);
    }
    
  } catch (err) {
    return res.status(409).send({
      message: err.message || "Error to delete User"
    })
  }
};