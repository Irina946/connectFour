import styles from './player.module.css';
import { Trick } from '../trick/trick';
import { COLORS_TRICKS, SIZES_TRICKS } from '../../styles/variables/constans';
import { Button } from '../button/button';
import { useState, RefObject } from 'react';
import { Modal } from '../utilComponents/modal/modal';
import { PlayerSettings } from '../playerSettings/playerSettings';
import { CountDown, TCountDownHandle } from '../timer/timer';
import { useTranslation } from 'react-i18next';

interface IPlayerProps {
    color?: string;
    colorKey?: string;
    location: boolean;
    name?: string;
    isActive?: boolean;
    onNameChange?: (name: string) => void;
    forbiddenColorKey?: string;
    onColorChange?: (colorKey: string) => void;
    storageKey?: string;
    score?: number;
    onTimeOver?: () => void;
    gameEnded?: boolean;
    timerRef?: RefObject<TCountDownHandle>;
    timerEnabled?: boolean;
}

export const Player = (props: IPlayerProps) => {
    const { t } = useTranslation();
    const {
        color,
        colorKey,
        location,
        name,
        onNameChange,
        forbiddenColorKey,
        onColorChange,
        storageKey,
        isActive,
        onTimeOver,
        gameEnded,
        timerRef,
        timerEnabled
    } = props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const key = storageKey ?? `playerColorKey:${name ?? 'player'}`;

    const keyToHex = (k?: string) => {
        if (!k) return undefined;
        return (COLORS_TRICKS as Record<string, string>)[k] ?? k;
    }

    const hexToKey = (hex?: string) => {
        if (!hex) return undefined;
        const entry = Object.entries(COLORS_TRICKS).find(([, v]) => v.toLowerCase() === hex.toLowerCase());
        return entry ? entry[0] : undefined;
    }

    const initialSelected = colorKey ?? hexToKey(color);
    const [selectedKey, setSelectedKey] = useState<string | undefined>(initialSelected);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const colorKeyForLabel = selectedKey ?? hexToKey(color);
    const colorLabel = colorKeyForLabel
        ? (t(colorKeyForLabel).startsWith('color.')
            ? (COLORS_TRICKS[colorKeyForLabel]
                ?? colorKeyForLabel)
            : t(colorKeyForLabel))
        : (color ?? '');
    return (
        <div className={`${styles.playerContainer} ${location ? styles.locationRight : ''}`}>
            <div className={`${styles.player} ${location ? styles.locationRight : ''} ${isActive ? styles.active : ''}`}>
                <div className={`${styles.playerName} ${!location ? styles.locationLeft : ''}`}>
                    {name}
                    {timerEnabled &&
                        <CountDown
                            ref={timerRef}
                            minutes={5}
                            isActive={timerEnabled && isActive}
                            onTimeOver={onTimeOver}
                            gameEnded={gameEnded}
                        />
                    }
                </div>
                <>
                    <Button
                        className='clear'
                        size='xs'
                        onClick={openModal}
                    >
                        <Trick
                            color={keyToHex(selectedKey) ?? selectedKey ?? color}
                            size={SIZES_TRICKS.medium}
                        />
                    </Button>
                    <Modal isOpen={isModalOpen} onClose={closeModal}>
                        <div style={{ padding: 8 }} className={styles.modalContent}>
                            <div className={styles.headerPlayer}>{t('Информация об игроке')}</div>
                            <PlayerSettings
                                storageKey={key}
                                name={name}
                                selectedKey={selectedKey}
                                colorLabel={colorLabel}
                                forbiddenColorKey={forbiddenColorKey}
                                setSelectedKey={setSelectedKey}
                                onColorChange={onColorChange}
                                onNameChange={onNameChange}
                                id={key + "-name-input"}
                            />
                            <Button
                                className='primary'
                                onClick={closeModal}>
                                {t('Закрыть')}
                            </Button>
                        </div>
                    </Modal>
                </>
            </div>
            <div className={styles.score}>
                {props.score !== undefined ? props.score : 0}
            </div>
        </div>
    );
}
