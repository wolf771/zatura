/*=========================================================================================
  File Name: sidebarItems.js
  Description: Sidebar Items list. Add / Remove menu items from here.
  Strucutre:
          url     => router path
          name    => name to display in sidebar
          slug    => router path name
          icon    => Feather Icon component/icon name
          tag     => text to display on badge
          tagColor  => class to apply on badge element
          i18n    => Internationalization
          submenu   => submenu of current item (current item will become dropdown )
                NOTE: Submenu don't have any icon(you can add icon if u want to display)
          isDisabled  => disable sidebar item/group
  ----------------------------------------------------------------------------------------
  Item Name: Vuesax Admin - VueJS Dashboard Admin Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

export default [
  {
    url: "/dashboard",
    name: "Dashboard",
    slug: "dashboard",
    icon: "HomeIcon",
    i18n: "Dashboard"
  },
  {
    url: "/clients",
    name: "Clientes",
    slug: "/clients",
    icon: "UsersIcon",
    i18n: "Clientes",
    new_item: "new-client"
  },
  {
    url: "/items",
    name: "Articulos",
    slug: "/items",
    icon: "FileIcon",
    i18n: "Articulos",
    new_item: "/new-item"
  },
  {
    header: " ",
    i18n: " "
  },
  {
    url: "/quotations",
    name: "Cotizaciones",
    slug: "/quotations",
    icon: "FileTextIcon",
    i18n: "Cotizaciones",
    new_item: "/new-quotation"
  },
  {
    url: "/recurrings",
    name: "Facturas recurrentes",
    slug: "/recurrings",
    icon: "FileTextIcon",
    i18n: "Facturas recurrentes"
  },
  {
    url: "/invoices",
    name: "Facturas",
    slug: "/invoices",
    icon: "TagIcon",
    i18n: "Facturas",
    new_item: "/new-invoice"
  },
  {
    url: "/tickets",
    name: "Tiquetes",
    slug: "/tickets",
    icon: "FileTextIcon",
    i18n: "Tiquetes",
    new_item: "/new-ticket"
  },
  {
    url: "/notes",
    name: "Notas",
    slug: "/notes",
    icon: "FileTextIcon",
    i18n: "Notas"
  },
  {
    url: null,
    name: "Simplificado",
    slug: "simples",
    icon: "FileTextIcon",
    i18n: "Simplificado",
    submenu: [
      {
        url: "/simples",
        name: "Emitidos",
        slug: "/simples",
        i18n: "Emitidos"
      },
      {
        url: "/providers",
        name: "Proveedores",
        slug: "/providers",
        i18n: "Proveedores"
      }
    ]
  },
  {
    header: " ",
    i18n: " "
  },
  {
    url: "/message-receptors",
    name: "Recepción Documentos",
    slug: "/message-receptors",
    icon: "FileTextIcon",
    i18n: "Recepción Documentos",
    new_item: "new-message-receptor"
  },
  {
    url: "/payments",
    name: "Pagos",
    slug: "/payments",
    icon: "CreditCardIcon",
    i18n: "Pagos"
  },
  {
    url: "/expenses",
    name: "Gastos",
    slug: "/expenses",
    icon: "HeartIcon",
    i18n: "Gastos"
  },
  {
    url: null,
    name: "Reportes",
    slug: "reports",
    icon: "ActivityIcon",
    i18n: "Reportes",
    submenu: [
      {
        url: "/report-tickets",
        name: "Tiquetes",
        slug: "/report-tickets",
        i18n: "Tiquetes"
      },
      {
        url: "/report-invoices",
        name: "Facturas",
        slug: "/report-invoices",
        i18n: "Facturas"
      },
      {
        url: "/report-notes",
        name: "Notas",
        slug: "/report-notes",
        i18n: "Notas"
      },
      {
        url: "/report-expenses",
        name: "Gastos",
        slug: "/report-expenses",
        i18n: "Gastos"
      },
      {
        url: "/report-items",
        name: "Productos",
        slug: "/report-items",
        i18n: "Productos"
      },
      {
        url: "/report-document-receptions",
        name: "Recep. Documentos",
        slug: "/report-document-receptions",
        i18n: "Recep. Documentos"
      }
    ]
  },
  {
    header: " ",
    i18n: " "
  },
  {
    url: "/companies",
    name: "Mis compañias",
    slug: "/companies",
    icon: "BoxIcon",
    i18n: "Mis compañias"
  },
  {
    url: null,
    name: "Administrador",
    slug: "administrator",
    icon: "ArchiveIcon",
    i18n: "Administrador",
    submenu: [
      {
        url: "/users",
        name: "Usuarios",
        slug: "/users",
        i18n: "Usuarios"
      },
      {
        url: "/all-companies",
        name: "Todas compañias",
        slug: "/all-companies",
        i18n: "Todas compañias"
      },
      {
        url: "/assign-company",
        name: "Asignar compañia",
        slug: "/assign-company",
        i18n: "Asignar compañia"
      },
      {
        url: "/advertisement",
        name: "Anuncio",
        slug: "/advertisement",
        i18n: "Anuncio"
      },
      {
        url: "/update-cabys-codes",
        name: "Actualizar codigos cabys",
        slug: "/update-cabys-codes",
        i18n: "Actualizar codigos cabys"
      }
    ]
  }
];
