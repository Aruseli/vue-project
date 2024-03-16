import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { Good, useGoodsStore } from './goods';
import { useAppStore } from './app';
import { apiSaveDocument } from 'src/services';
import { getNextInvoiceNumber } from 'src/services/documents';

export type CartItem = {
  id: string,
  quant: number,
  price: number,
}

export const useCartStore = defineStore('cartStore',
  () => {
    const appStore = useAppStore();
    const goodsStore = useGoodsStore();
    const cart = ref<CartItem[]>([]);
    const increaseItemsCount = (good: Good | CartItem) => {
      const cartItem = cart.value.find(i => i.id == good.id)
      if (cartItem) {
        cartItem.quant += 1
      } else {
        cart.value.push({ id: good.id, quant: 1, price: good.price})
      }
    }

    const decreaseItemsCount = (good: Good | CartItem) => {
      const cartItem = cart.value.find(i => i.id == good.id)
      if (!cartItem) {
        return
      }
      cartItem.quant -= 1
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

    const submitOrder = async () => {
      const settings = appStore.kioskState.settings
      const doc = {
        id: undefined,
        state: 2,
        doc_type: settings?.invoice_doc_type_id ?? '',
        abbr_text: undefined,
        abbr_num: getNextInvoiceNumber(),
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
          doc_detail_type: settings?.invoice_docdetail_type_id ?? '',
        })),
      }
      await apiSaveDocument(doc)
      clearCart()
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
      cartExtended,
      totalQuantity: computed(() => cart.value.reduce((acc, item) => acc + item.quant, 0)),
      totalPrice: computed(() => cart.value.reduce((acc, item) => acc + item.quant * item.price, 0)),
      clearCart,
      decreaseItemsCount,
      increaseItemsCount,
      removeFromCart,
      submitOrder,
    }
  },
  {
    persist: true,
  },

);


