import { memo, useMemo, useCallback, ChangeEvent } from 'react';
import { COLORS_TRICKS, SIZES_TRICKS } from "../../styles/variables/constans";
import { Input } from "../input/input";
import { Trick } from "../trick/trick";
import styles from './playerSettings.module.css';
import { useTranslation } from 'react-i18next';

interface IPlayerSettingsProps {
    name?: string;
    selectedKey?: string;
    forbiddenColorKey?: string;
    colorLabel?: string;
    storageKey?: string;
    onNameChange?: (name: string) => void;
    onColorChange?: (colorKey: string) => void;
    setSelectedKey?: (colorKey: string) => void;
    id: string;
}

export const PlayerSettings = memo((props: IPlayerSettingsProps) => {
    const { t } = useTranslation();
    const {
        name,
        selectedKey,
        forbiddenColorKey,
        colorLabel,
        onNameChange,
        onColorChange,
        setSelectedKey,
        id
    } = props;

    const nameLabelText = useMemo(() => t('Имя игрока'), [t]);
    const selectedColorText = useMemo(() => t('Выбранный цвет'), [t]);

    const handleNameChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        onNameChange?.((e.target as HTMLInputElement).value);
    }, [onNameChange]);

    const colorEntries = useMemo(() =>
        Object.entries(COLORS_TRICKS || {}),
        []
    );

    return (
        <div className={styles.playerSettings}>
            <Input
                id={id}
                label={nameLabelText}
                placeholder={name}
                value={name}
                onChange={handleNameChange}
            />
            <p className={styles.headerColor}>
                {`${selectedColorText}: `}
                <span style={{ fontWeight: 700 }}>
                    {colorLabel}
                </span>
            </p>
            <div className={styles.trickList}>
                {colorEntries.map(([k, trickColor]) => {
                    const isSelected = k === selectedKey;
                    const isForbidden = forbiddenColorKey ? k === forbiddenColorKey : false;
                    return (
                        <button
                            key={k}
                            className={`${styles.colorTile} ${isSelected
                                ? styles.selected
                                : ''} 
                                ${isForbidden
                                    ? styles.disabled
                                    : ''}`}
                            onClick={() => {
                                if (isForbidden) return;
                                setSelectedKey?.(k);
                                onColorChange?.(k);
                            }}
                            aria-pressed={isSelected}
                            aria-disabled={isForbidden}
                        >
                            <Trick
                                color={trickColor}
                                size={SIZES_TRICKS.extraSmall}
                            />
                        </button>
                    );
                })}
            </div>
        </div>
    );
}, (prevProps, nextProps) => {
    return (
        prevProps.name === nextProps.name &&
        prevProps.selectedKey === nextProps.selectedKey &&
        prevProps.colorLabel === nextProps.colorLabel &&
        prevProps.forbiddenColorKey === nextProps.forbiddenColorKey &&
        prevProps.storageKey === nextProps.storageKey &&
        prevProps.id === nextProps.id
    );
});

PlayerSettings.displayName = 'PlayerSettings';
