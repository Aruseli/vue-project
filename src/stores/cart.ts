import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { Good, useGoodsStore } from './goods';
import { useAppStore } from './app';
import { apiSaveDocument, printOrder } from 'src/services';
import { QVueGlobals } from 'quasar';
import { showSimpleNotification } from 'src/services/dialogs';
import { t } from 'i18next';

export type CartItem = {
  id: string,
  quant: number,
  price: number,
  stock: number,
}

export const useCartStore = defineStore('cartStore',
  () => {
    const appStore = useAppStore();
    const goodsStore = useGoodsStore();
    const cart = ref<CartItem[]>([]);
    const cta = ref(false);

    const ctaShow = () => {
      if(cart.value.length == 0) {
        cta.value = false;
      }
      cta.value = true;
    }

    const increaseItemsCount = (good: Good | CartItem) => {
      const cartItem = cart.value.find(i => i.id == good.id)
      if ((cartItem?.quant ?? 0) + 1 > good.stock) {
        showSimpleNotification(t('cart_item_is_limited_by_stock'));
        return;
      }
      if (cartItem) {
        cartItem.quant += 1;
      } else {
        cart.value.push({ id: good.id, quant: 1, price: good.price, stock: good.stock })
      }
    }

    const decreaseItemsCount = (good: Good | CartItem) => {
      const cartItem = cart.value.find(i => i.id == good.id)
      if (!cartItem) {
        return
      }
      cartItem.quant -= 1;
      if (cartItem.quant <= 0) {
        cart.value = cart.value.filter(i => i.id != good.id)
      }
    }

    const removeFromCart = (id: string) => {
      cart.value = cart.value.filter(i => i.id != id)
    }

    const clearCart = () => {
      cart.value = [];
    }

    const submitOrder = async ({$q} :{$q: QVueGlobals}) => {
      const settings = appStore.kioskState.settings
      const doc = {
        id: undefined,
        state: 2,
        doc_type: settings?.doc_type__invoice ?? '',
        abbr_text: undefined,
        doc_date: new Date().toISOString(),
        doc_order: 0,
        corr_from_ref: appStore.kioskState.kioskCorr?.id ?? '',
        corr_to_ref: settings?.client_corr_id ?? '',
        respperson_ref: appStore.kioskState.userCorr?.id ?? '',
        currency_ref: settings?.currency_id ?? '',
        curr_rate: 1,
        comment: undefined,
        details: cart.value.map((item, index) => ({
          id: undefined,
          state: 0,
          rec_order: index + 1,
          good_id: item.id,
          munit_id: settings?.munit_id ?? '', // default
          quant: item.quant,
          total: item.quant * item.price,
          doc_detail_link: undefined,
          doc_detail_type: settings?.docdetail_type__invoice ?? '',
        })),
      }
      const documentId = await apiSaveDocument(doc, appStore.kioskState.terminalShift?.id ?? '')
      await printOrder({documentId, $q,appStore})
      // clearCart()
      return { documentId };
    }

    const cartExtended = computed(() => {
      return cart.value.map(ci => {
        const good = goodsStore.getGoodById(ci.id);
        return {
          ...ci,
          image: good?.images[0]?.image,
          title: good?.title,
        }
      })
    })

    return {
      cart,
      cta,
      cartExtended,
      totalQuantity: computed(() => cart.value.reduce((acc, item) => acc + item.quant, 0)),
      totalPrice: computed(() => cart.value.reduce((acc, item) => acc + item.quant * item.price, 0)),
      clearCart,
      decreaseItemsCount,
      increaseItemsCount,
      removeFromCart,
      submitOrder,
      ctaShow,
    }
  },
  {
    persist: true,
  },

);


