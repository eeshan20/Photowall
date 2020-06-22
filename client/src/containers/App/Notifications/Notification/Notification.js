import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import axios from 'axios';

import classes from './Notification.module.css';
import avatar from '../../../../assets/images/avatar_for_photoApp.jpg';

class Notification extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            status: null
        })
        this.arrayBufferToBase64 = this.arrayBufferToBase64.bind(this); 
        this.confirmRequest = this.confirmRequest.bind(this);
        this.deleteRequest = this.deleteRequest.bind(this);
    }

    componentDidMount() {
        this.setState({
            status: this.props.data.notificationData.status
        })
    }

    arrayBufferToBase64 = (buffer) => {
		var binary = '';
		var bytes = [].slice.call(new Uint8Array(buffer));
		bytes.forEach((byte) => binary += String.fromCharCode(byte));
		return window.btoa(binary);
    };

    confirmRequest = () => {
        const token = localStorage.getItem('token');
        const data = {
            recieverId: this.props.data.notificationData.recieverID,
            senderId: this.props.data.notificationData.senderID
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
        const token = localStorage.getItem('token');
        const data = {
            recieverId: this.props.data.notificationData.recieverID,
            senderId: this.props.data.notificationData.senderID
        }

        axios.post('http://localhost:4000/delete-request',data,{
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
    
    render() {
        let imageData;
        if(this.props.data.image.data[0]) {
            imageData = `data:image/*;base64,${this.arrayBufferToBase64(this.props.data.image.data)}`;
        }
        else {
            imageData = avatar;
        }
        // console.log(this.props.data);
        return (
            <div>
            { this.state.status !== 'deleted' ? this.state.status === 'pending' ?
                <div className={classes.div}>
                    <Link to={"/profile/" + this.props.data.notificationData.senderID} className={classes.link}>
                        <div className={classes.user}>
                            <div className={classes.imageDiv}>
                                <img src={imageData} alt="userImage" className={classes.image}/>
                            </div>
                            <div className={classes.name}>
                                <span>{this.props.data.username}</span>
                            </div>
                        </div>
                    </Link>
                    <div className={classes.outerButtonDiv}>
                        <div className={classes.innerButtonDiv}>
                            <div className={classes.confirmDiv}>
                                <Button variant="contained" color="primary" onClick={this.confirmRequest} className={classes.confirm}>
                                    Confirm
                                </Button>
                            </div>
                            <div className={classes.deleteDiv}>
                                <Button variant="contained" onClick={this.deleteRequest} className={classes.delete}>
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </div>
                </div> :
                <div className={classes.div}>
                    <Link to={"/profile/" + this.props.data.notificationData.senderID} className={classes.link}>
                        <div className={classes.user}>
                            <div className={classes.imageDiv}>
                                <img src={imageData} alt="userImage" className={classes.image}/>
                            </div>
                            <div className={classes.name}>
                                <span>{`${this.props.data.username} and you are connected`}</span>
                            </div>
                        </div>
                    </Link>
                </div> : null 
            }
        </div>
        )
    }
}

export default Notification;
