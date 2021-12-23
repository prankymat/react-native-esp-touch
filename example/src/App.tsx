import React, {
  useCallback, useEffect
} from 'react';

import {StyleSheet, View, Text, Button} from 'react-native';
import { useESPTouch } from 'react-native-esp-touch';

export default function App() {
  const { isProvisioning, startProvisioning, stopProvisioning, result } = useESPTouch({
    ssid: "ssid",
    bssid: "bssid",
    password: "password",
    count: 2
  })

  useEffect(() => {
    console.log('isProvisioning', isProvisioning)
  }, [isProvisioning]);


  const start = useCallback(() => {
    startProvisioning();
  }, []);

  const stop = useCallback(() => {
    stopProvisioning();
  }, []);

  return (
    <View style={styles.container}>
      <Text>isProvisioning: {JSON.stringify(isProvisioning)}</Text>
      <Text>Result: {JSON.stringify(result)}</Text>
      <Button title="start" onPress={start}>Start</Button>
      <Button title="stop" onPress={stop}>Stop</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
