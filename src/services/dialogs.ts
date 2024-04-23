import { reactive } from "vue";

export const dialogs = reactive<Dialog[]>([]);

export type Dialog = DialogParams & {
  id: Symbol,
  priority: number,
  loading: boolean,
}

export type DialogParams = {
  text: string,
  buttons: {
    name: string,
    type: 'common' | 'primary',
    handler: () => Promise<any>,
  }[],
  priority?: number,
  /** Number of button to click on background click */
  bgClickButton?: number,
}

export function showDialog(params: DialogParams) {
  const dialog: Dialog = {
    ...params,
    priority: params.priority ?? 0,
    id: Symbol("Dialog ID"),
    loading: false,
  };

  dialog.buttons.forEach(b => {
    b.handler = async () => {
      dialog.loading = true;
      try {
        await b.handler();
      } finally {
        dialog.loading = false;
        const index = dialogs.indexOf(dialog);
        if (index > -1) {
          dialogs.splice(index, 1);
        }
      }
    }
  })

  dialogs.push(dialog);
  dialogs.sort((a, b) => b.priority - a.priority); // descending
}
