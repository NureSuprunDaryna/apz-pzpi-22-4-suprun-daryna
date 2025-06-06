import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api';

export default function ElixirDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [elixir, setElixir] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [favoriteLoading, setFavoriteLoading] = useState(false);

    useEffect(() => {
        const fetchElixir = async () => {
            try {
                const res = await api.get(`/elixir/${id}`);
                setElixir(res.data);
            } catch (err) {
                setError('Не вдалося завантажити еліксир');
            } finally {
                setLoading(false);
            }
        };

        fetchElixir();
    }, [id]);

    const toggleFavorite = async () => {
        if (!elixir) return;

        setFavoriteLoading(true);
        try {
            if (elixir.isFavorite) {
                await api.delete(`/favorites/${elixir.id}`);
                setElixir({ ...elixir, isFavorite: false });
            } else {
                await api.post(`/elixir/favorite/${elixir.id}`);
                setElixir({ ...elixir, isFavorite: true });
            }
        } catch (err) {
            setError('Не вдалося змінити статус улюбленого');
        } finally {
            setFavoriteLoading(false);
        }
    };

    if (loading) return <div style={containerStyle}>Завантаження...</div>;
    if (error) return <div style={containerStyle}><p style={{ color: 'red' }}>{error}</p></div>;
    if (!elixir) return null;

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <h2 style={titleStyle}>{elixir.name}</h2>
                <p style={descriptionStyle}>{elixir.description}</p>

                {elixir.compositions?.length > 0 && (
                    <>
                        <h3 style={sectionTitleStyle}>Ноти композиції:</h3>
                        <ul style={listStyle}>
                            {elixir.compositions.map((comp, index) => (
                                <li key={index} style={listItemStyle}>
                                    <strong>{comp.note.name}</strong> – {comp.noteCategory} ({comp.proportion}%)
                                </li>
                            ))}
                        </ul>
                    </>
                )}

                <div style={buttonGroupStyle}>
                    <button onClick={() => navigate(`/elixirs/${elixir.id}/edit`)} style={editButtonStyle}>
                        Редагувати
                    </button>

                    <button
                        onClick={toggleFavorite}
                        disabled={favoriteLoading}
                        style={elixir.isFavorite ? unfavButtonStyle : favButtonStyle}
                    >
                        {elixir.isFavorite ? 'Видалити з улюблених' : 'Додати до улюблених'}
                    </button>
                </div>
            </div>
        </div>
    );
}

const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: '40px',
    fontFamily: 'Segoe UI, sans-serif'
};

const cardStyle = {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    maxWidth: '700px',
    width: '100%'
};

const titleStyle = {
    fontSize: '28px',
    marginBottom: '16px',
    color: '#333'
};

const descriptionStyle = {
    fontSize: '16px',
    color: '#555',
    marginBottom: '24px'
};

const sectionTitleStyle = {
    fontSize: '20px',
    marginBottom: '10px',
    color: '#222'
};

const listStyle = {
    listStyleType: 'none',
    padding: 0,
    marginBottom: '20px'
};

const listItemStyle = {
    fontSize: '15px',
    marginBottom: '8px',
    color: '#444'
};

const buttonGroupStyle = {
    display: 'flex',
    gap: '16px',
    marginTop: '20px'
};

const editButtonStyle = {
    flex: 1,
    padding: '10px 20px',
    fontSize: '15px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
};

const favButtonStyle = {
    flex: 1,
    padding: '10px 20px',
    fontSize: '15px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
};

const unfavButtonStyle = {
    ...favButtonStyle,
    backgroundColor: '#dc3545'
};
