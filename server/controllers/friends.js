const Friends = require('../models/friendlist');
const Notifications = require('../models/notification');
const UserProfile = require('../models/userProfile');

exports.addFriend = (req, res, next) => {
    const senderId = req.body.senderId;
    const recieverId = req.body.recieverId;
    // const data1 = {
    //     userID: senderId,
    //     friendsID: [recieverId]
    // }
    updateData1 = {
        $set: {senderID: senderId},
        $addToSet: {friendsID: recieverId}
    }

    Friends.findOneAndUpdate({userID: senderId}, updateData1,{new: true, upsert: true, useFindAndModify: false})
        .then((result) => {
            console.log(result);
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json("not saved in senderlist");
        })
    
    updateData2 = {
        $set: {senderID: recieverId},
        $addToSet: {friendsID: senderId}
    }
    
    Friends.findOneAndUpdate({userID: recieverId}, updateData2,{new: true, upsert: true,useFindAndModify: false})
    .then((result) => {
        console.log(result);
    })
    .catch((err) => {
        console.log(err);
        return res.status(500).json("not saved in reciever list");
    })

    Notifications.findOneAndUpdate({senderID: senderId, recieverID: recieverId},{status: 'accepted'},{new: true, useFindAndModify: false})
        .then((result) => {
            return res.status(201).json(result);
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json("not updated status");
        })
}

exports.displayFriends = (req,res,next)=> {
    const userId = req.params.userId;
    Friends.findOne({userID: userId})
        .then((result)=>{
            if(result) {
                console.log("line55");
                console.log(result);
                let resultArray = [];
                result.friendsID.forEach((id) => {
                    console.log("line59");
                    console.log(id);
                    UserProfile.findOne({userID: id})
                        .populate("userID")
                        .then((profileData)=>{
                            if(profileData) {
                                resultArray.push({friendName: profileData.userID.username, friendId: profileData.userID._id, image: profileData.image, status: "connected"});
                                console.log(resultArray);
                                if(result.friendsID.length === resultArray.length)
                                    return res.status(200).json(resultArray);
                            }
                            else {
                                console.log("profile not found");
                                return res.status(500).json("profile not found");
                            }
                    })
                })
                
            }
            else {
                console.log("no friends found");
                return res.status(500).json("no friends found");
            }
    })
}

exports.removeFriend = (req,res,next)=> {
    const userId = req.body.userId;
    const friendId = req.body.friendId;
    console.log(userId+" "+friendId);

    Friends.findOneAndUpdate({userID : userId}, {$pull: {friendsID : friendId}}, {useFindAndModify: false})
        .then((result)=>{
            console.log("inside first update");
            console.log(result);
            Friends.findOneAndUpdate({userID : friendId}, {$pull: {friendsID : userId}}, {useFindAndModify: false})
                .then((result2)=>{
                    console.log("inside second update");
                    console.log(result2);
                    Notifications.findOneAndDelete({senderID: friendId, recieverID : userId})
                        .then((result3)=>{
                            if(result3) {
                                console.log("inside first notification");
                                console.log(result3);
                                return res.status(201).json({status: "deleted"});
                            }
                            else {
                                console.log("inside first catch err");
                                // console.log(err);
                                Notifications.findOneAndDelete({senderID: userId, recieverID : friendId})
                                    .then((result4)=>{
                                        if(result4) {
                                            console.log("inside second notification");
                                            console.log(result4);
                                            return res.status(201).json({status: "deleted"});
                                        }
                                        else {
                                            console.log("inside 2nd catch");
                                            // console.log(err);
                                            return res.status(501).json("notification not found");
                                        }
                                    })
                                }
                        })
                })
                .catch((err)=>{
                    console.log("inside 3rd catch");
                    console.log(err);
                    return res.status(500).json("not found in the friendId");
                })
        })
        .catch((err)=>{
            console.log("inside 4th catch");
            console.log(err);
            return res.status(501).json("not found in the userId");
        })
}

