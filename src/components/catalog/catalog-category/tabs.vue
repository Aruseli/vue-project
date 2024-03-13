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
  });
};
onMounted(() => {
  selectTab(0)
})
</script>

<template>
<div class="column tabs_style">
  <ul class='tabs__header'>
    <li v-for='(goodCategory, index) in goodsStore.goods'
      :key='goodCategory.id'
      @click='selectTab(index)'
      class="text-h4"
      :class='[(index == selectedIndex) && "tab__selected"]'>
      {{ goodCategory.title }}
    </li>
  </ul>

</div>
</template>

<style scope>
.tabs_style {
  box-shadow: var(--border-shadow);
  background-color: white;
  width: 25vw;
  height: calc(100vh - 20rem);
  /* margin-left: 2rem; */
  border-radius: 1.5rem
}

ul.tabs__header {
  /* display: flex;
  flex-direction: column; */
  list-style: none;
  margin: 0;
  padding: 0;
}

ul.tabs__header > li {
  padding: 1.5rem;
  cursor: pointer;
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
  color: #83FFB3;
}
</style>
