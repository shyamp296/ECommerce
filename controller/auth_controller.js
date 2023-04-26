const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')
const User = require('../models/user_model')
const otpverification = require('../models/otpverification_model')
const multer = require('multer')
const path = require('path')

const SECRET_KEY = "Shyamdadhaniya"

// transporter for the mail
const trasporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {

        user: 'sdpatel320@gmail.com',
        pass: 'xkqmdiatqzbrzuue'
    }
})

// Get login
exports.getlogin = ((req, res, next) => {
    res.render('login', {
        pagetitle: 'Login'
    })
})

//Get registration 
exports.getregister = ((req, res, next) => {
    res.render('registration', {
        pagetitle: 'registration'
    })
})

//Post registration
exports.addUser = async (req, res, next) => {
    const Username = req.body.username
    const email = req.body.email
    const Password = req.body.psw
    const role = req.body.role
    // const image = req.file
    try {
        const existinguser = await User.findOne({ email: email })
        if (existinguser) {
            console.log('email is already exist');
            return res.redirect('/registration')
        }
        const existinguser3 = await User.findOne({ username: Username })
        if (existinguser3) {
            console.log('username is already exist');
            return res.redirect('/registration')
        }
        const hashedPassword = await bcrypt.hash(Password, 12)


        const user = new User({
            username: Username,
            email: email,
            Password: hashedPassword,
            role: role,
            // image : image.path
        })



        user.save().then((result) => {
            console.log(result);
            res.redirect('/sign-In')

        }).catch((err) => {
            console.log(err)
        });
    } catch (error) {
        console.log(error);
    }
}

//Post sign-In
exports.signIn = async (req, res, next) => {

    const email = req.body.email
    const Password = req.body.password


    try {

        const existingUser = await User.findOne({ email: email })
        if (!existingUser) {
            console.log('user not found');
            return res.redirect('/registration')
        }

        const matchpassword = await bcrypt.compare(Password, existingUser.Password)
        if (!matchpassword) {
            console.log('Password is incorrect');
            return res.redirect('/sign-In')
        }

        const otp = `${Math.floor(1000 + Math.random() * 9000)}`
        console.log(otp);
        const hashedotp = await bcrypt.hash(otp, 12)

        const Otpverification = await new otpverification({
            userId: existingUser._id,
            otp: hashedotp,
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000,
        })

        await Otpverification.save()
        trasporter.sendMail({
            to: existingUser.email,
            from: 'sdpatel320@gmail.com',
            subject: 'signup successful',
            html: `<h1>Your verification otp is ${otp}.</h1>`
        }).then(() => {
            res.render('otpverification', {
                pagetitle: 'Otp Verification',
                existingUser
            })
        })


    } catch (error) {

        console.log(error);
    }
}

//Post OTP verification
exports.postOtpVerification = async (req, res, next) => {
    try {
        const { id, otp } = req.body
        const existingUser = await User.findOne({ _id: id })

        const existingotp = await otpverification.findOne({ userId: id })
        if (existingotp) {

            if (existingotp.expiresAt < Date.now()) {
                console.log('otp has not found please request again');
                await otpverification.deleteMany({ userId: id })
                console.log('your otp has been expies please login again');
                res.redirect('/sign-In')

            } else {
                const validOtp = bcrypt.compare(otp, existingotp.otp)
                if (validOtp) {

                    const token = jwt.sign({ id: existingUser._id }, SECRET_KEY)
                    const role = existingUser.role
                    res.cookie('token', token, {
                        httpOnly: true,
                        maxAge: 40000000


                    })
                 
                    await existingotp.deleteOne({ userId: id })
                  
                   return res.redirect('/')
                    
                } else {

                    res.render('otpverification', {
                        pagetitle: 'Otp Verification',
                        existingUser
                    })
                }
            }
        } else {

            console.log('otp has not found please request again');
            res.redirect('/sign-In')
        }


    } catch (error) {

    }
}

// get signed out
exports.signOut = (req, res, next) => {

    res.clearCookie("token")
    res.redirect('/sign-in')
}

//get forget password
exports.getforgetPassword = (req, res, next) => {

    res.render('forgetPassword', {
        pagetitle: 'Forget-Password'
    })
}

//post forget password
exports.postforgetPasword = async (req, res, next) => {

    const email = req.body.email

    const user = await User.findOne({ email: email })
    if (user) {
        console.log(user);

        // const token = jwt.sign('ftoken', token , { 
        //     maxAge : 4000,
        //     http : true
        // })
        // res.render('resetPassword',{
        //     pagetitle : 'Reset-password',
        //     user
        // })

        trasporter.sendMail({
            to: email,
            from: 'sdpatel320@gmail.com',
            subject: 'signup successful',
            html: `<p>Click <a href=http://localhost:8000/reset-password/${user._id}>here</a> to reset your password</p>`
        }).then(ress => {
            // confirm('your reset link has been sent to your mail')
            res.redirect('/sign-In')
            console.log('sent');
        })
    } else {

        res.redirect('/forget-password')
    }

}

// get reset password
exports.getresetPassword = (req, res, next) => {
    const id = req.params.id
    res.render('resetPassword', {
        pagetitle: 'Reset-password',
        id
    })
}

// post reset password 
exports.postresetPassword = async (req, res, next) => {

    const id = req.body.id
    const password = req.body.psw

    const hashedPassword = await bcrypt.hash(password, 12)
    const user = await User.findOne({ _id: id })
    if (user) {
        user.Password = hashedPassword

        user.save().then(result => {
            res.redirect('/sign-In')
        })
    }

}


