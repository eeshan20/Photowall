import React, { Component } from 'react'
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import classesContainer from './UserProfile.module.css';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import NavBarApp from '../../../components/UI/NavBar/NavbarApp';
import UserPosts from '../UserPosts/UserPosts';
import avatar from '../../../assets/images/avatar_for_photoApp.jpg';

class UserProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userData: null,
            status: null,
            sendBy: null,
            incomingData: false,
            posts: null,
            postLoading: true
        }
        this.arrayBufferToBase64 = this.arrayBufferToBase64.bind(this);
        this.sendRequest = this.sendRequest.bind(this);
        this.confirmRequest = this.confirmRequest.bind(this);
        this.deleteRequest = this.deleteRequest.bind(this);
        this.loadPost = this.loadPost.bind(this);
    }

    componentDidMount() {
        const userId = this.props.match.params.id;
        const id = localStorage.getItem("userId");
        const token = localStorage.getItem("token");
        console.log("inside did mount");
        axios.post(`http://localhost:4000/getProfile/${userId}`,{id: id},{
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
        .then((result) => {
            console.log(result);
            this.setState({
                userData: result.data,
                status: result.data.status,
                sendBy: result.data.sendBy
            })
            if(result.data.status === "accepted")
                    this.loadPost();
            // console.log(result);
        })
        .catch((err) => {
            console.log(err);
        })
    }

    loadPost = () => {
        const userId = this.props.match.params.id;
        const token = localStorage.getItem("token");
        axios.get(`http://localhost:4000/getuserposts/${userId}`,{
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
        .then((posts) => {
            console.log(posts);
            this.setState({
                posts: posts.data,
                postLoading: false
            })
            // console.log(this.state.posts);
        })
        .catch((err) => {
            console.log(err);
            this.setState({
                posts: "No Posts yet",
                postLoading: false
            })
        })
    }

    componentDidUpdate(prevProps) {
        if(prevProps.match.params.id !== this.props.match.params.id) {
            const userId = this.props.match.params.id;
            const id = localStorage.getItem("userId");
            const token = localStorage.getItem("token");
            console.log("inside did update");
            axios.post(`http://localhost:4000/getProfile/${userId}`,{id: id},{
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })
            .then((result) => {
                console.log(result);
                this.setState({
                    userData: result.data,
                    status: result.data.status,
                    sendBy: result.data.sendBy
                })
                if(result.data.status === "accepted")
                    this.loadPost();
                // console.log(result);
            })
            .catch((err) => {
                console.log(err);
            })
        }
    }

    arrayBufferToBase64 = (buffer) => {
		var binary = '';
		var bytes = [].slice.call(new Uint8Array(buffer));
		bytes.forEach((byte) => binary += String.fromCharCode(byte));
		return window.btoa(binary);
	};

    sendRequest = () => {
        const senderId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        const recieverId = this.state.userData.userId;
        const notificationData = {
            senderId: senderId,
            recieverId: recieverId
        }

        axios.post(`http://localhost:4000/notification`, notificationData,{
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
        .then((result) => {
            console.log(result);
            this.setState({
                status: result.data.status,
                sendBy: 'sender'
            })
        })
        .catch((err) => {
            console.log(err);
        })

    }

    confirmRequest = () => {
        const recieverId = localStorage.getItem('userId')
        const token = localStorage.getItem('token');
        const data = {
            recieverId: recieverId,
            senderId: this.state.userData.userId
        }

        axios.post('http://localhost:4000/add-friend',data,{
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
        .then((result) => {
            console.log(result);
            this.setState({
                status: result.data.status
            })
        })
        .catch((err) => {
            console.log(err);
        })
    }

    deleteRequest = () => {
        const recieverId = localStorage.getItem('userId')
        const token = localStorage.getItem('token');
        const data = {
            recieverId: recieverId,
            senderId: this.state.userData.userId
        }

        axios.post('http://localhost:4000/delete-request',data,{
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
        .then((result) => {
            console.log(result);
            this.setState({
                status: 'none'
            })
        })
        .catch((err) => {
            console.log(err);
        })
    }

    render() {
        console.log(this.state.userData);
        let imageData;
        if(this.state.userData){
            if(this.state.userData.profileData.image.data[0]) {
                imageData = `data:image/*;base64,${this.arrayBufferToBase64(this.state.userData.profileData.image.data)}`;
            }
            else {
                imageData = avatar;
            }
        }
        // let disabled = this.state.status === 'pending' ? true : false;
        // console.log(this.props.match.params.id);
        return (
            <>
                <NavBarApp />
                <div className={classesContainer.form}>
                    {!this.state.userData ? <CircularProgress size={70} className={classesContainer.loading}/> : 
                        <Grid container /*className={classes.form}*/>
                            <Grid item sm={3} xs={1}/>
                            <Grid item sm={6} xs={10} className={classesContainer.grid}>
                                <header className={classesContainer.header}>
                                    <div className={classesContainer.leftSide}>
                                        <div className={classesContainer.box}>
                                            <img src={imageData} alt="images" className={classesContainer.image}/>
                                        </div>
                                    </div>
                                    <section>
                                        <div>
                                            <h2 className={classesContainer.username}>{this.state.userData.profileData.userID.username}</h2>
                                        </div>
                                        <div style={{marginTop: "15px"}}>
                                            <p className={classesContainer.name}>{this.state.userData.profileData.name}</p>
                                            <p className={classesContainer.text}>{this.state.userData.profileData.bio}</p>
                                            <a href={this.state.userData.profileData.website} target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none'}}><p className={classesContainer.link}>{this.state.userData.profileData.website.split('//')[1]}</p></a>
                                        </div>
                                        <div>
                                            {this.state.status === 'none' ?
                                                <Button variant="contained" color="primary" onClick={this.sendRequest}>
                                                    Connect
                                                </Button> : 
                                                this.state.status === 'accepted' ?
                                                    <Button variant="contained" disabled>
                                                        Connected
                                                    </Button> :
                                                    (this.state.status === 'pending' && this.state.sendBy === 'sender') ?
                                                        <Button variant="contained" disabled>
                                                            Pending...
                                                        </Button> :
                                                        <div>
                                                            <Button variant="contained" color="primary" onClick={this.confirmRequest} /*className={classes.confirm}*/>
                                                                Confirm
                                                            </Button>
                                                            <Button variant="contained" onClick={this.deleteRequest} style={{marginLeft: '10px'}}/*className={classes.delete}*/>
                                                                Delete
                                                            </Button>
                                                        </div>    
                                            }
                                        </div>
                                    </section>
                                </header>
                                <div className={classesContainer.postBox}>
                                    <p>Posts</p>
                                </div>
                                <div className={classesContainer.postDiv}>
                                    {this.state.status === "accepted" ? 
                                        this.state.postLoading ? <CircularProgress size={50} className={classesContainer.postLoader} /> :
                                        this.state.posts === "No Posts yet" ? <p>No Posts Yet!!!</p> :
                                            this.state.posts.map((post) => {
                                                return <UserPosts key={post._id} data={post}/>
                                            }):
                                            <h1 className={classesContainer.h1}>This Account is Private</h1> 
                                    }
                                </div>
                            </Grid>
                            <Grid item sm={3} xs={1}/>
                        </Grid>
                    }
                </div>
            </>
        )
    }
}

export default UserProfile;
