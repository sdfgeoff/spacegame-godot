import React from 'react';

import { ColorSchemes, Panel, PanelProps, colorToBorder } from './Panel';


export type PanelTitledProps = {
    heading: React.ReactNode,
} & PanelProps



export const PanelTitled: React.FC<PanelTitledProps> = ({ heading, variant, extraBorder, children, ...rest }) => {
    return (
        <Panel variant={variant} extraBorder={extraBorder}>
            {heading}
            <hr style={{
                border: '',
                borderTop: colorToBorder(ColorSchemes[variant].text),
                opacity: 0.5,
            }}
            className="w-100"
            />
            {children}
        </Panel>
    );
};

export default PanelTitled;


