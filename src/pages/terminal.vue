<script setup>
  import axios  from 'axios';
  import { ref, reactive, onMounted } from 'vue';
  import QrcodeVue from 'qrcode.vue';
  import { useI18n } from 'vue-i18n';
  import { useRouter } from 'vue-router';

  const { t } = useI18n();
  const router = useRouter();

  let userName = ref('');
  let userPassword = ref('');
  let isPwd = ref(true);
  let qrcode = ref(true);


  let props = defineProps({
    terminalId: {
      type: Number,
      default: null,
    },
    objectId: {
      type: Number,
      default: null,
    },
    locationId: {
      type: Number,
      default: null,
    },
  });

  let state = reactive({
    terminalId: props.terminalId,
    objectId: props.objectId,
    locationId: props.locationId,
  });

  const level = ref('M');
  const renderAs = ref('svg');

  const onSubmit = () => {
    // axios.post('/api/v2/addAnyTerminal',
    //   {
    //     name: 'kiosk-test',
    //     code: 'kiosk-test',
    //     type_id: '654c6b75-54c5-4153-a3c7-b0f6a3431c68',
    //   }, {
    //     headers: {
    //       'Content-Type': 'application/json'
    //     }
    //   }
    // )
    //   .then(response => {
    //     const { terminal_id, object_id, location_id } = response.data.data;
    //     // state.terminalId = response.data.data.terminal_id;
    //     state.terminalId = terminal_id;
    //     state.objectId = object_id;
    //     state.locationId = location_id;
    //     console.log('state.objectId, state.terminalId', state.objectId, state.terminalId)
    //   })
    //   .catch(err => {
    //     console.log('err')
    //   }
    // );
    console.log('hi')
  }


  const onSubmitLogin = () => {
    axios.post('http://158.255.7.105:60480/auth/login.json',
      {
        userName: userName.value,
        userPassword: userPassword.value
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
      .then(response => {
        if (!!response.data) router.push('catalog');
        console.log('response', !!response.data)
      })
      .catch(err => {
        console.log('err', err)
      }
    );
  }

  onMounted(async() => {
    axios.post('/api/v2/addAnyTerminal',
      {
        name: 'kiosk-test',
        code: 'kiosk-test',
        type_id: '654c6b75-54c5-4153-a3c7-b0f6a3431c68',
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
      .then(response => {
        const { terminal_id, object_id, location_id } = response.data.data;
        // state.terminalId = response.data.data.terminal_id;
        state.terminalId = terminal_id;
        state.objectId = object_id;
        state.locationId = location_id;
        console.log('state.objectId, state.terminalId', state.objectId, state.terminalId)
      })
      .catch(err => {
        console.log('err')
      }
    );
    console.log('state.objectId, state.terminalId', state.objectId, state.terminalId)
  })

</script>

<template>
  <q-page class="flex flex-center relative" style="100%">
    <div class="q-pa-md items-center column" style="max-width: 400px">

      <q-dialog v-model="qrcode" dark="true">
        <q-card  dark="true" class="flex column items-center">
          <q-card-section v-if="state.terminalId == null">
            <q-form
              @submit="onSubmit"
              class="text-text form-style"
              style="margin-bottom: 2rem;"
            >
              <q-btn label="Submit" rounded type="submit" color="primary"/>
            </q-form>
          </q-card-section>
          <q-card-section v-if="state.objectId === null && state.locationId === null ">
            <div class="text-h6 q-mx-sm">Ожидание подтверждения регистрации в системе...</div>
          </q-card-section>
          <q-card-section v-if="!!state.objectId || !!state.locationId">
            <div class="text-body1">
              Код терминала <code style="font-family: 'Courier New', monospace">{{ state.terminalId }}</code>
            </div>
            <div
              v-if="state.terminalId"
              class="q-mx-auto"
              style="width: 300px; height: 300px"
            >
              <qrcode-vue
                :value="state.terminalId"
                :level="level"
                :render-as="renderAs"
                size="300"
                foreground="#234141"
              />
            </div>
          </q-card-section>

        </q-card>
      </q-dialog>

      <q-form
        class="text-text form-style"
        @submit.prevent="onSubmitLogin"
      >
        <q-input
          v-model="userName"
          label="login"
          type="email"
          autofocus
          :rules="[
            value => !!value || t('field_is_required')
          ]"
          no-error-icon
          debounce="500"
          dark="true"
          rounded
          outlined
        />
        <q-input
          v-model="userPassword"
          label="password"
          :type="isPwd ? 'password' : 'text'"
          :rules="[
            val => !!val || t('field_is_required'),
            val => val.length == 6 || t('password_consists_characters'),
          ]"
          counter
          no-error-icon
          debounce="500"
          dark="true"
          rounded
          outlined
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>

        <div class="text-center">
          <q-btn label="authorization" rounded type="submit" color="primary"/>
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

