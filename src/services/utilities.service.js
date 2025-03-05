import { HTTP } from "../helpers/http-common.js";
import authHeader from "../helpers/auth-header.js";
import helpers from "../helpers/helpers.js";

const utilitiesService = {
  getCountries,
  getProvinces,
  getCantons,
  getDistricts,
  getCategories,
  getUnits,
  getTaxTypes,
  getPaymentMethods,
  getPaymentTerms,
  getPaymentForms,
  getCurrencies,
  getDetailTransaction,
  getConsecutives,
  getExchangeRate,
  downloadXml,
  getPdfTransaction,
  downloadFileByPath,
  getEmailProtocols,
  getTemplatesEmail,
  getTerms,
  getDocumentsByType,
  getAvailableDatabase,
  getDetailTransactionPublic,
  storeAdvertisement,
  getAdvertisementAdmin,
  updateAdvertisementCodeUser,
  storeExpenseCategory,
  getEconomicActivities,
  getTaxConditions,
  getPdfAutomaticReception,
  storeNewPaymentTerm,
  getExonerationTypes,
  updateCabysCodes,
  getCabysCodes
};

export default utilitiesService;

function getPdfAutomaticReception(id) {
  return HTTP.get(`get-pdf-invoice-automatic-reception/${id}`, {
    headers: {
      Authorization: authHeader(),
      "x-Company": helpers.getCompanyId()
    },
    responseType: "blob"
  });
}

function getCountries() {
  return HTTP.get("countries", {
    headers: {
      Authorization: authHeader(),
      "x-Company": helpers.getCompanyId()
    }
  });
}

function getProvinces() {
  return HTTP.get("provinces", {
    headers: {
      Authorization: authHeader(),
      "x-Company": helpers.getCompanyId()
    }
  });
}

function getCantons(province_number) {
  return HTTP.get("cantons", {
    params: {
      province_number: province_number
    },
    headers: {
      Authorization: authHeader(),
      "x-Company": helpers.getCompanyId()
    }
  });
}

function getDistricts(province_number, canton_number) {
  return HTTP.get("districts", {
    params: {
      province_number: province_number,
      canton_number: canton_number
    },
    headers: {
      Authorization: authHeader(),
      "x-Company": helpers.getCompanyId()
    }
  });
}

function getCategories() {
  return HTTP.get("categories", {
    headers: {
      Authorization: authHeader(),
      "x-Company": helpers.getCompanyId()
    }
  });
}

function getUnits() {
  return HTTP.get("units", {
    headers: {
      Authorization: authHeader(),
      "x-Company": helpers.getCompanyId()
    }
  });
}

function getTaxTypes() {
  return HTTP.get("tax-types", {
    headers: {
      Authorization: authHeader(),
      "x-Company": helpers.getCompanyId()
    }
  });
}

function getPaymentMethods() {
  return HTTP.get("payment-methods", {
    headers: {
      Authorization: authHeader(),
      "x-Company": helpers.getCompanyId()
    }
  });
}

function getPaymentTerms() {
  return HTTP.get("payment-terms", {
    headers: {
      Authorization: authHeader(),
      "x-Company": helpers.getCompanyId()
    }
  });
}

function getPaymentForms() {
  return HTTP.get("payment-forms", {
    headers: {
      Authorization: authHeader(),
      "x-Company": helpers.getCompanyId()
    }
  });
}

function getCurrencies() {
  return HTTP.get("currencies", {
    headers: {
      Authorization: authHeader(),
      "x-Company": helpers.getCompanyId()
    }
  });
}

//Get detail transaction interno pide token
function getDetailTransaction(type, id) {
  return HTTP.get(`detail/${type}/${id}`, {
    headers: {
      Authorization: authHeader(),
      "x-Company": helpers.getCompanyId()
    }
  });
}

//Get detail transaction public para los qr
function getDetailTransactionPublic(code64) {
  return HTTP.get(`public-detail/${code64}`);
}

//Company default consecutives
//Consecutives ready + 1 ready
function getConsecutives() {
  return HTTP.get(`consecutives`, {
    headers: {
      Authorization: authHeader(),
      "x-Company": helpers.getCompanyId()
    }
  });
}

//Company default consecutives
function getExchangeRate() {
  return HTTP.get(`exchange-rate`, {
    headers: {
      Authorization: authHeader(),
      "x-Company": helpers.getCompanyId()
    }
  });
}

