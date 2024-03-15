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
    await nextTick();
    if (good.value.description.length > 50) {
      sliceDescription.value = good.value.description.slice(0, 50) + ' <span style="color: blue">more...</span>';
    } else {
      sliceDescription.value = good.value.description;
    }
  })


</script>


<template>
  <div class="card_setting" :class="[good && good.stock <= 0 && 'disabled no-pointer-events']" v-bind="$attrs" @click="goodDetails">
    <div>
      <div class="content_container">
        <div class="img_container">
          <q-img
            :src="goodsStore.getImage(good?.images_ids?.[0])"
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
            <div class="text-h4 q-mb-xs ellipsis first_letter">
              {{ good?.title }}
            </div>

            <div class="text-h3">
              &#3647&ensp;{{ good?.price }}
            </div>
          </div>
        </div>

        <div class="block_description" @click="goodDetails">
          <div class="text-body1" v-html="sliceDescription"/>
        </div>

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
          <div class="text-center text-h4 q-py-xs text-uppercase">
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
                v-for="(image, index) in good.images_ids"
                :key="index"
                :name="index"
                class="column no-wrap flex-center"
              >
                <div class="img_container_dialog">
                  <q-img
                    :src="goodsStore.getImage(image)"
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
            <div class="text-h4 text-capitalize q-mb-sm">{{ $t('description') }}</div>
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
                <div class="text-center text-weight-bold text-h3 text-white q-py-xl text-uppercase">
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
    width: calc(var(--width_coefficient) + var(--coefficient));
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 1.3rem;
    background-color: var(--q-header_bg);
  }
  .img_container {
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
    margin-bottom: 1rem;
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
    border: thin solid var(--q-accent);
  }

.block_description {
  height: 3.5rem;
  overflow: hidden;
}

</style>
