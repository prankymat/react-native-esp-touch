import { useEffect, useState, useRef } from 'react';
import { NativeEventEmitter, NativeModules, Platform } from 'react-native';

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

const eventEmitter = new NativeEventEmitter(EspTouch);

export function useESPTouch({ ssid, bssid, password, count = 1 }: ProvisioningConfig) {
  const [result, setResult] = useState();
  const [error, setError] = useState<any>();
  const [isProvisioning, setIsProvisioning] = useState(false);
  const subscriptionRef = useRef<any>(null);

  const onDeviceProvisioned = (event: any) => {
    console.log("received", event);
  }

  const start = async () => {
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
  };

  const stop = () => {
    try {
      EspTouch.stopProvisioning()
    } catch (error) {
      console.error(error);
      setError(error);
    }
    setIsProvisioning(false);
  };

  useEffect(() => {

    if (!isProvisioning) {
      if (subscriptionRef.current) {
        console.log('stopping')
        stop();
        subscriptionRef.current?.remove();
      }
    }
    subscriptionRef.current = eventEmitter.addListener('onDeviceProvisioned', onDeviceProvisioned);
    // return () => { subscriptionRef.current?.remove(); };
  }, [isProvisioning, ssid, bssid, password, count]);


  return {
    result,
    error,
    isProvisioning,
    startProvisioning: start,
    stopProvisioning: stop,
  }
}
