import { HTTP } from "../helpers/http-common.js";
import authHeader from "../helpers/auth-header";
import helpers from "../helpers/helpers";

const reportsService = {
  getReportTickets,
  downloadExcelReportTickets,
  getReportInvoices,
  downloadExcelReportInvoices,
  getReportExpenses,
  getReportItems,
  downloadExcelReportItems,
  downloadExcelReportExpenses,
  getReportTicketsSkip,
  getReportInvoicesSkip,
  getReportReceptions,
  getReportReceptionsSkip,
  getReportNotes,
  downloadExcelReportNotes,
  getReportNotesSkip
};

export default reportsService;
//Get report tickets
function getReportTickets(page, search = {}) {
  let params = "";
  if (search.term) {
    params += `&search=${search.term}`;
  }

  if (search.options) {
    params += `&options=${search.options}`;
  }

  if (search.rangeDates) {
    params += `&range_dates=${search.rangeDates}`;
  }

  if (search.skip) {
    params += `&skip=${search.skip}`;
  }

  return HTTP.get(`report-tickets?page=${page}${params}`, {
    headers: {
      Authorization: authHeader(),
      "x-Company": helpers.getCompanyId()
    }
  });
}

//Get report tickets
function getReportTicketsSkip(page, search = {}) {
  let params = "";
  if (search.term) {
    params += `&search=${search.term}`;
  }

  if (search.options) {
    params += `&options=${search.options}`;
  }

  if (search.rangeDates) {
    params += `&range_dates=${search.rangeDates}`;
  }

  if (search.skip) {
    params += `&skip=${search.skip}`;
  }

  return HTTP.get(`report-tickets-skip?page=${page}${params}`, {
    headers: {
      Authorization: authHeader(),
      "x-Company": helpers.getCompanyId()
    }
  });
}

//Download excel report tickets
function downloadExcelReportTickets(page, search = {}) {
  let params = "";
  if (search.term) {
    params += `&search=${search.term}`;
  }

  if (search.options) {
    params += `&options=${search.options}`;
  }

  if (search.rangeDates) {
    params += `&range_dates=${search.rangeDates}`;
  }
  return HTTP.get(`download-excel-report-tickets?page=${page}${params}`, {
    headers: {
      Authorization: authHeader(),
      "x-Company": helpers.getCompanyId()
    },
    responseType: "blob"
  });
}

//Get report invoices
function getReportInvoices(page, search = {}) {
  let params = "";
  if (search.term) {
    params += `&search=${search.term}`;
  }

  if (search.options) {
    params += `&options=${search.options}`;
  }

  if (search.rangeDates) {
    params += `&range_dates=${search.rangeDates}`;
  }

  return HTTP.get(`report-invoices?page=${page}${params}`, {
    headers: {
      Authorization: authHeader(),
      "x-Company": helpers.getCompanyId()
    }
  });
}

//Get report skip invoices
function getReportInvoicesSkip(page, search = {}) {
  let params = "";
  if (search.term) {
    params += `&search=${search.term}`;
  }

  if (search.options) {
    params += `&options=${search.options}`;
  }

  if (search.rangeDates) {
    params += `&range_dates=${search.rangeDates}`;
  }

  if (search.skip) {
    params += `&skip=${search.skip}`;
  }

  return HTTP.get(`report-invoices-skip?page=${page}${params}`, {
    headers: {
      Authorization: authHeader(),
      "x-Company": helpers.getCompanyId()
    }
  });
}

//Download excel report invoices
function downloadExcelReportInvoices(page = 1, search = {}) {
  let params = "";
  if (search.term) {
    params += `&search=${search.term}`;
  }

  if (search.options) {
    params += `&options=${search.options}`;
  }

  if (search.rangeDates) {
    params += `&range_dates=${search.rangeDates}`;
  }
  return HTTP.get(`download-excel-report-invoices?page=${page}${params}`, {
    headers: {
      Authorization: authHeader(),
      "x-Company": helpers.getCompanyId()
    },
    responseType: "blob"
  });
}

//Get report expenses
function getReportExpenses(page = 1, search = {}) {
  let params = "";
  if (search.term) {
    params += `&search=${search.term}`;
  }

  if (search.options) {
    params += `&options=${search.options}`;
  }

  if (search.expenses_year) {
    params += `&expenses_year=${search.expenses_year}`;
  }

  return HTTP.get(`report-expenses?page=${page}${params}`, {
    headers: {
      Authorization: authHeader(),
      "x-Company": helpers.getCompanyId()
    }
  });
}

