import { useEffect, useRef } from 'react';

export function useChipSizeEffect(chipSizeKey: string | undefined) {
    useEffect(() => {
        const root = document.documentElement;
        const sizes: Record<string, string> = {
            extraSmall: '24px',
            small: '48px',
            medium: '64px',
            large: '80px',
            extraLarge: '96px',
        };
        const multipliers: Record<string, number> = {
            xs: 24 / 64,
            s: 48 / 64,
            m: 1,
            l: 80 / 64,
            xl: 96 / 64,
        };

        const selectedKey = chipSizeKey ?? 'medium';
        const selectedPx = parseFloat(sizes[selectedKey] || '64');

        root.style.setProperty('--chip-size-xs', `${Math.round(selectedPx * multipliers.xs)}px`);
        root.style.setProperty('--chip-size-s', `${Math.round(selectedPx * multipliers.s)}px`);
        root.style.setProperty('--chip-size-m', `${Math.round(selectedPx * multipliers.m)}px`);
        root.style.setProperty('--chip-size-l', `${Math.round(selectedPx * multipliers.l)}px`);
        root.style.setProperty('--chip-size-xl', `${Math.round(selectedPx * multipliers.xl)}px`);
    }, [chipSizeKey]);
}

export function useFontSizeEffect(fontSize: string | undefined) {
    const baselineRef = useRef<{ m: number; l: number; xl: number } | null>(null);

    useEffect(() => {
        const root = document.documentElement;
        if (!baselineRef.current) {
            const cs = getComputedStyle(root);
            const parsePx = (v: string) => parseFloat(v.trim()) || 0;
            baselineRef.current = {
                m: parsePx(cs.getPropertyValue('--font-size-m')),
                l: parsePx(cs.getPropertyValue('--font-size-l')),
                xl: parsePx(cs.getPropertyValue('--font-size-xl')),
            };
        }

        const base = baselineRef.current ?? { m: 16, l: 24, xl: 32 };
        const factors: Record<string, number> = {
            small: 0.875,
            normal: 1,
            large: 1.125,
            xlarge: 1.25,
        };
        const f = factors[fontSize ?? 'normal'] ?? 1;
        root.style.setProperty('--font-size-m', `${Math.round(base.m * f)}px`);
        root.style.setProperty('--font-size-l', `${Math.round(base.l * f)}px`);
        root.style.setProperty('--font-size-xl', `${Math.round(base.xl * f)}px`);
    }, [fontSize]);
}
