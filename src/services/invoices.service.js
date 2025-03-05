import { HTTP } from '../helpers/http-common.js'
import authHeader from '../helpers/auth-header'
import helpers from '../helpers/helpers'

const invoicesService = {
  getInvoices,
  storeInvoice,
  getInvoiceDetail
};

export default invoicesService

function getInvoices(page = 0, search = {}) {
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
   
  return HTTP.get(`invoices?page=${page}${params}`, {
    headers: {
      'Authorization': authHeader(),
      'x-Company': helpers.getCompanyId()
    }
  });
}

function getInvoiceDetail(id) {
  return HTTP.get(`invoice/${id}`, {
    headers: {
      'Authorization': authHeader(),
      'x-Company': helpers.getCompanyId()
    }
  });
}


function storeInvoice(invoice = {}) {
  return HTTP({
    method: 'post',
    url: 'store-invoice',
    data: invoice,
    headers: {
      'Authorization': authHeader(),
      'x-Company': helpers.getCompanyId()
    }
  });
}


