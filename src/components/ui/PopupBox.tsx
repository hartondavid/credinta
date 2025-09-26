import React, { useEffect } from 'react';

interface PopupBoxProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'warning' | 'danger' | 'info' | 'success';
}

export default function PopupBox({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirmă',
    cancelText = 'Anulează',
    type = 'warning'
}: PopupBoxProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const getTypeStyles = () => {
        switch (type) {
            case 'danger':
                return {
                    icon: '⚠️',
                    iconBg: 'bg-red-100',
                    iconColor: 'text-red-600',
                    buttonBg: 'bg-red-600 hover:bg-red-700',
                    buttonText: 'text-white'
                };
            case 'success':
                return {
                    icon: '✅',
                    iconBg: 'bg-green-100',
                    iconColor: 'text-green-600',
                    buttonBg: 'bg-green-600 hover:bg-green-700',
                    buttonText: 'text-white'
                };
            case 'info':
                return {
                    icon: 'ℹ️',
                    iconBg: 'bg-blue-100',
                    iconColor: 'text-blue-600',
                    buttonBg: 'bg-blue-600 hover:bg-blue-700',
                    buttonText: 'text-white'
                };
            default: // warning
                return {
                    icon: '⚠️',
                    iconBg: 'bg-yellow-100',
                    iconColor: 'text-yellow-600',
                    buttonBg: 'bg-yellow-600 hover:bg-yellow-700',
                    buttonText: 'text-white'
                };
        }
    };

    const styles = getTypeStyles();

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-opacity-20 transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative transform overflow-hidden rounded-lg bg-white shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg dark:bg-neutral-700/80 dark:text-white">
                    {/* Header */}
                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 dark:bg-neutral-700/80 dark:text-white">
                        <div className="sm:flex sm:items-start">
                            <div className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${styles.iconBg} sm:mx-0 sm:h-10 sm:w-10`}>
                                <span className="text-xl">{styles.icon}</span>
                            </div>
                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                <h3 className="text-lg font-medium leading-6 text-black dark:text-white">
                                    {title}
                                </h3>
                                <div className="mt-2">
                                    <p className="text-sm text-black dark:text-white">
                                        {message}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 dark:bg-neutral-700/80 dark:text-white">
                        <button
                            type="button"
                            className={`inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold ${styles.buttonBg} ${styles.buttonText} shadow-sm sm:ml-3 sm:w-auto`}
                            onClick={onConfirm}
                        >
                            {confirmText}
                        </button>
                        <button
                            type="button"
                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto dark:bg-neutral-800/80 dark:text-white dark:hover:bg-neutral-800/80"
                            onClick={onClose}
                        >
                            {cancelText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Global functions for easy use in vanilla JS
export const showConfirmPopup = (
    title: string,
    message: string,
    onConfirm: () => void,
    options?: {
        confirmText?: string;
        cancelText?: string;
        type?: 'warning' | 'danger' | 'info' | 'success';
    }
) => {
    const popupContainer = document.getElementById('popup-container');
    if (!popupContainer) return;

    const { confirmText = 'Confirmă', cancelText = 'Anulează', type = 'warning' } = options || {};

    const handleClose = () => {
        popupContainer.innerHTML = '';
    };

    const handleConfirm = () => {
        onConfirm();
        handleClose();
    };

    // Create React root and render popup
    const root = document.createElement('div');
    popupContainer.appendChild(root);

    // Import React and render
    import('react').then((React) => {
        import('react-dom/client').then(({ createRoot }) => {
            const reactRoot = createRoot(root);
            reactRoot.render(
                React.createElement(PopupBox, {
                    isOpen: true,
                    onClose: handleClose,
                    onConfirm: handleConfirm,
                    title,
                    message,
                    confirmText,
                    cancelText,
                    type
                })
            );
        });
    });
};
