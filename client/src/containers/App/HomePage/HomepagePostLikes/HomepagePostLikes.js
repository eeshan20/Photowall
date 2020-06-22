import React, { Component } from 'react'
import { Link } from 'react-router-dom';

import classesLikes from './HomepagePostLikes.module.css';
import avatar from '../../../../assets/images/avatar_for_photoApp.jpg';

class HompagePostLikes extends Component {
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
        if(this.props.likesData.image.data[0]) {
            imageData = `data:image/*;base64,${this.arrayBufferToBase64(this.props.likesData.image.data)}`;
        }
        else {
            imageData = avatar;
        }

        return (
            <div>
                <div className={classesLikes.likedBy}>
                    <div className={classesLikes.imageOuterDiv}>
                        <div className={classesLikes.imageInnerDiv}>
                            <img src={imageData} className={classesLikes.image} alt="profileImage"/>
                        </div>
                    </div>
                    <div className={classesLikes.usernameOuterDiv}>
                        <div className={classesLikes.usernameInnerDiv}>
                            <Link to={"/profile/" + this.props.likesData.userId} className={classesLikes.link}>
                                {this.props.likesData.username}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default HompagePostLikes;
