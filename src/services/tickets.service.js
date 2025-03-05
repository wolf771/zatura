import { HTTP } from '../helpers/http-common.js'
import authHeader from '../helpers/auth-header.js'
import helpers from '../helpers/helpers.js'

const ticketsService = {
  getTickets,
  storeTicket,
  getTicketDetail
};

export default ticketsService

function getTickets(page = 1, search = {}) {
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

  return HTTP.get(`tickets?page=${page}${params}`, {
    headers: {
      'Authorization': authHeader(),
      'x-Company': helpers.getCompanyId()
    }
  });
}

function getTicketDetail(id) {
  return HTTP.get(`ticket/${id}`, {
    headers: {
      'Authorization': authHeader(),
      'x-Company': helpers.getCompanyId()
    }
  });
}

function storeTicket(ticket = {}) {
  return HTTP({
    method: 'post',
    url: 'store-ticket',
    data: ticket,
    headers: {
      'Authorization': authHeader(),
      'x-Company': helpers.getCompanyId()
    }
  });
}


