import { HTTP } from '../helpers/http-common.js'
import authHeader from '../helpers/auth-header'
import helpers from '../helpers/helpers'

const simplesService = {
  getSimples,
  storeSimple,
  getSimpleDetail
};

export default simplesService

function getSimples(page = 0, search = {}) {
  console.log(search)
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
   
  return HTTP.get(`simples?page=${page}${params}`, {
    headers: {
      'Authorization': authHeader(),
      'x-Company': helpers.getCompanyId()
    }
  });
}

function getSimpleDetail(id) {
  return HTTP.get(`simple/${id}`, {
    headers: {
      'Authorization': authHeader(),
      'x-Company': helpers.getCompanyId()
    }
  });
}


function storeSimple(simple = {}) {
  return HTTP({
    method: 'post',
    url: 'store-simple',
    data: simple,
    headers: {
      'Authorization': authHeader(),
      'x-Company': helpers.getCompanyId()
    }
  });
}


