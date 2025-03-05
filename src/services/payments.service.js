import { HTTP } from '../helpers/http-common.js'
import authHeader from '../helpers/auth-header'
import helpers from '../helpers/helpers'

const paymentsService = {
  getPayments,
  storePayment,
  getPaymentDetail,
  deletePayment
};

export default paymentsService

function getPayments(page = 1, search) {
  let params = "";
  if(search.term) {
    params += `&search=${search.term}`;
  }

  if(search.options) {
    params += `&options=${search.options}`
  } 

  if(search.perPage) {
    params += `&perPage=${search.perPage}`
  }

  return HTTP.get(`payments?page=${page}${params}`, {
    headers: {
      'Authorization': authHeader(),
      'x-Company': helpers.getCompanyId()
    }
  });
}

function getPaymentDetail(id) {
  return HTTP.get(`payment/${id}`, {
    headers: {
      'Authorization': authHeader(),
      'x-Company': helpers.getCompanyId()
    }
  });
}

function storePayment(payment = {}) {
  return HTTP({
    method: 'post',
    url: 'store-payment',
    data: payment,
    headers: {
      'Authorization': authHeader(),
      'x-Company': helpers.getCompanyId()
    }
  });
}

function deletePayment(id) {
  return HTTP({
    method: 'post',
    url: 'delete-payment',
    data: {id: id},
    headers: {
      'Authorization': authHeader(),
      'x-Company': helpers.getCompanyId()
    }
  });
}


