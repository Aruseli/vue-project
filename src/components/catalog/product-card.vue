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


  const $q = useQuasar();
  const openDialog = ref(false);
  const slide = ref(0);
  const good = ref(undefined);

  const cartStore = useCartStore();
  const goodsStore = useGoodsStore();
  const app = useAppStore();

  const props = defineProps({
    itemId: {
      type: String,
      required: true,
    },
  })

  const showNotify = () => {
    $q.notify({
      timeout: 3000,
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

  const goodInCart = computed(() => cartStore.cart.find((item) => item.id === props.itemId))

  const goodDetails = () => {
    openDialog.value = true;
  }
  const timer = ref(null);

  const addGoodToCart = (good) => {
    cartStore.increaseItemsCount(good);
    showNotify();
  }

  const decrease = (good) => {
    cartStore.decreaseItemsCount(good);
    // showNotify();
  }

  const increase = (good) => {
    cartStore.increaseItemsCount(good);
    showNotify();
  }

  const sliceDescription = ref(null);

  onMounted(async () => {
    good.value = goodsStore.getGoodById(props.itemId);
    if (!app.kioskState.settings?.alt_ui) {
      await nextTick();
      if (good.value.description.length > 50) {
        sliceDescription.value = good.value.description.slice(0, 50) + ' <span style="color: blue">more...</span>';
      } else {
        sliceDescription.value = good.value.description;
      }
    }
  })

</script>


<template>
  <div :class="[good && good.stock <= 0 && 'disabled no-pointer-events', !app.kioskState.settings?.alt_ui ? 'card_setting' : 'card_setting_alt']" v-bind="$attrs">
    <div>
      <div class="content_container" @click="goodDetails">
        <div class="img_container">
          <q-img
            :src="good?.images[0]?.image"
            :alt="good?.title"
            :ratio="4/3"
          >
            <template #loading>
              <div class="text-subtitle1 text-black">
                Loading...
              </div>
            </template>
          </q-img>
        </div>
        <div>
          <div class="column no-wrap items-left">
            <div
              class="q-mb-xs ellipsis first_letter"
              :class="[!app.kioskState.settings?.alt_ui ? 'text-h4 ellipsis' : 'text-h5 text-center']"
            >
              {{ good?.title }}
            </div>

            <div v-if="!app.kioskState.settings?.alt_ui">
              <span class="text-h5" v-if="good && good.stock <= 0">{{ t('out_of_stock') }}</span>
              <span class="text-h3" v-else>&#3647&ensp;{{ good?.price }}</span>
            </div>
          </div>
        </div>

        <div v-if="!app.kioskState.settings?.alt_ui" class="block_description" @click="goodDetails">
          <div class="text-body1" v-html="sliceDescription"/>
        </div>

      </div>

      <div v-if="app.kioskState.settings?.alt_ui">
        <q-btn v-if="!goodInCart"
          class="full-width"
          unelevated
          rounded
          no-caps
          color="primary"
          text-color="white"
          @click="addGoodToCart(good)"
          >
          <div class="text-h5 text-center q-py-xs text-uppercase">
            <span v-if="good && good.stock <= 0">{{ t('out_of_stock') }}</span>
            <span v-else>&#3647&ensp;{{ good?.price }}</span>
          </div>
        </q-btn>
        <div class="row justify-between items-center" v-else>
          <IconButton
            :icon="evaMinusOutline"
            @click="decrease(good)"
            class="q-pa-xs"
          />
          <div class="text-h5 no-margin">{{ goodInCart.quant }}</div>
          <IconButton
            :icon="evaPlusOutline"
            :disabled="goodInCart?.quant >= good?.stock"
            @click="increase(good)"
            class="q-pa-xs"
          />
        </div>
      </div>

      <div v-if="!app.kioskState.settings?.alt_ui">
        <q-btn v-if="!goodInCart"
          class="full-width"
          unelevated
          rounded
          no-caps
          color="primary"
          text-color="white"
          @click="addGoodToCart(good)"
          >
          <div class="text-h5 text-center q-py-xs text-uppercase">
            {{ $t('buy') }}
          </div>
        </q-btn>
        <div class="row justify-between items-center" v-else>
          <IconButton
            :icon="evaMinusOutline"
            @click="decrease(good)"
            class="q-pa-xs"
          />
          <div class="text-h4 no-margin">{{ goodInCart.quant }}</div>
          <IconButton
            :icon="evaPlusOutline"
            :disabled="goodInCart?.quant >= good?.stock"
            @click="increase(good)"
            class="q-pa-xs"
          />
        </div>
      </div>
    </div>
  </div>

  <template>
    <q-dialog
      v-model="openDialog"
      transition-hide="fade"
      transition-show="fade"
      transition-duration="1.8"
      dark="true"
      class="relative-position"
    >
      <div class="dialog_container">
        <q-card class="dialog_card">
          <q-btn round color="primary" icon="cancel" class="absolute-top-right" v-close-popup />

          <q-card-section class="q-mb-xs-xs">
            <q-carousel
              transition-prev="slide-right"
              transition-next="slide-left"
              swipeable
              animated
              v-model="slide"
              control-color="primary"
              :navigation-icon="ionEllipse"
              navigation
              infinite
              padding
              class="bg-transparent round-borders fit"
            >
              <q-carousel-slide
                v-for="(image, index) in good.images"
                :key="index"
                :name="index"
                class="column no-wrap flex-center"
              >
                <div class="img_container_dialog">
                  <q-img
                    :src="image.image"
                    :ratio="4/3"
                    class="dialog_img"
                  >
                    <template #loading>
                      <div class="text-subtitle1 text-black">
                        Loading...
                      </div>
                    </template>
                  </q-img>
                </div>
              </q-carousel-slide>
            </q-carousel>
          </q-card-section>
          <q-card-section class="q-mb-lg-sm q-mb-xs-xs">
            <div class="text-h3">
              {{ good.name }}
            </div>
          </q-card-section>
          <q-card-section class="q-mb-lg-sm q-mb-xs-xs">
            <div class="text-h2">
              &#3647&ensp;{{ good.price }}
            </div>
          </q-card-section>
          <q-separator color="secondary" class="q-mb-lg-sm q-mb-xs-xs" />
          <q-card-section class="q-pt-none q-mb-sm">
            <div class="text-h4 text-capitalize q-mb-lg-sm q-mb-xs-xs">{{ $t('description') }}</div>
            <div class="text-body1" v-html="good.description"/>
          </q-card-section>
          <q-card-section>
            <div class="full-width">
              <q-btn
                v-if="!goodInCart"
                class="full-width text_style"
                unelevated
                rounded
                no-caps
                color="primary"
                text-color="white"
                @click="addGoodToCart(good)"
                >
                <div class="text-h4 text-center text-weight-bold text-white q-py-lg-sm q-py-sm-xs text-uppercase">
                  {{ $t('buy') }}
                </div>
              </q-btn>
              <div class="row justify-between items-center" v-else>
                <IconButton
                  :icon="evaMinusOutline"
                  @click="decrease(good)"
                  class="q-pa-lg-sm q-pa-sm-xs"
                />
                <div class="text-h4 no-margin">{{ goodInCart.quant }}</div>
                <IconButton
                  :icon="evaPlusOutline"
                  @click="increase(good)"
                  class="q-pa-lg-sm q-pa-sm-xs"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </q-dialog>
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
  .card_setting_alt {
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
