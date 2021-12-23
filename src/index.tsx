import { useState } from 'react';
import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-esp-touch' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const EspTouch = NativeModules.EspTouch
  ? NativeModules.EspTouch
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

interface ProvisioningConfig {
  ssid: string;
  bssid: string;
  password?: string;
  count?: number;
  onDeviceProvisioned?: (bssid: string) => void;
}

export function useESPTouch({ ssid, bssid, password, count = 1 }: ProvisioningConfig) {
  const [result, setResult] = useState();
  const [error, setError] = useState<any>();
  const [isProvisioning, setIsProvisioning] = useState(false);

  return {
    result,
    error,
    isProvisioning,
    startProvisioning: async () => {
      setIsProvisioning(true);
      setResult(undefined);

      try {
        const result = await EspTouch.startProvisioning(ssid, bssid, password, count)
        setResult(result);
      } catch (error) {
        setResult(undefined);
        setError(error);
      } finally {
        setIsProvisioning(false);
      }
    },
    stopProvisioning: () => {
      try {
        EspTouch.stopProvisioning()
      } catch (error) {
        console.error(error);
        setError(error);
      }
      setIsProvisioning(false);
    }
  }
}
