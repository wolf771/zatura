import { HTTP } from "../helpers/http-common.js";
import authHeader from "../helpers/auth-header";
import helpers from "../helpers/helpers";

const quotationsService = {
  getQuotations,
  storeQuotation,
  updateQuotation,
  getQuotationDetail,
  quotationToInvoice,
  deleteQuotation,
  storeRecurring,
  getRecurrings,
  updateRecurring,
  pausePlayRecurringInvoice
};

export default quotationsService;

function getQuotations(page = 1, search) {
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

  return HTTP.get(`quotations?page=${page}${params}`, {
    headers: {
      Authorization: authHeader(),
      "x-Company": helpers.getCompanyId()
    }
  });
}

function getQuotationDetail(id) {
  return HTTP.get(`quotation/${id}`, {
    headers: {
      Authorization: authHeader(),
      "x-Company": helpers.getCompanyId()
    }
  });
}

function storeQuotation(quotation = {}) {
  return HTTP({
    method: "post",
    url: "store-quotation",
    data: quotation,
    headers: {
      Authorization: authHeader(),
      "x-Company": helpers.getCompanyId()
    }
  });
}

function updateQuotation(quotation = {}) {
  return HTTP({
    method: "post",
    url: "update-quotation",
    data: quotation,
    headers: {
      Authorization: authHeader(),
      "x-Company": helpers.getCompanyId()
    }
  });
}

function quotationToInvoice(id) {
  return HTTP({
    method: "post",
    url: "quotation-to-invoice",
    data: { id: id },
    headers: {
      Authorization: authHeader(),
      "x-Company": helpers.getCompanyId()
    }
  });
}

function deleteQuotation(id) {
  return HTTP({
    method: "post",
    url: "delete-quotation",
    data: { id: id },
    headers: {
      Authorization: authHeader(),
      "x-Company": helpers.getCompanyId()
    }
  });
}

//Guarda una nueva factura recurrente
//Lo hace como una cotizacion siendo el campo is_recurring
//El que indica si es recurrente
function storeRecurring(recurring = {}) {
  return HTTP({
    method: "post",
    url: "store-quotation",
    data: recurring,
    headers: {
      Authorization: authHeader(),
      "x-Company": helpers.getCompanyId()
    }
  });
}

//Obtenr la lista de cotizaciones que son facturas recurrentes
//Se hace a traves de la misma ruta de obtenr cotizaciones
//Solo se pasa un parametro que es is_recurring en true
function getRecurrings(page = 1, search) {
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

  //Se pasa el parametro is recurring
  params += `&isRecurring=1`;

  return HTTP.get(`quotations?page=${page}${params}`, {
    headers: {
      Authorization: authHeader(),
      "x-Company": helpers.getCompanyId()
    }
  });
}

//Actualizar factura recurrente usa el mismo metodo de cotizacion
//Solo que se manda el is_recurring
function updateRecurring(recurring = {}) {
  return HTTP({
    method: "post",
    url: "update-quotation",
    data: recurring,
    headers: {
      Authorization: authHeader(),
      "x-Company": helpers.getCompanyId()
    }
  });
}

//pause play recurring invoice
function pausePlayRecurringInvoice(data) {
  return HTTP({
    method: "post",
    url: "pause-play-recurring-invoice",
    data: data,
    headers: {
      Authorization: authHeader(),
      "x-Company": helpers.getCompanyId()
    }
  });
}
