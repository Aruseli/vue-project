<script setup>
import { useGoodsStore } from 'src/stores/goods';
import { useAppStore } from 'src/stores/app';
import { ref, onMounted } from 'vue';

const goodsStore = useGoodsStore();
const app = useAppStore();
const selectedIndex = ref(0);

const selectTab = (i) => {
  selectedIndex.value = i;
  goodsStore.goods.forEach((goodCategory, index) => {
    goodCategory.isActive = index === i;
    console.log('goodCategory.isActive', goodCategory.isActive)
  });
};

const scrollToCategory = (id) => {
    event.preventDefault();
    const element = document.getElementById(id);
    element.scrollIntoView({
      behavior: 'smooth'
    });
  }
onMounted(() => {
  selectTab(0)
})
</script>

<template>
<div class="column tabs_style">
  <ul class='tabs__header'>
    <li v-for='(goodCategory, index) in goodsStore.goods'
      :key='goodCategory.id'
      @click="selectTab(index)"
      class="text-h5"
      :class='[(index == selectedIndex) && "tab__selected"]'>
      <div @click="scrollToCategory(goodCategory.id)">
        {{ goodCategory.title }}
      </div>
    </li>
  </ul>
</div>
</template>

<style scope>
.tabs_style {
  box-shadow: var(--border-shadow);
  background-color: white;
  width: 20vw;
  height: calc(100vh - 20rem);
  border-radius: 1.5rem
}

ul.tabs__header {
  list-style: none;
  margin: 0;
  padding: 0;
}

ul.tabs__header > li {
  padding: 1.5rem;
  cursor: pointer;
  @media (max-width: 1300px) {
    padding: 1rem;
  }
}

ul.tabs__header > li.tab__selected {
  font-weight: bold;
  text-decoration: underline;
}
.tab {
  color: black;
  padding: 20px;
}
li.tab__selected {
  color: var(--q-primary);
  text-transform: uppercase;
}
</style>
