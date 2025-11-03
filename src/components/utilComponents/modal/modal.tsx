
import styles from './modal.module.css'
import {ReactNode, useCallback, useEffect, useRef, useState} from "react";
import { Portal } from "../../../shared/ui/Portal/Portal.tsx";
import { MouseEvent } from 'react';

interface IModalProps {
    className?: string;
    children?: ReactNode;
    isOpen?: boolean;
    onClose?: () => void;
    lazy?: boolean;
}

const ANIMATION_DELAY = 300;

export const Modal = (props: IModalProps) => {
    const {
        children,
        isOpen,
        onClose,
        lazy = true
    } = props

    const [isClosing, setIsClosing] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const timeRef = useRef<number | null>(null);
    useEffect(() => {
        if (isOpen) {
            if (timeRef.current !== null) {
                clearTimeout(timeRef.current);
                timeRef.current = null;
            }
            setIsMounted(true);
            setIsClosing(false);
            return;
        }

        if (!isOpen && isMounted) {
            setIsClosing(true);
            timeRef.current = window.setTimeout(() => {
                setIsClosing(false);
                setIsMounted(false);
                timeRef.current = null;
            }, ANIMATION_DELAY);
        }
    }, [isOpen, isMounted]);

    const closeHandler = useCallback(() => {
        if (onClose) {
            onClose();
        }
    }, [onClose]);

    const onKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            closeHandler();
        }
    }, [closeHandler]);

    const onContentClick = (e: MouseEvent) => {
        e.stopPropagation();
    };

    useEffect(() => {
        if (isOpen) {
            window.addEventListener('keydown', onKeyDown);
        }

        return () => {
            if (timeRef.current !== null) {
                clearTimeout(timeRef.current);
                timeRef.current = null;
            }
            window.removeEventListener('keydown', onKeyDown);
        }
    }, [isOpen, onKeyDown]);

    if (lazy && !isMounted) return null;

    return (
        <Portal>
            <div className={`${styles.modal} ${isClosing ? styles.closing : ''} ${isOpen && !isClosing ? styles.open : ''}`}>
                <div className={styles.overlay} onClick={closeHandler}>
                    <div className={styles.content} onClick={onContentClick}>
                        {children}
                    </div>

                </div>
            </div>
        </Portal>
    )
}
