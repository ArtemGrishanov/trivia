const translations = {
    firstName: {
        en: 'First name',
        ru: 'Имя',
    },
    lastName: {
        en: 'Last name',
        ru: 'Фамилия',
    },
    email: {
        en: 'Email',
        ru: 'Почта',
    },
    phone: {
        en: 'Phone',
        ru: 'Телефон',
    },
    next: {
        en: 'Next',
        ru: 'Дальше',
    },
    privacy_policy: {
        en: 'Privacy Policy',
        ru: 'Политикой конфиденциальности',
    },
    agree_with: {
        en: 'Agree with',
        ru: 'Согласен с',
    },
}

const getLang = () => window.localStorage.getItem('lng') || 'en'

export const getTranslation = key => translations[key][getLang()]
