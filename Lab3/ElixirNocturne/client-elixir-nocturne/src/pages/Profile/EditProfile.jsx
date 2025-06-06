import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

export default function EditProfile() {
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        bio: '',
        sex: '',
        dateOfBirth: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/account/profile');
                const user = res.data;
                setForm({
                    firstName: user.firstName || '',
                    lastName: user.lastName || '',
                    bio: user.bio || '',
                    sex: user.sex || '',
                    dateOfBirth: user.dateOfBirth?.substring(0, 10) || ''
                });
            } catch {
                setError('Не вдалося завантажити дані профілю');
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put('/account/update', form);
            navigate('/profile');
        } catch {
            setError('Не вдалося оновити профіль');
        }
    };

    return (
        <div style={containerStyle}>
            <form onSubmit={handleSubmit} style={formStyle}>
                <h2 style={titleStyle}>Редагування профілю</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}

                <input
                    type="text"
                    name="firstName"
                    placeholder="Ім’я"
                    value={form.firstName}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                />
                <input
                    type="text"
                    name="lastName"
                    placeholder="Прізвище"
                    value={form.lastName}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                />
                <textarea
                    name="bio"
                    placeholder="Про себе"
                    value={form.bio}
                    onChange={handleChange}
                    style={{ ...inputStyle, height: '100px' }}
                />
                <select
                    name="sex"
                    value={form.sex}
                    onChange={handleChange}
                    style={inputStyle}
                >
                    <option value="">Стать не вказана</option>
                    <option value="M">Чоловіча</option>
                    <option value="F">Жіноча</option>
                </select>
                <input
                    type="date"
                    name="dateOfBirth"
                    value={form.dateOfBirth}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                />

                <button type="submit" style={buttonStyle}>Зберегти зміни</button>
            </form>
        </div>
    );
}

const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px',
    backgroundColor: '#f3f3f3',
    fontFamily: 'Segoe UI, sans-serif'
};

const formStyle = {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    maxWidth: '600px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
};

const titleStyle = {
    fontSize: '24px',
    textAlign: 'center',
    marginBottom: '10px'
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
    cursor: 'pointer'
};
