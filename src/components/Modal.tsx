import { useEffect, useRef } from "react";
import styles from "./modal.module.css";

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
};

export function Modal({ isOpen, onClose, children }: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;

        const previousFocus = document.activeElement as HTMLElement;

        modalRef.current?.focus();

        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleEsc);

        return () => {
            document.removeEventListener("keydown", handleEsc);
            previousFocus?.focus();
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            onClick={onClose}
            className={styles.overlay}
        >
            <div
                ref={modalRef}
                tabIndex={-1}
                role="dialog"
                aria-modal="true"
                onClick={(e) => e.stopPropagation()}
                className={styles.content}
            >
                <button
                    onClick={onClose}
                    aria-label="Close modal"
                    className={styles.closeButton}
                >
                    ✕
                </button>

                {children}
            </div>
        </div>
    );
}