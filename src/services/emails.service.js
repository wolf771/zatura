import { HTTP } from '../helpers/http-common.js'
import authHeader from '../helpers/auth-header'
import helpers from '../helpers/helpers'

const emailsService = {
  send,
  suggestion,
  sendRememberPaymentInvoice
};

export default emailsService

function send(data) {
  return HTTP({
    method: 'post',
    url: 'send-email',
    data: data,
    headers: {
      'Authorization': authHeader(),
      'x-Company': helpers.getCompanyId()
    }
  });
}

function sendRememberPaymentInvoice(data) {
  return HTTP({
    method: 'post',
    url: 'send-email-remember-payment-invoice',
    data: data,
    headers: {
      'Authorization': authHeader(),
      'x-Company': helpers.getCompanyId()
    }
  });
}

function suggestion(data) {
  return HTTP({
    method: 'post',
    url: 'send-suggestion',
    data: data,
    headers: {
      'Authorization': authHeader()
    }
  });
}


