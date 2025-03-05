import { HTTP } from "../helpers/http-common.js";
import authHeader from "../helpers/auth-header";

const companiesService = {
  getCompanies,
  getAllCompanies,
  storeCompany,
  updateCompany,
  getCompanyDetail,
  selectCompany,
  getAllCompaniesNotAssignUser,
  updateCompanyConfig,
  deleteCompany,
  deleteCompanyUser,
  activateDeactivateCompany,
  downloadAllFiles
};

export default companiesService;

function getCompanies(page = 1, search = {}) {
  let params = "";

  if (search.term) {
    params += `&search=${search.term}`;
  }

  if (search.options) {
    params += `&options=${search.options}`;
  }

  if (search.perPage) {
    params += `&perPage=${search.perPage}`;
  }

  return HTTP.get(`companies?page=${page}${params}`, {
    headers: {
      Authorization: authHeader()
    }
  });
}

function getAllCompanies(page = 1, search = {}) {
  let params = "";

  if (search.term) {
    params += `&search=${search.term}`;
  }

  if (search.options) {
    params += `&options=${search.options}`;
  }

  if (search.perPage) {
    params += `&perPage=${search.perPage}`;
  }

  return HTTP.get(`all-companies?page=${page}${params}`, {
    headers: {
      Authorization: authHeader()
    }
  });
}

function getAllCompaniesNotAssignUser(user_id) {
  return HTTP.get(`all-companies-not-assign-user?user_id=${user_id}`, {
    headers: {
      Authorization: authHeader()
    }
  });
}

function getCompanyDetail(id) {
  return HTTP.get(`company/${id}`, {
    headers: {
      Authorization: authHeader()
    }
  });
}

function storeCompany(company = {}) {
  return HTTP({
    method: "post",
    url: "store-company",
    data: company,
    headers: {
      Authorization: authHeader(),
      "Content-Type": "multipart/form-data"
    }
  });
}

function updateCompany(company = {}) {
  return HTTP({
    method: "post",
    url: "update-company",
    data: company,
    headers: {
      Authorization: authHeader()
    }
  });
}

function updateCompanyConfig(company = {}) {
  return HTTP({
    method: "post",
    url: "update-company-config",
    data: company,
    headers: {
      Authorization: authHeader()
    }
  });
}

function selectCompany(company = {}) {
  return HTTP({
    method: "post",
    url: "select-company",
    data: company,
    headers: {
      Authorization: authHeader()
    }
  });
}

function deleteCompany(company_id) {
  return HTTP({
    method: "post",
    url: "delete-company",
    data: { id: company_id },
    headers: {
      Authorization: authHeader()
    }
  });
}

function deleteCompanyUser(company_user) {
  return HTTP({
    method: "post",
    url: "delete-company-user",
    data: company_user,
    headers: {
      Authorization: authHeader()
    }
  });
}

function activateDeactivateCompany(data) {
  return HTTP({
    method: "post",
    url: "activate-deactivate-company",
    data: data,
    headers: {
      Authorization: authHeader()
    }
  });
}

function downloadAllFiles(company_id) {
  return HTTP.get(`download-all-files/${company_id}`, {
    headers: {
      Authorization: authHeader()
    },
    responseType: "blob"
  });
}
