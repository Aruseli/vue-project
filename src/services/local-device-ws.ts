import { RawLocalDeviceWsMessage } from '../types';
import { eventEmitter, isPlainObject, isString } from '../services';

let serviceLaunched = false;
export let ws: WebSocket | null = null;

export async function initLocalDeviceWsService(): Promise<void> {
  if (!serviceLaunched) {
    serviceLaunched = true;
    await startLocalDeviceWsService();
  }
}

async function startLocalDeviceWsService() {
  // first connect
  setTimeout(connect, 1000);
}

export function wsSendMessage(command: string, data?: string) {
  ws?.send(JSON.stringify({ cmd: command, data }))
}

function connect() {
  let host = 'localhost:3010';

  if (!host) {
    // retry later
    setTimeout(connect, 5000);

    return;
  }

  let protocol = location.protocol.toLowerCase() === 'https:' ? 'wss' : 'ws';

  ws = new WebSocket(`${protocol}://${host}/ws`);
  console.log('local-ws:', protocol, host);

  ws.onopen = () => {
    eventEmitter.emit('local-ws:connect');
    console.log(`local-ws:connect`);
  };
  ws.onerror = () => {
    ws?.close();
  };
  ws.onclose = function (event) {
    eventEmitter.emit('local-ws:disconnect');
    console.log(`local-ws:disconnect`);
    ws = (null as any);

    // reconnect
    setTimeout(connect, 1000);
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
