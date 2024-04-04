const User = require("../models/user");

const Register = async ({ username, email, password }) => {
  try {
    const newUser = await User.create({
      username,
      email,
      password,
    });

    return newUser;
  } catch (error) {
    throw error;
  }
};


const ResendOTP = async ({ email, otp_code, otp_expiration }) => {
    try {
        const user = await User.findOneAndUpdate(
            { email: email },
            { otp_code: otp_code, otp_expiration: otp_expiration },
            { new: true }
        );

        if (!user) return null

        return user
    } catch (error) {
        throw error
    }
}

const EmailExists = async ({ email }) => {
  try {
    const data = await User.find({
      email: email,
    });

    return data;
  } catch (error) {
    throw error;
  }
};

const VerifyEmail = async ({email, otp_code})=>{
    try {
        const user = await User.findOne({
                email: email,
                otp_code: otp_code
        })

        if (!user) return null

        const OTPExpired = new Date() > new Date(user.otp_expiration)
        if (OTPExpired) throw new Error('OTP is expired')

        const alreadyVerified = user.is_verified === true
        if (alreadyVerified) throw new Error('Email has been verified')

        await User.updateOne(
            { email: email },
            { is_verified: true }
        )

        const updatedData = await User.findOne({
            email: email
        })

        return updatedData
    } catch (error) {
        throw error
    }
}

module.exports = { Register, ResendOTP, EmailExists, VerifyEmail};
