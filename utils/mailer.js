
const nodemailer=require('nodemailer');
const Mailgen=require('mailgen');


exports.sendEmail = async(to,token)=>{
    try {
        const transporter = nodemailer.createTransport({
            // service:"gmail",
            host: process.env.EMAIL_HOST,
            port: 465,
            auth: {
                user: process.env.EMAIL_USER, 
                pass: process.env.EMAIL_PASSWORD, 
            }
        });
        // generate email body using Mailgen
        console.log(process.env.EMAIL_USER)
       const MailGenerator = new Mailgen({
            theme: "cerberus",
            product : {
                name: "EVOTING",
                link: 'http://localhost:5000/'
            }
        })
        /*  send mails */
        const email = {
            body : {
                name: "EVOTE USER",
                intro : 'Receive EVOTE SINGLE TOKEN',
                outro: `TOKEN: ${token}`
            }
        }
        const emailBody = MailGenerator.generate(email);
        // send mail with defined transport object
        const mailOptions = {
            from: process.env.EMAIL,
            to: to,
            subject: 'EVOTE TOKEN',
            html: emailBody
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return error
            } else {
                console.log('Email sent: ' + info.response);
               return "Email Sent"
            }
        });

    } catch (error) {
        console.log('error email', error)
        return error
    }
}
