<script setup>
  import { evaArrowBack, evaMinusOutline, evaPlusOutline } from '@quasar/extras/eva-icons';
import { useAppStore } from 'src/stores/app';
import { useCartStore } from 'src/stores/cart';
import DividerBold from '../../dividers/divider-bold.vue';
import DividerThin from '../../dividers/divider-thin.vue';
import Modal from '../../overlay/modal.vue';

  const app = useAppStore();
  const cartStore = useCartStore();
</script>

<template>
  <Modal :isOpen="app.orderDialog">
    <div class="dialog_container">
      <div class="dialog_cart bg-white column justify-between items-center q-pa-lg-md q-pa-xs-sm">
        <div>
          <div class="text-h3 text-uppercase text-center text-weight-regular q-mb-lg-md q-mb-xs-sm">
            {{$t('order_is_processed')}}
          </div>
          <div class="q-mb-lg-md q-mb-xs-sm text-center">
            <q-img src="/girl.svg" max-width="100%" max-height="100%" class="img_style" />
          </div>
          <div class="text-h4 text-center text-weight-bold q-mb-lg-sm q-mb-xs-xs">
            {{$t('contact_seller_for_further_information')}}
          </div>
          <DividerBold class="q-mb-lg-sm q-mb-xs-xs" />
          <div class="text-h5 text-center text-uppercase text-weight-regular">
            {{$t('thank_you')}}
          </div>
        </div>
        <div class="q-mb-lg-md q-mb-xs-sm full-width">
          <div class="ordered_list column full-width">
            <div class="ordered_product row fit justify-between" v-for="item in cartStore.cartExtended" :key="item.id">
              <div class="text-h5">{{ item.title }}</div>
              <div class="text-h5">
                <span>{{ item.quant }}</span>
                <span>{{ $t('pc', { count: item.quant }) }}</span> &#8260;
                <span>{{ item.price * item.quant }}&ensp;&#3647</span>
              </div>
            </div>
          </div>
        </div>

        <div class="column full-width">
          <div class="q-mb-lg-md q-mb-xs-sm row justify-between fit">
            <div class="text-h5 text-uppercase text-weight-bold">{{ $t('total') }}</div>
            <div class="text-h5 text-uppercase text-weight-bold">
              {{ cartStore.totalPrice }} &ensp;&#3647
            </div>
          </div>
          <DividerThin class="bg-negative q-mb-sm" />
          <div class="text-h5 text-uppercase row q-gutter-x-sm text-weight-regular text-left">
            <span>{{ $t('order') }}</span>
            <span>{{ cartStore.totalQuantity }}</span>
            <span>{{ $t('pc', { count: cartStore.totalQuantity }) }}</span>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>

<style scoped>
  .dialog_cart {
    border-radius: 2rem;
  }
  .dialog_cart > *:nth-child(1) {
    margin-bottom: 5rem;
    @media(max-width: 1300px) {
      margin-bottom: 3rem;
    }
  }
  .dialog_container {
    width: 70vw;
    max-width: 80vw;
    height: max-content;
  }
  .img_style {
    width: 25rem;
    height: 25rem;
    @media(max-width: 1300px) {
      width: 15rem;
      height: 15rem;
    }
    @media(max-width: 900px) {
      width: 10rem;
      height: 10rem;
    }
    @media(max-width: 500px) {
      width: 7rem;
      height: 7rem;
    }
  }
  .ordered_list > *:not(:last-child) {
    margin-bottom: 0.5rem;
  }
</style>
