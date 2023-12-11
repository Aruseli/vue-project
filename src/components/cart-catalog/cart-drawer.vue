<script setup>
  import { productsStore } from '../../stores/store';
  import { ref, computed } from 'vue';
  import { evaPlusOutline } from '@quasar/extras/eva-icons';
  import { evaMinusOutline } from '@quasar/extras/eva-icons';

  const store = productsStore();
  const slide = ref(0);

  const closeDrawer = () => {
    store.openDrawer(false)
  }

  const removeFromCart = (id) => {
    store.removeFromCart(id);
  }

  const price = computed(() => {
    let indexOfSize = props.product.sizes.map((item) => item.value).indexOf(selectedSize.value);
    if (indexOfSize === -1) {
      indexOfSize = 0;
    }
    return (props.product.price + indexOfSize * 10) * selectedCount.value;
  });
  // onMounted(() => {
  //   console.log('MOUNTED');
  //   store.fetchDataFromDB()
  // })
</script>


<template>
  <q-drawer
    dark="true"
    v-model="store.drawerState"
    side="right"
    overlay
    elevated
  >
    <q-btn unelevated round @click="closeDrawer" class="q-pa-md">
      <q-icon name="arrow_back" class="round-button-light_green" />
    </q-btn>

    <div v-if="!store.cart.length" style="padding: 2rem; text-align: center;">
      <h2>{{ $t('empty_cart') }}</h2>
    </div>
    <q-scroll-area class="fit">

      <div class="row container-settings">
        <div class="cart-product-item"  v-for="(item, index) in store.cart" :key="index">
          <div style="width: 200px; height: 100%;">
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
              class="bg-white shadow-1 round-borders fit"
            >
              <q-carousel-slide
                v-for="(image, index) in item.images"
                :key="index"
                :name="index"
                class="column no-wrap flex-center"
                style="height: auto; padding: 0;"
              >
                <div style="width: 200px; height: 200px;">
                  <q-img
                    :src="image"
                    style="width: 100%; height: 100%;"
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

          <div class="column justify-between">
            <div class="row justify-between items-center">
              <div class="text-h2 text-weight-regular">
                {{ item.title }}
              </div>
              <q-btn unelevated round @click="removeFromCart(item.id)">
                <q-icon name="delete_forever" class="round-button-dark_green" />
              </q-btn>
            </div>

            <div class="text-body1 text-weight-regular">
              {{ item.description }}
            </div>
            <div class="row justify-between items-center">
              <div class="text-subtitle1">
                {{ item.price }}$
              </div>
              <div class="row justify-between items-center">
                <q-btn unelevated round @click="store.increaseItems(item)" class='q-mr-lg'>
                  <q-icon flat class="round-button-light_green" :name="evaPlusOutline"/>
                </q-btn>
                <h5 class='q-mr-lg q-my-none'>{{ item.count }}</h5>
                <q-btn unelevated round @click="store.decreaseItems(item)">
                  <q-icon flat class="round-button-light_green" :name="evaMinusOutline"/>
                </q-btn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </q-scroll-area>
  </q-drawer>
</template>

<style scoped>

.container-settings {
  padding: var(--px43);
}

.container-settings > *:not(:last-of-type) {
  margin-bottom: var(--px30);
}
.container-settings > *:last-of-type {
  margin-bottom: var(--px60);
}
.cart-product-item {
  width: 100%;
  height: max-content;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  border-radius: var(--border-sm);
  box-shadow: var(--box-shadow--product_cart);
  padding: var(--px30);
}
.cart-product-item > *:first-of-type {
  margin-right: 2rem;
}
</style>
