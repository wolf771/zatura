import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

Vue.use(VueRouter)

function authGuard(to, from, next) {
  store.dispatch('auth/me')
  store.dispatch('auth/getInitData')
  let isAuthenticated = false
  if (localStorage.getItem('token')) { isAuthenticated = true } else { isAuthenticated = false }
  if (isAuthenticated) {
    next() // allow to enter route
  } else {
    next('/login') // go to '/login';
  }
}
function beforeAuthGuard(to, from, next) {
  let isAuthenticated = false
  if (localStorage.getItem('token')) { isAuthenticated = true } else { isAuthenticated = false }
  if (!isAuthenticated) {
    next()
  } else {
    next('/')
  }
}

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/register/index.vue'),
      beforeEnter: beforeAuthGuard,
      meta: {
        pageTitle: 'Registro',
        layout: 'full',
      },
    },
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue'),
      beforeEnter: authGuard,
      meta: {
        pageTitle: 'Home',
        breadcrumb: [
          {
            text: 'Home',
            active: true,
          },
        ],
      },
    },
    {
      path: '/clients',
      name: 'clients',
      component: () => import('@/views/Clients/index.vue'),
      beforeEnter: authGuard,
      meta: {
        pageTitle: 'Clientes',
        breadcrumb: [
          {
            text: 'Clientes',
            active: true,
          },
        ],
      },
    },
    {
      path: '/clients/:id',
      name: 'client-detail',
      component: () => import('@/views/Clients/ DetailClient.vue'),
      beforeEnter: authGuard,
      meta: {
        pageTitle: 'Clientes',
        breadcrumb: [
          {
            text: 'Clientes',
            active: true,
          },
        ],
      },
    },
    {
      path: '/products',
      name: 'products',
      component: () => import('@/views/Products/index.vue'),
      beforeEnter: authGuard,
      meta: {
        pageTitle: 'Articulos',
        breadcrumb: [
          {
            text: 'Articulos',
            active: true,
          },
        ],
      },
    },
    {
      path: '/invoices',
      name: 'invoices',
      component: () => import('@/views/Invoices/index.vue'),
      beforeEnter: authGuard,
      meta: {
        pageTitle: 'Facturas',
        breadcrumb: [
          {
            text: 'Facturas',
            active: true,
          },
        ],
      },
    },
    {
      path: '/tickets',
      name: 'tickets',
      component: () => import('@/views/Tickets/index.vue'),
      beforeEnter: authGuard,
      meta: {
        pageTitle: 'Tiquetes',
        breadcrumb: [
          {
            text: 'Tiquetes',
            active: true,
          },
        ],
      },
    },
    {
      path: '/quotations',
      name: 'quotations',
      component: () => import('@/views/Quotations/index.vue'),
      beforeEnter: authGuard,
      meta: {
        pageTitle: 'Cotizaciónes',
        breadcrumb: [
          {
            text: 'Cotizaciónes',
            active: true,
          },
        ],
      },
    },
    {
      path: '/recurring-invoices',
      name: 'recurring-invoices',
      component: () => import('@/views/Recurring/index.vue'),
      beforeEnter: authGuard,
      meta: {
        pageTitle: 'Factura Recurrente',
        breadcrumb: [
          {
            text: 'Factura Recurrente',
            active: true,
          },
        ],
      },
    },
    {
      path: '/document/:type/:action/:id?',
      name: 'document',
      component: () => import('@/views/NewDocument.vue'),
      beforeEnter: authGuard,
      meta: {
        pageTitle: 'Nuevo Documento',
        breadcrumb: [
          {
            text: 'Nuevo Documento',
            active: true,
          },
        ],
      },
    },
    {
      path: '/detail/:type/:id',
      name: 'document-detail',
      component: () => import('@/views/DocumentDetail/Index.vue'),
      beforeEnter: authGuard,
      meta: {
        pageTitle: 'Vista Previa',
        breadcrumb: [],
      },
    },
    {
      path: '/my-companies',
      name: 'my-companies',
      component: () => import('@/views/MyCompanies/index.vue'),
      beforeEnter: authGuard,
      meta: {
        pageTitle: 'Mis compañias',
        breadcrumb: [
          {
            text: 'Mis compañias',
            active: true,
          },
        ],
      },
    },
    {
      path: '/company-configurations/:company_id',
      name: 'company-configurations',
      component: () => import('@/views/MyCompanies/components/MainConfiguration.vue'),
      beforeEnter: authGuard,
      meta: {
        pageTitle: 'Configurar compañía',
        breadcrumb: [
          {
            text: 'Configurar compañía',
            active: true,
          },
        ],
      },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
      beforeEnter: beforeAuthGuard,
      meta: {
        layout: 'full',
      },
    },
    {
      path: '/error-404',
      name: 'error-404',
      component: () => import('@/views/error/Error404.vue'),
      meta: {
        layout: 'full',
      },
    },
    {
      path: '*',
      redirect: 'error-404',
    },
  ],
})

// ? For splash screen
// Remove afterEach hook if you are not using splash screen
router.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById('loading-bg')
  if (appLoading) {
    appLoading.style.display = 'none'
  }
})
export default router
