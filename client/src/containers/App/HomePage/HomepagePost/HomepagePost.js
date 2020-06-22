import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'

import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import CommentIcon from '@material-ui/icons/Comment';

import classes from './HomepagePost.module.css';
import avatar from '../../../../assets/images/avatar_for_photoApp.jpg';

class HomepagePost extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comment: '',
            saved: false,
            liked: this.props.liked,
            likeCount: this.props.postData.likeCount,
            commentCount: this.props.postData.commentCount,
            disabled: true
        }
        this.arrayBufferToBase64 = this.arrayBufferToBase64.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.submitLike = this.submitLike.bind(this);
        this.submitUnlike = this.submitUnLike.bind(this);
    }

    arrayBufferToBase64 = (buffer) => {
		var binary = '';
		var bytes = [].slice.call(new Uint8Array(buffer));
		bytes.forEach((byte) => binary += String.fromCharCode(byte));
		return window.btoa(binary);
    };

    submitLike = () => {
        const count = this.state.likeCount + 1;
        this.setState({
            liked: true,
            likeCount: count
        })

        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        const postId = this.props.postData._id;
        const data = {
            userId: userId,
            postId: postId
        }

        axios.post('http://localhost:4000/like',data,{
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
        .then((result) => {
            console.log(result);
            // const count = this.state.likeCount + 1;
            // this.setState({
            //     liked: true,
            //     likeCount: count
            // })
        })
        .catch((err) => {
            console.log(err);
            const count = this.state.likeCount - 1;
            this.setState({
                liked: false,
                likeCount: count
            })
        })
    }

    submitUnLike = () => {
        const count = this.state.likeCount - 1;
        this.setState({
            liked: false,
            likeCount: count
        })
     
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        const postId = this.props.postData._id;
        const data = {
            userId: userId,
            postId: postId
        }

        axios.post('http://localhost:4000/unlike',data,{
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
        .then((result) => {
            console.log(result);
            // const count = this.state.likeCount - 1;
            // this.setState({
            //     liked: false,
            //     likeCount: count
            // })
        })
        .catch((err) => {
            console.log(err);
            const count = this.state.likeCount + 1;
            this.setState({
                liked: true,
                likeCount: count
            })
        })
    }

    handleChange = (event) => {
        this.setState({
            comment: event.target.value,
            saved: false,
            disabled: false
        })
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        const postId = this.props.postData._id;
        const comment = this.state.comment;
        const data = {
            userId: userId,
            comment: comment,
            postId: postId
        }
        
        axios.post('http://localhost:4000/comment',data,{
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
        .then((result) => {
            console.log(result);
            const count = this.state.commentCount + 1;
            this.setState({
                saved: true,
                disabled: true,
                comment: '',
                commentCount: count
            })
        })
        .catch((err) => {
            console.log(err);
            const count = this.state.commentCount - 1;
            this.setState({
                disabled: true,
                comment: '',
                commentCount: count
            })
        })
    }

    render() {
        dayjs.extend(relativeTime);

        // console.log(this.state.likeCount);
        const { disabled } = this.state;
        let imageData;
        let postImageData;
        if(this.props.profileData.image.data[0]) {
            imageData = `data:image/*;base64,${this.arrayBufferToBase64(this.props.profileData.image.data)}`;
        }
        else {
            imageData = avatar;
        }

        if(this.props.postData.image.data[0]) {
            postImageData = `data:image/*;base64,${this.arrayBufferToBase64(this.props.postData.image.data)}`;
        }
        
        return (
            <div className={classes.mainDiv}>
                <article className={classes.article}>
                    <header className={classes.header}>
                        <div className={classes.profilePicture}>
                            <img src={imageData} alt="dp" className={classes.picture}/>
                        </div>
                        <div className={classes.username}>
                            <Link to={"/profile/"+this.props.postData.userID} className={classes.link}>
                                {this.props.profileData.username}
                            </Link>
                        </div>
                    </header>
                    <div className={classes.postImage}>
                        <img src={postImageData} alt="postImage" className={classes.image} />
                    </div>
                    <div className={classes.bottom}>
                        <section className={classes.icons}>
                            <span className={classes.likeSpan}>
                            {!this.state.liked ? 
                                <FavoriteBorderIcon  style={{fontSize: "1.9rem"}} onClick={this.submitLike} /> :
                                <FavoriteIcon  style={{fontSize: "1.9rem", color: 'rgb(237, 73, 86)'}} onClick={this.submitUnLike} /> 
                            }
                            </span>
                            {this.props.location.pathname.split('/')[1] === 'homepage' ? this.state.commentCount > 0 ?
                                (<span className={classes.commentSpan} >
                                    <Link to={"/post/" + this.props.postData._id} style={{textDecoration: 'none', color: '#262626'}}>
                                        <CommentIcon style={{fontSize: "1.9rem"}} />
                                    </Link>    
                                </span>) : null : null
                            }
                        </section>
                        {this.state.likeCount > 0 ?
                            <section className={classes.likedBy}>
                                <div className={classes.likedByDiv}>
                                    <div className={classes.likeLink} onClick={() => this.props.clicked(this.props.postData._id)}>
                                        Liked by {this.state.likeCount} individuals
                                    </div>
                                </div>
                            </section> : null
                        }
                        <div className={classes.captionAndCommentDiv}>
                            <div className={classes.captionDiv}>
                                <Link to={"/profile/"+this.props.postData.userID} className={classes.usernameLink} >
                                    {this.props.profileData.username}
                                </Link>
                                <span className={classes.caption}>&nbsp;&nbsp;{this.props.postData.caption}</span>                                
                            </div>
                            {/* {console.log(this.props.location.pathname)} */}
                            {this.props.location.pathname.split('/')[1] === 'homepage' ? this.state.commentCount > 0 ?
                                <div className={classes.commentsCount}>
                                    <Link to={"/post/" + this.props.postData._id} className={classes.commentLink}>
                                        View all {this.state.commentCount} comments
                                    </Link>
                                </div> : null : null
                            }
                        </div>
                        <div className={classes.timeDiv}>
                            <span className={classes.time}>
                                {dayjs(this.props.postData.createdAt).fromNow()}
                            </span>
                        </div>
                        <section className={classes.commentSection}>
                            <div className={classes.commentDiv}>
                                <form onSubmit={this.handleSubmit} className={classes.form}>
                                    <textarea placeholder="Add a comment…" onChange={this.handleChange} value={this.state.comment} className={classes.textarea} autoComplete="off" autoCorrect="off" />
                                    <button className={classes.button} disabled={disabled} type="submit">Post</button>
                                </form>
                            </div>
                        </section>
                    </div>
                    {this.state.saved ?
                        <p className={classes.p}>Comment Saved Successfuly</p> : null
                    }
                </article>
            </div>
        )
    }
}

export default withRouter(HomepagePost);
