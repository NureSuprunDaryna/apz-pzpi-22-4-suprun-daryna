import { useEffect, useState } from 'react';
import api from '../../api';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get('/account/profile');
                setUser(res.data);
            } catch (err) {
                setError('Не вдалося завантажити профіль');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('uk-UA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) return <div style={containerStyle}>Завантаження...</div>;
    if (error) return <div style={containerStyle}><p style={{ color: 'red' }}>{error}</p></div>;
    if (!user) return null;

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <h2 style={titleStyle}>Мій профіль</h2>

                <div style={infoRowStyle}><strong>Ім’я:</strong> {user.firstName}</div>
                <div style={infoRowStyle}><strong>Прізвище:</strong> {user.lastName}</div>
                <div style={infoRowStyle}><strong>Email:</strong> {user.email}</div>
                <div style={infoRowStyle}><strong>Дата народження:</strong> {formatDate(user.dateOfBirth)}</div>
                <div style={infoRowStyle}><strong>Стать:</strong> {user.sex === 'M' ? 'Чоловіча' : user.sex === 'F' ? 'Жіноча' : 'Не вказано'}</div>
                <div style={infoRowStyle}><strong>Біо:</strong> {user.bio || '—'}</div>
                <div style={infoRowStyle}><strong>Роль:</strong> {user.role}</div>
                <div style={infoRowStyle}><strong>Дата приєднання:</strong> {formatDate(user.joined)}</div>

                <button style={editButtonStyle} onClick={() => navigate('/profile/edit')}>
                    ✏️ Редагувати профіль
                </button>
            </div>
        </div>
    );
}

const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px',
    backgroundColor: '#f5f5f5',
    fontFamily: 'Segoe UI, sans-serif'
};

const cardStyle = {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    maxWidth: '600px',
    width: '100%'
};

const titleStyle = {
    fontSize: '26px',
    marginBottom: '20px',
    textAlign: 'center',
    color: '#333'
};

const infoRowStyle = {
    fontSize: '16px',
    marginBottom: '12px',
    color: '#555'
};

const editButtonStyle = {
    marginTop: '20px',
    padding: '10px 20px',
    fontSize: '15px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
};
