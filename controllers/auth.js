const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const User = require('../models/user')
const Doctor = require("../models/doctor")

exports.signupUser = async (req,permission, res, next) => {
    
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const name = firstName+ ' ' + lastName;
    const mobilePhone = req.body.mobilePhone;
    const gender = req.body.gender;
    const email = req.body.email;
    const password = req.body.password;
    const birthDate = req.body.birthDate;
    const address = req.body.address;
    const city = req.body.city;
    
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error('Validation failed.')
            error.statusCode = 422
            error.data = errors.array();
            throw error;
        }
        const hashedPW = await bcrypt.hash(password, 12);

        const user = new User({
            name: name,
            mobilePhone: mobilePhone,
            gender: gender,
            email: email,
            password: hashedPW,
            birthDate: birthDate,
            address: address,
            city: city,
            permission: permission
        })
        const result = await user.save();
        res.status(201).json({ message: 'User created!', userId: result._id });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }       
}

exports.signupDoctor = async (req, permission, res, next) => {
   
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const name = firstName + ' ' + lastName;
    const mobilePhone = req.body.mobilePhone;
    const gender = req.body.gender;
    const email = req.body.email;
    const password = req.body.password;
    const master = req.body.master;
    const birthDate = req.body.birthDate;
    const address = req.body.address;
    const city = req.body.city;
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error('Validation failed.')
            error.statusCode = 422
            error.data = errors.array();
            throw error;
        }
        const hashedPW = await bcrypt.hash(password, 12);

        const user = new Doctor({
            name: name,
            mobilePhone: mobilePhone,
            gender: gender,
            email: email,
            password: hashedPW,
            master: master,
            birthDate: birthDate,
            address: address,
            city: city,
            permission: permission
        });
        const result = await user.save();
        res.status(201).json({ message: 'Doctor created!', userId: result._id });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}
// exports.signupDoctor = (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         const error = new Error('Validation failed.')
//         error.statusCode = 422
//         error.data = errors.array();
//         throw error;
//     }
//     const firstName = req.body.firstName;
//     const lastName = req.body.lastName;
//     const name = firstName + ' ' + lastName;
//     const mobilePhone = req.body.mobilePhone;
//     const gender = req.body.gender;
//     const email = req.body.email;
//     const password = req.body.password;
//     let permission = User.permission;
//     bcrypt.hash(password, 12)
//         .then(hashedPW => {
//             const user = new User({
//                 name: name,
//                 mobilePhone: mobilePhone,
//                 gender: gender,
//                 email: email,
//                 password: hashedPW,
//                 permission: permission
//             })
//             return user.save();
//         })
//         .then(result => {
//             res.status(201).json({ message: 'User created!', userId: result._id });
//         })
//         .catch(err => {
//             if (!err.statusCode) {
//                 err.statusCode = 500;
//             }
//             next(err);
//         })
// }


//  exports.authPage =  (permissions) => {
//     return(req ,res , next) => {
//         const userRole = req.body.permission
//         if(permissions.includes(userRole)) {
//             next()
//         } else {
//             const error = new Error('You dont have permission!')
//             error.statusCode = 401;
//             throw error;
//         }
//     }
// }

exports.login = async (req, permission ,res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    try {
        const user = await User.findOne({ email: email })
        if (!user) {
            const error = new Error('A user with this email could not be found.');
            error.statusCode = 401;
            throw error;
        }
        //==
        if (user.permission !== permission ){
            return res.json({ message: "You are not alowed to this gate" });
        }
        loadedUser = user;
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            const error = new Error('incorrect password!')
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign(
            {
                email: loadedUser.email,
                userId: loadedUser._id.toString()
            },
            'mysupersecret',
            { expiresIn: "1d" }
        );
        res.status(200).json({ token: token, userId: loadedUser._id.toString() })
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
    
}