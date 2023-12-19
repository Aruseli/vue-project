<script setup>
  import axios  from 'axios';
  import { ref, reactive, onMounted, watch } from 'vue';
  import QrcodeVue from 'qrcode.vue';
  import { useI18n } from 'vue-i18n';
  import { useRouter } from 'vue-router';
  import { useQuasar } from 'quasar';

  const $q = useQuasar();

  const { t } = useI18n();
  const router = useRouter();

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
    requestError: {
      type: {},
      request: false,
    },
    userName: {
      type: String,
      default: '',
    },
    userPassword: {
      type: String,
      default: '',
    },
    code: {
      type: String,
      default: 'kiosk-test',
    }
  });

  let state = reactive({
    terminalId: props.terminalId,
    objectId: props.objectId,
    locationId: props.locationId,
    requestError: props.requestError,
    userName: props.userName,
    userPassword: props.userPassword,
    code: props.code,
  });

  const level = ref('M');
  const renderAs = ref('svg');

  const sendRequest = () => {
    axios.post('/api/v2/addAnyTerminal',
      {
        name: 'kiosk-test',
        code: state.code,
        type_id: '654c6b75-54c5-4153-a3c7-b0f6a3431c68',
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    .then(response => {
      const { terminal_id, object_id, location_id } = response.data.data;
      state.terminalId = terminal_id;
      state.objectId = object_id;
      state.locationId = location_id;
      console.log('state.objectId, state.terminalId', state.objectId, state.terminalId);
    })
    .catch(err => {
      if (terminal_id == nul) {
        // Ошибка в ответе от сервера
        this.$q.notify({
          color: 'negative',
          position: 'right',
          message: 'Произошла ошибка: ' + err.response,
        });
        console.log('Ошибка в ответе от сервера:', err.response);
      } else if (err.request) {
        state.requestError = err.request;
        // Ошибка отправки запроса
        this.$q.notify({
          color: 'negative',
          position: 'right',
          message: 'Произошла ошибка: ' + error.request,
        });
        console.log('Ошибка отправки запроса:', err.request);
      } else {
        // Общая ошибка
        console.log('Общая ошибка:', err.message);
        this.$q.notify({
          color: 'negative',
          position: 'right',
          message: 'Произошла ошибка: ' + err.message,
        });
      }
      console.log('error', err);
    });
  }


  const onSubmitLogin = () => {
    axios.post('http://158.255.7.105:60480/auth/login.json',
      {
        userName: state.userName,
        userPassword: state.userPassword
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
        const { userName, userPassword } = err.config.data;
        if ( userName !== state.userName) {
          $q.notify({
            color: 'primary',
            position: 'center',
            message: 'некорректный логин: ' + state.userName,
            timeout: 2000,
          });
        } else if (userPassword !== state.userPassword) {
          $q.notify({
            color: 'negative',
            position: 'right',
            message: 'некорректный пароль: ' + state.userPassword,
            timeout: 2000,
          });
        } else {
          $q.notify({
            color: 'negative',
            position: 'right',
            message: 'некорректные логин и пароль: ' + state.userName + state.userPassword,
            timeout: 2000,
          });
        }
        console.log(err.config.data)
      }
    );
  }

  onMounted(() => {
    const intervalId = setInterval(() => {
      sendRequest();
    }, 5000);

    watch([() => state.objectId, () => state.locationId], ([ newObjectId, newLocationId]) => {
      if (newObjectId && newLocationId) {
        clearInterval(intervalId);
      }
    });
    console.log('ERROR', state.terminalId)
  })

</script>

<template>
  <q-page class="flex flex-center relative" style="100%">
    <div class="q-pa-md items-center column" style="width: 50vw">

      <q-dialog v-model="qrcode" dark="true" v-if="state.requestError">
        <q-card  dark="true" class="flex column items-center">
          <q-card-section>
            <div class="text-h6 q-mx-sm text-center">Ошибка на сервере {{ state.requestError }}</div>
          </q-card-section>
        </q-card>
      </q-dialog>

      <q-dialog v-model="qrcode" dark="true" v-if="!state.objectId || !state.locationId">
        <q-card  dark="true" class="flex column items-center">
          <q-card-section v-if="state.requestError">
            <div class="text-h6 q-mx-sm text-center">Ошибка на сервере {{ state.requestError }}</div>
          </q-card-section>
          <q-card-section v-if="!state.objectId || !state.locationId">
            <div class="text-h6 q-ma-sm text-center">Ожидание подтверждения регистрации в системе...</div>
            <div v-if="state.terminalId">
              <div class="text-h6 text-center q-mb-md text-weight-bold">
                Код терминала <code style="font-family: 'Courier New', monospace">{{ state.code }}</code>
              </div>
              <div
                v-if="state.terminalId"
                class="q-mx-auto q-mb-md"
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
            </div>
          </q-card-section>


        </q-card>
      </q-dialog>

      <q-form
        class="text-text form_style fit"
        @submit.prevent="onSubmitLogin"
      >
        <q-input
          v-model="state.userName"
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
          v-model="state.userPassword"
          label="password"
          :type="isPwd ? 'password' : 'text'"
          :rules="[
            val => !!val || t('field_is_required'),
            val => val.length == 6 || t('password_consists_characters'),
          ]"
          counter
          no-error-icon
          dark="true"
          rounded
          outlined
          class="q-mb-lg"
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
          <q-btn label="authorization" rounded type="submit" color="primary" class="fit" />
        </div>
      </q-form>

    </div>
  </q-page>
</template>

<style scoped>
.form_style > *:not(:last-child) {
  /* margin-bottom: 0.5rem; */
}
</style>

