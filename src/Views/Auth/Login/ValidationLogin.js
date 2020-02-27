
const validate = (props) => {
    const errors = {}
    if (!props.username) {
        errors.username = {
            en: 'Enter Username',
            ar: 'ادخل اسمك'
        }
    }

    if (!props.password) {
        errors.password = {
            en: 'Enter Password',
            ar: 'ادخل رقم السري'
        }
    }

    return errors
}

export default validate;