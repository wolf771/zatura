import { HTTP } from '../helpers/http-common.js'
import authHeader from '../helpers/auth-header'
import helpers from '../helpers/helpers'

const  providersService = {
  getProviders,
  storeProvider,
  updateProvider,
  getProviderDetail,
  deleteProvider,
  activeDeactiveProvider
};

export default providersService

function getProviders(page = 1, generic = false, search = {}) {
  let params = generic ? '&generic=1' : '';
  
  if(search.term) {
    params += `&search=${search.term}`;
  }

  if(search.options) {
    params += `&options=${search.options}`
  }

  if(search.perPage) {
    params += `&perPage=${search.perPage}`
  }

  return HTTP.get(`providers?page=${page}${params}`,{
    headers: {
      'Authorization': authHeader(),
      'x-Company': helpers.getCompanyId()
    }
  });
}

function getProviderDetail(id) {
  return HTTP.get(`client/${id}`,{
    headers: {
      'Authorization': authHeader(),
      'x-Company': helpers.getCompanyId()
    }
  });
}

function storeProvider(client = {}) {
  return HTTP({
    method: 'post',
    url: 'store-client',
    data: client,
    headers: {
      'Authorization': authHeader(),
      'x-Company': helpers.getCompanyId()
    }
  });
}

function updateProvider(client = {}) {
  return HTTP({
    method: 'post',
    url: 'update-client',
    data: client,
    headers: {
      'Authorization': authHeader(),
      'x-Company': helpers.getCompanyId()
    }
  });
}

function deleteProvider(id) {
  return HTTP({
    method: 'post',
    url: 'delete-client',
    data: {id: id},
    headers: {
      'Authorization': authHeader(),
      'x-Company': helpers.getCompanyId()
    }
  });
}


function activeDeactiveProvider(id) {
  return HTTP({
    method: 'post',
    url: 'active-deactive-client',
    data: {id: id},
    headers: {
      'Authorization': authHeader(),
      'x-Company': helpers.getCompanyId()
    }
  });
}