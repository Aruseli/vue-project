import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/terminal.vue"),
      },
      {
        path: "employee-actions",
        component: () => import("pages/employee-actions.vue"),
      },
      {
        path: "complete-inventory",
        component: () => import("pages/complete-inventory.vue"),
      },
      {
        path: "selective-inventory",
        component: () => import("pages/selective-inventory.vue"),
      },
      {
        path: "arrival-goods/:id",
        component: () => import("pages/arrival-goods.vue"),
      },
      {
        path: "issuing-order",
        component: () => import("pages/issuing-order.vue"),
      },
      {
        path: "issued-order",
        component: () => import("pages/issued-order.vue"),
      },
      {
        path: "issuing-order/order/:id",
        component: () => import("pages/order-details.vue"),
        props: true,
      },
      {
        path: "hello",
        component: () => import("pages/hello.vue"),
      },
      {
        path: "languages",
        component: () => import("pages/languages.vue"),
      },
      {
        path: "catalog",
        component: () => import("pages/catalog.vue"),
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

