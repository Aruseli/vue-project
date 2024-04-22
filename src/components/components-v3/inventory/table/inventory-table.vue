<script setup lang="ts">

</script>

<template>
  <div class="table_container full-width">
    <table class="table_scroll">
      <thead>
        <tr>
          <th class="text-h4">#</th>
          <th class="text-h4">{{ $t('product_name') }}</th>
          <th class="text-h4">{{ $t('estimated_quantity') }}
  (pcs)</th>
          <th class="text-h4">{{ $t('actual_quantity') }} (pcs)</th>
          <th class="text-h4"></th>
        </tr>
      </thead>

      <tbody>
        <slot />
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table_scroll {
  width: 100%;
}
.table_scroll thead {
  position: sticky;
  top: -2px;
  z-index: 999;
  background-color: white;
  border: 1px solid black;
  box-shadow: 0 0 1px 2px black;
}
table {
  width: 100%;
}

table td + td { border-left:2px solid black; }
td:first-child, th:first-child {
  border-left: none;
}
tr td,
table {
    /* border:1px solid black; */
    border-collapse: collapse;
}
table tr {
  border-right: 1px solid #000;
  border-bottom: none;
  border-top: none;
  height: 5rem;
}

table td {
    /* border-left: 1px solid #000; */
    border-right: 1px solid #000;
}
thead {
  border-top: 2px solid rgb(38, 38, 38);
  border-bottom: 2px solid rgb(38, 38, 38);
  text-align: center;
}
thead > tr > th {
  border-right: 2px solid rgb(38, 38, 38);
}

.highlight:hover {
  background-color: red;
}

</style>
