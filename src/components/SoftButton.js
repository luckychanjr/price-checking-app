import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { buttonTones } from '../theme/pastel';

export default function SoftButton({
  title,
  onPress,
  disabled = false,
  tone = 'primary',
  compact = false,
  fullWidth = false,
  style,
  textStyle,
}) {
  const palette = buttonTones[tone] ?? buttonTones.primary;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        compact ? styles.compact : styles.regular,
        fullWidth ? styles.fullWidth : null,
        {
          backgroundColor: palette.background,
          borderColor: palette.border,
        },
        pressed && !disabled ? styles.pressed : null,
        disabled ? styles.disabled : null,
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          {
            color: palette.text,
          },
          textStyle,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: 1,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  regular: {
    minHeight: 48,
    paddingHorizontal: 18,
  },
  compact: {
    minHeight: 38,
    paddingHorizontal: 14,
  },
  fullWidth: {
    width: '100%',
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.985 }],
  },
  disabled: {
    opacity: 0.55,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
  },
});
