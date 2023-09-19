const wrapper = require('./wrapper');

const sendResponse = async (result, res) => {
  // console.log("result: ", result);
  if(result.err){
    return wrapper.response(res, 'fail', result);
  }else{
    if(result.message){
      return wrapper.response(res, 'success', result, result.message);
    }else{
      return wrapper.response(res, 'success', result, 'Your request has been processed.');
    }
    
  }
  // return (result.err) ? wrapper.response(res, 'fail', result) :
  //   wrapper.response(res, 'success', result, 'Your request has been processed.');
    
};

const paginationResponse = async (result, res) => {
  return (result.err) ? wrapper.response(res, 'fail', result) :
    wrapper.paginationResponse(res, 'success', result, 'Your request has been processed.');
};


module.exports = {
  sendResponse,
  paginationResponse
};
