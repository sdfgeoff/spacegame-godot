import React from 'react';
import { ColorVariant, colorToCSS } from '../theme/themeConstants';

export const PanelVariants = [
    'light',
    'dark',
    'primary',
    'secondary',
    'success',
    'warning',
    'danger',
    'info',
] as const


const CORNER_SIZE = '1em'
const BORDER_THICKNESS = '2px'

export const ColorSchemes: {
    [key in typeof PanelVariants[number]]: {
        background: ColorVariant,
        text: ColorVariant,
    }
} = {
    'light': {
        background: 'light',
        text: 'dark',
    },
    'dark': {
        background: 'dark',
        text: 'light',
    },
    'primary': {
        background: 'primary_darkest',
        text: 'primary_lightest',
    },
    'secondary': {
        background: 'secondary_darkest',
        text: 'secondary_lightest',
    },
    'success': {
        background: 'success_darkest',
        text: 'success_lightest',
    },
    'warning': {
        background: 'warning_darkest',
        text: 'warning_lightest',
    },
    'danger': {
        background: 'danger_darkest',
        text: 'danger_lightest',
    },
    'info': {
        background: 'info_darkest',
        text: 'info_lightest',
    },
} as const


export const ExtraBorder = ['corner', 'top-bottom'] as const

export type PanelProps = {
    variant: keyof typeof ColorSchemes,
    extraBorder?: typeof ExtraBorder[number]

} & React.HTMLAttributes<HTMLDivElement>


export const colorToBorder = (color: ColorVariant) => `${BORDER_THICKNESS} solid ` + colorToCSS(color)


export const Panel: React.FC<PanelProps> = ({ variant, children, extraBorder, ...rest }) => {
    const colorScheme = ColorSchemes[variant]
    const border = colorToBorder(colorScheme.text)
    return <div
        style={{
            background: colorToCSS(colorScheme.background),
            color: colorToCSS(colorScheme.text),
            position: 'relative',
        }}
        {...rest}
    >
        {extraBorder === 'top-bottom' && (<>
            <div
                className="fill"
                style={{
                    borderBottom: border,
                    borderTop: border,
                }}
            />
        </>)}
        {extraBorder === 'corner' && (<>
            <div
                className="position-absolute top-0 left-0"
                style={{
                    borderTop: border,
                    borderLeft: border,
                    width: CORNER_SIZE,
                    height: CORNER_SIZE,
                }} />
            <div
                className="position-absolute top-0 right-0"
                style={{
                    borderTop: border,
                    borderRight: border,
                    width: CORNER_SIZE,
                    height: CORNER_SIZE,
                }} />
            <div
                className="position-absolute bottom-0 right-0"
                style={{
                    borderBottom: border,
                    borderRight: border,
                    width: CORNER_SIZE,
                    height: CORNER_SIZE,
                }} />
            <div
                className="position-absolute bottom-0 left-0"
                style={{
                    borderBottom: border,
                    borderLeft: border,
                    width: CORNER_SIZE,
                    height: CORNER_SIZE,
                }} />
        </>
        
        
        )}
        {children}
    </div>
}

export default Panel