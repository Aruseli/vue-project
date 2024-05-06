import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/terminal.vue"),
        meta: { colorMode: 'dark' } ,
        children: [
          {
            path: "",
            component: () => import("pages/employee-actions.vue"),
            meta: { colorMode: 'dark' }
          },
          {
            path: "employee-actions",
            component: () => import("pages/employee-actions.vue"),
            meta: { colorMode: 'dark' }
          },
          {
            path: "complete-inventory",
            component: () => import("pages/complete-inventory.vue"),
            meta: { colorMode: 'light' }
          },
          {
            path: "selective-inventory",
            component: () => import("pages/selective-inventory.vue"),
            meta: { colorMode: 'light' }
          },
          {
            path: "arrival-goods/:id",
            component: () => import("pages/arrival-goods.vue"),
            meta: { colorMode: 'light' }
          },
          {
            path: "issuing-order",
            component: () => import("pages/issuing-order.vue"),
            meta: { colorMode: 'light' }
          },
          {
            path: "issued-order",
            component: () => import("pages/issued-order.vue"),
            meta: { colorMode: 'light' }
          },
          {
            path: "issuing-order/order/:id",
            component: () => import("pages/order-details.vue"),
            meta: { colorMode: 'light' },
            props: true,
          },
          {
            path: "hello",
            component: () => import("pages/hello.vue"),
            meta: { colorMode: 'dark' },
          },
          {
            path: "languages",
            component: () => import("pages/languages.vue"),
            meta: { colorMode: 'dark' },
          },
          {
            path: "catalog",
            component: () => import("pages/catalog.vue"),
            meta: { colorMode: 'dark' },
          },
          {
            path: "close-shift/:ref",
            component: () => import("pages/complete-inventory.vue"),
            meta: { colorMode: 'light' },
          },
          {
            path: "open-shift/:ref",
            component: () => import("pages/complete-inventory.vue"),
            meta: { colorMode: 'light' },
          },
        ],
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;

