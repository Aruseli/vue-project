export type RawLocalDeviceWsMessageCmd = 'check-print' | 'barcode';

export interface RawLocalDeviceWsMessage<T = any> {
  cmd: RawLocalDeviceWsMessageCmd;
  data: T;
}
