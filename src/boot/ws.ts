import { boot } from 'quasar/wrappers';
import { initLocalDeviceWsService } from 'src/services';

export default boot(({ /* app */ }) => {
  initLocalDeviceWsService();
});
