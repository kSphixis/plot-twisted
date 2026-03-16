import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TextStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface PlayerChipProps {
  label: string;
  onPress: () => void;
  selected?: boolean;
  color?: string;
  disabled?: boolean;
}

export function PlayerChip({
  label,
  onPress,
  selected = false,
  color = colors.voteColor,
  disabled = false,
}: PlayerChipProps) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <TouchableOpacity
      style={[
        styles.chip,
        selected && { backgroundColor: color, borderColor: color },
        disabled && styles.disabled,
      ]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
    >
      <Text
        style={[
          styles.label,
          selected && styles.labelSelected,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    minHeight: 56,
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.4,
  },
  label: {
    ...typography.buttonText,
    color: colors.textPrimary,
  } as TextStyle,
  labelSelected: {
    color: colors.background,
    fontWeight: '700',
  } as TextStyle,
});
