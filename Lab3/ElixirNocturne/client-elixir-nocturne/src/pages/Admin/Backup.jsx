import { useState } from 'react';
import api from '../../api';

export default function BackupAdmin() {
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [restorePath, setRestorePath] = useState('');

    const handleCreateBackup = async () => {
        try {
            await api.post('/backup/create');
            setMessage('Резервну копію створено успішно');
            setError('');
        } catch (err) {
            setError('Помилка при створенні резервної копії');
            setMessage('');
        }
    };

    const handleRestoreBackup = async () => {
        if (!restorePath) {
            setError('Введіть шлях до файлу резервної копії');
            setMessage('');
            return;
        }

        try {
            await api.post(`/backup/restore?backupFilePath=${encodeURIComponent(restorePath)}`);
            setMessage('Базу даних успішно відновлено');
            setError('');
        } catch (err) {
            setError('Помилка при відновленні з резервної копії');
            setMessage('');
        }
    };

    return (
        <div style={containerStyle}>
            <h2 style={titleStyle}>Резервне копіювання (Admin)</h2>

            {message && <p style={successStyle}>{message}</p>}
            {error && <p style={errorStyle}>{error}</p>}

            <button style={buttonStyle} onClick={handleCreateBackup}>
                Створити резервну копію
            </button>

            <div style={restoreBlockStyle}>
                <input
                    type="text"
                    placeholder="Введіть повний шлях до .bak файлу"
                    value={restorePath}
                    onChange={e => setRestorePath(e.target.value)}
                    style={inputStyle}
                />
                <button style={buttonStyle} onClick={handleRestoreBackup}>
                    Відновити базу
                </button>
            </div>
        </div>
    );
}

const containerStyle = {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '40px',
    fontFamily: 'Segoe UI, sans-serif'
};

const titleStyle = {
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: '24px',
    color: '#333'
};

const buttonStyle = {
    padding: '12px 20px',
    marginTop: '10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px'
};

const inputStyle = {
    padding: '10px',
    width: '100%',
    fontSize: '16px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    marginTop: '20px',
    marginBottom: '10px'
};

const restoreBlockStyle = {
    marginTop: '30px'
};

const errorStyle = {
    color: 'red'
};

const successStyle = {
    color: 'green'
};
