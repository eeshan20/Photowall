const User = require('../models/user');
const UserProfile = require('../models/userProfile');
const Notification = require('../models/notification');

// const util = require('util');
const { reduceUserDetails } = require('../middleware/validator');

exports.searchUser = (req,res,next) => {
    const search = req.body.user;
    console.log(req.body);
    User.find({username: {$regex: search, $options: 'i'}})
        .then((result) => {
            if(result.length) {
                console.log(result);
                // return res.status(200).json(result);
                let resultArray = []; 
                result.forEach((rslt) => {
                    UserProfile.findOne({userID: rslt._id})
                        .then((profileResult) => {
                            if(profileResult) {
                                // console.log(`line16${profileResult}`)
                                // console.log(`line17${profileResult[0].image}`)
                                resultArray.push({userId: rslt._id, username: rslt.username, image: profileResult.image});    
                            }
                            else {
                                return res.status(500).json("not found in userprofile");
                            }
                            console.log("line27");
                            console.log(resultArray);
                            if(resultArray.length === result.length)
                                return res.status(200).json(resultArray);
                        })
                //         .catch((err) => {
                //             console.log(`line21\n${err}`);
                //         })
                })
            }
            else {
                return res.status(500).json("error");
            }
        })
        // .catch((err) => {
        //     console.log(err);
        // })
}

exports.getUser = (req,res,next) => {
    const userId = req.params.userId;
    const id = req.body.id;
    // console.log(userId);
    let data = {};
    UserProfile.findOne({userID: userId})
        .populate("userID")
        .then((result) => {
            if(result) {
                console.log(`result\n${result}`)
                data.profileData = result;
                data.userId = userId;
                Notification.findOne({senderID: userId,recieverID: id})
                    .then((result) => {
                        if(result){
                            console.log(result);
                            data.status = result.status;
                            data.sendBy = "reciever";
                            return res.status(200).json(data);
                        }
                        else {
                            Notification.findOne({senderID: id,recieverID: userId})
                                .then((result) => {
                                    if(result) {
                                        console.log(result);
                                        data.status = result.status;
                                        data.sendBy = "sender";
                                        return res.status(200).json(data);
                                    }
                                    else {
                                        data.status = "none";
                                        console.log(`data\n${data}`)
                                        return res.status(200).json(data);
                                    }
                                })
                        }
                        // return res.status(500).json("not deleted notification");
                    })
                }
                else {
                    return res.status(500).json('user not found');
                }
            // data.userId = userId;
            // data.image = result[0].image;
            // data.name = result[0].name;
            // data.website = result[0].website;
            // data.bio = result[0].bio;
            // data.username = result[0].userID.username;

            // return res.status(200).json(data);
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json('user not found');
        })
    }
    
exports.postProfile = (req,res,next) => {
    const userId = req.params.userId;
    let name = req.body.name;
    // const username = req.body.user;
    let file = null;
    if(req.files)
        file = req.files[0];
    // let user;
    // console.log(`line46\n${req}`)
    // // console.log(`post/${util.inspect(req.body,false,null)}`);
    // // if(username)
    //     user = username;
    //     console.log(user);
    let website = req.body.website;
    let bio = req.body.bio;
    let use = req.body.use;
    const data = {
        name: name,
        bio: bio,
        website: website
    }

    // const cleanData = reduceUserDetails(data);
    // name = cleanData.name;
    // bio = cleanData.bio;
    // website = cleanData.website;

    // console.log(req.files[0]);
    console.log(userId);
    UserProfile.findOne({userID: userId})
        .then((result) => {
            if(result) {
                console.log(`line: 51\n${result}`);
                let profile = {};
                if(!file) {
                    console.log("if then");
                    if(name)
                        profile.name = name;
                    else
                        profile.name = '';
                    if(website)
                        profile.website = website;
                    else
                        profile.website = '';
                    if(bio)
                        profile.bio = bio;
                    else
                        profile.bio = '';
                    if(userId)
                        profile.userID = userId;
                }
                else {
                    console.log("else then");
                    if(name)
                        profile.name = name;
                    else
                        profile.name = '';
                    if(website)
                        profile.website = website;
                    else
                        profile.website = '';
                    if(bio)
                        profile.bio = bio;
                    else
                        profile.bio = '';
                    profile.image = file.buffer;
                    if(userId)
                        profile.userID = userId;
                }
                return UserProfile.findOneAndUpdate({userID: userId}, profile, {new: true, useFindAndModify: false})
                    .then((result) => {
                        console.log(`line: 78\n${result}`);
                        // return User.findOneAndUpdate({_id: userId}, user, {useFindAndModify: false})
                        //     .then((result) => {
                        //         console.log(`line86\nusername updated\n${result}`)
                        //     })
                        //     .catch((err)=> {
                        //         console.log(err);
                        //     })
                        if(use === "profilePicture") {
                            return res.status(201).json(result.image);
                        }
                        else {
                            return res.status(201).json({general: "Data saved successfuly"});
                        }
                    })
                    .catch((err) => {
                        console.log(`line: 87\n${err}`);
                        return res.status(500).json("not updated");
                    })
            }
            else {
                return res.status(500).json("profile not found");
            }
        })
}