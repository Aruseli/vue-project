<script setup>
import { ionEllipse } from '@quasar/extras/ionicons-v6';
import { ref } from 'vue';
  import { productsStore } from '../stores/store';

const store = productsStore();

let slide=ref(0);

const props = defineProps({
  url: {
    type: String,
    required: false
  },
  alt: {
    type: String,
    required: false
  },
  title: {
    type: String,
    required: false
  },
  price: {
    type: Number,
    required: false
  },
  description: {
    type: String,
    required: false
  },
  productId: {
    type: Number,
    required: false
  },
})

const selectedProduct = computed(() => {
  return store.products.find((item) => item.id === props.productId);
})

</script>


<template>
  <div class="cart-product-item">
    <div>
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
        class="bg-white shadow-1 round-borders fit"
      >
        <q-carousel-slide v-for="(image, index) in selectedProduct.images" :key="index" :name="index" class="column no-wrap flex-center">
          <div class="">
            <q-img
              :src="image.image"
              :ratio="4/3"
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
    </div>
    <div>
      <div class="text-h4 text-weight-regular">
        {{ selectedProduct.title }}
      </div>
    </div>
    <div>
      <div class="text-body1 text-weight-regular">
        {{ selectedProduct.description }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart-product-item {
  width: 100%;
  height: max-content;
  display: flex;
  flex-flow: row nowrap;
}
</style>
