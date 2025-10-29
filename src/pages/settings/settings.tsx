import { useEffect, useRef, useMemo, useCallback } from 'react';
import { PlayerSettings } from "../../components/playerSettings/playerSettings";
import { SIZES_TRICKS } from "../../styles/variables/constans";
import { Select } from '../../components/select/select';
import { Checkbox } from '../../components/checked/checked';
import { useTheme } from '../../contexts/ThemeContext';
import styles from './setting.module.css';
import { Button } from '../../components/button/button';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import { useLanguage } from '../../contexts/LanguageContext';

const DEFAULT_PLAYER1 = 'red';
const DEFAULT_PLAYER2 = 'blue';

export const SettingsPage = () => {
    const { t } = useTranslation('setting');
    const { language, changeLanguage } = useLanguage();
    const [player1ColorKey, setPlayer1ColorKey] = useLocalStorage<string>('player1Color', DEFAULT_PLAYER1);
    const [player2ColorKey, setPlayer2ColorKey] = useLocalStorage<string>('player2Color', DEFAULT_PLAYER2);
    const [player1Name, setPlayer1Name] = useLocalStorage<string>('player1Name', 'Игрок 1');
    const [player2Name, setPlayer2Name] = useLocalStorage<string>('player2Name', 'Игрок 2');

    const [fontSize, setFontSize] = useLocalStorage<string>('fontSize', 'normal');
    const baselineRef = useRef<{ m: number; l: number; xl: number } | null>(null);
    const [chipSizeKey, setChipSizeKey] = useLocalStorage<string>('chipSize', 'medium');
    const { theme, setTheme } = useTheme();
    const [timerEnabled, setTimerEnabled] = useLocalStorage<boolean>('timerEnabled', false);

    const [aiEnabled, setAiEnabled] = useLocalStorage<boolean>('aiEnabled', false);
    const [aiDifficulty, setAiDifficulty] = useLocalStorage<string>('aiDifficulty', 'medium');

    useEffect(() => {
        if (language && i18n.language !== language) {
            i18n.changeLanguage(language);
        }
    }, [language]);

    const keyToLabel = useCallback((k?: string) => {
        if (!k) return '';
        const translated = t(k);
        if (translated && translated !== k) return translated;
        return k;
    }, [t]);

    const fontOptions = useMemo(() => [
        { label: t('Маленький'), value: 'small' },
        { label: t('Обычный'), value: 'normal' },
        { label: t('Большой'), value: 'large' },
        { label: t('Очень большой'), value: 'xlarge' },
    ], [t]);

    const chipSizeOptions = useMemo(() =>
        Object.keys(SIZES_TRICKS).map((k) => ({
            label: t(k),
            value: k
        }))
        , [t]);

    const themeOptions = useMemo(() => [
        { label: t('Светлая'), value: 'light' },
        { label: t('Темная'), value: 'dark' }
    ], [t]);

    const languageOptions = useMemo(() => [
        { label: t('Русский'), value: 'ru' },
        { label: t('English'), value: 'en' }
    ], [t]);

    const aiDifficultyOptions = useMemo(() => [
        { label: t('Легкий'), value: 'easy' },
        { label: t('Средний'), value: 'medium' },
        { label: t('Сложный'), value: 'hard' }
    ], [t]);

    const handleAiEnabledChange = useCallback((checked: boolean) => {
        setAiEnabled(checked);
    }, [setAiEnabled]);

    const handleExitMenu = useCallback(() => {
        window.location.href = '/';
    }, []);

    const handleStart = useCallback(() => {
        window.location.href = '/game';
    }, []);

    const handleThemeChange = useCallback((v: string) => {
        setTheme(v as 'light' | 'dark');
    }, [setTheme]);

    const handleTimerChange = useCallback((checked: boolean) => {
        setTimerEnabled(checked);
    }, [setTimerEnabled]);

    const player1ColorLabel = useMemo(() =>
        keyToLabel(player1ColorKey),
        [player1ColorKey, keyToLabel]
    );

    const player2ColorLabel = useMemo(() =>
        keyToLabel(player2ColorKey),
        [player2ColorKey, keyToLabel]
    );

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

    useEffect(() => {
        const root = document.documentElement;
        const sizes: Record<string, string> = {
            extraSmall: '24px',
            small: '48px',
            medium: '64px',
            large: '80px',
            extraLarge: '96px'
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

    useEffect(() => {
        try { setTheme(theme); } catch (e) { console.warn(e); }
    }, [theme, setTheme]);

    return (
        <div className={styles.settingsPage}>
            <h1>{t('Настройки')}</h1>
            <div className={styles.playerSettingsBlock}>
                <div className={styles.playerSetting}>
                    <h3>{t('Игрок 1')}</h3>
                    <PlayerSettings
                        storageKey={'player1Color'}
                        name={player1Name}
                        selectedKey={player1ColorKey}
                        colorLabel={player1ColorLabel}
                        forbiddenColorKey={player2ColorKey}
                        setSelectedKey={setPlayer1ColorKey}
                        onColorChange={setPlayer1ColorKey}
                        onNameChange={setPlayer1Name}
                        id={"player1-name-input"}
                    />
                </div>

                <div className={styles.playerSetting}>
                    <h3>{t(aiEnabled ? 'Компьютер' : 'Игрок 2')}</h3>
                    <PlayerSettings
                        storageKey={'player2Color'}
                        name={player2Name}
                        selectedKey={player2ColorKey}
                        colorLabel={player2ColorLabel}
                        forbiddenColorKey={player1ColorKey}
                        setSelectedKey={setPlayer2ColorKey}
                        onColorChange={setPlayer2ColorKey}
                        onNameChange={setPlayer2Name}
                        id={"player2-name-input"}
                    />
                </div>
            </div>
            <Checkbox
                checked={timerEnabled ?? false}
                onChange={handleTimerChange}
                label={t('Включить таймер')}
            />
            <div className={styles.aiSettings}>
                <Checkbox
                    checked={aiEnabled ?? false}
                    onChange={handleAiEnabledChange}
                    label={t('Против компьютера')}
                />

                {aiEnabled && (
                    <Select
                        label={t('Сложность компьютера')}
                        value={aiDifficulty ?? 'medium'}
                        options={aiDifficultyOptions}
                        onChange={setAiDifficulty}
                    />
                )}
            </div>
            <div className={styles.additionalSettings}>
                <div className={styles.interfaceSettings}>
                    <h3 className={styles.interfaceSettingsHeader}>
                        {t('Интерфейс')}
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <Select
                            label={t('Размер шрифта')}
                            value={fontSize ?? 'normal'}
                            options={fontOptions}
                            onChange={setFontSize}
                        />

                        <Select
                            label={t('Размер фишек')}
                            value={chipSizeKey ?? 'medium'}
                            options={chipSizeOptions}
                            onChange={setChipSizeKey}
                        />

                        <Select
                            label={t('Тема')}
                            value={theme}
                            options={themeOptions}
                            onChange={handleThemeChange}
                        />

                        <Select
                            label={t('Язык')}
                            value={language ?? 'ru'}
                            options={languageOptions}
                            onChange={changeLanguage}
                        />
                    </div>
                </div>
            </div>
            <div className={styles.buttonsBlock}>
                <Button className='primary' onClick={handleExitMenu}>
                    {t('Выход')}
                </Button>
                <Button className='secondary' onClick={handleStart}>
                    {t('Начать игру')}
                </Button>
            </div>
        </div>
    );
}
