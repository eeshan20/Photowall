const Post = require('../models/post');
const Userprofile = require('../models/userProfile');
const Friends = require('../models/friendlist');
const Likes = require('../models/likes');

exports.addPost = (req,res,next) => {
    const userId = req.body.userId;
    console.log(req.body);
    const image = req.files[0];

    let caption = '';
    if(req.body.caption) {
        caption = req.body.caption;
    }
    else {
        caption = '';
    }
    console.log(caption);
    const postData = new Post({
        userID: userId,
        image: image.buffer,
        caption: caption
    });

    postData.save()
        .then((result) => {
            console.log(result);
            return res.status(201).json(result);
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json("post not created");
        })
}

exports.getSinglePost = (req,res,next) => {
    const postId = req.params.postId;
    const userId = req.body.userId;
    Post.findById(postId)
        .then((result) => {
            console.log(result);
            Userprofile.findOne({userID: result.userID})
                .populate("userID")
                .then((profileData) => {
                    if(profileData) {
                        console.log(profileData);
                        console.log(profileData.userID._id);
                        console.log(postId);
                        Likes.findOne({userID: userId, postID: postId})
                            .then((liked) => {
                                console.log(liked);
                                if(liked) {
                                    console.log("liked");
                                    console.log(liked);
                                    return res.status(200).json({postData: result, liked: true, profileData: {username: profileData.userID.username, image: profileData.image}});
                                }
                                else {
                                    console.log("unliked");
                                    return res.status(200).json({postData: result, liked: false, profileData: {username: profileData.userID.username, image: profileData.image}});
                                }
                            })
                    }
                    else {
                        return res.status(500).json("profile not found");
                    }
                })
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json("not found");
        })
}

exports.getUsersPost = (req,res,next) => {
    const userId = req.params.userId;
    Post.find({userID: userId}).sort({createdAt: -1})
        .then((posts) => {
        if(posts.length) {
            console.log(posts);
            return res.status(200).json(posts);
        }
        else {
            return res.status(503).json('no posts available');
        }
    })
}

exports.getFriendsPost = (req,res,next) => {
    const userId = req.params.userId;
    let resultArray = [];
    let count = 0;
    let count1=0;
    Friends.findOne({userID: userId})
        .then((result) => {
            console.log(result);
            if(result) {
                result.friendsID.forEach((friendId) => {
                    console.log(friendId)
                    Post.find({userID: friendId})
                        .then((posts) => {
                            count = count + 1;
                            if(posts.length) {
                                Userprofile.findOne({userID: friendId})
                                    .populate("userID")
                                    .then((profileData) => {
                                        if(profileData) {
                                            let postCount = 0;
                                            posts.forEach((post) => {
                                                let like = false;
                                                Likes.findOne({userID : userId, postID: post._id})
                                                    .then((liked) => {
                                                        postCount = postCount + 1;
                                                        if(liked) {
                                                            like = true
                                                        }
                                                        else {
                                                            like = false;
                                                        }
                                                        console.log('inside push post and profile');
                                                        resultArray.push({post: post, liked: like, profileData: {username: profileData.userID.username, image: profileData.image}});
                                                        console.log(`friendslength:  ${result.friendsID.length}`);
                                                        console.log(`count:  ${count}`);
                                                        console.log(`postslength:  ${posts.length}`);
                                                        console.log(`postsCount:  ${postCount}`);
                                                        if(result.friendsID.length === count && posts.length === postCount) {
                                                            console.log("inside response if");
                                                            return res.status(200).json(resultArray);
                                                        }
                                                        else {
                                                            console.log("inside response else");
                                                        }
                                                    })
                                            })
                                        }
                                        else {
                                            return res.status(500).json("not found");
                                        }
                                    })
                            }
                            else {
                                console.log('inside no post available');
                                count1++;
                                if(count1 === result.friendsID.length)
                                {
                                    return res.status(500).json("no posts found");
                                }
                                // resultArray.push({post: "no posts available"})
                                // if(result.friendsID.length === resultArray.length) {
                                //     console.log("inside if response if");
                                //     return res.status(200).json(resultArray);
                                // }
                                // else {
                                //    return res.status(500)("inside else response else");
                                // }
                            }
                        })
               }) 
            }
            else {
                return res.status(500).json("no friends found");
            }
        })
}