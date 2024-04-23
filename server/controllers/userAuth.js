const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/user.js')
const AES = require('crypto-js/aes')
const CryptoJS = require('crypto-js')
const dotenv = require('dotenv').config()


// When a user signs up, his password is first hashed with bcrypt, and then encrypted using AES, and finally stored on the db.
// So, when user logs in, in order to compare passowrds, you need to decrypt the stored password in the db (that gives the hashed password), and then compare the 2 passwords using bcrypt.compare

const signin = async (req, res) => {
    const {usernameoremail, password} = req.body
    try {
        //deletes blank spaces from start and end of strings
        let cleanUsernameoremail = usernameoremail.trim().toLowerCase()

        let existingUser = await User.findOne({email: cleanUsernameoremail})
        if (!existingUser) 
            existingUser = await User.findOne({username: cleanUsernameoremail})

        if(!existingUser) return res.status(404).json({message: "User doesn't exist"})

        username = existingUser.username

        let decryptedPwd = AES.decrypt(existingUser.password, process.env.AES_SECRET).toString(CryptoJS.enc.Utf8)

        let isPasswordCorrect = await bcrypt.compare(password, decryptedPwd)
        if(!isPasswordCorrect) return res.status(500).json({message: "Passowrd isn't correct"})

        //create jwt token
        const token = jwt.sign({email: existingUser.email, username: existingUser.username}, process.env.JWT_SECRET, {expiresIn: '2d'})

        res.status(200).json({token})

    } catch (error) {
        res.status(500).json({message: "Something went wrong"})
    }
}

const signup = async (req, res) => {
    const {username, email, password, repeatPassword} = req.body
    try {
        //.trim() deletes blank spaces from start and end of strings
        let cleanEmail = email.trim().toLowerCase()
        let cleanUsername = username.trim().toLowerCase()

        let existingEmail = await User.findOne({email: cleanEmail})
        if (existingEmail) 
            return res.status(500).json({message: "This email is already associated with an existing account"})

        let existingUsername = await User.findOne({username: cleanUsername})
        if (existingUsername) 
            return res.status(500).json({message: "Username already exists"})
        if(password !== repeatPassword) 
            return res.status(500).json({message: "Passwords don't match"})
        
        let hashedPwd = await bcrypt.hash(password, 12)

        let encryptedPwd = AES.encrypt(hashedPwd, process.env.AES_SECRET).toString()

        const newUser = await User.create({username: cleanUsername, email: cleanEmail, password: encryptedPwd})

        //create jwt token
        const token = jwt.sign({email: newUser.email, username: newUser.username}, process.env.JWT_SECRET, {expiresIn: '2d'})
        // console.log(token);
        
        res.status(200).json({token})

    } catch (error) {
        res.status(500).json({message: "Something went wrong"})
    }
}


const deleteAccount = async (req, res) => {
    try {
        let {username} = res.locals.jwtPayload
        const user = await User.findOneAndDelete({username})
        res.status(200).json({message: "User deleted successfully"})
    } catch (error) {
        res.status(500).json({message: "Something went wrong"})
    }
}

module.exports = {
    signin,
    signup,
    deleteAccount
}