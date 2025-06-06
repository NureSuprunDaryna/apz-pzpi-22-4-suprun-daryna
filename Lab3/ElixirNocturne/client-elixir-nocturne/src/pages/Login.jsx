import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api';

export default function Login() {
    const { t } = useTranslation();
    const [form, setForm] = useState({ UserName: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/account/login', form);
            const user = res.data;
            localStorage.setItem('user', JSON.stringify(user));
            navigate('/elixirs');
        } catch (err) {
            const errorMsg =
                err.response?.data?.message ||
                err.response?.data?.errors?.[Object.keys(err.response?.data?.errors ?? {})[0]]?.[0] ||
                t('loginError');
            setError(errorMsg);
        }
    };

    return (
        <div style={containerStyle}>
            <form onSubmit={handleSubmit} style={formStyle}>
                <h2 style={titleStyle}>{t('login')}</h2>

                {error && <p style={errorStyle}>{error}</p>}

                <input
                    name="UserName"
                    placeholder={t('username')}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                />
                <input
                    name="password"
                    placeholder={t('password')}
                    type="password"
                    onChange={handleChange}
                    required
                    style={inputStyle}
                />
                <button type="submit" style={buttonStyle}>
                    {t('login')}
                </button>
            </form>
        </div>
    );
}

const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c2c2c',
    fontFamily: 'Segoe UI, sans-serif',
    padding: '20px'
};

const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    padding: '32px',
    borderRadius: '12px',
    backgroundColor: '#ffffff',
    boxShadow: '0 6px 24px rgba(0, 0, 0, 0.15)',
    width: '100%',
    maxWidth: '400px'
};

const titleStyle = {
    textAlign: 'center',
    marginBottom: '10px',
    color: '#333'
};

const errorStyle = {
    color: 'red',
    textAlign: 'center'
};

const inputStyle = {
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    outline: 'none',
    backgroundColor: '#f9f9f9'
};

const buttonStyle = {
    padding: '12px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.2s ease'
};
