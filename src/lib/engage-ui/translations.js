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
        ru: 'Эл. адрес',
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
    invalid_email: {
        en: 'Please enter a valid email address',
        ru: 'Введите валидный адрес эл. почты',
    },
    invalid_phone: {
        en: 'Please enter a valid phone number',
        ru: 'Введите валидный телефонный номер',
    },
}

const getLang = () => window.localStorage.getItem('lng') || 'en'

export const getTranslation = key => translations[key][getLang()]
