/*=========================================================================================
  File Name: router.js
  Description: Routes for vue-router. Lazy loading is enabled.
  Object Strucutre:
                    path => router path
                    name => router name
                    component(lazy loading) => component to load
                    meta : {
                      rule => which user can have access (ACL)
                      breadcrumb => Add breadcrumb to specific page
                      pageTitle => Display title besides breadcrumb
                    }
  ----------------------------------------------------------------------------------------
  Item Name: Vuesax Admin - VueJS Dashboard Admin Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

import Vue from "vue";
import Router from "vue-router";
//import auth from "@/auth/authService";

//import firebase from 'firebase/app'
import "firebase/auth";

//import PublicLayout from './views/PublicLayout'
//import HomeLayout from './views/HomeLayout.vue'
import Login from "./views/auth/Login.vue";
import Dashboard from "./views/Dashboard.vue";
import Clients from "./views/clients/Clients.vue";
import NewClient from "./views/clients/NewClient.vue";
import ClientDetail from "./views/clients/ClientDetail.vue";
import Items from "./views/items/Items.vue";
import NewItem from "./views/items/NewItem.vue";
import EditItem from "./views/items/EditItem.vue";
import Companies from "./views/companies/Companies.vue";
import NewCompany from "./views/companies/NewCompany.vue";
import EditCompany from "./views/companies/EditCompany.vue";
import Quotations from "./views/quotations/Quotations.vue";
import NewQuotation from "./views/quotations/NewQuotation.vue";
import EditQuotation from "@/views/quotations/EditQuotation.vue";
import Invoices from "./views/invoices/Invoices.vue";
import NewInvoice from "./views/invoices/NewInvoice.vue";
import Tickets from "./views/tickets/Tickets.vue";
import NewTicket from "./views/tickets/NewTicket.vue";
import Detail from "./views/transactions/Detail.vue";
import ConfigHacienda from "./views/configurations/Hacienda.vue";
import ConfigGenerals from "./views/configurations/Generals.vue";
import ConfigEmail from "./views/configurations/Email.vue";
import Notes from "@/views/notes/Notes.vue";
import NewNote from "@/views/notes/NewNote.vue";
import Payments from "@/views/payments/Payments.vue";
import Expenses from "@/views/expenses/Expenses.vue";
import MessageReceptors from "@/views/message_receptors/MessageReceptors.vue";
import NewMessageReceptor from "@/views/message_receptors/NewMessageReceptor.vue";
import NewClone from "@/views/clone/NewClone.vue";
import ReportTickets from "@/views/reports/ReportTickets.vue";
import ReportInvoices from "@/views/reports/ReportInvoices.vue";
import ReportExpenses from "@/views/reports/ReportExpenses.vue";
import ReportItems from "@/views/reports/ReportItems.vue";
import TemplateEmail from "@/views/configurations/TemplateEmail.vue";
import Terms from "@/views/configurations/Terms.vue";
import Taxes from "@/views/configurations/Taxes.vue";
import AddUser from "@/views/admin/AddUser.vue";
import EditUser from "@/views/admin/EditUser.vue";
import Users from "@/views/admin/Users.vue";
import AssignCompany from "@/views/admin/AssignCompany.vue";
import CompaniesUser from "@/views/admin/CompaniesUser.vue";
import AllCompanies from "@/views/admin/AllCompanies.vue";
import MainConfigurations from "@/views/configurations/MainConfigurations.vue";
import AllConfigurationsCompany from "@/views/configurations/AllConfigurationsCompany.vue";
import ReDashboard from "@/views/ReDashboard.vue";
import QueryPublicDocument from "@/views/QueryPublicDocument.vue";
import PasswordReset from "@/views/PasswordReset.vue";
import PasswordEmail from "@/views/PasswordEmail.vue";
import Advertisement from "@/views/admin/Advertisement.vue";
import NewSimple from "@/views/simples/NewSimple.vue";
import Simples from "@/views/simples/Simples.vue";
import Providers from "@/views/providers/Providers.vue";
import ReportDocumentReceptions from "@/views/reports/ReportDocumentReceptions.vue";
import Students from "@/views/students/Students.vue";
import NewRecurring from "@/views/recurring/Recurring.vue";
import Recurrings from "@/views/recurring/Recurrings.vue";
import EditRecurring from "@/views/recurring/EditRecurring.vue";
import ReportNotes from "@/views/reports/ReportNotes.vue";

import UpdateCabysCodes from "@/views/admin/UpdateCabysCodes.vue";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
  routes: [
    {
      path: "/login",
      name: "login",
      component: Login,
      meta: {
        is_public: true
      }
    },
    {
      path: "/query-public/:code64",
      name: "query-public-document",
      component: QueryPublicDocument,
      meta: {
        is_public: true
      }
    },
    {
      path: "/password/reset/:token",
      name: "password-reset",
      component: PasswordReset,
      meta: {
        is_public: true
      }
    },
    {
      path: "/password/email",
      name: "password-email",
      component: PasswordEmail,
      meta: {
        is_public: true
      }
    },
    {
      path: "",
      component: () => import("./layouts/main/Main.vue"),
      children: [
        {
          path: "/",
          redirect: "dashboard"
        },
        {
          path: "/dashboard",
          name: "dashboard",
          component: Dashboard,
          meta: {
            rule: "editor",
            name_section: "Dashboard"
          }
        },
        {
          path: "/rdashboard",
          name: "re-dashboard",
          component: ReDashboard,
          meta: {
            rule: "editor",
            name_section: "Dashboard"
          }
        },
        {
          path: "/advertisement",
          name: "advertisement",
          component: Advertisement,
          meta: {
            rule: "editor",
            name_section: "Anuncio"
          }
        },
        {
          path: "/clients",
          name: "clients",
          component: Clients,
          meta: {
            rule: "editor",
            name_section: "Clientes"
          }
        },
        {
          path: "/new-client",
          name: "new-client",
          component: NewClient,
          meta: {
            rule: "editor",
            name_section: "Nuevo Cliente"
          }
        },
        {
          path: "/client-detail/:id",
          name: "client-detail",
          component: ClientDetail,
          meta: {
            rule: "editor",
            is_public: false,
            name_section: "Detalle Cliente"
          }
        },
        {
          path: "/students",
          name: "students",
          component: Students,
          meta: {
            rule: "editor",
            name_section: "Estudiantes"
          }
        },
        {
          path: "/items",
          name: "items",
          component: Items,
          meta: {
            rule: "editor",
            is_public: false,
            name_section: "Articulos"
          }
        },
        {
          path: "/new-item",
          name: "new-item",
          component: NewItem,
          meta: {
            rule: "editor",
            is_public: false,
            name_section: "Nuevo Artículo"
          }
        },
        {
          path: "/edit-item/:id",
          name: "edit-item",
          component: EditItem,
          meta: {
            rule: "editor",
            is_public: false,
            name_section: "Editar Artículo"
          }
        },
        {
          path: "/companies",
          name: "companies",
          component: Companies,
          meta: {
            rule: "editor",
            is_public: false,
            name_section: "Compañias"
          }
        },
        {
          path: "/new-company",
          name: "new-company",
          component: NewCompany,
          meta: {
            rule: "editor",
            is_public: false,
            name_section: "Nueva Compañia"
          }
        },
        {
          path: "/edit-company/:id",
          name: "edit-company",
          component: EditCompany,
          meta: {
            rule: "editor",
            is_public: false,
            name_section: "Editar Compañia"
          }
        },
        {
          path: "/quotations",
          name: "quotations",
          component: Quotations,
          meta: {
            rule: "editor",
            is_public: false,
            name_section: "Cotizaciones"
          }
        },
        {
          path: "/recurrings",
          name: "recurrings",
          component: Recurrings,
          meta: {
            rule: "editor",
            is_public: false,
            name_section: "Facturas recurrentes"
          }
        },
        {
          path: "/new-quotation",
          name: "new-quotation",
          component: NewQuotation,
          meta: {
            rule: "editor",
            is_public: false,
            name_section: "Nueva Cotización"
          }
        },
        {
          path: "/edit-quotation/:document_type/:document_id",
          name: "edit-quotation",
          component: EditQuotation,
          meta: {
            rule: "editor",
            is_public: false,
            name_section: "Editando"
          }
        },
        {
          path: "/edit-recurring/:document_type/:document_id",
          name: "edit-recurring",
          component: EditRecurring,
          meta: {
            rule: "editor",
            is_public: false,
            name_section: "Editando"
          }
        },
        {
          path: "/invoices",
          name: "invoices",
          component: Invoices,
          meta: {
            rule: "editor",
            is_public: false,
            name_section: "Facturas"
          }
        },
        {
          path: "/new-invoice",
          name: "new-invoice",
          component: NewInvoice,
          meta: {
            rule: "editor",
            is_public: false,
            name_section: "Nueva Factura"
          }
        },
        {
          path: "/tickets",
          name: "tickets",
          component: Tickets,
          meta: {
            rule: "editor",
            is_public: false,
            name_section: "Tiquetes"
          }
        },
        {
          path: "/new-ticket",
          name: "new-ticket",
          component: NewTicket,
          meta: {
            rule: "editor",
            is_public: false,
            name_section: "Nuevo Tiquete"
          }
        },
        {
          path: "/detail/:type/:id/:print?",
          name: "detail-transaction",
          component: Detail,
          meta: {
            rule: "editor",
            is_public: false,
            name_section: "Detalle"
          }
        },
        {
          path: "/main-configurations/:company_id",
          name: "main-configurations",
          component: MainConfigurations,
          meta: {
            rule: "editor",
            is_public: false,
            name_section: "Configuraciones"
          }
        },
        {
          path: "/all-configurations/:company_id",
          name: "all-configurations-company",
          component: AllConfigurationsCompany,
          meta: {
            rule: "editor",
            is_public: false,
            name_section: "Configuraciones compañia"
          }
        },
        {
          path: "/config-hacienda/:company_id",
          name: "config-hacienda",
          component: ConfigHacienda,
          meta: {
            rule: "editor",
            is_public: false,
            name_section: "Configuración Hacienda"
          }
        },
        {
          path: "/config-generals/:company_id",
          name: "config-generals",
          component: ConfigGenerals,
          meta: {
            rule: "editor",
            is_public: false,
            name_section: "Configuraciones Generales"
          }
        },
        {
          path: "/config-email/:company_id",
          name: "config-email",
          component: ConfigEmail,
          meta: {
            rule: "editor",
            is_public: false,
            name_section: "Configuraciones envio de emails"
          }
        },
        {
          path: "/template-email/:company_id",
          name: "template-email",
          component: TemplateEmail,
          meta: {
            rule: "editor",
            is_public: false,
            name_section: "Plantillas Correos"
          }
        },
        {
          path: "/notes",
          name: "notes",
          component: Notes,
          meta: {
            rule: "editor",
            is_public: false,
            name_section: "Notas"
          }
        },
        {
          path: "/new-note/:note_type/:document_type/:document_id",
          name: "new-note",
          component: NewNote,
          meta: {
            rule: "editor",
            is_public: false,
            name_section: "Nueva Nota"
          }
        },
        {
          path: "/payments",
          name: "payments",
          component: Payments,
          meta: {
            rule: "editor",
            is_public: false,
            name_section: "Pagos"
          }
        },
        {
          path: "/expenses",
          name: "expenses",
          component: Expenses,
          meta: {
            rule: "editor",
            is_public: false,
            name_section: "Gastos"
          }
        },
        {
          path: "/message-receptors",
          name: "message-receptors",
          component: MessageReceptors,
          meta: {
            rule: "editor",
            is_public: false,
            name_section: "Aceptación Documentos"
          }
        },
        {
          path: "/new-message-receptor",
          name: "new-message-receptor",
          component: NewMessageReceptor,
          meta: {
            rule: "editor",
            is_public: false,
            name_section: "Nueva Aceptación documento"
          }
        },
        {
          path: "/new-clone/:document_type/:document_id",
          name: "new-clone",
          component: NewClone,
          meta: {
            rule: "editor",
            is_public: false,
            name_section: "Clonar"
          }
        },
        {
          path: "/new-recurring/:document_type/:document_id",
          name: "new-recurring",
          component: NewRecurring,
          meta: {
            rule: "editor",
            is_public: false,
            name_section: "Recurrente"
          }
        },
        {
          path: "/report-tickets",
          name: "report-tickets",
          component: ReportTickets,
          meta: {
            rule: "editor",
            is_public: false,
            name_section: "Reporte Tiquetes"
          }
        },
        {
          path: "/report-invoices",
          name: "report-invoices",
          component: ReportInvoices,
          meta: {
            rule: "editor",
            is_public: false,
            name_section: "Reporte Facturas"
          }
        },
        {
          path: "/report-notes",
          name: "report-notes",
          component: ReportNotes,
          meta: {
            rule: "editor",
            is_public: false,
            name_section: "Reporte Notas"
          }
        },
        {
          path: "/report-expenses",
          name: "report-expenses",
          component: ReportExpenses,
          meta: {
            rule: "editor",
            is_public: false,
            name_section: "Informe de gastos"
          }
        },
        {
          path: "/report-items",
          name: "report-items",
          component: ReportItems,
          meta: {
            rule: "editor",
            is_public: false,
            name_section: "Reporte Productos"
          }
        },
        {
          path: "/terms/:company_id",
          name: "terms",
          component: Terms,
          meta: {
            rule: "editor",
            is_public: false,
            name_section: "Plantillas Correos"
          }
        },
        {
          path: "/taxes/:company_id",
          name: "taxes",
          component: Taxes,
          meta: {
            rule: "editor",
            is_public: false,
            name_section: "IVA"
          }
        },
        {
          path: "/add-user",
          name: "add-user",
          component: AddUser,
          meta: {
            rule: "editor",
            is_public: false,
            name_section: "Nuevo Usuario"
          }
        },
        {
          path: "/edit-user/:user_id",
          name: "edit-user",
          component: EditUser,
          meta: {
            rule: "editor",
            is_public: false,
            name_section: "Editar Usuario"
          }
        },
        {
          path: "/users",
          name: "users",
          component: Users,
          meta: {
            rule: "editor",
            is_public: false,
            name_section: "Lista de usuarios"
          }
        },
        {
          path: "/assign-company",
          name: "assign-company",
          component: AssignCompany,
          meta: {
            rule: "editor",
            is_public: false,
            name_section: "Asignar compañia"
          }
        },
        {
          path: "/companies-user/:user_id",
          name: "companies-user",
          component: CompaniesUser,
          meta: {
            rule: "editor",
            is_public: false,
            name_section: "Compañias usuario"
          }
        },
        {
          path: "/all-companies",
          name: "all-companies",
          component: AllCompanies,
          meta: {
            rule: "editor",
            is_public: false,
            name_section: "Todas las compañias"
          }
        },
        {
          path: "/update-cabys-codes",
          name: "update-cabys-codes",
          component: UpdateCabysCodes,
          meta: {
            rule: "editor",
            is_public: false,
            name_section: "Actualizar codigos cabys"
          }
        },
        {
          path: "/simples",
          name: "simples",
          component: Simples,
          meta: {
            rule: "editor",
            is_public: false,
            name_section: "Simplificado"
          }
        },
        {
          path: "/new-simple",
          name: "new-simple",
          component: NewSimple,
          meta: {
            rule: "editor",
            is_public: false,
            name_section: "Nuevo Simplificado"
          }
        },
        {
          path: "/providers",
          name: "providers",
          component: Providers,
          meta: {
            rule: "editor",
            is_public: false,
            name_section: "Proveedores"
          }
        },
        {
          path: "/report-document-receptions",
          name: "report-document-receptions",
          component: ReportDocumentReceptions,
          meta: {
            rule: "editor",
            is_public: false,
            name_section: "Reporte recepción de documentos"
          }
        }
      ]
    },
    // Redirect to 404 page, if no match found
    {
      path: "/*",
      redirect: "/pages/error-404"
    }
  ]
});

router.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById("loading-bg");
  if (appLoading) {
    appLoading.style.display = "none";
  }
});

router.beforeEach((to, from, next) => {
  let token = localStorage.getItem("token");
  let company = localStorage.getItem("company_default");
  let expire_token = localStorage.getItem("expire_token");
  let user = localStorage.getItem("user");

  if (expire_token) {
    localStorage.clear();
    next({ path: "/login" });
  } else if (token && company) {
    company = JSON.parse(company);
    user = JSON.parse(user);
    if (
      !company.active &&
      user.rol !== "admin" &&
      to.name !== "dashboard" &&
      to.name !== "companies"
    ) {
      next({ path: "/dashboard" });
    } else if (
      company.permission == 2 &&
      (to.name == "message-receptors" ||
        to.name == "new-message-receptor" ||
        to.name == "dashboard" ||
        to.name == "report-expenses")
    ) {
      next();
    } else if (
      company.permission == 1 ||
      company.permission == 3 ||
      company.permission == 4
    ) {
      next();
    }
  } else if (
    to.name === "query-public-document" ||
    to.name === "password-reset" ||
    to.name === "password-email"
  ) {
    next();
  } else {
    if (to.name == "login") {
      next();
    } else {
      next({ path: "/login" });
    }
  }
});

export default router;
