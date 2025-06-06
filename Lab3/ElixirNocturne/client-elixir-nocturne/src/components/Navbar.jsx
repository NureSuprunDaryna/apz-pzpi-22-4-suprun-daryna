import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
    const { t } = useTranslation();

    return (
        <nav style={{ padding: '10px', backgroundColor: '#f8f9fa' }}>
            <LanguageSwitcher />
            <ul style={{ display: 'flex', gap: '20px', listStyle: 'none', padding: 0 }}>
                <li><Link to="/profile">{t('profile')}</Link></li>
                <li><Link to="/elixirs">{t('elixirs')}</Link></li>
                <li><Link to="/favorites">{t('favorites')}</Link></li>
                <li><Link to="/admin/backup">{t('backup')}</Link></li>
            </ul>
        </nav>
    );
}

const navbarStyle = {
    backgroundColor: '#fff',
    borderBottom: '1px solid #ddd',
    padding: '10px 20px',
    fontFamily: 'Segoe UI, sans-serif',
    position: 'sticky',
    top: 0,
    zIndex: 10
};

const navInnerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto'
};

const logoStyle = {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#007bff'
};

const linkGroupStyle = {
    display: 'flex',
    gap: '20px'
};

const linkStyle = {
    textDecoration: 'none',
    color: '#333',
    fontSize: '16px',
    paddingBottom: '4px'
};
