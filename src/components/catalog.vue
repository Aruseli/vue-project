<script setup>
  import { onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { productsStore } from '../stores/store';
  import ProductCard from '../components/product-card.vue';

  const rout = useRoute();
  const store = productsStore();

  onMounted(async() => {
    await  store.fetchDataFromDB();
  })

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
        style="width: max-content; height: 830px"
      >
        <ProductCard
          :images="product.images"
          :alt="product.title"
          :title="product.title"
          :price="product.price"
          :count="product.count"
          :description="product.description"
          :productId="product.id"
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
