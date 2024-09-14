import React from 'react';

interface TypographyH1Props {
    children: React.ReactNode;
    className: string;
}

export function TypographyH1({ children, className }: TypographyH1Props) {
    return (
        <h1 className={className}>
            {children}
        </h1>
    )
}