import { HTTP } from '../helpers/http-common.js'
import authHeader from '../helpers/auth-header.js'

const  configurationsService = {
  getConfigurations,
  storeConfiguration,
  getGeneralConfigurations,
  storeGeneralConfiguration,
  getConfigurationEmail,
  storeConfigurationEmail,
  getTemplatesEmail,
  updateTemplateEmail,
  getTerms,
  updateTerm,
  getTaxes,
  storeTax,
  testCryptographyKey,
  testAccessHacienda,
  getReceptionEmail,
  updateConfigurationEmail
};

export default configurationsService

//Hacienda
function getConfigurations(company_id) {
  return HTTP.get(`configurations/${company_id}`, {
    headers: {
      'Authorization': authHeader()
    }
  });
}

function storeConfiguration(configurations) {
  return HTTP({
    method: 'post',
    url: 'store-configuration',
    data: configurations,
    headers: {
      'Authorization': authHeader(),
      'Content-Type': 'multipart/form-data'
    }
  });
}


//Generals
function getGeneralConfigurations(company_id) {
  return HTTP.get(`general-configurations/${company_id}`, {
    headers: {
      'Authorization': authHeader()
    }
  });
}

function storeGeneralConfiguration(configurations) {
  return HTTP({
    method: 'post',
    url: 'store-general-configuration',
    data: configurations,
    headers: {
      'Authorization': authHeader()
    }
  });
}


//Emails
function getConfigurationEmail(company_id) {
  return HTTP.get(`get-configuration-email/${company_id}`, {
    headers: {
      'Authorization': authHeader()
    }
  });
}

//Reception Email
function getReceptionEmail(company_id) {
  return HTTP.get(`get-reception-email/${company_id}`, {
    headers: {
      'Authorization': authHeader()
    }
  });
}

function storeConfigurationEmail(configurations) {
  return HTTP({
    method: 'post',
    url: 'store-configuration-email',
    data: configurations,
    headers: {
      'Authorization': authHeader()
    }
  });
}

function updateConfigurationEmail(configurations) {
  return HTTP({
    method: 'post',
    url: 'update-configuration-email',
    data: configurations,
    headers: {
      'Authorization': authHeader()
    }
  });
}

//Template Emails
function getTemplatesEmail(company_id) {
  return HTTP.get(`get-templates-email/${company_id}`, {
    headers: {
      'Authorization': authHeader()
    }
  });
}

//Update template email
function updateTemplateEmail(template) {
  return HTTP({
    method: 'post',
    url: 'update-template-email',
    data: template,
    headers: {
      'Authorization': authHeader()
    }
  });
}

//Terms
function getTerms(company_id) {
  return HTTP.get(`terms/${company_id}`, {
    headers: {
      'Authorization': authHeader()
    }
  });
}

//Update term
function updateTerm(template) {
  return HTTP({
    method: 'post',
    url: 'update-term',
    data: template,
    headers: {
      'Authorization': authHeader()
    }
  });
}


//Taxes
function getTaxes() {
  return HTTP.get(`tax-types`, {
    headers: {
      'Authorization': authHeader()
    }
  });
}

//Store tax
function storeTax(tax) {
  return HTTP({
    method: 'post',
    url: 'store-tax',
    data: tax,
    headers: {
      'Authorization': authHeader()
    }
  });
}


//Test crytography key
function testCryptographyKey(company_id) {
  return HTTP.get(`test-cryptography-key/${company_id}`, {
    headers: {
      'Authorization': authHeader()
    }
  });
}

//Test access hacienda
function testAccessHacienda(company_id) {
  return HTTP.get(`test-access-hacienda/${company_id}`, {
    headers: {
      'Authorization': authHeader()
    }
  });
}
