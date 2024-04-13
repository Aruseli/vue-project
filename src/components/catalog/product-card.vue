<script setup>
  import { evaMinusOutline, evaPlusOutline } from '@quasar/extras/eva-icons';
import { ionEllipse } from '@quasar/extras/ionicons-v6';
import { t } from 'i18next';
import { useQuasar } from 'quasar';
import { computed, nextTick, onMounted, ref } from 'vue';
import { useAppStore } from '../../stores/app';
import { useCartStore } from '../../stores/cart';
import { useGoodsStore } from '../../stores/goods';
import IconButton from '../buttons/icon-button.vue';
import ProductModal from './product-modal.vue';


  const $q = useQuasar();
  const slide = ref(0);

  const cartStore = useCartStore();
  const goodsStore = useGoodsStore();
  const app = useAppStore();
  const openDialog = ref(false)

  const props = defineProps({
    good: {
      type: Object,
      required: true,
    },
  })

  const showNotify = () => {
    $q.notify({
      timeout: 1000,
      multiLine: true,
      color: 'primary',
      classes: 'full-width notification_styles',
      actions: [
        {
          label: t('placing_an_order'),
          color: 'white',
          'aria-label': 'Move to cart',
          handler: () => app.openDrawerCart(true)
        },
      ]
    })
  }

  const goodInCart = computed(() => cartStore.cart.find((item) => item.id === props.good.id))

  const addGoodToCart = (good) => {
    cartStore.increaseItemsCount(good);
    showNotify();
  }

  const decrease = (good) => {
    cartStore.decreaseItemsCount(good);
  }

  const increase = (good) => {
    cartStore.increaseItemsCount(good);
    showNotify();
  }

  const sliceDescription = computed(() => props.good.description.slice(0, 50) + ' <span style="color: blue">more...</span>');

</script>


<template>
  <div :class="[props.good && props.good.stock <= 0 && 'disabled no-pointer-events', app.kioskState.settings?.alt_ui == 'design_v2' ? 'card_setting_v2' : 'card_setting']" v-bind="$attrs">
    <div>
      <div class="content_container" @click="openDialog = true">
        <div class="img_container">
          <q-img
            :src="props.good?.images[0]?.image"
            :alt="props.good?.title"
            :ratio="4/3"
          >
            <template #loading>
              <div class="text-subtitle1 text-black">
                Loading...
              </div>
            </template>
          </q-img>
        </div>
        <div class="column no-wrap items-left">
          <div
            class="q-mb-xs ellipsis first_letter"
            :class="[app.kioskState.settings?.alt_ui == 'design_v2'? 'text-h5 text-center' : 'text-h4 ellipsis']"
          >
            {{ $t(props.good?.title) }}
          </div>

          <div v-if="app.kioskState.settings?.alt_ui == 'design_1'">
            <span class="text-h5" v-if="props.good && props.good.stock <= 0">{{ $t('out_of_stock') }}</span>
            <span class="text-h3" v-else>&#3647&ensp;{{ props.good?.price }}</span>
          </div>
        </div>

        <div v-if="app.kioskState.settings?.alt_ui == 'design_1'" class="block_description" @click="openDialog = true">
          <div class="text-body1" v-html="$t(sliceDescription)"/>
        </div>

      </div>

      <div v-if="app.kioskState.settings?.alt_ui == 'design_v2'">
        <q-btn v-if="!goodInCart"
          class="full-width"
          unelevated
          rounded
          no-caps
          color="primary"
          text-color="white"
          @click="addGoodToCart(props.good)"
          >
          <div class="text-h5 text-center q-py-xs text-uppercase">
            <span v-if="props.good && props.good.stock <= 0">{{ $t('out_of_stock') }}</span>
            <span v-else>&#3647&ensp;{{ props.good?.price }}</span>
          </div>
        </q-btn>
        <div class="row justify-between items-center" v-else>
          <IconButton
            :icon="evaMinusOutline"
            @click="decrease(props.good)"
            class="q-pa-xs"
          />
          <div class="text-h5 no-margin">{{ goodInCart.quant }}</div>
          <IconButton
            :icon="evaPlusOutline"
            :disabled="goodInCart?.quant >= props.good?.stock"
            @click="increase(props.good)"
            class="q-pa-xs"
          />
        </div>
      </div>

      <div v-else>
        <q-btn v-if="!goodInCart"
          class="full-width"
          unelevated
          rounded
          no-caps
          color="primary"
          text-color="white"
          @click="addGoodToCart(props.good)"
          >
          <div class="text-h5 text-center q-py-xs text-uppercase">
            {{ $t('buy') }}
          </div>
        </q-btn>
        <div class="row justify-between items-center" v-else>
          <IconButton
            :icon="evaMinusOutline"
            @click="decrease(props.good)"
            class="q-pa-xs"
          />
          <div class="text-h4 no-margin">{{ goodInCart.quant }}</div>
          <IconButton
            :icon="evaPlusOutline"
            :disabled="goodInCart?.quant >= good?.stock"
            @click="increase(props.good)"
            class="q-pa-xs"
          />
        </div>
      </div>
    </div>
  </div>

  <template>
    <ProductModal :good="props.good" :isOpen="openDialog" @click="openDialog = false" />
  </template>

</template>

<style lang="scss" scoped>
  $calc_width: calc(15em + 6vmax);
  $calc_width_alt: calc(12em + 4.5vmax);


  .card_setting {
    border-radius: var(--border-sm);
    box-shadow: var(--box-shadow--product_cart);
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 1.3rem;
    background-color: var(--q-header_bg);
  }
  .card_setting_v2 {
    border-radius: var(--border-sm);
    box-shadow: var(--border-shadow);
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 1rem;
    background-color: var(--q-header_bg);
  }
  .img_container {
    // max-width: $calc_width;
    // max-height: $calc_width;
    width: 100%;
    border-radius : var(--px30);
    overflow: hidden;
    margin-bottom: 1.5rem;
    border: thin solid var(--q-accent);
  }
  .img_container_alt {
    max-width: calc_width_alt;
    max-height: calc_width_alt;
    border-radius : var(--px30);
    overflow: hidden;
    margin-bottom: 1.5rem;
    border: thin solid var(--q-accent);
  }
  .img_container_dialog {
    width: 100%;
    height: 100%;
    border-radius : var(--px30);
    overflow: hidden;
    border: thin solid var(--q-accent);
  }

  .content_container > *:nth-child(n+2){
    margin-bottom: 1rem;
  }

  .text_style {
    font-weight: bold;
  }

  .dialog_container {
    width: 50%;
    max-width: 60vw;
    height: max-content;
  }

  .dialog_img {
    width: 100%;
    border: thin solid var(--q-accent);
  }

.block_description {
  height: 4.5rem;
  overflow: hidden;
}

</style>
