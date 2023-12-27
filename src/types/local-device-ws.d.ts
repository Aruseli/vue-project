export type RawLocalDeviceWsMessageCmd = 'check-print';

export interface RawLocalDeviceWsMessage<T = any> {
  cmd: RawLocalDeviceWsMessageCmd;
  data: T;
}
