<script setup lang="ts">
  import axios  from 'axios';
  import { ref, reactive, onMounted, watch } from 'vue';
  import QrcodeVue, { Level, RenderAs } from 'qrcode.vue';
  import { useI18n } from 'vue-i18n';
  import { useRouter } from 'vue-router';
  import { useQuasar } from 'quasar';
  import { apiCatAuth, apiFetchCatView, wsSendMessage } from '../services';
  import Logo from '../components/logo.vue';

  const $q = useQuasar();

  const { t } = useI18n();
  const router = useRouter();

  let isPwd = ref(true);
  let openDialog = ref(false);
  let openDialogRegistration = ref(false);

  let props = defineProps({
    terminalId: {
      type: String,
      default: null,
      require: false
    },
    objectId: {
      type: String,
      default: null,
      require: false
    },
    locationId: {
      type: String,
      default: null,
      require: false
    },
    requestError: {
      type: String,
      request: false,
      require: false
    },
    userName: {
      type: String,
      default: '',
      require: false
    },
    userPassword: {
      type: String,
      default: '',
      require: false
    },
    code: {
      type: String,
      default: 'kiosk-test',
      require: false
    },
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

  const sendRequest = async () => {
    /*
    const result = await axios.post('/api/v2/addAnyTerminal',
      {
        name: 'kiosk-test',
        code: state.code,
        type_id: '654c6b75-54c5-4153-a3c7-b0f6a3431c68',
      },
      {
        // timeout: 1000,
        headers: {
          'Content-Type': 'application/json'
        },
        validateStatus: status => true
      }
    )
    */
    const result = {
      data: { data: { terminal_id: 'bd9d517b-57d6-45c9-a5b5-aa4efc4d0986', object_id: 'bd9d517b-57d6-45c9-a5b5-aa4efc4d0986', location_id: 'bd9d517b-57d6-45c9-a5b5-aa4efc4d0986' } },
      request: { response: 1 },
      status: 200,
    };

    if (!!result.request.response) openDialogRegistration.value = true;
    if (result.status >= 400) {
      state.requestError = result.status.toString();
      openDialog.value = true
      // $q.notify({
      //   color: 'primary',
      //   position: 'center',
      //   timeout: result.status >= 400 ? 0 : 3000,
      //   multiLine: true,
      //   message: `Page not found on the server. Error ${result.status}`,
      // })
    }
    const { terminal_id, object_id, location_id } = result.data.data;
    if ( !!object_id && !!location_id ) openDialogRegistration.value = false;

    state.terminalId = terminal_id;
    state.objectId = object_id;
    state.locationId = location_id;
  };

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
  };

  onMounted(() => {
    const intervalId = setInterval(() => {
      sendRequest().catch((error) => {
        // Ошибка при отправке запроса, нет соединения с интернетом
        if (error.code === 'ERR_NETWORK') {
          $q.notify({
            color: 'primary',
            position: 'center',
            message: `Internet connection lost ${error.code}`,
          })
        };
        if (error.code === 'ECONNABORTED') {
          // Ошибка тайм-аута
          console.log('The request took too long to return');
        }
      });
    }, 5000);

    watch(
      [() => state.objectId, () => state.terminalId, () => state.locationId, () => state.requestError],
      ([ newObjectId, newLocationId, newTerminalId, newRequestError]) => {
        if (newObjectId && newLocationId && newTerminalId || newRequestError) {
          clearInterval(intervalId);
        }
      }
    );
  });

  const printText = ref('<print align="center" bold>text</print><printqr>hello world</printqr>');

  function sendWsCommand() {
    wsSendMessage('check-print', printText.value);
  }

  const sessionToken = localStorage.getItem('sessionToken');
  const check1ViewId = ref('c2db028c-bee9-4504-9302-379a888a1676');

  async function doAuth() {
    $q.loading.show();
    try {
      const authToken = await apiCatAuth('v.kakotkin@fait.gl', '1c8b6f9f-a29a');

      if (!authToken) {
        $q.notify({
          message: 'Auth error...',
          icon: 'warning',
          color: 'negative',
        });
      }
      else {
        localStorage.setItem('sessionToken', authToken);
      }
    }
    catch(e) {
      console.log(e);
      $q.notify({
        message: 'Error occured',
        icon: 'warning',
        color: 'warning',
      });
    }
    finally {
      $q.loading.hide();
    }
  }

  async function sendCatPrintCommand() {
    $q.loading.show();
    try {
      const viewData = await apiFetchCatView(check1ViewId.value);

      console.log(viewData);
      wsSendMessage('check-print', viewData);
    }
    catch(e) {
      console.log(e);
      $q.notify({
        message: 'Error occured',
        icon: 'warning',
        color: 'warning',
      });
    }
    finally {
      $q.loading.hide();
    }
  }
</script>

<template>
  <q-page class="flex flex-center relative bg-secondary" style="100%">
    <div class="q-pa-md items-center column" style="width: 50vw">
      <q-dialog v-model="openDialog" dark class="1234">
        <q-card dark class="flex column items-center">
          <q-card-section>
            <div class="text-h6 q-ma-sm text-center">Page not found on the server {{ state.requestError }}</div>
          </q-card-section>
        </q-card>
      </q-dialog>

      <q-dialog v-model="openDialogRegistration" dark class="7654323">
        <q-card dark class="flex column items-center">
          <q-card-section>
            <div v-if="!state.objectId && !state.locationId">
              <div class="text-h6 q-ma-sm text-center">
                Ожидание подтверждения регистрации в системе...
              </div>
              <div>
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
                    :level="(level as Level)"
                    :render-as="(renderAs as RenderAs)"
                    :size="300"
                    foreground="#234141"
                  />
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>

      <div v-if="state.objectId && state.locationId" class="fit">

        <Logo class="logo_column" />

        <q-form
          class="text-text fit"
          @submit.prevent="onSubmitLogin"
        >
          <q-input
            v-model="state.userName"
            label="login"
            type="email"
            autofocus
            :rules="[
              (val: any) => !!val || t('field_is_required')
            ]"
            no-error-icon
            debounce="500"
            dark
            rounded
            outlined
            bg-color="white"
          />
          <q-input
            v-model="state.userPassword"
            label="password"
            :type="isPwd ? 'password' : 'text'"
            :rules="[
              (val: any) => !!val || t('field_is_required'),
              (val: any) => val.length == 6 || t('password_consists_characters'),
            ]"
            counter
            no-error-icon
            dark
            rounded
            outlined
            class="q-mb-lg"
            bg-color="white"
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
            <q-btn label="authorization" unelevated size="xl" type="submit" color="primary" class="fit" />
          </div>
        </q-form>
        <div class="column full-width">
          <b>Custom device-provider command</b>
          <q-input v-model="printText" class="q-mb-sm" outlined />
          <q-btn label="test ws" rounded color="secondary" @click="sendWsCommand" />
        </div>
        <q-separator spaced />
        <div class="column full-width">
          <div><b>Auth</b> <span v-if="sessionToken">(already has a session token)</span></div>
          <q-btn label="authorize" rounded color="indigo-4" @click="doAuth" />
        </div>
        <q-separator spaced />
        <div class="column full-width">
          <b>Call to CAT API for building device-provider command</b>
          <q-input v-model="check1ViewId" class="q-mb-sm" outlined />
          <q-btn label="test print command" rounded color="secondary" @click="sendCatPrintCommand" />
        </div>
      </div>
    </div>
  </q-page>
</template>

<style scoped>
</style>
