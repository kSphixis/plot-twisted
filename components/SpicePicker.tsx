import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, TextStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import { SpiceLevel } from '../types/story';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface SpicePickerProps {
  value: SpiceLevel;
  onChange: (level: SpiceLevel) => void;
}

const levels: { key: SpiceLevel; label: string; description: string }[] = [
  { key: 'mild', label: 'Mild', description: 'Keep it chill' },
  { key: 'wild', label: 'Wild', description: 'Turn it up' },
];

export function SpicePicker({ value, onChange }: SpicePickerProps) {
  const handlePress = (level: SpiceLevel) => {
    Haptics.selectionAsync();
    onChange(level);
  };

  return (
    <View style={styles.container}>
      {levels.map((level) => {
        const isSelected = value === level.key;
        return (
          <TouchableOpacity
            key={level.key}
            style={[
              styles.option,
              isSelected && styles.optionSelected,
            ]}
            onPress={() => handlePress(level.key)}
            accessibilityRole="radio"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={`${level.label}: ${level.description}`}
          >
            <Text
              style={[
                styles.label,
                isSelected && styles.labelSelected,
              ]}
            >
              {level.label}
            </Text>
            <Text
              style={[
                styles.description,
                isSelected && styles.descriptionSelected,
              ]}
            >
              {level.description}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  option: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
  },
  optionSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.surfaceLight,
  },
  label: {
    ...typography.buttonText,
    color: colors.textSecondary,
  } as TextStyle,
  labelSelected: {
    color: colors.accent,
  },
  description: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  } as TextStyle,
  descriptionSelected: {
    color: colors.textPrimary,
  },
});
