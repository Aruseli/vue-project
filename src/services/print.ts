import i18next from "i18next";
import { QVueGlobals } from "quasar";
import { apiReportsGetView } from "./api";
import { wsSendMessage } from "./local-device-ws";
import { useAppStore } from "src/stores/app";

/**
 * Prints document
 * 
 * @example
 * ```
 * <IconButton
 *   round
 *   :icon="print"
 *   @click="printDocument({documentId: '7d92dd13-a34c-4b04-bc3c-fba23dbc7293', $q})"
 * />
 * ```
 */
export async function printDocument({documentId, $q, viewId, langCode = i18next.language}: PrintDocumentOptions) {
  console.log({documentId})
  $q.loading.show();
    try {
      const viewData = await apiReportsGetView(viewId, [
        {
          "name": "doc_id",
          "value": documentId,
          "expression": documentId
        },
        {
          "name": "lang_code",
          "value": langCode,
          "expression": langCode
        }
      ]);
      console.log({viewData});
      wsSendMessage('check-print', viewData);
    }
    catch(e) {
      console.log(e);
      $q.notify({
        message: 'Print Error occured',
        icon: 'warning',
        color: 'warning',
      });
    }
    finally {
      $q.loading.hide();
    }
}

type PrintDocumentOptions = {documentId: string, $q: QVueGlobals, viewId: string, langCode?: string}
type PrintSpecificDocumentOptions = Omit<PrintDocumentOptions, 'viewId'> & {
  viewId?: string,
  appStore: ReturnType<typeof useAppStore>
}

type PrintOrderDocumentOptions = Omit<PrintDocumentOptions, 'viewId'|'langCode'> & {
  viewId?: string,
  appStore: ReturnType<typeof useAppStore>,
  localLangCode?: string,
  systemLangCode?: string,
}


export async function printCheck({$q, documentId, langCode = i18next.language, appStore}: PrintSpecificDocumentOptions) {
  console.log(`appStore.kioskState.settings!.view_check`, appStore.kioskState.settings!.view_check)
  return await printDocument({documentId, $q, viewId: appStore.kioskState.settings!.view_check, langCode});
}

export async function printOrder({$q, documentId, localLangCode = i18next.language, appStore,viewId = appStore.kioskState.settings!.view_ord,systemLangCode}: PrintOrderDocumentOptions) {
  console.log({documentId})
  $q.loading.show();
    try {
      const viewData = await apiReportsGetView(viewId, [
        {
          "name": "doc_id",
          "value": documentId,
          "expression": documentId
        },
        {
          "name": "system_lang_code",
          "value": systemLangCode,
          "expression": systemLangCode
        },
        {
          "name": "local_lang_code",
          "value": localLangCode,
          "expression": localLangCode
        }
      ]);
      console.log({viewData});
      wsSendMessage('check-print', viewData);
    }
    catch(e) {
      console.log(e);
      $q.notify({
        message: 'Print Error occured',
        icon: 'warning',
        color: 'warning',
      });
    }
    finally {
      $q.loading.hide();
    }
}

export async function printGoodsArrival({$q,documentId, langCode = i18next.language, appStore, viewId = appStore.kioskState.settings!.view_doc_input}: PrintSpecificDocumentOptions) {
  return await printDocument({documentId, $q, viewId, langCode});
}

export async function printInventory({$q, documentId, langCode = i18next.language, appStore, viewId = appStore.kioskState.settings!.view_doc_invent}: PrintSpecificDocumentOptions) {
  return await printDocument({documentId, $q, viewId, langCode});
}

/**
 * Prints leftovers
 * 
 * @example
 * ```
 * <IconButton
 *   round
 *   :icon="print"
 *   @click="printLeftovers({$q, dateTo: '21.03.2024', kioskCorrespondentId: '1362c8b4-3642-408b-9fd0-057acf547c60'})"
 * />
 * ```
 */
export async function printLeftovers({$q,appStore, viewId = appStore.kioskState.settings!.view_doc_leftover, dateTo, shouldShowZeroRemains = false, kioskCorrespondentId, langCode = i18next.language}: {$q: QVueGlobals, viewId?: string, kioskCorrespondentId: string, dateTo: string, shouldShowZeroRemains?: boolean, langCode?: string, appStore: ReturnType<typeof useAppStore>}) {
  $q.loading.show();
    try {
      const viewData = await apiReportsGetView(viewId, [
        {
          "name": "date2",
          "value": dateTo,
          "expression": dateTo
        },
        {
          "name": "lang_code",
          "value": langCode,
          "expression": langCode
        },
        {
          "name": "show_zero_remains",
          "value": shouldShowZeroRemains,
          "expression": shouldShowZeroRemains
        },
        {
          "name": "kiosk_correspondent_id",
          "value": kioskCorrespondentId,
          "expression": kioskCorrespondentId
        }
      ]
      );
      console.log({viewData});
      wsSendMessage('check-print', viewData);
    }
    catch(e) {
      console.log(e);
      $q.notify({
        message: 'Print Error occured',
        icon: 'warning',
        color: 'warning',
      });
    }
    finally {
      $q.loading.hide();
    }
}