import i18next from "i18next";
import { QVueGlobals } from "quasar";
import { apiReportsGetView } from "./api";
import { wsSendMessage } from "./local-device-ws";

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
        message: 'Error occured',
        icon: 'warning',
        color: 'warning',
      });
    }
    finally {
      $q.loading.hide();
    }
}

type PrintDocumentOptions = {documentId: number, $q: QVueGlobals, viewId: string, langCode: string}

/**
 * Prints leftovers
 * 
 * @example
 * ```
 * <IconButton
 *   round
 *   :icon="print"
 *   @click="printLeftovers({$q, dateTo: '21.03.2024', shouldShowZeroRemains: true, stockList: ['1362c8b4-3642-408b-9fd0-057acf547c60']})"
 * />
 * ```
 */
export async function printLeftovers({$q, viewId = '3b3ed231-f11c-46d9-ba66-253a05940968', dateTo, shouldShowZeroRemains, stockList, langCode = i18next.language}: {$q: QVueGlobals, viewId?: string, stockList: Array<string>, dateTo: string, shouldShowZeroRemains: boolean, langCode?: string}) {
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
          "name": "stock_list",
          "value": `{${stockList.join(',')}}`,
          "expression": `{${stockList.join(',')}}`
        }
      ]
      );
      console.log({viewData});
      wsSendMessage('check-print', viewData);
    }
    catch(e) {
      console.log(e);
      $q.notify({
        message: 'Error occured',
        icon: 'warning',
        color: 'warning',
      });
    }
    finally {
      $q.loading.hide();
    }
}