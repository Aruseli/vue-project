// @ts-check
export default {
  /**
   * @typedef {import('../types/kiosk-state').Settings} Settings
   * @type Settings
   */
  "settings": {
    "loc": "en",
    "tdp": "ws://127.0.0.1:3010",

    "view_ord": "a59a2a47-7ebb-497d-80ff-5b9386726871",
    "view_check": "ff7ce8d1-989f-4fc6-9ad4-4aacf65da9f8",
    "view_doc_input": "f8e0f371-87e6-460a-8010-011eabef8757",
    "view_doc_invent": "3d8779b5-2705-4668-a7fd-fd51e480890c",
    "view_doc_leftover": "827dea44-c354-4b5a-aaee-6aff45c01369",

    "client_corr_id": "4b4d99df-3e1a-4e49-853b-2ae324a954ae",
    "user_corr_type": "staff",
    "kiosk_corr_type": "stock",
    "munit_id": "f749a8e4-aa0e-42ad-9768-888c8ef5629b",
    "currency_id": "54a23c08-4fb8-4952-bf17-7ee9528cdfca",

    "doc_type__goods_arrival": "c50c9265-6874-4ecc-950f-588145ff3b65",
    "doc_type__inventory": "9f358a54-742e-49f7-bbe6-2cf906d534c3",
    "doc_type__inventory_request": "bb3e82aa-f45d-47e5-9c32-0d6e8f7881ca",
    "doc_type__invoice": "3631602d-ef2e-41fe-8aaf-0c063eacb5e1",
    "docdetail_type__goods_arrival_incoming": "bd91b47e-e905-46c5-bbe8-736757f03b87",
    "docdetail_type__inventory": "23e85f54-cf45-417e-bd57-afd89a2a93de",
    "docdetail_type__inventory_request": "fdacca65-6f36-4343-8821-f1dc1d18e1cf",
    "docdetail_type__invoice": "f15e302a-b60e-4a7d-bbba-64d29548355c",
    "inventory_request_state_requested": 0,
    "inventory_request_state_fulfilled": 6,

    "docoperation_type__erroneous_action": "850180e3-837f-436f-8d92-2a6ff4a8de97",

    "rights__kiosk_open_shift": "a2bd93d9-c7a3-4a53-ace9-0a655ac4dff1",
    "rights__kiosk_close_own_shift": "05dcfdba-1b5c-477c-a2f4-e2ac341f5e72",
    "rights__kiosk_close_any_shift": "73b7dd8b-b755-49ae-b08d-b13128769c9d",
    "rights__kiosk_issue_order": "11d9d58e-8863-49a1-81f1-93d7921468db",
    "rights__kiosk_selective_inventory": "9cd13ce1-e4a8-4a21-9bfd-3cfdb9ace2da",
    "rights__kiosk_selective_inventory_extended": "bdb3e37d-62ea-462a-9830-8d014c6dd6d1",
    "rights__kiosk_full_inventory": "89d028a8-c1c1-43e8-8dec-6922dcfe02aa",
    "rights__kiosk_arrival_of_goods": "aa354b72-07ba-456a-8028-da17a2783381",
    "rights__kiosk_list_orders": "4c8cc46b-2e84-4002-98da-b3b31c19049b",
    "rights__kiosk_print_stock": "734ee7be-917e-493e-8763-c6c27c3a686f",

    "cache__images_cleanup_interval_ms": 6*3600*1000,
    "cache__orders_ttl_ms": 120*1000,
    "cache__arrivals_ttl_ms": 120*1000,
    "cache__inventories_ttl_ms": 120*1000,
    "user_info_update_interval": (process.env.DEV) ? 60_000 : 600_000,

    "customer_inactivity_before_redirect": 97_000,
    "customer_inactivity_countdown_duration": 7000,
    "customer_inactivity_animation_start_before_redirect": 9000,
    "customer_successful_order_notify_duration_ms": 7000,


    "employee_menu_inactivity_before_action": 150_000,
    "employee_menu_inactivity_countdown_duration": 30_000,
    "employee_menu_inactivity_action": "customer",
    "employee_docs_inactivity_before_action": 150_000,
    "employee_docs_inactivity_countdown_duration": 30_000,
    "employee_docs_inactivity_action": "customer",
    "employee_doclists_inactivity_before_action": 150_000,
    "employee_doclists_inactivity_countdown_duration": 30_000,
    "employee_doclists_inactivity_action": "customer",

    "allow_order_issue_in_outdated_shift": true,
    "shifts__poll_interval_average_ms": 600*1000,
    "shifts__poll_interval_variance_ms": 120*1000,
    "shifts__inventory_on_open": true,
    "shifts__inventory_on_close": true,
    "shifts__skip_inventory_on_open_if_same_user": true,
    "shifts__state_open": 2,
    "shifts__state_closing": 5,
    "shifts__state_closed": 0,

    "alt_ui": 'design_v3',
    "keyboard_login_enabled": false,

    "payment_type_id_cash": "8f404e9c-e42f-4251-8520-13961924c5e6",
    "payment_type_id_card": "df828bbb-05f7-4f64-bb36-3c20b0e37393",

    "check_ext_source": "d69b1a29-ed49-4b57-b335-f719abce640d",
    "check_content_type": "продажа товара",

    "printer_type": "usb",
    "networkHost": undefined,
    "networkPort": undefined,
  },

  // These four lines are outside of settings because they are used
  // before backend settings overrides are available
  "terminal_type_id": "654c6b75-54c5-4153-a3c7-b0f6a3431c68",
  "terminal_registration_attempt_interval": (process.env.DEV) ? 1000 : 5000,
  "terminal_status_update_interval": (process.env.DEV) ? 60_000 : 600_000,
  "cat_health_check_interval_ms": 5000,
}
