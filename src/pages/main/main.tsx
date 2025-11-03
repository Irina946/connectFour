import { Link } from "react-router";
import { Button } from "../../components/button/button";
import styles from './main.module.css';
import { useTranslation } from "react-i18next";

export const MainPage = () => {
    const { t } = useTranslation();
    return (
        <div className={styles.main}>
            <div className={styles.mainHeader}>{t('4 в ряд')}</div>
            <Link to="/game">
                <Button className="primary" size="m">
                    {t('Начать игру')}
                </Button>
            </Link>
            <Link to="/settings">
                <Button className="secondary" size="m">
                    {t('Настройки')}
                </Button>
            </Link>
        </div>
    );
}