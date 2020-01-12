import crypto from 'crypto';

export const generateKey = (hmacKey, algorithm, encoding) => {
    algorithm = algorithm || 'sha1';
    encoding = encoding || 'hex';
    const hmac = crypto.createHmac(algorithm, hmacKey);
    const buf = crypto.randomBytes(32);
    hmac.update(buf);
    return hmac.digest(encoding);
};

export const generatePassword = () => {
    return generateKey('password', null, null);
};
