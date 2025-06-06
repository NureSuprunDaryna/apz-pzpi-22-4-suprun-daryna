import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div style={{ textAlign: 'right', margin: '10px' }}>
            <button onClick={() => changeLanguage('uk')}>🇺🇦 Українська</button>
            <button onClick={() => changeLanguage('en')} style={{ marginLeft: '10px' }}>🇬🇧 English</button>
        </div>
    );
}
