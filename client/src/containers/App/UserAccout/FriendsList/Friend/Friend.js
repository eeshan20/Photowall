import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios';
import Button from '@material-ui/core/Button';

import classes from './Friend.module.css';
import avatar from '../../../../../assets/images/avatar_for_photoApp.jpg';


class Friend extends Component{
    constructor(props) {
        super(props);
        this.state = {
            friendData: this.props.data,
            loading: false
        }
        this.handleClick = this.handleClick.bind(this);
        this.arrayBufferToBase64 = this.arrayBufferToBase64.bind(this);
    }

    arrayBufferToBase64 = (buffer) => {
		var binary = '';
		var bytes = [].slice.call(new Uint8Array(buffer));
		bytes.forEach((byte) => binary += String.fromCharCode(byte));
		return window.btoa(binary);
    };

    handleClick= ()=>{
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        const data = {
            userId: userId,    
            friendId: this.props.data.friendId
        }           

        axios.post(`http://localhost:4000/deletefriend`,data,{
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
        .then((result) => {    
            this.setState({
                friendData: {
                  status: result.data.status  
                } 
            })
            console.log(result);
            console.log(this.state.friendData);
        })
        .catch((err) => {
            console.log(err);
        })
        console.log("inside handle click");
    }
    
    render() {
       
        let imageData;
        if(this.props.data.image.data[0]) {
            imageData = `data:image/*;base64,${this.arrayBufferToBase64(this.props.data.image.data)}`;
        }
        else {
            imageData = avatar;
        }

        return (
            <>
            {this.state.friendData.status === "connected" ?
                <div className={classes.div}>
                    <Link to={"/profile/" + this.props.data.friendId} className={classes.link}>
                        <div className={classes.user}>
                            <div className={classes.imageDiv}>
                                <img src={imageData} alt="userImage" className={classes.image}/>
                            </div>
                            <div className={classes.name}>
                                <span>{this.props.data.friendName}</span>
                            </div>
                        </div>
                    </Link>
                    <div className={classes.outerButtonDiv}>
                        <div className={classes.innerButtonDiv}>
                            <div className={classes.removeDiv}>
                                <Button variant="contained"  onClick={this.handleClick} className={classes.remove}>
                                    Unfriend
                                </Button>
                            </div>
                        </div>
                    </div>
                </div> : null
            }
            </>
        )
    }
}

export default Friend;