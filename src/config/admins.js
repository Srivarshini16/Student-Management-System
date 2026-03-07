// Add all admin Gmail addresses here
export const ADMIN_EMAILS = [
    "anandkumar@gmail.com",
    "anandkumarp093@gmail.com"
];


export const isAdmin = (email) => {
    return ADMIN_EMAILS.includes(email.toLowerCase());
};