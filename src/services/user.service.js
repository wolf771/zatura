import { HTTP } from '../helpers/http-common.js'
import authHeader from '../helpers/auth-header.js';
import helpers from '../helpers/helpers.js'

const  userService = {
  authenticate,
  getUser,
  storeUser,
  getUsers,
  assignUser,
  getCompaniesUser,
  getUserById,
  updateUser,
  deleteUser,
  passwordReset,
  passwordEmail,
  getUsersAssignCompany
};

export default userService

//login
function authenticate(email, password) {
  return HTTP.post('auth/login', {
    email,
    password
  });
}

//password reset
function passwordEmail(email) {
  return HTTP.post('password/email', {
    email
  });
}

//password reset
function passwordReset(email, password, token) {
  return HTTP.post('password/reset', {
    email,
    password,
    token
  });
}

//Get user lin session
function getUser() {
  let company_id = false;
  if(helpers.getCompanyId()) {
    company_id = helpers.getCompanyId()
  }

  return HTTP.get('get-user', {
    headers: {
      Authorization: authHeader(),
      'x-Company': company_id
    }
  });
}

//Get user by id
function getUserById(user_id) {
  let company_id = false;
  if(helpers.getCompanyId()) {
    company_id = helpers.getCompanyId()
  }

  return HTTP.get(`get-user-by-id/${user_id}`, {
    headers: {
      Authorization: authHeader(),
      'x-Company': company_id
    }
  });
}

function storeUser(user) {
  return HTTP({
    method: 'post',
    url: 'store-user',
    data: user,
    headers: {
      'Authorization': authHeader()
    }
  });
}

function updateUser(user) {
  return HTTP({
    method: 'post',
    url: 'update-user',
    data: user,
    headers: {
      'Authorization': authHeader()
    }
  });
}

function deleteUser(user_id) {
  return HTTP({
    method: 'post',
    url: 'delete-user',
    data: {id: user_id},
    headers: {
      'Authorization': authHeader()
    }
  });
}

function getUsers(page, search) {
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


  //get all users
  return HTTP.get(`get-users?page=${page}${params}`, {
    headers: {
      Authorization: authHeader()
    }
  });
}


//Get user assign to company
function getUsersAssignCompany(page, search) {
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


  return HTTP.get(`get-users-assign-company?page=${page}${params}`, {
    headers: {
      Authorization: authHeader()
    }
  });
}



function assignUser(data) {
  return HTTP({
    method: 'post',
    url: 'assign-user',
    data: data,
    headers: {
      'Authorization': authHeader()
    }
  });
}

function getCompaniesUser(user_id) {
  return HTTP.get(`get-companies-user/${user_id}`, {
    headers: {
      Authorization: authHeader()
    }
  });
}