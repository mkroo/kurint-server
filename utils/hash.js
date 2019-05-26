import pbkdf2 from 'pbkdf2-password';
const hasher = pbkdf2();

export const createHash = async (password) => {
    return await func(password);
}

export const validateHash = async (password, salt) => {
    return await func(password, salt);
}

const func = (password, salt) => new Promise((resolve, reject) => {
    let flag = !salt;
    const option = {
        password
    }
    if (salt) {
        option.salt = salt;
    }
    
    hasher(option, (err, pass, salt, hash) => {
        if (err) {
            reject(err);
        } else {
            const result = { hash };
            if (flag) {
                result.salt = salt;
            }
            resolve(result);
        }
    });
})