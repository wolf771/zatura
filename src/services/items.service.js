import { HTTP } from '../helpers/http-common.js'
import authHeader from '../helpers/auth-header.js'
import helpers from '../helpers/helpers.js'


const itemsService = {
  getItems,
  storeItem,
  updateItem,
  getItemDetail,
  deleteItem
};

export default itemsService

function getItems(page = 0, search = {}) {

  let params = '';
  
  if(search.term) {
    params += `&search=${search.term}`;
  }

  if(search.options) {
    params += `&options=${search.options}`
  }

  if(search.perPage) {
    params += `&perPage=${search.perPage}`
  }

  return HTTP.get(`items?page=${page}${params}`, {
    headers: {
      'Authorization': authHeader(),
      'x-Company': helpers.getCompanyId()
    }
  });
}

function getItemDetail(id) {
  return HTTP.get(`item/${id}`, {
    headers: {
      'Authorization': authHeader(),
      'x-Company': helpers.getCompanyId()

    }
  });
}

function storeItem(item = {}) {
  return HTTP({
    method: 'post',
    url: 'store-item',
    data: item,
    headers: {
      'Authorization': authHeader(),
      'x-Company': helpers.getCompanyId()

    }
  });
}

function updateItem(item = {}) {
  return HTTP({
    method: 'post',
    url: 'update-item',
    data: item,
    headers: {
      'Authorization': authHeader(),
      'x-Company': helpers.getCompanyId()
    }
  });
}

function deleteItem(id) {
  return HTTP({
    method: 'post',
    url: 'delete-item',
    data: {id: id},
    headers: {
      'Authorization': authHeader(),
      'x-Company': helpers.getCompanyId()
    }
  });
}
