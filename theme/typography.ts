import { Platform, TextStyle } from 'react-native';

const fontFamily = Platform.select({
  ios: 'System',
  default: undefined,
});

export const typography = {
  heading: {
    fontFamily,
    fontSize: 38,
    fontWeight: '800',
    lineHeight: 46,
  } as TextStyle,
  storyText: {
    fontFamily,
    fontSize: 28,
    fontWeight: '400',
    lineHeight: 40,
  } as TextStyle,
  buttonText: {
    fontFamily,
    fontSize: 22,
    fontWeight: '600',
    lineHeight: 28,
  } as TextStyle,
  label: {
    fontFamily,
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 24,
  } as TextStyle,
  caption: {
    fontFamily,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  } as TextStyle,
} as const;
