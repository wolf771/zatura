import { HTTP } from "../helpers/http-common.js";
import authHeader from "../helpers/auth-header";
import helpers from "../helpers/helpers";

const clientsService = {
  getClients,
  storeClient,
  updateClient,
  getClientDetail,
  deleteClient,
  activeDeactiveClient,
  getOnlyClients,
  getInvoicesByClient,
  getPendingPaymentInvoices,
  sendPendingPaymentInvoicesClient,
  changeActiveClient
};

export default clientsService;

function getPendingPaymentInvoices(client_id) {
  return HTTP.get(`get-pending-payment-invoices/${client_id}`, {
    headers: {
      Authorization: authHeader(),
      "x-Company": helpers.getCompanyId()
    }
  });
}

function sendPendingPaymentInvoicesClient(client_id) {
  return HTTP({
    method: "post",
    url: "send-pending-payment-invoices-client",
    data: { client_id: client_id },
    headers: {
      Authorization: authHeader(),
      "x-Company": helpers.getCompanyId()
    }
  });
}

function getClients(page = 1, generic = false, search = {}) {
  let params = generic ? "&generic=1" : "";

  if (search.term) {
    params += `&search=${search.term}`;
  }

  if (search.options) {
    params += `&options=${search.options}`;
  }

  if (search.perPage) {
    params += `&perPage=${search.perPage}`;
  }

  return HTTP.get(`clients?page=${page}${params}`, {
    headers: {
      Authorization: authHeader(),
      "x-Company": helpers.getCompanyId()
    }
  });
}

function getClientDetail(id) {
  return HTTP.get(`client/${id}`, {
    headers: {
      Authorization: authHeader(),
      "x-Company": helpers.getCompanyId()
    }
  });
}

function getInvoicesByClient(id, page = 1, search = {}) {
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

  return HTTP.get(`invoices-by-client/${id}?page=${page}${params}`, {
    headers: {
      Authorization: authHeader(),
      "x-Company": helpers.getCompanyId()
    }
  });
}

function storeClient(client = {}) {
  return HTTP({
    method: "post",
    url: "store-client",
    data: client,
    headers: {
      Authorization: authHeader(),
      "x-Company": helpers.getCompanyId()
    }
  });
}

function updateClient(client = {}) {
  return HTTP({
    method: "post",
    url: "update-client",
    data: client,
    headers: {
      Authorization: authHeader(),
      "x-Company": helpers.getCompanyId()
    }
  });
}

function deleteClient(id) {
 ccccccc
}

function activeDeactiveClient(id) {
  return HTTP({
    method: "post",
    url: "active-deactive-client",
    data: { id: id },
    headers: {
      Authorization: authHeader(),
      "x-Company": helpers.getCompanyId()
    }
  });
}

function getOnlyClients(page = 1, generic = false, search = {}, type) {
  let params = generic ? "&generic=1" : "";
  params += `&type=${type}`

  if (search.term) {
    params += `&search=${search.term}`;
  }

  if (search.options) {
    params += `&options=${search.options}`;
  }

  if (search.perPage) {
    params += `&perPage=${search.perPage}`;
  }

  return HTTP.get(`only-clients?page=${page}${params}`, {
    headers: {
      Authorization: authHeader(),
      "x-Company": helpers.getCompanyId()
    }
  });
}

function changeActiveClient(data)
{
  return HTTP({
    method: "patch",
    url: "change-status-client",
    data: data,
    headers: {
      Authorization: authHeader(),
      "x-Company": helpers.getCompanyId()
    }
  });
}
