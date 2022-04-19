const jwt = require('jsonwebtoken')
const crypto = require('crypto');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { addRoleToUser } = require("../Helpers/roles");
const { setKeyRedis, getKeyRedis } = require("../Helpers/redis");
const { emailConfirmation, emailData } = require("../Helpers/email");
const {sendNewEmail} = require("../Jobs/queues")
const{BadRequest} = require("../errors/ApiError");



const register = async (req, res) => {
    try {
        const { email, plainPassword, firstName, lastName, middlename, username, mobile, confirmPassword } = req.body;
        existingEmail = await User.findOne({ email });
        if (existingEmail) {
            throw new BadRequest("User already have an account with this email")
            // return res.status(500).json("User already have an account with this email");
        }
        existingUsername = await User.findOne({ username });
        if (existingUsername) {
            throw new BadRequest("Username is already taken")
            // return res.status(500).json("Username is already taken");
        }
        if (plainPassword !== confirmPassword) {
            throw new BadRequest("password doe not match")
            // return res.status(500).json("password doe not match");
        }
        const password = await bcrypt.hash(plainPassword, 10);
        const emailToken = crypto.randomBytes(64).toString('hex');

        const user = await User.create({
            email, password, firstName, lastName, middlename, mobile, username,
        });

        const role = await addRoleToUser("User", user);
        if (!role){
            throw new BadRequest("Error assigning role to user" )
            // return res.status(500).json({ success: false, msg: "Error assigning role to user" });
        } 
        if (!user){
            throw new BadRequest("Error user not created")
            // return res.status(500).json({ success: false, msg: "Error user not created" });
        }
        // email token key-value  key = email-token value = email
        await setKeyRedis(`email-${emailToken}`, email, 172800);

        const html = `<h3>Hello,${user.username}</h3>
           <p>Thanks for signing up with farad, Click the link below to verify your email</p>
            <a href ="${req.protocol}://${req.headers.host}/api/v1/auth/verify-email?token=${emailToken}"> verify email </a>`

        sendNewEmail({
            email:email,
            subject:'Registeration Confirmation',
            html:html
        });
        res.status(201).json({ sucess: true, data: user });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error })
    }
}


const verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;
        // const key = await getKeyRedis()
        const email = await getKeyRedis("email", token);
        if (!email) 
        {
            return res.status(500).json({ success: false, msg: "Invalid token... Contact admin for a new token" })
        };
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(500).json("Invalid token");
        }
        user.isVerified = true;
        await user.save();
        res.status(200).json({ success: true, msg: "Email successfully verified" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
}



const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(500).json("Invalid email or password");
        }
        if (!user.isVerified) {
            return res.status(500).json("Account is not verified...");
        }
        if (user.isLocked) {
            return res.status(500).json("Account is locked... contact Admin...");
        }
        const decodedPasword = await bcrypt.compare(password, user.password);
        if (!decodedPasword) {
            return res.status(500).json("Invalid email or password");
        }
        const { _id, role, username } = user;
        const access_token = jwt.sign({ email, _id, role, username }, process.env.ACCESS_TOKEN, { expiresIn: '10d' });
        const refreshToken = jwt.sign({ email, _id, role, username }, process.env.REFRESH_TOKEN, { expiresIn: '10d' });
        // user.refreshToken = refreshToken;
        user.lastLogin = Date.now();
        await user.save();
        res.status(200).json({ success: true, data: { access_token, refresh_token: refreshToken } });
    } catch (error) {
        res.status(500).json({ success: false, error });
    }
}


const resetLink = async (req, res) => {
    try {
        const { email } = req.body
        const user = await User.findOne({ email });
        if (!user) {
           return res.status(500).json({ success: false, msg: "No user found with this email" });
        }

        const resetLink = crypto.randomBytes(64).toString('hex');
        await setKeyRedis(`resetLink-${emailToken}`, resetLink, 300);
        const html = `<h3>Hello,${user.username}</h3>
        <p>You have requested to reset your password, Click the link below to reset your password</p>
         <a href ="${req.protocol}://${req.headers.host}/api/v1/auth/verify-email?token=${emailToken}"> verify email </a>`

     const msg = emailData(user, 'Password Reset', html)
     emailConfirmation(msg);
        res.status(200).json({ success: true, msg: "Password reset link successfully sent to your email" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error });
    }
}


const resetPassword = async (req, res) => {
    try {
        const { token } = req.query;
        const email = await getKeyRedis("email", token);
        if (!email) return res.status(500).json({ success: false, msg: "Invalid token... Contact admin for a new token" });
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(500).json({ success: false, msg: "In valid reset link" });
        }
        const { plainPassword, confirmPassword } = req.body
        if (plainPassword !== confirmPassword) {
           return  res.status(500).json({ success: false, msg: "password does not match" });
        }
        const password = await bcrypt.hash(plainPassword, 10);
        user.password = password;
        await user.save();
        res.status(200).json({ success: true, msg: "Password reseted successfully" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error });
    }
}




module.exports = { register, verifyEmail, login, resetLink, resetPassword };