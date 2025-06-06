import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    en: {
        translation: {
            login: "Login",
            username: "Username",
            password: "Password",
            loginError: "Failed to log in",
            welcome: "Welcome",
            logout: "Logout",
            adminPanel: "Admin Panel",
            userPanel: "User Panel",
            elixirs: "Elixirs",
            favorites: "Favorites",
            create: "Create",
            edit: "Edit",
            delete: "Delete",
            view: "View",
            save: "Save",
            description: "Description",
            name: "Name",
            keywords: "Keywords",
            profile: "Profile",
            editProfile: "Edit Profile",
            backup: "Backup",
            createBackup: "Create Backup",
            restoreBackup: "Restore Backup",
            register: "Register",
            username: "Username",
            password: "Password",
            firstName: "First Name",
            lastName: "Last Name",
            bio: "Bio",
            registerSuccess: "Registration successful! Check your email for confirmation.",
            registerError: "Registration failed"
        },
    },
    uk: {
        translation: {
            welcome: "Ласкаво просимо",
            login: "Увійти",
            logout: "Вийти",
            adminPanel: "Панель адміністратора",
            userPanel: "Панель користувача",
            elixirs: "Еліксири",
            favorites: "Улюблені",
            create: "Створити",
            edit: "Редагувати",
            delete: "Видалити",
            view: "Переглянути",
            save: "Зберегти",
            description: "Опис",
            name: "Назва",
            keywords: "Ключові слова",
            profile: "Профіль",
            editProfile: "Редагувати профіль",
            backup: "Резервне копіювання",
            createBackup: "Створити резервну копію",
            restoreBackup: "Відновити резервну копію",
            username: "Нікнейм",
            password: "Пароль",
            loginError: "Помилка при вході",
            register: "Реєстрація",
            username: "Нікнейм",
            password: "Пароль",
            firstName: "Ім’я",
            lastName: "Прізвище",
            bio: "Біо",
            registerSuccess: "Реєстрація успішна! Перевірте пошту для підтвердження.",
            registerError: "Помилка при реєстрації"
        },
    },
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
