import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, TextStyle } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface PlayerNameInputProps {
  value: string;
  index: number;
  onChangeText: (text: string) => void;
  onRemove: () => void;
  canRemove: boolean;
}

export function PlayerNameInput({
  value,
  index,
  onChangeText,
  onRemove,
  canRemove,
}: PlayerNameInputProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.number}>{index + 1}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder="Enter name..."
        placeholderTextColor={colors.textSecondary}
        maxLength={20}
        autoCapitalize="words"
        returnKeyType="done"
      />
      {canRemove && (
        <TouchableOpacity
          onPress={onRemove}
          style={styles.removeButton}
          accessibilityLabel={`Remove player ${index + 1}`}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.removeText}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  number: {
    ...typography.label,
    color: colors.textSecondary,
    width: 28,
    textAlign: 'center',
  } as TextStyle,
  input: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: spacing.md,
    ...typography.label,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  } as TextStyle,
  removeButton: {
    marginLeft: spacing.sm,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeText: {
    color: colors.danger,
    fontSize: 18,
    fontWeight: '600',
  } as TextStyle,
});
