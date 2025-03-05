import { HTTP } from '../helpers/http-common.js'
import authHeader from '../helpers/auth-header'
import helpers from '../helpers/helpers'

const expensesService = {
  getExpenses,
  storeExpense,
  getExpenseDetail,
  deleteExpense,
  getExpenseCategories
};

export default expensesService

function getExpenses(page = 1, search = {}) {
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

  return HTTP.get(`expenses?page=${page}${params}`, {
    headers: {
      'Authorization': authHeader(),
      'x-Company': helpers.getCompanyId()
    }
  });
}

function getExpenseDetail(id) {
  return HTTP.get(`expense/${id}`, {
    headers: {
      'Authorization': authHeader(),
      'x-Company': helpers.getCompanyId()
    }
  });
}

function storeExpense(expense = {}) {
  return HTTP({
    method: 'post',
    url: 'store-expense',
    data: expense,
    headers: {
      'Authorization': authHeader(),
      'x-Company': helpers.getCompanyId()
    }
  });
}

function deleteExpense(id) {
  return HTTP({
    method: 'post',
    url: 'delete-expense',
    data: {id: id},
    headers: {
      'Authorization': authHeader(),
      'x-Company': helpers.getCompanyId()
    }
  });
}

function getExpenseCategories() {
  return HTTP.get(`expense-categories`, {
    headers: {
      'Authorization': authHeader(),
      'x-Company': helpers.getCompanyId()
    }
  });
}


