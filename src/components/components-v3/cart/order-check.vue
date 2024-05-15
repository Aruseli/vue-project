<script setup lang="ts">
  import { t } from 'i18next';
  import { useCartStore } from 'src/stores/cart';
  import { computed, ref } from 'vue';
  import IconButton from '../../buttons/icon-button.vue';
  import DividerThin from '../../dividers/divider-thin.vue';
  import LogoSvg from '../../logo/logo-svg.vue';

  const cartStore = useCartStore();

  const emit = defineEmits(['click']);
  const message = ref(t('contact_seller_for_further_information'));
  const maxFontSize = 6; // максимальный размер шрифта
  const minFontSize = 4; // минимальный размер шрифта

  const computedFontSize = computed(() => {
    const length = message.value.length;
    return length > 38 ? `${minFontSize}rem` : `${maxFontSize}rem`;
  });
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
    <div class="text-h2 text-white text-uppercase text-center pt-100 px-140 mb-200 line_height_1_3">
      {{$t('order_was_successfully_confirmed')}}
    </div>
    <div class="items-center column">
      <div class="text-green text-center first_letter px-40 mb-100 contact_style line_height_1_3" :style="{ fontSize: computedFontSize }">
        {{$t(message)}}
      </div>
      <LogoSvg
        fill="#5D5D5D"
        width="15em"
        height="15em"
        class="mb-100"
      />
      <div class="text-h2 text-center text-uppercase text-white mb-120">
        {{$t('thank_you')}}
      </div>
    </div>
    <div class="full-width q-pa-xl">
      <ol class=" text-white full-width">
        <li class="text-h4 text-weight-light text-white mb-10" v-for="item in cartStore.cartExtended" :key="item.id">
          <div class="ordered_product">
            <div>{{ item.title }}</div>
            <div class="dotted_border" />
            <div>
              <span>{{ item.quant }}</span>&ensp;
              <span>{{ $t('pc', { count: item.quant }) }}</span>
            </div>
            <div class="dotted_border" />
            <div>{{ item.price * item.quant }}&ensp;&#3647;</div>
          </div>
        </li>
      </ol>
    </div>

    <div class="text-white text-h2 no-margin row justify-between fit q-pb-xl">
      <DividerThin class="bg-white q-mb-sm" />
      <div class="column q-px-xl full-width">
        <div class="text-h2 text-uppercase">{{ $t('total') }}</div>
        <div class="text-white row justify-between full-width">
          <div class="text-h3 row text-weight-regular q-gutter-x-sm text-white items-center">
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
    grid-template-columns: max-content 1fr max-content 1fr max-content;
  }

</style>
