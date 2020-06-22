const Notification = require('../models/notification');
const UserProfile = require('../models/userProfile');

exports.saveNotification = (req,res,next) => {
    const senderId = req.body.senderId;
    const recieverId = req.body.recieverId;
    let status = "pending";
    const notificationData = new Notification({
        senderID: senderId,
        status: status,
        recieverID: recieverId
    })
    notificationData.save()
        .then((result) => {
            console.log(result);
            return res.status(201).json(result);
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json(err);
        })
}


exports.getNotifications = (req,res,next) => {
    const recieverId = req.params.id;
    Notification.find({recieverID: recieverId}).sort({"createdAt": -1})
        .then((result) => {
            if(result.length) {
                console.log(result);
                console.log('inside find then')
                let resultArray = []; 
                result.forEach((rslt) => {
                    UserProfile.findOne({userID: rslt.senderID}).populate("userID")
                        .then((profileResult) => {
                            if(profileResult) {
                                console.log(`line16${profileResult.name}`)
                                // console.log(`line17${profileResult[0].image}`)
                                resultArray.push({notificationData: rslt, image: profileResult.image, username: profileResult.userID.username});
                            }
                            else {
                                return res.status(500).json("not found in userprofile");
                            }
                            console.log(resultArray);
                            if(resultArray.length === result.length)
                                return res.status(200).json(resultArray);

                            // console.log(`line41 ${resultArray}`)
                        })
                        .catch((err) => {
                            console.log(`line43\n${err}`);
                        })                        
                })
            }
            else {
                return res.status(500).json("no notifications");
            }
        })
    // .catch((err) => {
    //     console.log(`line63\n${err}`);
    //     return res.json(500).json("something went wrong");
    // })
}

exports.deleteRequest = (req, res, next) => {
    const senderId = req.body.senderId;
    const recieverId = req.body.recieverId;
    Notification.findOneAndDelete({senderID: senderId,recieverID: recieverId})
        .then((result) => {
            console.log(result);
            return res.status(200).json({status: 'deleted'});
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json("not deleted notification");
        })
}