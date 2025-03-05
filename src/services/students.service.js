import { HTTP } from '../helpers/http-common.js'
import authHeader from '../helpers/auth-header'
import helpers from '../helpers/helpers'

const  studentsService = {
  getStudents,
  storeStudent,
  updateStudent,
  getStudentDetail,
  deleteStudent,
  activeDeactiveStudent,
  getStudents
};

export default studentsService

function getStudents(page = 1, generic = false, search = {}) {
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

  return HTTP.get(`students?page=${page}${params}`,{
    headers: {
      'Authorization': authHeader(),
      'x-Company': helpers.getCompanyId()
    }
  });
}

function getStudentDetail(id) {
  return HTTP.get(`student/${id}`,{
    headers: {
      'Authorization': authHeader(),
      'x-Company': helpers.getCompanyId()
    }
  });
}

function storeStudent(student = {}) {
  return HTTP({
    method: 'post',
    url: 'store-student',
    data: student,
    headers: {
      'Authorization': authHeader(),
      'x-Company': helpers.getCompanyId()
    }
  });
}

function updateStudent(student = {}) {
  return HTTP({
    method: 'post',
    url: 'update-student',
    data: student,
    headers: {
      'Authorization': authHeader(),
      'x-Company': helpers.getCompanyId()
    }
  });
}

function deleteStudent(id) {
  return HTTP({
    method: 'post',
    url: 'delete-student',
    data: {id: id},
    headers: {
      'Authorization': authHeader(),
      'x-Company': helpers.getCompanyId()
    }
  });
}


function activeDeactiveStudent(id) {
  return HTTP({
    method: 'post',
    url: 'active-deactive-student',
    data: {id: id},
    headers: {
      'Authorization': authHeader(),
      'x-Company': helpers.getCompanyId()
    }
  });
}
