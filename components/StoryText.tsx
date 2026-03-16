import React, { useEffect, useRef } from 'react';
import { Text, StyleSheet, Animated, TextStyle } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

interface StoryTextProps {
  text: string;
  color?: string;
}

export function StoryText({ text, color = colors.textPrimary }: StoryTextProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [text]);

  return (
    <Animated.Text
      style={[styles.text, { color, opacity: fadeAnim }]}
      accessibilityRole="text"
    >
      {text}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  text: {
    ...typography.storyText,
  } as TextStyle,
});
