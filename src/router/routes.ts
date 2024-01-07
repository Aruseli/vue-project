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
        component: () => import("pages/IndexPage.vue"),
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

