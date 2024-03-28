import i18next from "i18next";
import { QVueGlobals } from "quasar";
import { apiReportsGetView } from "./api";
import { wsSendMessage } from "./local-device-ws";

export async function printDocument({documentId, $q}: {documentId: number, $q: QVueGlobals}) {
  console.log({documentId})
  $q.loading.show();
    try {
      const orderViewId = "a59a2a47-7ebb-497d-80ff-5b9386726871";
      const langCode = i18next.language;
      const viewData = await apiReportsGetView(orderViewId, [
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