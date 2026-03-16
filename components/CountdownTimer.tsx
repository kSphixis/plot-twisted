import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TextStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

interface CountdownTimerProps {
  durationSeconds: number;
  onComplete: () => void;
  color?: string;
}

export function CountdownTimer({
  durationSeconds,
  onComplete,
  color = colors.dareColor,
}: CountdownTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(durationSeconds);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    setSecondsLeft(durationSeconds);
  }, [durationSeconds]);

  useEffect(() => {
    if (secondsLeft <= 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onCompleteRef.current();
      return;
    }

    const timer = setTimeout(() => {
      if (secondsLeft <= 4) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      setSecondsLeft((s) => s - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const minutes = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const display = minutes > 0
    ? `${minutes}:${secs.toString().padStart(2, '0')}`
    : `${secs}`;

  const isUrgent = secondsLeft <= 5;

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.timer,
          { color: isUrgent ? colors.danger : color },
        ]}
        accessibilityLabel={`${secondsLeft} seconds remaining`}
      >
        {display}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  timer: {
    fontSize: 80,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  } as TextStyle,
});
