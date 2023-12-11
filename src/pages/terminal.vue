<script setup>
import axios  from 'axios';
import { ref } from 'vue';

  let login = ref('');
  let password = ref('');
  let isPwd = ref(true);

  const onSubmit = () => {
    axios.post('https://dash.fait.team',
      {
        name: 'kiosk-test',
        code: 'kiosk-test',
        type_id: '654c6b75-54c5-4153-a3c7-b0f6a3431c68'
      }, {
      headers: {
        'content-type': 'text/json'
      }
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

</script>

<template>
  <q-page class="flex flex-center relative" style="100%">
    <div class="q-pa-md" style="max-width: 400px">

      <q-form
        @submit="onSubmit"
        class="text-text form-style"
        style="margin-bottom: 2rem;"
      >
        <q-input dark="true" rounded outlined v-model="name" label="name" />
        <q-input dark="true" rounded outlined v-model="code" label="code" />
        <q-input dark="true" rounded outlined v-model="token" label="token" />

        <div>
          <q-btn label="Submit" rounded type="submit" color="primary"/>
        </div>
      </q-form>

      <q-form
        class="text-text form-style"
      >
        <q-input
          v-model="login"
          dark="true"
          rounded
          outlined
          label="login"
        />
        <q-input
          v-model="password"
          dark="true"
          :debounce="500"
          rounded
          outlined
          label="password"
          :type="isPwd ? 'password' : 'text'"
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>

        <div>
          <q-btn label="Submit" rounded type="submit" color="primary"/>
        </div>
      </q-form>

    </div>
  </q-page>
</template>

<style scoped>
.form-style > *:not(:last-child) {
  margin-bottom: 0.5rem;
}
</style>

