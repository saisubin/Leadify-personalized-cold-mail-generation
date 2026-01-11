import React, { useEffect } from 'react';

interface ToastProps {
    message: string;
    type: 'success' | 'error' | '';
    isVisible: boolean;
    onHide: () => void;
}

export default function Toast({ message, type, isVisible, onHide }: ToastProps) {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onHide();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onHide]);

    return (
        <div className={`toast ${isVisible ? 'show' : ''} ${type}`}>
            <span>{message}</span>
        </div>
    );
}
