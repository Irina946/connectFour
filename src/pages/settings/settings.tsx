import { useMemo, useCallback } from 'react';
import { PlayerSettings } from "../../components/playerSettings/playerSettings";
import { SIZES_TRICKS } from "../../styles/variables/constans";
import { Select } from '../../components/select/select';
import { Checkbox } from '../../components/checked/checked';
import styles from './setting.module.css';
import { Button } from '../../components/button/button';
import { useLanguage } from '../../contexts/LanguageContext';
import { useGameSettings } from '../../hooks/useGameSettings';
import { useFontSizeEffect } from '../../hooks/useUISettings';
import { useTranslation } from 'react-i18next';
import { TTheme, useTheme } from '../../contexts/ThemeContext';


export const SettingsPage = () => {
    const { t } = useTranslation('setting');
    const { language, changeLanguage } = useLanguage();
    const { theme: contextTheme,
        setTheme: setContextTheme
    } = useTheme();
    const {
        settings,
        setPlayer1Color,
        setPlayer2Color,
        setPlayer1Name,
        setPlayer2Name,
        setTimerEnabled,
        setAIEnabled,
        setAIDifficulty,
        setFontSize,
        setChipSize,
    } = useGameSettings();

    const player1ColorKey = settings.player1Color;
    const player2ColorKey = settings.player2Color;
    const player1Name = settings.player1Name;
    const player2Name = settings.player2Name;
    const timerEnabled = settings.timerEnabled;
    const aiEnabled = settings.aiEnabled;
    const aiDifficulty = settings.aiDifficulty;
    const fontSize = settings.fontSize;
    const chipSizeKey = settings.chipSize;

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
        { label: t('Легкий'), value: 'easy' },
        { label: t('Средний'), value: 'medium' },
        { label: t('Сложный'), value: 'hard' }
    ], [t]);

    const handleAiEnabledChange = useCallback((checked: boolean) => {
        setAIEnabled(checked);
    }, [setAIEnabled]);

    const handleExitMenu = useCallback(() => {
        window.location.href = '/';
    }, []);

    const handleStart = useCallback(() => {
        window.location.href = '/game';
    }, []);

    const handleThemeChange = useCallback((v: string) => {
        setContextTheme(v as TTheme);
    }, [setContextTheme]);

    const handleTimerChange = useCallback((checked: boolean) => {
        setTimerEnabled(checked);
    }, [setTimerEnabled]);

    useFontSizeEffect(fontSize);

    return (
        <div className={styles.settingsPage}>
            <h1>{t('Настройки')}</h1>
            <div className={styles.playerSettingsBlock}>
                <div className={styles.playerSetting}>
                    <h3>{t('Игрок 1')}</h3>
                    <PlayerSettings
                        name={player1Name}
                        selectedKey={player1ColorKey}
                        colorLabel={keyToLabel(player1ColorKey)}
                        forbiddenColorKey={player2ColorKey}
                        onNameChange={setPlayer1Name}
                        onColorChange={setPlayer1Color}
                        id="player1"
                    />
                </div>

                <div className={styles.playerSetting}>
                    <h3>{t(aiEnabled ? 'Компьютер' : 'Игрок 2')}</h3>
                    <PlayerSettings
                        name={player2Name}
                        selectedKey={player2ColorKey}
                        colorLabel={keyToLabel(player2ColorKey)}
                        forbiddenColorKey={player1ColorKey}
                        onNameChange={setPlayer2Name}
                        onColorChange={setPlayer2Color}
                        id="player2"
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
                        onChange={setAIDifficulty}
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
                            onChange={setChipSize}
                        />

                        <Select
                            label={t('Тема')}
                            value={contextTheme}
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
