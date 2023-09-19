"use strict"
const { Category } = require('../models');
const { sendResponse, paginationResponse } = require('../helpers/response');

exports.getAllCategory = async (req, res, next) => {
  try {
    const res_query_all_category= await Category.getAllCategory();
    console.log("res_query_prod_type:", res_query_all_category);
   
    const result = {
      data: res_query_all_category,
      code: 200
    }
    return sendResponse(result, res);
  } catch (err) {
    console.log(err, 'ini errornya')
    return next(err);
  }
};