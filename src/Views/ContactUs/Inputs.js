const Inputs = [
    {
        name: "fullName",
        placeholder: { en : "your name " , ar :"الاسم"},
        label:{en : "your name ", ar : "الاسم" },
        size : {xs : "12" , md :"12" , lg : "12" } ,
        type: "text",
    },
    {
        type: "email",
        size : {xs : "12" , md :"12" , lg : "6" } ,
        name: "email",
        label: {en : "Email" , ar : "البريد الالكتروني"},
        placeholder: { en : "Email" , ar : "البريد الالكتروني" },
    },
    {
        name: "phonenum",
        label: { en: "phone Number", ar: "رقم الجوال" },
        placeholder: { en: ' Phone Number', ar: "رقم الجوال" }, 
        size : {xs : "12" , md :"12" , lg : "6" } ,
        type : "text" ,
        inputType:"number",
    },
    {
        type: "textarea",
        size : {xs : "12" , md :"12" , lg : "12" } ,
        name: "notes",
        label: {en : "Notes" , ar : "اكتب السبب"},
        placeholder: { en : "Notes" , ar : " اكتب السبب" },
    },
]
export default Inputs ;