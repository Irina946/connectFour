import { useMemo, useState, useCallback } from 'react';
import { GameSettingsManager, type TGameSettings } from '../utils/GameSettingsManager';

export function useGameSettings() {
    const manager = useMemo(() => new GameSettingsManager(), []);
    const [settings, setSettings] = useState<TGameSettings & { fontSize: string; chipSize: string; theme: string }>(manager.getSettings());

    const setPlayer1Color = useCallback((color: string) => {
        manager.setPlayer1Color(color);
        setSettings(manager.getSettings());
    }, [manager]);
    const setPlayer2Color = useCallback((color: string) => {
        manager.setPlayer2Color(color);
        setSettings(manager.getSettings());
    }, [manager]);
    const setPlayer1Name = useCallback((name: string) => {
        manager.setPlayer1Name(name);
        setSettings(manager.getSettings());
    }, [manager]);
    const setPlayer2Name = useCallback((name: string) => {
        manager.setPlayer2Name(name);
        setSettings(manager.getSettings());
    }, [manager]);
    const setTimerEnabled = useCallback((enabled: boolean) => {
        manager.setTimerEnabled(enabled);
        setSettings(manager.getSettings());
    }, [manager]);
    const setAIEnabled = useCallback((enabled: boolean) => {
        manager.setAIEnabled(enabled);
        setSettings(manager.getSettings());
    }, [manager]);
    const setAIDifficulty = useCallback((difficulty: string) => {
        manager.setAIDifficulty(difficulty);
        setSettings(manager.getSettings());
    }, [manager]);
    const setFontSize = useCallback((size: string) => {
        manager.setFontSize(size);
        setSettings(manager.getSettings());
    }, [manager]);
    const setChipSize = useCallback((size: string) => {
        manager.setChipSize(size);
        setSettings(manager.getSettings());
    }, [manager]);
    const setTheme = useCallback((theme: string) => {
        manager.setTheme(theme);
        setSettings(manager.getSettings());
    }, [manager]);

    return {
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
        setTheme,
    };
}
