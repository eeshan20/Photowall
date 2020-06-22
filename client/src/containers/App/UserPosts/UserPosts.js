import React, { Component } from 'react'
import { Link } from 'react-router-dom';

import classes from './UserPosts.module.css';

export class UserPosts extends Component {
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
        console.log(this.props)
        let imageData;
        if(this.props.data.image.data[0]) {
            imageData = `data:image/*;base64,${this.arrayBufferToBase64(this.props.data.image.data)}`;
        }

        return (
            <div className={classes.mainDiv}>
                <Link to={"/post/" + this.props.data._id} className={classes.link}>
                    <div className={classes.div}>
                        <img src={imageData} alt="userImage" className={classes.image}/>
                        {/* <p>hey there</p> */}
                    </div>
                </Link>
            </div>
        )
    }
}

export default UserPosts;
