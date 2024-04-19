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

export type PrinterType = 'network' | 'usb'

export function wsSendMessage(command: string, data?: { printerType: PrinterType, template: string,   networkHost?: string; networkPort?: number;}) {
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
