const Likes = require('../models/likes');
const Comments = require('../models/comments');
const Post = require('../models/post');
const Userprofile = require('../models/userProfile');

exports.postLike = (req,res,next) => {
    const userId = req.body.userId;
    const postId = req.body.postId;
    const like = new Likes({
        userID: userId,
        postID: postId
    })

    like.save()
        .then((result) => {
            console.log(result)
            Post.findByIdAndUpdate(postId,{$inc: {likeCount: 1}},{new: true ,useFindAndModify: false})
                .then((updated) => {
                    return res.status(200).json(updated);
                })
                .catch((err) => {
                    console.log(err);
                    return res.status(500).json("no post found");
                })
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json("not able to register like");
        })
}

exports.postUnlike = (req,res,next) => {
    const userId = req.body.userId;
    const postId = req.body.postId;
    
    Likes.findOneAndDelete({userID: userId, postID: postId})
        .then((result) => {
            console.log(result);
            if(result) {
                Post.findByIdAndUpdate(postId, {$inc: {likeCount: -1}}, {new: true, useFindAndModify: false})
                    .then((updated) => {
                        return res.status(200).json(updated);
                    })
                    .catch((err) => {
                        console.log(err);
                        return res.status(500).json("not able to unlike post");
                    })
            }
            else {
                return res.status(500).json("no like found");
            }
        })
}

exports.getLikes = (req,res,next) => {
    // const userId = req.body.userId;
    const postId = req.params.postId;

    let resultArray = [];
    Likes.find({postID: postId}).sort({likedAt: -1})
        .then((result) => {
            if(result.length) {
                result.forEach((rslt) => {
                    Userprofile.findOne({userID: rslt.userID})
                        .populate('userID')
                        .then((profileData) => {
                            if(profileData) {
                                resultArray.push({userId: rslt.userID, username: profileData.userID.username, image: profileData.image});
                            }
                            else {
                                return res.status(500).json("user profile not found");
                            }
                            if(result.length === resultArray.length)
                                return res.status(200).json(resultArray);
                        })
                })
            }
            else {
                return res.status(500).json("no likes found");
            }
        })
}

exports.postComment = (req,res,next) => {
    const userId = req.body.userId;
    const commentBody = req.body.comment;
    const postId = req.body.postId;

    const comment = new Comments({
        userID: userId,
        body: commentBody,
        postID: postId
    })

    comment.save()
        .then((result) => {
            console.log(result)
            Post.findByIdAndUpdate(postId,{$inc: {commentCount: 1}},{new: true ,useFindAndModify: false})
                .then((updated) => {
                    return res.status(200).json(updated);
                })
                .catch((err) => {
                    console.log(err);
                    return res.status(500).json("no post found");
                })
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json("not able to register comment");
        })
}

exports.getComments = (req,res,next) => {
    const postId = req.params.postId;

    let resultArray = [];
    Comments.find({postID: postId}).sort({commentedAt: -1})
        .then((result) => {
            if(result.length) {
                result.forEach((rslt) => {
                    Userprofile.findOne({userID: rslt.userID})
                        .populate('userID')
                        .then((profileData) => {
                            if(profileData) {
                                resultArray.push({userId: rslt.userID, id: rslt._id, commentBody: rslt.body, username: profileData.userID.username, image: profileData.image});
                            }
                            else {
                                return res.status(500).json("user profile not found");
                            }
                            if(result.length === resultArray.length)
                                return res.status(200).json(resultArray);
                        })
                })
            }
            else {
                return res.status(500).json("no comments found");
            }
        })
}