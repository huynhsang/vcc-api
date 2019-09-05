import config from '../global/config.global';

const emailDS = {
    name: 'emailDS',
    connector: 'mail',
    transports: [
        {
            type: 'smtp',
            host: 'smtp.gmail.com',
            secure: true,
            port: 465,
            auth: {
                user: config.EMAIL_ACCOUNT.email,
                pass: config.EMAIL_ACCOUNT.password
            }
        }
    ]
};

export default emailDS;
