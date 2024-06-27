const {PrismaClient} = require('@prisma/client')
const bcrypt = require('bcryptjs')
const { hashPassword } = require('../utils/hash')
const jwt = require('jsonwebtoken');
const { resetEmail } = require('../utils/resetMail');
const { sendEmail } = require('../utils/mailer');
const randToken = require('rand-token').uid

/***************************************AUTH CONTROLLER********************************************************/
const prisma = new PrismaClient();

exports.register = async(req,res) => {

    try {
        const { lastName, firstName, password, email, phone_number, role,location } = req.body
        //check whether field exists
        if (!password || !lastName || !firstName ||!email ||!phone_number ||!role ||!location) {
            return res.status(404).json({
                success: false,
                message: "This Field Cannot be empty"
            })
        }
        /* Check whether user exists */
        const existingUser = await prisma.user.findUnique({
            where: {
              email: email
            }
          });
          
        if(existingUser){
            return res.status(404).json({
                success:false,
                message: "User Already exists"
            })
        }
        /********************************* Create a User ************************/
        var pass = await hashPassword(password) //hash password

        const newUser = await prisma.user.create({
               data :{
                    password: pass,
                    lastName: lastName,
                    firstName: firstName,
                    email: email,
                    phone_number:phone_number,
                    roleId: role,
                    location: location
               }
           })
    
        

        return res.status(200).json({
             message : "User Created Successfully",
             success:true
        })

    } catch (error) {
        console.log('error', error)
        return res.status(500).json({
            error: error,
            succes:false
        })
    } finally{
       prisma.$disconnect()
    }
}

/**************************************** LOGIN ****************************************************/

exports.login = async(req,res) => {
    try {
        const {password, email } = req.body
        if(!password || !email) {
            return res.status(404).json({
                success: false,
                message: "This Field Cannot be empty"
          })
        }
        const user = await prisma.user.findUnique({
            where :{
                email : email
            }
        })
        /* Check user existance */
        if(!user){
            return res.status(404).json({
                success: false,
                message: "Invalid Credentials '"
          })
        }
        /* Compare password */
        const passwordCompare = await bcrypt.compare(password, user.password)

        if(!passwordCompare){
            return res.status(404).json({
                success: false,
                message: "Invalid Credentials"
            })
        }
        /* Password success */
        const access_token = await jwt.sign({user},process.env.JWT_SECRET, { expiresIn: '1440m' })

         
         /* Send Email */
        //  sendEmail(email,token)

        return res.status(201).json({
            success: true,
            login:true,
            user,
            access_token
        })
    } catch (error) {
        res.status(500).json({
            error:error,
            succes:false,
            message:error.message
        })
    } finally {
      prisma.$disconnect();
    }
}
/** SEND TOKEN  */

/*****************************************CHANGE PASSWORD*********************************************/


exports.generatePasswordToken = async(req,res)=>{
    try {
        const {email} = req.body;
        if(!email) {
            return res.status(201).json({
                success: false,
                message: "This Field Cannot be empty"
          })
        }

        /* Check whether user exists */
        const existingUser = await prisma.user.findUnique({
            where: {
              email: email
            }
         });
        /* If user Exists, send a password */
         if(existingUser){
            const token = randToken.generate(10);
           /* Store reset token */
            const resetToken = await prisma.user.update({
                where: {
                    email: email
                },
                data: {
                    reset_token: token
                }
             });
            /* Send Mail */
            const response = await resetEmail(email,token);
            console.log('token', token)

            return res.status(201).json({
                message: "Reset Token Sent to your email",
                succes:true
            })
         }
        /********************EMAIL NOT SENT*************************** */
        return res.status(201).json({
            success:false,
            message: "Email Does not exist"
        })

    } catch (error) {
        console.log(error)
        res.status(404).json({
            error:error
        })
    } finally{
       prisma.$disconnect();
    }
}


exports.updatePassword = async(req,res)=>{
    try {
        const {reset_token,  password} = req.body;

        if(!reset_token || !password) {
            return res.status(201).json({
                success: false,
                message: "Missing Parameters"
          })
        }

        const user = await prisma.user.findFirst({
            where: {
                reset_token: reset_token
            }
          });

        if(!user){
            return res.status(201).json({
                success: false,
                message: "Token expired"
            })
        }

        const new_password = await hashPassword(password)

        /* Update password */
        const updatedUser = await prisma.user.update({
            where: {
                email:user.email
            },
            data: {
                password: new_password
            }
        });
        /* Clear token */
        const clearToken = await prisma.user.update({
            where:  {
               email:user.email
            },
            data:{
                reset_token:null
            }
        });

        res.status(201).json({
            success:true,
            message:"Password updated Successfully"
        })

    } catch (error) {
        console.log(error)
        res.status(404).json({
            error:error
        })
    }finally{
      
        prisma.$disconnect();
    }
}