//Download XML by key50digits
function downloadXml(key50digits, document_type, folder) {
  return HTTP.get(`download-xml/${key50digits}/${document_type}/${folder}`, {
    headers: {
      Authorization: authHeader(),
      "x-Company": helpers.getCompanyId()
    }
  });
}

//get pdf transaction
function getPdfTransaction(document_type, id) {
  return HTTP.get(`get-pdf-transaction/${document_type}/${id}`, {
    headers: {
      Authorization: authHeader(),
      "x-Company": helpers.getCompanyId()
    },
    responseType: "blob"
  });
}

//Download file by path
function downloadFileByPath(path) {
  return HTTP.get(`download-file-by-path?path=${path}`, {
    headers: {
      Authorization: authHeader(),
      "x-Company": helpers.getCompanyId()
    },
    responseType: "blob"
  });
}

//Email protocols
function getEmailProtocols() {
  return HTTP.get(`email-protocols`, {
    headers: {
      Authorization: authHeader(),
      "x-Company": helpers.getCompanyId()
    }
  });
}

//Templates Email
function getTemplatesEmail() {
  return HTTP.get(`get-templates-email`, {
    headers: {
      Authorization: authHeader(),
      "x-Company": helpers.getCompanyId()
    }
  });
}

//Terms
function getTerms() {
  return HTTP.get(`get-terms`, {
    headers: {
      Authorization: authHeader(),
      "x-Company": helpers.getCompanyId()
    }
  });
}

//get Documents by Type
function getDocumentsByType(
  page,
  type,
  search = {},
  registers_per_page = false
) {
  let params = "";
  if (search.term) {
    params += `&search=${search.term}`;
  }

  if (search.options) {
    params += `&options=${search.options}`;
  }

  if (registers_per_page) {
    params += `&registers_per_page=${registers_per_page}`;
  }

  return HTTP.get(`get-documents-by-type/${type}?page=${page}${params}`, {
    headers: {
      Authorization: authHeader(),
      "x-Company": helpers.getCompanyId()
    }
  });
}

//get available database
function getAvailableDatabase() {
  return HTTP.get(`get-available-database`, {
    headers: {
      Authorization: authHeader(),
      "x-Company": helpers.getCompanyId()
    }
  });
}

//get advertisement edit admin
function getAdvertisementAdmin() {
  return HTTP.get(`get-advertisement-admin`, {
    headers: {
      Authorization: authHeader()
    }
  });
}

//store advertisement
function storeAdvertisement(advertisement) {
  return HTTP({
    method: "post",
    url: "store-advertisement",
    data: { advertisement: advertisement },
    headers: {
      Authorization: authHeader()
    }
  });
}

//update advertisement code in user
function updateAdvertisementCodeUser(advertisement_code) {
  return HTTP({
    method: "post",
    url: "update-advertisement-code-user",
    data: { advertisement_code },
    headers: {
      Authorization: authHeader()
    }
  });
}

//Store expense categoy
function storeExpenseCategory(expense_category) {
  return HTTP({
    method: "post",
    url: "store-expense-category",
    data: expense_category,
    headers: {
      Authorization: authHeader()
    }
  });
}

//get advertisement edit admin
function getEconomicActivities() {
  return HTTP.get(`get-economic-activities`, {
    headers: {
      Authorization: authHeader()
    }
  });
}

//get tax conditions
function getTaxConditions() {
  return HTTP.get(`get-tax-conditions`, {
    headers: {
      Authorization: authHeader()
    }
  });
}

//store new payment term
function storeNewPaymentTerm(payment_term) {
  return HTTP({
    method: "post",
    url: "store-new-payment-term",
    data: payment_term,
    headers: {
      Authorization: authHeader(),
      "x-Company": helpers.getCompanyId()
    }
  });
}

//get exonerations types
function getExonerationTypes() {
  return HTTP.get(`get-exoneration-types`, {
    headers: {
      Authorization: authHeader()
    }
  });
}

//update cabys codes
function updateCabysCodes(data) {
  return HTTP({
    method: "post",
    url: "update-cabys-codes",
    data: data,
    headers: {
      Authorization: authHeader(),
      "x-Company": helpers.getCompanyId(),
      "Content-Type": "multipart/form-data"
    }
  });
}

//get cabys codes
function getCabysCodes(search = false) {
  let url = `cabys-codes`;
  if (search) {
    url = `cabys-codes?search=${search}`;
  }
  return HTTP.get(url, {
    headers: {
      Authorization: authHeader()
    }
  });
}
