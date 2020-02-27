const validate = (props) => {
    const errors = {}
    if (!props.name) {
        errors.name = {
            en: 'Enter Your Name',
            ar: 'ادخل اسمك'
        }
    }

    if (!props.email) {
        errors.email = {
            en: 'Enter Your Email',
            ar: 'ادخل بريدك الالكتروني'
        }
    }
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,6}$/i.test(props.email)) {
        errors.email = {
            en: 'Invalid Email',
            ar: 'البريد الالكتروني غير صحيح'
        }

    }
    if (!props.password) {
        errors.password = {
            en: 'Enter Your Password',
            ar: 'ادخل الرقم السري'
        }
    }
    if (!props.confirmpassword) {
        errors.confirmpassword = {
            en: 'Enter Your Confirm Password',
            ar: 'ادخل تاكيد الرقم السري'
        }
    }
    if (!props.newpassword) {
        errors.newpassword = {
            en: 'Enter Your New Password',
            ar: 'ادخل الرقم السري الجديد'
        }
    }
    else if (props.newpassword !== props.confirmpassword) {
        errors.confirmpassword = {
            en: "Two Password Don't Match",
            ar: 'تاكيد الرقم غير صحيح'
        }
    }

    return errors
}

export default validate;