import { createTransport } from 'nodemailer';

const sendMail = async (email , subject , text )=> {
    //config
    const transport = createTransport({
        host : "smtp.gmail.com",
        port : 465,
        auth :{
            user :process.env.GMAIL,
            pass :process.env.GPASS,
        }
    });

    await transport.sendMail({
        from :process.env.GMAIL,
        to: email,
        subject,
        text,
    });
};

export default sendMail