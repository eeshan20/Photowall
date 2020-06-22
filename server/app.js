const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');

const isAuth = require('./middleware/is-auth');
const { signUp, logIn } = require('./controllers/authentication');
const { cupload, deleteImage, displayImage } = require('./controllers/uploadImages');
const { getUser, postProfile, searchUser } = require('./controllers/searchUser');
const { changePassword, deleteAccount, userAccount } = require('./controllers/Account');
const { getNotifications, saveNotification, deleteRequest } = require('./controllers/notification');
const { addFriend, displayFriends, removeFriend } = require('./controllers/friends');
const { addPost, getUsersPost, getSinglePost, getFriendsPost } = require('./controllers/post');
const { postLike, postUnlike, getLikes, postComment, getComments } = require('./controllers/likesAndComments');

const MONGODB_URL =
"mongodb://newuser:awasthy@cluster0-shard-00-00-ors3g.mongodb.net:27017,cluster0-shard-00-01-ors3g.mongodb.net:27017,cluster0-shard-00-02-ors3g.mongodb.net:27017/<dbname>?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority";

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use(multer({}).array('file',10));



app.post("/signup", signUp);
app.post("/login", logIn);
app.get("/logout",(req,res) => {
    res.set(200).json("logout");
    console.log("logout");
});
app.get("/checktokenexpiry",isAuth,(req,res) => {
    res.set(200).json("valid");
})

//cloud routes
app.get("/cloud/:userId", isAuth, displayImage);
app.post("/cloud", isAuth, cupload);
app.post("/cloud/delete/:imageId", isAuth,deleteImage);

//Photo App routes
app.post("/searchuser", isAuth,searchUser);
app.post("/getProfile/:userId", isAuth, getUser);
app.post("/profile/:userId", isAuth, postProfile);
app.get("/useraccount/:userId", isAuth, userAccount);
app.post("/change-password", isAuth,changePassword);
app.post("/delete-everything", isAuth,deleteAccount);
app.post("/notification", isAuth,saveNotification);
app.get("/notification/:id", isAuth,getNotifications);
app.post("/delete-request", isAuth,deleteRequest);
app.post("/add-friend", isAuth,addFriend);
app.get("/friends/:userId", isAuth,displayFriends);
app.post("/deletefriend", isAuth,removeFriend);
app.post("/addpost", isAuth,addPost);
app.post("/getpost/:postId", isAuth,getSinglePost);
app.get("/getuserposts/:userId", isAuth,getUsersPost);
app.get("/getfriendspost/:userId", isAuth,getFriendsPost);
app.post("/like", isAuth,postLike);
app.post("/unlike", isAuth,postUnlike);
app.get("/getlikes/:postId", isAuth,getLikes);
app.post("/comment", isAuth,postComment);
app.get("/getcomments/:postId", isAuth,getComments);

mongoose
.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
        console.log('connected');
        app.listen(4000);
    })
    .catch((err) => {
        console.log(err);
    })

