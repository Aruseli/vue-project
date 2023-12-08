<script setup>
  import { onMounted, computed } from 'vue';
  import { useRoute } from 'vue-router';
  import { productsStore } from '../stores/store';
  import ProductCard from '../components/product-card.vue';
  import { useQuasar } from 'quasar'

  // const $q = useQuasar();

  // $q.localStorage.set(key, value);
  // const value = $q.localStorage.getItem(key);

  // $q.sessionStorage.set(key, value);
  // const otherValue = $q.sessionStorage.getItem(key);


  const rout = useRoute();

  const store = productsStore();

  onMounted(async() => {
    await  store.fetchDataFromDB();
  })

  const addToCart = (product) => {
    store.addToCart(product);
    // go to cart page
    // router.push({name: 'Cart', params: { id }});
  }

</script>

<template>
  <div class="image-grid">
      <q-intersection
        v-for="(product, index) in store.products"
        :key="index"
        transition="slide-up"
        :threshold="0"
        transition-duration="0.5"
        ssr-prerender
        class="intersection-card-settings"
        style="width: 367px; height: 621px"
      >
        <ProductCard
          :images="product.images"
          :alt="product.title"
          :title="product.title"
          :price="product.price"
          :count="product.count"
          :description="product.description"
          :productId="product.id"
          @clickAddToCart="addToCart"
        />
      </q-intersection>
    </div>
</template>

<style lang="scss" scoped>
  $calc_width: calc(var(--width_coefficient) + var(--coefficient));
  $calc_gap: calc(1.875rem + var(--coefficient_gap));

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, $calc_width);
  gap: $calc_gap;
  width: 100%;
  height: 100%;
  padding: 0 3.75rem;
  justify-content: center;
  margin-top: 5rem;
}
.intersection-card-settings{
  min-height: 46rem;
}
</style>
