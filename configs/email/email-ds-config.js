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
                user: 'no.reply.vcnc@gmail.com',
                pass: 'aaAA11!!'
            }
        }
    ]
};

export default emailDS;
