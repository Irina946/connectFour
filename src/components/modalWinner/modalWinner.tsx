import { useTranslation } from 'react-i18next';
import { Button } from '../button/button.tsx';
import { Modal } from '../utilComponents/modal/modal.tsx';
import styles from './modalWinner.module.css';

interface IModalGameResultPops {
  showModal: boolean;
  isDraw: boolean;
  handleResetGame: () => void;
  winReason: 'standard' | 'time';
  winner: 'onePlayer' | 'twoPlayer' | null;
  timeoutPlayer?: string | null;
  player1Name?: string | null;
  player2Name?: string | null;
  aiEnabled?: boolean;
}
export const ModalWinner = (props: IModalGameResultPops) => {
  const {
    showModal,
    isDraw,
    handleResetGame,
    winReason,
    winner,
    timeoutPlayer,
    player1Name,
    player2Name,
    aiEnabled
  } = props;
  const { t } = useTranslation();

  const getModalMessage = () => {
    if (winReason === 'time' && timeoutPlayer) {
      const winnerName = timeoutPlayer === (player1Name ?? 'player_1')
        ? (aiEnabled ? t('Компьютер') : player2Name ?? 'player_2')
        : (player1Name ?? 'player_1');
      return <h2>{t('Время вышло, победил: {{name}}!', { name: winnerName })}</h2>;
    }
    if (winner) {
      return <h2>{t('Победитель: {{name}}!', {
        name: winner === 'onePlayer' ? (player1Name ?? 'Игрок 1') : (aiEnabled ? t('Компьютер') : player2Name ?? 'Игрок 2')
      })}</h2>;
    }
    return null;
  };

  return (
    <Modal onClose={handleResetGame} isOpen={showModal}>
      <div className={styles.modalWinner}>
        {isDraw ? (
          <div>
            <p>{t('Ничья!')}</p>
            <p>{t('Все ячейки заполнены, победителя нет')}</p>
          </div>
        ) : (
          getModalMessage()
        )}
        <Button onClick={handleResetGame} className="primary">
          {t('Играть снова')}
        </Button>
      </div>
    </Modal>
  );
}
