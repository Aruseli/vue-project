<script setup lang="ts">
  import { t } from 'i18next';
import { useQuasar } from 'quasar';
import { computed, ref } from 'vue';
import { useAppStore } from '../../stores/app';
import { useCartStore } from '../../stores/cart';
import { Good, useGoodsStore } from '../../stores/goods';
import IconButton from '../buttons/icon-button.vue';
import Carousel from '../carousel/carousel.vue';
import Slide from '../carousel/slide.vue';
import AttentionIcon from '../icons/attention-icon.vue';
import BinIconV3 from '../icons/bin-icon-v3.vue';
import BinButton from './buttons/bin-button.vue';
import ProductModal from './product-modal.vue';

  const $q = useQuasar();
  const slide = ref(0);

  const cartStore = useCartStore();
  const app = useAppStore();
  const openDialog = ref(false)

  const props = defineProps({
    good: {
      type: Object,
      default: {
        id: String,
        title: String,
        description: String,
        price: Number,
        stock: Number,
        images: Array as () => {
          id: String,
          image?: String,
        }[],
        code: String,
      },
      required: true,
    },
  })

  const goodInCart = computed(() => cartStore.cart.find((item) => item.id === props.good.id))

  const addGoodToCart = (good: Good) => {
    cartStore.increaseItemsCount(good);
    // cartStore.ctaShow();
  }

  const decrease = (good: Good) => {
    cartStore.decreaseItemsCount(good);
  }

  const increase = (good: Good) => {
    cartStore.increaseItemsCount(good);
  }
</script>


<template>
  <div
    :class="[props.good && props.good.stock <= 0 && 'disabled no-pointer-events', 'card_setting_v3 bg-grey-2 pa-14']"
    v-bind="$attrs"
  >
    <div class="row justify-between items-center q-mb-xs">
      <IconButton color="bg-white" class="q-pa-none" :customIcon="true" @click="openDialog = true">
        <AttentionIcon />
      </IconButton>
      <div class="text-body1 row">
        <div class="mr-14">99% THC</div>
        <div class="row items-center intensity_icons_container">
          <div class="intensity_icon bg-red" />
          <div class="intensity_icon bg-red" />
          <div class="intensity_icon bg-red" />
        </div>
      </div>
    </div>
    <div class="img_container mb-14 relative-position">
      <q-img
        :src="props.good?.images[0]?.image"
        :alt="props.good?.title"
        :ratio="4/3"
        class="img_style"
      >
        <template #loading>
          <div class="text-subtitle1 text-black">
            Loading...
          </div>
        </template>
      </q-img>
      <div class="absolute-top-right img_angle_top" />
      <div class="absolute-bottom-left img_angle_bottom" />
    </div>
    <div class="row no-wrap justify-between items-center">
      <div>
        <div class="mb-14 ellipsis text-capitalize text-h5 text-left text-green">
          {{ t(props.good?.title) }}
        </div>

        <div class="column">
          <div class="text-h5" v-if="props.good && props.good.stock <= 0">{{ t('out_of_stock') }}</div>
          <div class="text-h4" v-else>&#3647&ensp;{{ props.good?.price }}</div>
        </div>
      </div>
      <div>
        <BinButton @click="addGoodToCart(props.good as Good)" class="bin_button_style">
          <BinIconV3 :quantity="cartStore.totalQuantity" class="bin_alt_style" />
        </BinButton>
      </div>
    </div>
  </div>



  <template>
    <ProductModal
      :good="props.good"
      :isOpen="openDialog"
      @click="openDialog = false"
    >
      <template #carousel>
        <Carousel>
          <template #slides>
            <div class="relative-position full-width full-height">
              <div class="full-width full-height" />
              <Slide v-for="(image, index) in props.good.images" :key="index" :image="image" addedSlide="absolute-top-left" />
              <div class="absolute-top-right img_angle_top" />
              <div class="absolute-bottom-left img_angle_bottom" />
            </div>
          </template>
        </Carousel>
      </template>
      <template #slider-navigation>
        <div class="slider_navigation_container">
          <Slide
            v-for="(image, index) in props.good.images"
            :key="index" :image="image"
            @click="console.log('123')"
          >
            <template #angles>
              <div class="absolute-top-right slide_img_angle_top" />
              <div class="absolute-bottom-left slide_img_angle_bottom" />
            </template>
          </Slide>
        </div>
      </template>
    </ProductModal>
  </template>

</template>

<style lang="scss" scoped>
  $calc_width: calc(15em + 6vmax);
  $calc_width_alt: calc(12em + 4.5vmax);

  .slider_navigation_container {
    overflow: hidden;
    height: auto;
    display: grid;
    grid-row: 2 / 3;
    grid-column: 1 / 3;
    grid-template-columns: repeat(auto-fit, minmax(5%, 1fr));
    column-gap: 1.5rem;
  }
  .card_setting_v3 {
    border-radius: var(--border-xxs);
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-shadow: var(--box-shadow--product_cart_v3);
  }
  .intensity_icons_container > *:not(:last-child) {
    margin-right: 0.5rem;
  }
  .intensity_icon {
    width: var(--px16);
    height: var(--px16);
    border-radius: var(--px16);
  }

  .img_container {
    width: 52%;
    overflow: hidden;
    align-self: center;
    aspect-ratio: 1;
    display: flex;
  }
  .img_style {
    border-radius: 0 !important;
    scale: 0.9;
  }
  .bin_button_style {
    border-radius: var(--px54);
    border: thin solid green;
    padding: 0.8em;
  }
  .bin_alt_style {
    width: 3rem !important;
    align-self: stretch;
  }

</style>
