const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const UserProfile = require('../models/userProfile');

const {
  validateSignupData,
  validateLoginData
  } = require("../middleware/validator");
//console.log('outside signup');


exports.signUp = (req, res, next) => {

    const newUser = {
        password: req.body.password,
        userName: req.body.username,
        confirmPassword: req.body.confirmPassword,
        email: req.body.email
    }

    const password = req.body.password;

    // console.log(req.body);
    const { valid, errors } = validateSignupData(newUser);
    if (!valid) return res.status(400).json(errors);
    
    // console.log('in signup');
    User.findOne({email: req.body.email})
        .then((doc) => {
            if(doc) {
                return res.status(400).json({email: "this email is already in use"});
            }
            else {
                User.findOne({username: req.body.username})
                    .then((doc) => {
                        if(doc) {
                            return res.status(400).json({username: "this username is already taken"});
                        }
                        else {
                            return bcrypt
                                .hash(password,12)
                                .then((hashedpswd) => {
                                    const user = new User({
                                        email: req.body.email,
                                        password: hashedpswd,
                                        username: req.body.username
                                     });
                                    //  console.log('before signup');
                                    return user.save();
                                })
                                .then((result) => {
                                    console.log(result);
                                    const profile = new UserProfile({
                                        userID: result._id
                                    })
                                    return profile.save();
                                    // res.status(201).json('User created');
                                })
                                .then((result) => {
                                    console.log(result);
                                    return res.status(201).json("user created");
                                })
                                .catch((err) => {
                                    console.log(err);
                                    return res.status(500).json('something went wrong');
                                })
                                .catch((err) => {
                                    console.log(err);
                                    return res.status(500).json('something went wrong');
                                })
                        }
                    })
            }
        })

}


exports.logIn = (req,res,next) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    }
    const { valid, errors } = validateLoginData(user);

    if (!valid) return res.status(400).json(errors);
    let loadUser;
    email = req.body.email;
    password = req.body.password;
    User.findOne({email: email})
        .then((user) => {
            if(!user) {
                return res.status(400).json({email: 'user does not exit'});
            }
            else {
                loadUser = user;
                bcrypt
                    .compare(password,user.password)
                    .then((match) => {
                        if(match) {
                            const token = jwt.sign(
                                {
                                    email: loadUser.email,
                                    userId: loadUser._id.toString()
                                },
                                'some12$234%^3randomstring4646^*^*@#446idontknowwhyiusedthis3Qe@#2#@#@',
                                { expiresIn: '1h' }
                            );
                            res.status(200).json({ token: token, userId: loadUser._id.toString() });
                        }
                        else {
                            return res.status(401).json({password: 'wrong credientials'});
                        }
                    })
                    .catch((err) => {
                        return res.status(500).json('something went wrong1');
                    })
            }
        })
        .catch((err) => {
            return res.status(500).json('something went wrong2');
        })
}
