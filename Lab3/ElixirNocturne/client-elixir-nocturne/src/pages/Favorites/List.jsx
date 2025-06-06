import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

export default function FavoritesList() {
    const [favorites, setFavorites] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const res = await api.get('/favorites');
                setFavorites(res.data);
            } catch (err) {
                setError('Не вдалося завантажити улюблені еліксири');
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, []);

    const handleRemoveFavorite = async (elixirId) => {
        try {
            await api.delete(`/favorites/${elixirId}`);
            setFavorites(prev => prev.filter(e => e.id !== elixirId));
        } catch (err) {
            setError('Не вдалося видалити з улюблених');
        }
    };

    if (loading) return <div style={containerStyle}>Завантаження...</div>;

    return (
        <div style={containerStyle}>
            <h2 style={titleStyle}>Улюблені еліксири</h2>

            {error && <p style={errorStyle}>{error}</p>}

            {favorites.length === 0 ? (
                <p style={emptyStyle}>У вас немає улюблених еліксирів</p>
            ) : (
                <ul style={listStyle}>
                    {favorites.map(elixir => (
                        <li key={elixir.id} style={cardStyle}>
                            <h3 style={cardTitleStyle}>{elixir.name}</h3>
                            <p style={cardDescriptionStyle}>{elixir.description}</p>
                            <div style={buttonGroupStyle}>
                                <button onClick={() => navigate(`/elixirs/${elixir.id}`)} style={detailButtonStyle}>
                                    Переглянути
                                </button>
                                <button onClick={() => handleRemoveFavorite(elixir.id)} style={removeButtonStyle}>
                                    Видалити з улюблених
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

const containerStyle = {
    minHeight: '100vh',
    backgroundColor: '#fff',
    padding: '40px 20px',
    fontFamily: 'Segoe UI, sans-serif',
    color: '#000'
};

const titleStyle = {
    textAlign: 'center',
    marginBottom: '24px',
    fontSize: '28px',
    fontWeight: 'bold'
};

const errorStyle = {
    color: 'red',
    textAlign: 'center',
    marginBottom: '20px'
};

const emptyStyle = {
    textAlign: 'center',
    marginTop: '40px',
    fontSize: '18px',
    color: '#333'
};

const listStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '20px'
};

const cardStyle = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    color: '#000'
};

const cardTitleStyle = {
    fontSize: '18px',
    marginBottom: '10px'
};

const cardDescriptionStyle = {
    fontSize: '14px',
    marginBottom: '10px'
};

const buttonGroupStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '10px'
};

const detailButtonStyle = {
    flex: 1,
    padding: '8px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
};

const removeButtonStyle = {
    flex: 1,
    padding: '8px',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
};
