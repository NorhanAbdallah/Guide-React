const validate =props=> {
    const errors = {}
    if (!props.fullName) {
        errors.fullName = {
            ar: ' يرجى ادخال الاسم ',
            en: 'Please enter your name',
        }
    }
    if (!props.phone) {
        errors.phone = {
            ar: 'يرجى ادخال الهاتف ',
            en: 'Please enter your phone',
        }
    } 
    if (!(Number(props.phone))) {
        errors.phone = {
            ar: ' يرجى ادخال الهاتف ',
            en: 'Enter correct phone number',
        }
    } 
    if (!props.email) {
        errors.email = {
            ar: 'يرجى ادخال البريد الالكتروني',
            en: 'Enter your email',
        }
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,6}$/i.test(props.email)) {
        errors.email = {
            ar: 'البريد الالكتروني غير صحيح',
            en: 'invalid email',
        }
    }

    if (!props.notes) {
        errors.notes = {
            ar: 'يرجى ادخال الملاحظات',
            en: 'Enter notes'
        }}

    return errors
}
export default validate;

