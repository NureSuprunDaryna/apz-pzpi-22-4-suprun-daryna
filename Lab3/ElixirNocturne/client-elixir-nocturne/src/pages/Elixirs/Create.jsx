import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

export default function CreateElixir() {
    const [form, setForm] = useState({
        name: '',
        description: '',
        keywords: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/elixirs/create', {
                name: form.name,
                description: form.description,
                keywords: form.keywords.split(',').map(k => k.trim())
            });
            navigate('/elixirs');
        } catch (err) {
            setError(err.response?.data || 'Не вдалося створити еліксир');
        }
    };

    return (
        <div style={containerStyle}>
            <form onSubmit={handleSubmit} style={formStyle}>
                <h2 style={titleStyle}>Створити еліксир</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}

                <input
                    type="text"
                    name="name"
                    placeholder="Назва еліксиру"
                    value={form.name}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                />
                <textarea
                    name="description"
                    placeholder="Опис"
                    value={form.description}
                    onChange={handleChange}
                    required
                    style={{ ...inputStyle, height: '100px' }}
                />
                <input
                    type="text"
                    name="keywords"
                    placeholder="Ключові слова (через кому)"
                    value={form.keywords}
                    onChange={handleChange}
                    style={inputStyle}
                />
                <button type="submit" style={buttonStyle}>Зберегти</button>
            </form>
        </div>
    );
}

const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f3f3',
    fontFamily: 'Segoe UI, sans-serif',
    padding: '20px'
};

const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    padding: '36px',
    borderRadius: '10px',
    backgroundColor: '#fff',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.1)',
    maxWidth: '600px',
    width: '100%'
};

const titleStyle = {
    textAlign: 'center',
    color: '#333'
};

const inputStyle = {
    padding: '12px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    backgroundColor: '#fff',
    color: '#333'
};

const buttonStyle = {
    padding: '12px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold'
};
