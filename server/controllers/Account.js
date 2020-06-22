const bcrypt = require('bcryptjs');

const User = require('../models/user');
const UserProfile = require('../models/userProfile');
const Cloud = require('../models/cloud');
const Posts= require('../models/post');
const Notifications= require('../models/notification');
const Friends= require('../models/friendlist');
const Comments= require('../models/comments');
const Likes= require('../models/likes');
const { validateChangePassword } = require('../middleware/validator');

exports.userAccount = (req,res,next) => {
    const userId = req.params.userId;
    UserProfile.findOne({userID: userId})
        .populate("userID")
        .then((result) => {
            if(result) {
                console.log(`result\n${result}`)
                let data = {};
                data.image = result.image;
                data.name = result.name;
                data.website = result.website;
                data.bio = result.bio;
                data.username = result.userID.username;

                return res.status(200).json(data);
            }
            else {
                return res.status(500).json('user not found'); 
            }
        })
}

exports.changePassword = (req,res,next) => {
    userId = req.body.userId;
    password = req.body.oldPassword;
    newPassword = req.body.newPassword;
    const passwordData = {
        oldPassword: req.body.oldPassword,
        newPassword: req.body.newPassword,
        confirmPassword: req.body.confirmPassword
    }

    const { valid, errors } = validateChangePassword(passwordData);
    if (!valid) return res.status(400).json(errors);

    console.log(userId);
    User.findById(userId)
        .then((user) => {
            console.log('inside findby id');
            if(!user) {
                return res.status(400).json({user: 'user does not exit'});
            }
            else {
                loadUser = user;
                bcrypt.compare(password,user.password)
                    .then((match) => {
                        if(match) {
                            console.log('inside match');
                            return bcrypt
                                    .hash(newPassword,12)
                                        .then((hashedpswd) => {
                                            return User.findOneAndUpdate({_id: userId}, {password: hashedpswd}, {new: true, useFindAndModify: false})
                                        })
                                        .then((result) => {
                                            return res.status(200).json({general: "Password changed Succesfuly"});
                                        })
                                        .catch((err) => {
                                            console.log(`inside passwordnot change catch\n${err}`);
                                            return res.status(400).json({general: "Error in Changing Password"});
                                        })
                        }
                        else {
                            console.log('inside else match');
                            return res.status(401).json({oldPassword: 'wrong Password'});
                        }
                    })
                    .catch((err) => {
                        console.log(`inside bcrytp catch\n${err}`);
                        return res.status(500).json('something went wrong1');
                    })
                }
            })
            .catch((err) => {
                console.log(`inside findby id catch${err}`);
                return res.status(501).json('something went wrong2');
            })
}

exports.deleteAccount = (req,res,next) => {
    const userId = req.body.userId;
    Cloud.deleteMany({userID: userId})
    .then((result)=>{
        console.log(result);
        Friends.findOne({userID: userId})
        .then((result2)=>{
            console.log(result2); 
            if(result2){
                result2.friendsID.forEach((id) => {
                    Friends.findOneAndUpdate({userID : id}, {$pull: {friendsID : userId}}, {useFindAndModify: false})
                    .then((rslt)=>{ })
                    .catch((err)=>{ return res.status(500).json("Something went wrong") });
                });
            Friends.findOneAndDelete({userID: userId})
            .then((rslt)=>{ })
            .catch((err)=>{ return res.status(500).json("Something went wrong") });
            }
            Notifications.deleteMany({recieverID: userId})
            .then((result3)=>{
                console.log(result3);
                Notifications.deleteMany({senderID: userId})
                .then((result4)=>{
                    Posts.find({userID: userId})
                    .then((result5)=>{
                        console.log(result5);
                        if(result5){
                            result5.forEach((object)=>{
                                Likes.deleteMany({postID: object._id})
                                .then((reslt)=>{})
                                .catch((err)=>{
                                    console.log(err);
                                    return res.status(500).json("Something went wrong");
                                });
                                Comments.deleteMany({postID: object._id})
                                .then((reslt)=>{})
                                .catch((err)=>{
                                    console.log(err);
                                    return res.status(500).json("Something went wrong");
                                })
                            })
                        }
                        Likes.deleteMany({userID: userId})
                        .then((result6)=>{
                            console.log(result6);
                            Comments.deleteMany({userID: userId})
                            .then((result7)=>{
                                console.log(result7);
                                Posts.deleteMany({userID: userId})
                                .then((result9)=>{
                                    console.log(result9);
                                    UserProfile.findOneAndDelete({userID: userId})
                                    .then((result10) => {
                                        console.log(result10);
                                        return User.findByIdAndDelete(userId)
                                                .then((result11) => {
                                                    console.log("Account Deleted");
                                                    return res.status(200).json("Account Deleted");
                                                })
                                                .catch((err) => {
                                                    console.log(err);
                                                    return res.status(500).json("Something went wrong");
                                                })
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                        return res.status(500).json("Something went wrong");
                                    })
                                })
                                .catch((err)=>{
                                    console.log(err);
                                    return res.status(500).json("Something went wrong");
                                })
                            })
                            .catch((err)=>{
                                console.log(err);
                                return res.status(500).json("Something went wrong");
                            })
                       
                        })
                        .catch((err)=>{ 
                            console.log(err);
                            return res.status(500).json("Something went wrong"); 
                        })
                    })
                    .catch((err)=>{ 
                        console.log(err);
                        return res.status(500).json("Something went wrong"); 
                    })
                })
                .catch((err)=>{ 
                    console.log(err);
                    return res.status(500).json("Something went wrong"); 
                })
            })
            .catch((err)=>{ 
                console.log(err);
                return res.status(500).json("Something went wrong"); })   
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json("something went wrong");
        });
    })
    .catch((err) => {
        console.log(err);
        return res.status(500).json("something went wrong");
    });
   
}