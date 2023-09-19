"use strict"
const { Product } = require('../models');
const { sendResponse, paginationResponse } = require('../helpers/response');
const multer = require('multer');
const imagekit = require('../lib/imagekit');

const upload = multer({ dest: 'uploads/' });

exports.create_product = async (req, res, next) => {
  try {
    const split = req.file.originalname.split('.');
    const ext = split[split.length - 1];
    const image = await imagekit.upload({
      file: req.file.buffer,
      fileName: `IMG-${Date.now()}.${ext}`
    })

    const res_insert = await Product.create(req.body, image.url);
    const result = {
      message: "success create new data",
      code: 200,
      data: res_insert
    }
    return sendResponse(result, res);

  } catch (error) {
    return next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const id = req.params.id
    if(req.file){
      const split = req.file.originalname.split('.');
      const ext = split[split.length - 1];
      const image = await imagekit.upload({
        file: req.file.buffer,
        fileName: `IMG-${Date.now()}.${ext}`
      })
      req.body.image = image?.url
      const res_update = await Product.updateProduct(id, req.body);
      if(res_update.status == false){
        const result = {
          err: res_update.message,
          code: 401,
          message: "Failed Updated Data Product, " + res_update.message,
        }
        return sendResponse(result, res);
      }else{
        const result = {
          code: 200,
          message: "Success Updated Data Product",
          data: res_update
        }
        return sendResponse(result, res);
      }
    } else {
      const res_update = await Product.updateProduct(id, req.body);

      if(res_update.status == false){
        const result = {
          err: res_update.message,
          code: 401,
          message: "Failed Updated Data Product, " + res_update.message,
        }
        return sendResponse(result, res);
      }else{
        const result = {
          code: 200,
          message: "Success Updated Data Product",
          data: res_update
        }
        return sendResponse(result, res);
      }
    }
  } catch (error) {
    return next(error);
  }
};

exports.setActiveProduct = async (req, res, next) => {
  try {
    const res_update = await Product.setActiveProduct(req.body);

    if(res_update.status == false){
      const result = {
        err: res_update.message,
        code: 401,
        message: "Failed Updated Data Product, " + res_update.message,
      }
      return sendResponse(result, res);
    }else{
    
      const result = {
        code: 200,
        message: "Success Updated Data Product",
        data: res_update
      }
      return sendResponse(result, res);
    }
   

  } catch (error) {
    return next(error);
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const showentry = parseInt (req.query.showentry); //rows
    const page = parseInt(req.query.page); //page ke berapa
    const order = req.query.order; //desc asc
    const key = req.query.key; //field for orders
    const search = req.query.search;
    // const is_active = req.query.is_active;
        
    const payload = {
      showentry: showentry,
      search: search,
      page: page,
      order: order,
      key: key
    }
     
    // List Data 
    
    const resList  = await Product.getDataProductPagination1(payload); 

    if(resList.data){
      const result = {
        code : 200,
        data : resList
      }
      
      return paginationResponse(result, res);
    }
  } catch (err) {
    return next(err);
  }
     
};

exports.getDetailProduct = async (req, res, next) => {
  try {
   
    const data = {
      product_id: req.params.id,
    }

    let res_query = await Product.findDetailProduct(data);

    if(res_query){
      const result = {
        data: res_query,
        code: 200
      }
      return sendResponse(result, res);
    }else{
      const result = {
        data: null,
        code: 200, 
        message: "DATA NOT FOUND"
      }
      return sendResponse(result, res);
    }
  } catch (err) {
    return next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    
    const id = req.params.id
    const res_del = await Product.softDeleteProduct(id)

    if (res_del == "success") {
      const result = {
        message: "Success Deleted Product",
        code: 200
      }
      return sendResponse(result, res);
    } else {
      const error = new Error("Product Id Not Found");
      return next(error);
    }
    
  } catch (err) {
    return res.status(409).send({
      message: err.message || "Error to delete Product"
    })
  }
};


