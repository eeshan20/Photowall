import React, { Component } from 'react'
import { Link } from 'react-router-dom';

import classes from './SearchUser.module.css';
import avatar from '../../../assets/images/avatar_for_photoApp.jpg';

class SearchUser extends Component {
    constructor(props) {
        super(props);
        this.arrayBufferToBase64 = this.arrayBufferToBase64.bind(this);
    }
    
    arrayBufferToBase64 = (buffer) => {
		var binary = '';
		var bytes = [].slice.call(new Uint8Array(buffer));
		bytes.forEach((byte) => binary += String.fromCharCode(byte));
		return window.btoa(binary);
    };

    render() {
        let imageData;
        if(this.props.data.image.data[0]) {
            imageData = `data:image/*;base64,${this.arrayBufferToBase64(this.props.data.image.data)}`;
        }
        else {
            imageData = avatar;
        }
        return (
            <Link to={"/profile/" + this.props.data.userId} className={classes.link}>
                <div className={classes.user}>
                    <div className={classes.imageDiv}>
                        <img src={imageData} alt="userImage" className={classes.image}/>
                    </div>
                    <div className={classes.name}>
                        <span>{this.props.data.username}</span>
                    </div>
                </div>
            </Link>
        )
    }
}

export default SearchUser;
