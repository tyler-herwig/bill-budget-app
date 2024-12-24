import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert, { AlertColor } from '@mui/material/Alert';

interface NotificationContextType {
    showNotification: (message: string, severity?: AlertColor) => void;
}

interface NotificationState {
    open: boolean;
    message: string;
    severity: AlertColor;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

interface NotificationProviderProps {
    children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
    const [notification, setNotification] = useState<NotificationState>({
        open: false,
        message: '',
        severity: 'info',
    });

    const showNotification = useCallback((message: string, severity: AlertColor = 'info') => {
        setNotification({
            open: true,
            message,
            severity,
        });
    }, []);

    const closeNotification = useCallback(() => {
        setNotification((prev) => ({ ...prev, open: false }));
    }, []);

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                onClose={closeNotification}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={closeNotification} severity={notification.severity} sx={{ width: '100%' }}>
                    {notification.message}
                </Alert>
            </Snackbar>
        </NotificationContext.Provider>
    );
};

export const useNotification = (): NotificationContextType => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};