import { RouteRecordRaw } from 'vue-router';
import CartDrawer from '../components/cart-catalog/cart-drawer.vue';
import Cart from '../components/cart-catalog/cart.vue';
import Catalog from '../components/catalog.vue';
import Dialog from '../components/dialog.vue';
import Terminal from '../pages/terminal.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue')
      },
      {
        path: '/post',
        component: () => import('pages/terminal.vue')
      },
      {
        path: '/catalog',
        name: 'Catalog',
        component: Catalog,
        children: [
          {
            path: '/product/:id',
            name: 'Dialog',
            component: Dialog
          },
        ]
      },
      {
        path: '/cart',
        name: 'Cart',
        component: Cart
      },

    ],
  },
  // {
  //   path: '/post',
  //   name: 'Terminal',
  //   component: () => import('pages/terminal.vue')
  // },

  // Always leave this as last one,
  // but you can also remove it
  // {
  //   path: '/:catchAll(.*)*',
  //   component: () => import('pages/ErrorNotFound.vue'),
  // },
];

export default routes;

