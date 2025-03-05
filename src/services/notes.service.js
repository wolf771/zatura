import { HTTP } from '../helpers/http-common.js'
import authHeader from '../helpers/auth-header'
import helpers from '../helpers/helpers'

const notesService = {
  getNotes,
  storeNote,
  getNoteDetail
};

export default notesService

function getNotes(page = 1, search) {
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

  return HTTP.get(`notes?page=${page}${params}`, {
    headers: {
      'Authorization': authHeader(),
      'x-Company': helpers.getCompanyId()
    }
  });
}

function getNoteDetail(id) {
  return HTTP.get(`note/${id}`, {
    headers: {
      'Authorization': authHeader(),
      'x-Company': helpers.getCompanyId()
    }
  });
}

function storeNote(note = {}) {
  return HTTP({
    method: 'post',
    url: 'store-note',
    data: note,
    headers: {
      'Authorization': authHeader(),
      'x-Company': helpers.getCompanyId()
    }
  });
}


