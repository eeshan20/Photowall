import React, { Component } from 'react'
import { Link } from 'react-router-dom';

import classes from './PostComment.module.css';
import avatar from '../../../../../assets/images/avatar_for_photoApp.jpg';

class PostComment extends Component {
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
        console.log(this.props);
        if(this.props.data.image.data[0]) {
            imageData = `data:image/*;base64,${this.arrayBufferToBase64(this.props.data.image.data)}`;
        }
        else {
            imageData = avatar;
        }

        return (
            <div>
                <div className={classes.likedBy}>
                    <div className={classes.imageOuterDiv}>
                        <div className={classes.imageInnerDiv}>
                            <img src={imageData} className={classes.image} alt="profileImage"/>
                        </div>
                    </div>
                    <div className={classes.usernameOuterDiv}>
                        <div className={classes.usernameInnerDiv}>
                            <Link to={"/profile/" + this.props.data.userId} className={classes.link}>
                                {this.props.data.username}:&nbsp;&nbsp;
                            </Link>
                        </div>
                        <div className={classes.commentDiv}>
                            <p className={classes.p}>{this.props.data.commentBody}</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default PostComment;
