import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api';
import { useEffect, useState } from 'react';

export default function ElixirDelete() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleDelete = async () => {
        try {
            await api.delete(`/elixir/delete/${id}`);
            navigate('/elixirs');
        } catch (err) {
            setError('Не вдалося видалити еліксир');
        }
    };

    const handleCancel = () => navigate('/elixirs');

    return (
        <div style={containerStyle}>
            <div style={dialogStyle}>
                <h3>Видалити еліксир?</h3>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button onClick={handleDelete} style={confirmStyle}>Так, видалити</button>
                <button onClick={handleCancel} style={cancelStyle}>Скасувати</button>
            </div>
        </div>
    );
}

const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f3f3'
};

const dialogStyle = {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    textAlign: 'center'
};

const confirmStyle = {
    padding: '10px 20px',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    marginRight: '10px',
    cursor: 'pointer'
};

const cancelStyle = {
    padding: '10px 20px',
    backgroundColor: '#6c757d',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
};
