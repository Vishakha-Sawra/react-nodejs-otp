const service = require('./auth-service')
const response = require('../utils/responses')
const User = require('../models/user');
const generateOTP = require('../utils/otp-generator')
const { sendEmail } = require('../utils/nodemailer')

const Register = async (req, res) => {
    try {
        const { username, email, password } = req.body
        const otp = generateOTP()

        if (!username) {
            return response(res, 400, { message: `Username can't be empty` })
        } else if (!email || !password) {
            return response(res, 400, { message: `Email or password can't be empty` })
        }

        const queries = {
            username: username,
            email: email,
            password: password,
            otp_code: otp,
            otp_expiration: new Date(Date.now() + 10 * 60 * 1000) // OTP expires after 10 minutes
        };

        const newUser = new User(queries);

        const savedUser = await newUser.save();

        if (!savedUser) {
            return response(res, 500, { message: 'There was a problem registering the user.' });
        }

        // Send the OTP to the user's email
        sendEmail(email, 'Your OTP', `Your OTP is: ${otp}`);

        return response(res, 200, { message: 'User registered successfully', user: savedUser });
    } catch (error) {
        return response(res, 500, { message: error.message });
    }
}

const ResendOTP = async (req, res) => {
    const { email } = req.body;
    const otp_code = generateOTP();
    const otp_expiration = new Date(Date.now() + 10 * 60 * 1000);

    console.log(`Email: ${email}`); // Log the email

    try {
        const user = await User.findOneAndUpdate(
            { email: email },
            { otp_code: otp_code, otp_expiration: otp_expiration },
            { new: true }
        );

        console.log(`User: ${JSON.stringify(user)}`); // Log the user

        if (!user) { 
            return res.status(404).json({ message: 'User not found' });
        }

        // Send the OTP to the user's email
        sendEmail(email, 'Resent OTP', `Resent OTP is: ${otp_code}`);

        return res.status(200).json({ message: 'OTP resent', user });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const VerifyEmail = async (req, res)=>{
    try {
        console.log(req.body)
        const { email, otp_code } = req.body
        const emailExists = await service.EmailExists({ email })

        console.log('emailExists:', emailExists)

        if (emailExists.length <= 0) return response(res, 404, { message: 'User not found' })

        try {
            const user = await service.VerifyEmail({ email, otp_code })
            console.log('user:', user)
            if (!user) return response(res, 400, {message: 'user not found'})

            const result = user

            return response(res, 200, {
                message: 'Email is verified',
                result: result,
            })
        } catch (error) {
            console.log('VerifyEmail error:', error)
            if (error.message === 'OTP is expired') return response(res, 400, { message: 'OTP is expired' })
            if (error.message === 'Email has been verified') return response(res, 401, {message: 'Email has been verified'})
        }
    } catch (error) {
        console.log('Outer error:', error)
        return response(res, 500, error.message)
    }
} 


module.exports = { Register, ResendOTP, VerifyEmail}