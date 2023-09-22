import React from 'react';
import { ColorVariant, colorToCSS } from '../theme/themeConstants';



export const ButtonVariants = [
    'light',
    'dark',
    'primary',
    'secondary',
    'success',
    'warning',
    'danger',
    'info',
] as const


export const ColorSchemes: {
    [key in typeof ButtonVariants[number]]: {
        background: ColorVariant,
        text: ColorVariant,
        activeBackground: ColorVariant,
        activeText: ColorVariant,
    }
} = {
    'light': {
        background: 'light',
        text: 'dark',
        activeBackground: 'dark',
        activeText: 'light',
        
    },
    'dark': {
        background: 'dark',
        text: 'light',
        activeBackground: 'light',
        activeText: 'dark',
        
    },
    'primary': {
        background: 'primary_darkest',
        text: 'primary_lightest',
        activeBackground: 'primary_lightest',
        activeText: 'primary_darkest',
        
    },
    'secondary': {
        background: 'secondary_darkest',
        text: 'secondary_lightest',
        activeBackground: 'secondary_lightest',
        activeText: 'secondary_darkest',
        
    },
    'success': {
        background: 'success_darkest',
        text: 'success_lightest',
        activeBackground: 'success_lightest',
        activeText: 'success_darkest',
        
    },
    'warning': {
        background: 'warning_darkest',
        text: 'warning_lightest',
        activeBackground: 'warning_lightest',
        activeText: 'warning_darkest',
        
    },
    'danger': {
        background: 'danger_darkest',
        text: 'danger_lightest',
        activeBackground: 'danger_lightest',
        activeText: 'danger_darkest',
        
    },
    'info': {
        background: 'info_darkest',
        text: 'info_lightest',
        activeBackground: 'info_lightest',
        activeText: 'info_darkest',
        
    },
} as const



export type ButtonProps = {
  onClick: () => void;
  variant?: keyof typeof ColorSchemes;
  active?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: React.FC<ButtonProps> = ({ children, variant = 'dark', active, ...rest }) => {
    const colorScheme = ColorSchemes[variant];
  return (
    <button style={{
        background: colorToCSS(active ? colorScheme.activeBackground : colorScheme.background),
        color: colorToCSS(active ? colorScheme.activeText : colorScheme.text),
        position: 'relative',
    }}
    {...rest}>
        
      {children}
    </button>
  );
};

export default Button;
