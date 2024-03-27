import { RawLocalDeviceWsMessage } from '../types';
import { apiReportsGetView, eventEmitter, isPlainObject, isString } from '../services';
import i18next from 'i18next';

let serviceLaunched = false;
export let ws: WebSocket | null = null;

export async function initLocalDeviceWsService(address: string): Promise<void> {
  if (!serviceLaunched) {
    serviceLaunched = true;
    await startLocalDeviceWsService(address);
  }
}

async function startLocalDeviceWsService(address: string) {
  // first connect
  setTimeout(connect, 0, address);
}

export function wsSendMessage(command: string, data?: string) {
  ws?.send(JSON.stringify({ cmd: command, data }))
}

function connect(address: string) {
  // let protocol = location.protocol.toLowerCase() === 'https:' ? 'wss' : 'ws';
  // ws = new WebSocket(`${protocol}://${host}/ws`);
  // console.log('local-ws:', protocol, host);
  ws = new WebSocket(address);

  ws.onopen = () => {
    eventEmitter.emit('local-ws:connect');
    console.log(`local-ws:connect`);
  };
  ws.onerror = (event) => {
    console.log(`local-ws:error`, event);
    ws?.close();
  };
  ws.onclose = function (event) {
    eventEmitter.emit('local-ws:disconnect');
    console.log(`local-ws:disconnect`);
    ws = (null as any);

    // reconnect
    setTimeout(connect, 1000, address);
  };

  ws.onmessage = async (event) => {
    try {
      let wsMessage = _localDeviceWsMessageParser(event.data);

      eventEmitter.emit('local-ws', wsMessage);
      console.log(`local-ws`+ JSON.stringify(wsMessage, null, 2));

      if(wsMessage.cmd === 'barcode') {
        // TODO: Where should I get documentId?
        // try {
        //   const orderViewId = "a59a2a47-7ebb-497d-80ff-5b9386726871";
        //   const langCode = i18next.language;
        //   const viewData = await apiReportsGetView(orderViewId, [
        //     {
        //       "name": "doc_id",
        //       "value": documentId,
        //       "expression": documentId
        //     },
        //     {
        //       "name": "lang_code",
        //       "value": langCode,
        //       "expression": langCode
        //     }
        //   ]);
        //   console.log({viewData});
        //   wsSendMessage('check-print', viewData);
        // }
        // catch(e) {
        //   console.error(e);
        // }
      }
    }
    catch (e) {
      if (process.env.DEBUG) {
        console.log(e);
      }
    }
  };
}

/**
 * Local device ws message parser
 * If the format does not match, returns an error
 */
function _localDeviceWsMessageParser<T = any>(raw: string): RawLocalDeviceWsMessage<T> {
  let parsedRaw;

  try {
    parsedRaw = JSON.parse(raw);
  }
  catch (e: any) {
    console.error(e.stack);
  }

  if (parsedRaw && isPlainObject(parsedRaw)) {
    const { data, cmd } = parsedRaw as RawLocalDeviceWsMessage<T>;

    if (isString(cmd)) {
      return {
        data,
        cmd: cmd,
      };
    }
  }

  throw new Error(raw);
}
