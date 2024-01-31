<script setup>
  import { evaPlusOutline } from '@quasar/extras/eva-icons';
  import { evaMinusOutline } from '@quasar/extras/eva-icons';
  import { ionEllipse } from '@quasar/extras/ionicons-v6';
  import { evaRadioButtonOffOutline } from '@quasar/extras/eva-icons';
  import { useI18n } from 'vue-i18n';
  import { computed, ref, onMounted } from 'vue';
  import { useCartStore } from '../../stores/cart';
  import { useGoodsStore } from '../../stores/goods';
  import { useAppStore } from '../../stores/app';
  import { useQuasar } from 'quasar';
  import IconButton from '../buttons/icon-button.vue';

  const $q = useQuasar();
  const openDialog = ref(false);
  const slide = ref(0);
  const good = ref(undefined);

  const { t } = useI18n();

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
      classes: 'full-width',
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

  const goodInCart = computed(() => {
    return cartStore.cart.find((item) => item.id === props.itemId);
  })

  const goodDetails = () => {
    openDialog.value = true;
  }
  const timer = ref(null);

  const addGoodToCart = (good) => {
    cartStore.increaseItemsCount(good);
    showNotify();
    // // Запускаем таймер на 15 минут
    // timer.value = setTimeout(() => {
    //   $q.notify({
    //     color: 'warning',
    //     icon: 'warning',
    //     position: 'center',
    //     message: "Ваша корзина будет очищена через 1 минуту.",
    //     timeout: 6000,
    //   })
    // }, 6000);

    // console.log('count', cartStore.cart)

  }

  const decrease = (good) => {
    cartStore.decreaseItemsCount(good);
    // showNotify();
  }

  const increase = (good) => {
    cartStore.increaseItemsCount(good);
    showNotify();
  }

  onMounted(async () => {
    good.value = goodsStore.getGoodById(props.itemId);
  })

</script>


<template>
  <div class="card_setting">
    <div
      style="cursor: not-allowed"
      :style="{ filter: good?.stock <= 0 ? 'contrast(0.2)' : 'none' }"
    >
      <div class="content_container">
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
            <div class="text-h4 q-mb-sm ellipsis first_letter">
              {{ good?.title }}
            </div>

            <div class="text-h3">
              &#3647&ensp;{{ good?.price }}
            </div>
          </div>
        </div>

        <div class="text-body1 ellipsis-2-lines block_description" v-html="good?.description "/>


        <q-btn @click="goodDetails">{{ $t('read') }}</q-btn>
      </div>

      <div>
        <q-btn v-if="!goodInCart"
          class="full-width"
          unelevated
          rounded
          no-caps
          color="primary"
          text-color="white"
          @click="addGoodToCart(good)"
          >
          <div class="text-center text-h3 q-py-xs">
            {{ $t('buy') }}
          </div>
        </q-btn>
        <div class="row justify-between items-center" v-else>
          <IconButton
            :icon="evaMinusOutline"
            @click="decrease(good)"
            class="q-pa-xs"
          />
          <div class="text-h4 q-ma-none">{{ goodInCart.quant }}</div>
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
          <q-btn flat label="X" color="primary" class="absolute-top-right" v-close-popup />
          <q-card-section class="q-mb-sm">
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
          <q-card-section class="q-mb-sm">
            <div class="text-h3">
              {{ good.name }}
            </div>
          </q-card-section>
          <q-card-section class="q-mb-md">
            <div class="text-h2">
              &#3647&ensp;{{ good.price }}
            </div>
          </q-card-section>
          <q-separator color="secondary" class="q-mb-md" />
          <q-card-section class="q-pt-none q-mb-lg">
            <q-tabs
              v-model="app.tabCharacteristics"
              narrow-indicator
              dense
              no-caps
              align="left"
              class="q-mb-xs"
            >
              <q-tab :ripple="false" name="description" :label="t('description')" content-class="product_tab_label_style" />
              <q-tab :ripple="false" name="characteristics" :label="t('characteristics')" content-class="product_tab_label_style" />
            </q-tabs>
            <q-tab-panels v-model="app.tabCharacteristics" animated swipeable class="fit">
              <q-tab-panel name="description" dark>
                <div class="text-body1" v-html="good.description"/>
              </q-tab-panel>
              <q-tab-panel name="characteristics" dark>
                <div class="text-body1">
                  {{ good.description }}
                </div>
              </q-tab-panel>
            </q-tab-panels>
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
                <div class="text-center text-weight-bold text-h3 text-white q-py-xl">
                  {{ $t('buy') }}
                </div>
              </q-btn>
              <div class="row justify-between items-center" v-else>
                <IconButton
                  :icon="evaMinusOutline"
                  @click="decrease(good)"
                  class="q-pa-xl"
                />
                <div class="text-h4 q-ma-none">{{ goodInCart.quant }}</div>
                <IconButton
                  :icon="evaPlusOutline"
                  @click="increase(good)"
                  class="q-pa-xl"
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
  $calc_width: calc(var(--width_coefficient) + var(--coefficient));

  .card_setting {
    border-radius: var(--border-sm);
    box-shadow: var(--box-shadow--product_cart);
    // width: max-content;
    width: calc(var(--width_coefficient) + var(--coefficient));
    height: 100%;
    // height: 55rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 1.3rem;
    background-color: var(--q-header_bg);
  }
  .img_container {
    // width: $calc_width;
    // height: $calc_width;
    max-width: $calc_width;
    max-height: $calc_width;
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
    margin-bottom: 1.5rem;
  }

  .text_style {
    font-weight: bold;
  }

  .dialog_container {
    width: 60vw;
    max-width: 80vw;
    height: max-content;
  }

  .dialog_img {
    width: 100%;
    // height: calc(70vw - 8rem);
    border: thin solid var(--q-accent);
  }

.block_description {
  min-height: 3.2rem;
}
</style>
