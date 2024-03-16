import { defineComponent } from 'vue';
import { useAppStore } from 'src/stores/app';

export default defineComponent({
  name: 'App',
  setup() {
    const { lang_dir } = useAppStore();

    return {
      lang_dir,
    };
  },
});