//Get report expenses
function getReportItems(page = 1, search = {}) {
  let params = "";
  if (search.term) {
    params += `&search=${search.term}`;
  }

  if (search.options) {
    params += `&options=${search.options}`;
  }

  if (search.rangeDates) {
    params += `&range_dates=${search.rangeDates}`;
  }

  return HTTP.get(`report-items?page=${page}${params}`, {
    headers: {
      Authorization: authHeader(),
      "x-Company": helpers.getCompanyId()
    }
  });
}

//Download excel report items
function downloadExcelReportItems(page = 1, search = {}) {
  let params = "";
  if (search.term) {
    params += `&search=${search.term}`;
  }

  if (search.options) {
    params += `&options=${search.options}`;
  }

  if (search.rangeDates) {
    params += `&range_dates=${search.rangeDates}`;
  }
  return HTTP.get(`download-excel-report-items?page=${page}${params}`, {
    headers: {
      Authorization: authHeader(),
      "x-Company": helpers.getCompanyId()
    },
    responseType: "blob"
  });
}

//Download excel report expenses
function downloadExcelReportExpenses(page = 1, search = {}) {
  let params = "";
  if (search.term) {
    params += `&search=${search.term}`;
  }

  if (search.options) {
    params += `&options=${search.options}`;
  }

  if (search.expenses_year) {
    params += `&expenses_year=${search.expenses_year}`;
  }
  return HTTP.get(`download-excel-report-expenses?page=${page}${params}`, {
    headers: {
      Authorization: authHeader(),
      "x-Company": helpers.getCompanyId()
    },
    responseType: "blob"
  });
}

//Get report invoices
function getReportReceptions(page, search = {}) {
  let params = "";
  if (search.term) {
    params += `&search=${search.term}`;
  }

  if (search.options) {
    params += `&options=${search.options}`;
  }

  if (search.rangeDates) {
    params += `&range_dates=${search.rangeDates}`;
  }

  return HTTP.get(`report-receptions?page=${page}${params}`, {
    headers: {
      Authorization: authHeader(),
      "x-Company": helpers.getCompanyId()
    }
  });
}

function getReportReceptionsSkip(page, search = {}) {
  let params = "";
  if (search.term) {
    params += `&search=${search.term}`;
  }

  if (search.options) {
    params += `&options=${search.options}`;
  }

  if (search.rangeDates) {
    params += `&range_dates=${search.rangeDates}`;
  }

  if (search.skip) {
    params += `&skip=${search.skip}`;
  }

  return HTTP.get(`report-receptions-skip?page=${page}${params}`, {
    headers: {
      Authorization: authHeader(),
      "x-Company": helpers.getCompanyId()
    }
  });
}

//Get report notes
function getReportNotes(page, search = {}) {
  let params = "";
  if (search.term) {
    params += `&search=${search.term}`;
  }

  if (search.options) {
    params += `&options=${search.options}`;
  }

  if (search.rangeDates) {
    params += `&range_dates=${search.rangeDates}`;
  }

  params += `&filter=${search.filter}`;

  return HTTP.get(`report-notes?page=${page}${params}`, {
    headers: {
      Authorization: authHeader(),
      "x-Company": helpers.getCompanyId()
    }
  });
}

//Get report skip notes
function getReportNotesSkip(page, search = {}) {
  console.log(search);
  let params = "";
  if (search.term) {
    params += `&search=${search.term}`;
  }

  if (search.options) {
    params += `&options=${search.options}`;
  }

  if (search.rangeDates) {
    params += `&range_dates=${search.rangeDates}`;
  }

  if (search.skip) {
    params += `&skip=${search.skip}`;
  }

  params += `&filter=${search.filter}`;

  return HTTP.get(`report-notes-skip?page=${page}${params}`, {
    headers: {
      Authorization: authHeader(),
      "x-Company": helpers.getCompanyId()
    }
  });
}

//Download excel report notes
function downloadExcelReportNotes(page = 1, search = {}) {
  let params = "";
  if (search.term) {
    params += `&search=${search.term}`;
  }

  if (search.options) {
    params += `&options=${search.options}`;
  }

  if (search.rangeDates) {
    params += `&range_dates=${search.rangeDates}`;
  }
  return HTTP.get(`download-excel-report-notes?page=${page}${params}`, {
    headers: {
      Authorization: authHeader(),
      "x-Company": helpers.getCompanyId()
    },
    responseType: "blob"
  });
}
