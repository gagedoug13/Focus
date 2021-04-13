import React, { useState } from 'react';
import { Text, View, StyleSheet, Vibration, Platform } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { useKeepAwake } from 'expo-keep-awake';

import { colors } from '../../utils/colors';
import { spacing } from '../../utils/sizes';
import { Countdown } from '../../components/Countdown';
import { RoundedButton } from '../../components/RoundedButton';
import {Timing} from './Timing'

const DEFAULT_TIME = 0.1;
export const Timer = ({ focusSubject, onTimerEnd }) => {
  useKeepAwake();
  const [minutes, setMinutes] = useState(DEFAULT_TIME)
  const [isStarted, setIsStarted] = useState(false);
  const [progress, setProgress] = useState(1);
  const onProgress = (progress) => {
    setProgress(progress);
  };

  const vibrate = () => {
    if (Platform.OS === 'ios') {
      const interval = setInterval(() => Vibration.vibrate(), 500);
      setTimeout(() => clearInterval(interval), 2000)
    } else {
      Vibration.vibrate(10000)
    }
  }

  const onEnd = () => {
    vibrate();
    setMinutes(DEFAULT_TIME)
    setProgress(1)
    setIsStarted(false)
    onTimerEnd();
  }
  const changeTime = (min) => {
    setMinutes(min)
    setProgress(1)
    setIsStarted(false)
  }
  return (
    <View style={styles.container}>
      <View style={styles.countdown}>
        <Countdown onEnd={onEnd} minutes={minutes} isPaused={!isStarted} onProgress={onProgress} />
      </View>
      <View style={{ paddingTop: spacing.xxl }}>
        <Text style={styles.title}>focusing on:</Text>
        <Text style={styles.task}>{focusSubject}</Text>
      </View>
      <View>
        <View style={{ paddingTop: spacing.sm }}>
          <ProgressBar
            color="#5E84E2"
            progress={progress}
            style={{ height: 10 }}
          />
        </View>
        <View style={styles.buttonWrapper}>
          <Timing changeTime={changeTime}/>
        </View>
      </View>
      <View style={styles.buttonWrapper}>
        {isStarted ? (
          <RoundedButton title="pause" onPress={() => setIsStarted(false)} />
        ) : (
          <RoundedButton title="start" onPress={() => setIsStarted(true)} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    color: colors.white,
    textAlign: 'center',
  },
  task: {
    color: colors.white,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 10
  },
  countdown: {
    flex: 0.4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonWrapper: {
    flex: 0.3,
    flexDirection: 'row',
    marginTop: 55,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});