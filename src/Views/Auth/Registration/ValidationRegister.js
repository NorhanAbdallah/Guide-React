const validate = (props) => {
    const errors = {}
    console.log("ERRORR", props)
    if (!props.name) {
        errors.name = {
            en: 'Enter Your Name',
            ar: 'ادخل اسمك'
        }
    }
    if (!props.username) {
        errors.username = {
            en: 'Enter Username',
            ar: 'ادخل اسمك'
        }
    }
    if (!props.email) {
        errors.email = {
            en: 'Enter Your Email',
            ar: 'ادخل بريدك الالكتروني'
        }
    }
    else if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(props.email)) {
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
            en: 'Enter Confirmation Password',
            ar: 'ادخل تاكيد الرقم السري'
        }
    }
    else if (props.password !== props.confirmpassword) {
        errors.confirmpassword = {
            en: "Two Passwords Don't Match",
            ar: 'تاكيد الرقم غير صحيح'
        }
    }
    if (!props.eventenglish) {
        errors.eventenglish = {
            en: "Enter Your Event in English",
            ar: "ادخل اسم الفعالية بالانجليزي"
        }
    }
    if (!props.eventarabic) {
        errors.eventarabic = {
            en: "Enter Your Event in Arabic",
            ar: "ادخل اسم الفعالية بالعربي"
        }
    }
    if (!props.country) {
        errors.country = {
            en: "Select Country",
            ar: "اختار الدولة"
        }
    }
    if (!props.city) {
        errors.city = {
            en: "Select City",
            ar: "اختار المدينة"
        }
    }
    if (!props.logoSign) {
        errors.logoSign = {
            en: "Select Logo",
            ar: "اختار اللوجو"
        }
    }
    if (!props.shopenglish) {
        errors.shopenglish = {
            en: "Enter Your Shop in English",
            ar: "ادخل اسم المحل بالانجليزي"
        }
    }
    if (!props.shoparabic) {
        errors.shoparabic = {
            en: "Enter Your Shop in Arabic",
            ar: "ادخل اسم المحل بالعربي"
        }
    }
    if (!props.activityenglish) {
        errors.activityenglish = {
            en: "Enter Your Activity in English",
            ar: "ادخل اسم النشاط بالانجليزي"
        }
    }
    if (!props.activityarabic) {
        errors.activityarabic = {
            en: "Enter Your Activity in Arabic",
            ar: "ادخل اسم النشاط بالعربي"
        }
    }
    if (!props.sector) {
        errors.sector = {
            en: "Select Sector",
            ar: "اختار القطاع"
        }
    }
    if (!props.department) {
        errors.department = {
            en: "Select Department",
            ar: "اختار القسم"
        }
    }
    if (!props.branches) {
        errors.branches = {
            en: "Enter Number of Branches",
            ar: "ادخل عدد الفروع"
        }
    }
    if (!props.cities) {
        errors.cities = {
            en: "Enter Number of Cities",
            ar: "ادخل عدد المدن"
        }
    }


    return errors
}

export default validate;