<script setup lang="ts">
  import { evaMinusOutline, evaPlusOutline } from '@quasar/extras/eva-icons';
  import { t } from 'i18next';
  import { computed, ref } from 'vue';
  import { useCartStore } from '../../../stores/cart';
  import { Good } from '../../../stores/goods';
  import BinButton from '../../buttons/bin-button.vue';
  import IconButton from '../../buttons/icon-button.vue';
  import Carousel from '../carousel/carousel.vue';
  import Slide from '../carousel/slide.vue';
  import AttentionIcon from '../icons/attention-icon.vue';
  import BinIcon from '../icons/bin-icon.vue';
  import ProductModal from './product-modal.vue';

  const cartStore = useCartStore();
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

  const currentSlide = ref(0);
  const setCurrentSlide = (index: number) => {
    currentSlide.value = index;
  };
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
      <div class="text-subtitle1 row">
        <div class="mr-14">99% THC</div>
        <div class="row items-center intensity_icons_container">
          <div class="intensity_icon bg-red" />
          <div class="intensity_icon bg-red" />
          <div class="intensity_icon bg-red" />
        </div>
      </div>
    </div>

    <!-- main image -->
    <div class="img_container mb-14 relative-position">
      <q-img
        :src="props.good?.images[0]?.image"
        :alt="props.good?.title"
        :ratio="4/3"
        class="img_style"
      >
        <template #loading>
          <div class="text-subtitle1 text-white">
            Loading...
          </div>
        </template>
      </q-img>
      <div class="absolute-top-right img_angle_top" />
      <div class="absolute-bottom-left img_angle_bottom" />
    </div>

    <!-- title + price + buttons -->
    <div class="row no-wrap justify-between items-center relative-position">
      <div>
        <div class="mb-14 ellipsis text-capitalize text-h4 text-left text-green">
          {{ t(props.good?.title) }}
        </div>

        <div class="column">
          <div class="text-h3" v-if="props.good && props.good.stock <= 0">{{ t('out_of_stock') }}</div>
          <div class="text-h3" v-else>&#3647&ensp;{{ props.good?.price }}</div>
        </div>
      </div>

      <BinButton @click="addGoodToCart(props.good as Good)" class="bin_button_style">
        <BinIcon :quantity="cartStore.totalQuantity" class="bin_alt_style" v-if="!goodInCart" />
        <div v-else class="text-h2 no-margin text-white">{{ goodInCart.quant }}</div>
      </BinButton>
      <transition name="slide-fade">
        <div class="bg-grey-2 row justify-between items-center absolute-top full-height" v-if="goodInCart">
          <IconButton
            round
            iconStyle="text-white"
            :icon="evaPlusOutline"
            @click="increase(props.good as Good)"
            class="q-pa-xs bg-transparent"
          />
          <div
            class='text-h2 text-white q-mx-lg-md q-mx-xs-sm q-my-none'
          >{{ goodInCart.quant }}</div>
          <IconButton
            round
            class="bg-transparent q-pa-xs"
            iconStyle="text-white"
            :icon="evaMinusOutline"
            @click="decrease(props.good as Good)"
          />
        </div>
      </transition>
    </div>

  </div>

  <!-- product modal card with description -->
  <template>
    <ProductModal
      :good="props.good"
      :isOpen="openDialog"
      @click="openDialog = false"
    >
      <template #carousel>
        <Carousel>
          <div class="relative-position full-width full-height">
            <div class="full-width full-height" />
            <Slide v-for="(images, index) in props.good.images" :key="index" class="absolute-top-left">
              <template #slide>
                <q-img
                  :src="images.image"
                  width="100%"
                  height="100%"
                  :ratio="1"
                  class="slide_img"
                  v-show="currentSlide === index"
                >
                  <template #loading>
                    <div class="text-subtitle1 text-white">
                      Loading...
                    </div>
                  </template>
                </q-img>
              </template>
            </Slide>
            <div class="absolute-top-right img_angle_top" />
            <div class="absolute-bottom-left img_angle_bottom" />
          </div>
        </Carousel>
      </template>
      <template #slider-navigation>
        <div class="slider_navigation_container">
          <Slide
            v-for="(images, index) in props.good.images"
            :key="index"
            @click="setCurrentSlide(index)"
            class="relative-position"
          >
            <template #slide>
              <q-img
                :src="images.image"
                width="100%"
                height="100%"
                :ratio="1"
                class="slide_img"
              >
                <template #loading>
                  <div class="text-subtitle1 text-white">
                    Loading...
                  </div>
                </template>
              </q-img>
            </template>
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

  .active {
    opacity: 1
  }
  .non_active {
    opacity: 0
  }
  .slider_navigation_container {
    overflow: hidden;
    height: auto;
    display: grid;
    grid-row: 2 / 3;
    grid-column: 1 / 3;
    grid-template-columns: repeat(auto-fit, minmax(5%, 1fr));
    column-gap: 1.5rem;
  }

  .slide_img {
    border-radius: 0 !important;
    scale: 0.9;
  }
  .card_setting_v3 {
    border-radius: var(--border-xxs);
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
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
    width: 59%;
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
    min-width: 5rem;
    width: max-content;
    height: 5rem;
  }
  .bin_alt_style {
    width: 3rem !important;
    align-self: stretch;
  }

  .slide-fade-enter-active,
  .slide-fade-leave-active {
    transition: all 0.3s cubic-bezier(0.215, 0.610, 0.355, 1);
  }
  .slide-fade-leave-to,
  .slide-fade-enter-from {
    opacity: 0;
    transform: translateY(100%);
  }
</style>
