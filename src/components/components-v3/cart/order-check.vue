<script setup lang="ts">
  import { evaArrowBack, evaMinusOutline, evaPlusOutline } from '@quasar/extras/eva-icons';
  import { useAppStore } from 'src/stores/app';
  import { useCartStore } from 'src/stores/cart';
  import DividerBold from '../../dividers/divider-bold.vue';
  import DividerThin from '../../dividers/divider-thin.vue';
  import IconButton from '../../buttons/icon-button.vue';
  import LogoSvg from '../../logo/logo-svg.vue';

  const cartStore = useCartStore();

  const emit = defineEmits(['click']);
</script>

<template>
  <div class="dialog_container_v3 bg-grey-3 relative-position justify-between items-center" v-bind="$attrs">
    <IconButton
      icon="close"
      textColor="grey"
      :rounded="false"
      :round="true"
      :flat="true"
      size="xl"
      class="cart_close_button absolute-top-right"
      @click="emit('click')"
    />
    <div class="text-h2 text-white text-uppercase text-center pt-140 px-200 mb-200">
      {{$t('order_was_successfully_confirmed')}}
    </div>
    <div class="items-center column">
      <div class="text-green text-h1 text-center first_letter px-140 mb-100 contact_style">
        {{$t('contact_seller_for_further_information')}}
      </div>
      <LogoSvg
        fill="#5D5D5D"
        width="15em"
        height="15em"
        class="mb-100"
      />
      <div class="text-h2 text-center text-uppercase text-white">
        {{$t('thank_you')}}
      </div>
    </div>
    <div class="full-width q-pa-xl">
      <ol class=" text-white full-width">
        <li class="text-h4 text-weight-light text-white" v-for="item in cartStore.cartExtended" :key="item.id">
          <div class="ordered_product">
            <div>{{ item.title }}</div>
            <div class="dotted_border" />
            <div>
              <span>{{ item.quant }}</span>
              <span>{{ $t('pc', { count: item.quant }) }}</span> &#8260;
              <span>{{ item.price * item.quant }}&ensp;&#3647</span>
            </div>
          </div>
        </li>
      </ol>
    </div>

    <div class="text-white text-h2 no-margin row justify-between fit q-pb-xl">
      <DividerThin class="bg-white q-mb-sm" />
      <div class="column q-px-xl full-width">
        <div class="text-h2 text-uppercase">{{ $t('total') }}</div>
        <div class="text-white row justify-between full-width">
          <div
            class="text-h3 row text-weight-regular q-gutter-x-sm text-white items-center"
          >
            <span>{{ $t('order') }}</span>
            <span>{{ cartStore.totalQuantity }}</span>
            <span>{{ $t('pieces', { count: cartStore.totalQuantity }) }}</span>
          </div>
          <div class="text-h2">
            {{ cartStore.totalPrice }} &ensp;&#3647
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
  .dialog_container_v3 {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-rows: max-content repeat(2, 1fr) max-content;
  }
  .ordered_list_v3 > *:not(:last-child) {
    margin-bottom: 0.5rem;
  }

  li > div {
    color: #fafafa;
  }

  .ordered_product {
    display: grid;
    grid-template-columns: max-content 1fr max-content;
  }

  .dotted_border {
    border-bottom: 5px dotted white;
  }
  /* .contact_style {
    width: max-content;
  } */
</style>
