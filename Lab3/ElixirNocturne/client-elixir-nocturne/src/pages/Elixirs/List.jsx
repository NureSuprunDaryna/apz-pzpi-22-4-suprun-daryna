import { useEffect, useState } from 'react';
import api from '../../api';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function List() {
    const [elixirs, setElixirs] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const emptyFlag = searchParams.get('empty') === 'true';

    useEffect(() => {
        const fetchElixirs = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                const res = await api.get(`/elixir/author/${user.id}`);
                setElixirs(res.data);
            } catch (err) {
                setError('Не вдалося завантажити еліксири');
            } finally {
                setLoading(false);
            }
        };

        fetchElixirs();
    }, []);

    useEffect(() => {
        let filteredData = elixirs;

        if (search.trim() !== '') {
            filteredData = filteredData.filter(e =>
                e.name.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (showFavoritesOnly) {
            filteredData = filteredData.filter(e => e.isFavorite);
        }

        setFiltered(filteredData);
    }, [search, showFavoritesOnly, elixirs]);

    const handleCreateClick = () => navigate('/elixirs/create');

    const handleEdit = (id) => navigate(`/elixirs/${id}/edit`);

    const handleDelete = async (id) => {
        if (!window.confirm('Ви впевнені, що хочете видалити еліксир?')) return;
        try {
            await api.delete(`/elixir/delete/${id}`);
            setElixirs(elixirs.filter(e => e.id !== id));
        } catch {
            alert('Помилка при видаленні еліксиру');
        }
    };

    const handleFavorite = async (id) => {
        try {
            await api.post(`/elixir/favorite/${id}`);
            setElixirs(prev =>
                prev.map(e => e.id === id ? { ...e, isFavorite: !e.isFavorite } : e)
            );
        } catch {
            alert('Помилка при зміні статусу улюбленого');
        }
    };

    if (loading) return <div style={containerStyle}>Завантаження...</div>;

    return (
        <div style={containerStyle}>
            <div style={contentWrapperStyle}>
                <div style={headerRowStyle}>
                    <h2 style={titleStyle}>Мої еліксири</h2>
                    <button onClick={handleCreateClick} style={createButtonStyle}>+ Створити</button>
                </div>

                <div style={filterRowStyle}>
                    <input
                        type="text"
                        placeholder="Пошук за назвою..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={searchInputStyle}
                    />
                    <label style={checkboxLabelStyle}>
                        <input
                            type="checkbox"
                            checked={showFavoritesOnly}
                            onChange={() => setShowFavoritesOnly(!showFavoritesOnly)}
                        />
                        <span style={{ marginLeft: '8px' }}>Улюблені</span>
                    </label>
                </div>

                {error && <p style={errorStyle}>{error}</p>}

                {filtered.length === 0 ? (
                    <div style={emptyStyle}>
                        <p style={emptyTextStyle}>
                            {emptyFlag ? 'У вас ще немає еліксирів' : 'Нічого не знайдено'}
                        </p>
                        <button onClick={handleCreateClick} style={buttonStyle}>Створити еліксир</button>
                    </div>
                ) : (
                    <ul style={listStyle}>
                        {filtered.map(elixir => (
                            <li key={elixir.id} style={cardStyle}>
                                <h3 style={cardTitleStyle}>{elixir.name}</h3>
                                <p style={cardDescriptionStyle}>{elixir.description}</p>

                                <div style={buttonRowStyle}>
                                    <button onClick={() => navigate(`/elixirs/${elixir.id}`)} style={smallButtonStyle}>
                                        👁️
                                    </button>
                                    <button onClick={() => handleEdit(elixir.id)} style={editButtonStyle}>
                                        ✏️
                                    </button>
                                    <button onClick={() => handleDelete(elixir.id)} style={deleteButtonStyle}>
                                        🗑️
                                    </button>
                                    <button
                                        onClick={() => handleFavorite(elixir.id)}
                                        style={favoriteButtonStyle(elixir.isFavorite)}
                                    >
                                        {elixir.isFavorite ? '💔' : '❤️'}
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

const containerStyle = {
    minHeight: '100vh',
    backgroundColor: '#fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: '40px 20px',
    fontFamily: 'Segoe UI, sans-serif',
    color: '#000',
    width: '100%'
};

const contentWrapperStyle = {
    width: '100%',
    maxWidth: '900px'
};

const headerRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px'
};

const filterRowStyle = {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px',
    alignItems: 'center'
};

const titleStyle = {
    fontSize: '28px',
    fontWeight: 'bold'
};

const createButtonStyle = {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px'
};

const searchInputStyle = {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    flex: '1'
};

const checkboxLabelStyle = {
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    userSelect: 'none'
};

const errorStyle = {
    color: 'red',
    textAlign: 'center',
    marginBottom: '20px'
};

const emptyStyle = {
    textAlign: 'center',
    marginTop: '60px'
};

const emptyTextStyle = {
    fontSize: '18px',
    marginBottom: '16px',
    color: '#333'
};

const buttonStyle = {
    padding: '12px 24px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px'
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
    color: '#000',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
};

const cardTitleStyle = {
    fontSize: '18px',
    marginBottom: '10px'
};

const cardDescriptionStyle = {
    fontSize: '14px',
    marginBottom: '10px'
};

const buttonRowStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px'
};

const smallButtonStyle = {
    padding: '6px 10px',
    fontSize: '14px',
    backgroundColor: '#17a2b8',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
};

const editButtonStyle = {
    ...smallButtonStyle,
    backgroundColor: '#ffc107'
};

const deleteButtonStyle = {
    ...smallButtonStyle,
    backgroundColor: '#dc3545'
};

const favoriteButtonStyle = (isFavorite) => ({
    ...smallButtonStyle,
    backgroundColor: isFavorite ? '#28a745' : '#6c757d'
});
