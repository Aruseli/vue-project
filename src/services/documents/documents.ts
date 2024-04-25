import { apiSaveDocument, apiSaveOperation } from "../api";
import { useAppStore } from "src/stores/app";
import { useGoodsStore } from "src/stores/goods";
import { uuidv4 } from "../utils";

export async function journalErroneousAction(doc_id: string, data?: object) {
  const appStore = useAppStore();
  await apiSaveOperation(
    appStore.kioskState.settings?.docoperation_type__erroneous_action ?? '',
    doc_id,
    appStore.kioskState.userCorr?.id ?? '',
    appStore.kioskState.terminalShift?.id ?? '',
    data,
  )
}

export async function debugGenerateArrival() {
  const appStore = useAppStore();
  const goodsStore = useGoodsStore();
  const goodsArrivalDoc = {
    id: undefined,
    state: 2,
    doc_type: appStore.kioskState.settings?.doc_type__goods_arrival ?? '',
    abbr_text: undefined,
    abbr_num: undefined,
    doc_date: new Date().toISOString(),
    doc_order: 0,
    corr_from_ref: "26e33d00-e735-4fc7-9ea9-c98dc769d7b9", // supplier
    corr_to_ref: appStore.kioskState.kioskCorr?.id ?? '',
    respperson_ref: appStore.kioskState.userCorr?.id ?? '',
    currency_ref: appStore.kioskState.settings?.currency_id ?? '',
    curr_rate: 1,
    comment: undefined,
    details: goodsStore.goods.flatMap(gc =>
      gc.goods.slice(0, 3).flatMap(g =>
        [0, 1, 2].map(i => ({
          id: undefined,
          state: 0,
          rec_order: 0,
          good_id: g.id,
          munit_id: appStore.kioskState.settings?.munit_id ?? '', // default
          quant: 1,
          total: g.price,
          doc_detail_link: uuidv4(),
          doc_detail_type: 'bd91b47e-e905-46c5-bbe8-736757f03b87', // incoming
        })))),
  }
  console.log('Debug arrival goods', await apiSaveDocument(goodsArrivalDoc, appStore.kioskState.terminalShift?.id ?? ''))
}

// ---------- Generate selective inventory ----------
// const goodsInventoryDoc = {
//   id: undefined,
//   state: 2,
//   doc_type: settings?.doc_type__inventory ?? '',
//   abbr_text: undefined,
//   abbr_num: undefined,
//   doc_date: new Date().toISOString(),
//   doc_order: 0,
//   corr_from_ref: appStore.kioskState.kioskCorr?.id ?? '',
//   corr_to_ref: appStore.kioskState.kioskCorr?.id ?? '',
//   respperson_ref: appStore.kioskState.userCorr?.id ?? '',
//   currency_ref: settings?.currency_id ?? '',
//   curr_rate: 1,
//   comment: undefined,
//   details: fetchedGoods.flatMap(gc => gc.goods.filter(g => !!g)).map(g => ({
//     id: undefined,
//     state: 0,
//     rec_order: 0,
//     good_id: g.id,
//     munit_id: settings?.munit_id ?? '', // default
//     quant: 3,
//     total: 3*g.price,
//     doc_detail_link: undefined,
//     doc_detail_type: settings?.docdetail_type__inventory ?? '',
//   })),
// }
// console.log('Debug inventory goods', await apiSaveDocument(goodsInventoryDoc))
// --------------------------------------------------
