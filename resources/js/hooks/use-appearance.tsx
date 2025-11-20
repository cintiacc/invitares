import { useCallback, useEffect, useState } from 'react';

export type Appearance = 'light';

/**
 * Aplica exclusivamente o tema claro.
 */
const applyLightTheme = () => {
    document.documentElement.classList.remove('dark');
    document.documentElement.style.colorScheme = 'light';
};

/**
 * Cria um cookie para persistência SSR.
 */
const setCookie = (name: string, value: string, days = 365) => {
    if (typeof document === 'undefined') return;

    const maxAge = days * 24 * 60 * 60;
    document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
};

/**
 * Inicializa o tema SEMPRE como claro.
 */
export function initializeTheme() {
    // força sempre "light"
    localStorage.setItem('appearance', 'light');
    setCookie('appearance', 'light');
    applyLightTheme();
}

/**
 * Hook para controlar o tema (sempre claro).
 */
export function useAppearance() {
    const [appearance, setAppearance] = useState<Appearance>('light');

    const updateAppearance = useCallback(() => {
        setAppearance('light');
        localStorage.setItem('appearance', 'light');
        setCookie('appearance', 'light');
        applyLightTheme();
    }, []);

    useEffect(() => {
        updateAppearance(); // força sempre claro ao montar
    }, [updateAppearance]);

    return {
        appearance,
        updateAppearance, // continua existindo para compatibilidade, mas sempre será "light"
    } as const;
}
