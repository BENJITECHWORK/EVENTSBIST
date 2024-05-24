const nodemailer = require('nodemailer');

exports.resetEmail = async (email, token) => {
    try {
        let transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: 465,
            auth: {
                user: process.env.EMAIL_USER, 
                pass: process.env.EMAIL_PASSWORD, 
            }
        });

        //our message
        message = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset",
            // text: "Please Receive",
            html: `<html>
            <body style="background-color: #ffffff; font-size: 16px;">
                <center>
                    <table align="center" border="0" cellpadding="0" cellspacing="0" style="height:100%; width:600px;">
                       <tr>
                           <td align="center" bgcolor="#ffffff" style="padding:30px">
                               <p style="text-align:left">Hello there,<br><br> We received a request to reset the password for your account for this email address. To initiate the password reset process for your account, click the link below.
                               </p>
                               <p>
                                   <a target="_blank" style="text-decoration:none; background-color: black; border: black 1px solid; color: #fff; padding:10px 10px; display:block;" href="https://grademixnmatch.com/reset/${token}/">
                                      <strong>Reset Password</strong>
                                   </a>
                               </p>
                               <p style="text-align:left">This link can only be used once. If you need to reset your password again, please visit <a href="https://grademixnmatch.com/">grademixnmatch.com</a> and request another reset.<br><br>If you did not make this request, you can simply ignore this email.</p>
                               <p style="text-align:left">
                               Sincerely,<br>The Website Team
                               </p>
                           </td>
                       </tr>
                    </table>
                </center>
            </body>
            </html>`
            //eric.jjumba@students.mak.ac.ug
            //benjaminjjumba@gmail.com
        };
        //send email
        await transporter.sendMail(message);
    } catch (error) {
        console.log(error.message)
    }

}