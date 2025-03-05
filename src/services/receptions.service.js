import { HTTP } from '../helpers/http-common.js'
import authHeader from '../helpers/auth-header'
import helpers from '../helpers/helpers'

const receptionsService = {
  getDocumentsReception,
  storeDocumentReception,
  getReceptionDetail,
  updateDocumentReception
};

export default receptionsService

function getDocumentsReception(page = 1, search) {
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

  return HTTP.get(`get-documents-reception?page=${page}${params}`, {
    headers: {
      'Authorization': authHeader(),
      'x-Company': helpers.getCompanyId()
    }
  });
}

function getReceptionDetail(id) {
  return HTTP.get(`reception/${id}`, {
    headers: {
      'Authorization': authHeader(),
      'x-Company': helpers.getCompanyId()
    }
  });
}

function storeDocumentReception(reception = {}) {
  return HTTP({
    method: 'post',
    url: 'store-document-reception',
    data: reception,
    headers: {
      'Authorization': authHeader(),
      'x-Company': helpers.getCompanyId()
    }
  });
}

//JRA Actualizacion de Aceptacion de documentos
function updateDocumentReception(reception = {}) {
  return HTTP({
    method: 'post',
    url: 'update-document-reception',
    data: reception,
    headers: {
      'Authorization': authHeader(),
      'x-Company': helpers.getCompanyId()
    }
  });
}


