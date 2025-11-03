import { LocalStorageService } from './LocalStorageService';

export type TGameSettings = {
    player1Color: string;
    player2Color: string;
    player1Name: string;
    player2Name: string;
    timerEnabled: boolean;
    aiEnabled: boolean;
    aiDifficulty: string;
};

const DEFAULTS: TGameSettings = {
    player1Color: 'red',
    player2Color: 'blue',
    player1Name: 'Игрок 1',
    player2Name: 'Игрок 2',
    timerEnabled: false,
    aiEnabled: false,
    aiDifficulty: 'medium',
};

export class GameSettingsManager {
    static KEYS = {
        player1Color: 'player1Color',
        player2Color: 'player2Color',
        player1Name: 'player1Name',
        player2Name: 'player2Name',
        timerEnabled: 'timerEnabled',
        aiEnabled: 'aiEnabled',
        aiDifficulty: 'aiDifficulty',
        fontSize: 'fontSize',
        chipSize: 'chipSize',
        theme: 'theme',
    };

    getSettings(): TGameSettings & { fontSize: string; chipSize: string; theme: string } {
        return {
            player1Color: LocalStorageService.get<string>(GameSettingsManager.KEYS.player1Color, DEFAULTS.player1Color)!,
            player2Color: LocalStorageService.get<string>(GameSettingsManager.KEYS.player2Color, DEFAULTS.player2Color)!,
            player1Name: LocalStorageService.get<string>(GameSettingsManager.KEYS.player1Name, DEFAULTS.player1Name)!,
            player2Name: LocalStorageService.get<string>(GameSettingsManager.KEYS.player2Name, DEFAULTS.player2Name)!,
            timerEnabled: LocalStorageService.get<boolean>(GameSettingsManager.KEYS.timerEnabled, DEFAULTS.timerEnabled)!,
            aiEnabled: LocalStorageService.get<boolean>(GameSettingsManager.KEYS.aiEnabled, DEFAULTS.aiEnabled)!,
            aiDifficulty: LocalStorageService.get<string>(GameSettingsManager.KEYS.aiDifficulty, DEFAULTS.aiDifficulty)!,
            fontSize: LocalStorageService.get<string>(GameSettingsManager.KEYS.fontSize, 'normal')!,
            chipSize: LocalStorageService.get<string>(GameSettingsManager.KEYS.chipSize, 'medium')!,
            theme: LocalStorageService.get<string>(GameSettingsManager.KEYS.theme, 'light')!,
        };
    }

    setPlayer1Color(color: string) {
        LocalStorageService.set<string>(GameSettingsManager.KEYS.player1Color, color);
    }
    setPlayer2Color(color: string) {
        LocalStorageService.set<string>(GameSettingsManager.KEYS.player2Color, color);
    }
    setPlayer1Name(name: string) {
        LocalStorageService.set<string>(GameSettingsManager.KEYS.player1Name, name);
    }
    setPlayer2Name(name: string) {
        LocalStorageService.set<string>(GameSettingsManager.KEYS.player2Name, name);
    }
    setTimerEnabled(enabled: boolean) {
        LocalStorageService.set<boolean>(GameSettingsManager.KEYS.timerEnabled, enabled);
    }
    setAIEnabled(enabled: boolean) {
        LocalStorageService.set<boolean>(GameSettingsManager.KEYS.aiEnabled, enabled);
    }
    setAIDifficulty(difficulty: string) {
        LocalStorageService.set<string>(GameSettingsManager.KEYS.aiDifficulty, difficulty);
    }
    setFontSize(size: string) {
        LocalStorageService.set<string>(GameSettingsManager.KEYS.fontSize, size);
    }
    setChipSize(size: string) {
        LocalStorageService.set<string>(GameSettingsManager.KEYS.chipSize, size);
    }
    setTheme(theme: string) {
        LocalStorageService.set<string>(GameSettingsManager.KEYS.theme, theme);
    }
}
