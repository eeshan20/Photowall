import React, { Component } from 'react'
import axios from 'axios';

import { withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Grid } from '@material-ui/core';

import NavbarApp from '../../../../components/UI/NavBar/NavbarApp';
import HomepagePost from '../../HomePage/HomepagePost/HomepagePost';
import HomepagePostLikes from '../../HomePage/HomepagePostLikes/HomepagePostLikes';
import PostComment from './PostComment/PostComment';
import classesPost from './UserPost.module.css';

const styles = (theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        width: '300px',
        height: '300px',
        borderRadius: '10px',
        outline: 'none',
        overFlow: 'hidden',
        boxShadow: theme.shadows[5],
    },
    likesLoader: {
        position: 'absolute',
        marginLeft: '10%',
        marginTop: '11%'
	}	
});


class UserPost extends Component {
    constructor(props) {
        super(props);
        this.state = {
            postData: null,
            loading: true,
            open: false,
            likesData: null,
            likesLoading: true,
            commentsData: null,
            commentsLoading: false
        }
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.openLikes = this.openLikes.bind(this);
        this.loadComment = this.loadComment.bind(this);
    }

    componentDidMount() {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem('token');
        console.log(this.props);
        const { id } = this.props.match.params;
        axios.post(`http://localhost:4000/getpost/${id}`, {userId: userId}, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
        .then((result) => {
            console.log(result);
            this.setState({
                postData: result.data,
                loading: false,
                commentsLoading: true
            });
            this.loadComment();
        })
        .catch((err) => {
            console.log("not valid")
            console.log(err);
        })
        
    }

    loadComment = () =>{
        // console.log(insi)
        const token = localStorage.getItem('token');
        const { id } = this.props.match.params;
        axios.get(`http://localhost:4000/getcomments/${id}`, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
        .then((result) => {
            console.log(result);
            this.setState({
                commentsData: result.data,
                commentsLoading: false
            });
        })
        .catch((err) => {
            // console.log("not valid")
            this.setState({
                commentsData: null,
                commentsLoading: false
            })
            console.log(err);
        })
    }

    openLikes = (postId) => {
        this.handleOpen();
        const token = localStorage.getItem('token')
        axios.get(`http://localhost:4000/getlikes/${postId}`,{
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
        .then((result) => {
            console.log(result);
            this.setState({
                likesData: result.data,
                likesLoading: false
            })
        })
        .catch((err) => {
            console.log(err);
            this.handleClose();
        })    
    }

    handleOpen = () => {
        console.log("handletoggle");
        const open = true;
        this.setState({open: open});
    };

    handleClose = () => {
        console.log("handleclose");
        this.setState({
            open: false,
            likesData: null
        });
    };

    render() {
        // const 
        const { classes } = this.props;
        console.log(this.state.commentsData);
        console.log(`comments loading ${this.state.commentsLoading}`);
        console.log(`loading ${this.state.loading}`);
        return (
            <div className={classesPost.form}>
                <NavbarApp />
                <Grid container /*className={classes.form}*/>
                    <Grid item sm={4} xs={1}/>
                    <Grid item sm={4} xs={10}>
                        <div>
                            {this.state.loading ? <CircularProgress size={70} className={classesPost.loading}/> :
                                <HomepagePost key={this.state.postData.postData._id} liked={this.state.postData.liked} postData={this.state.postData.postData} profileData={this.state.postData.profileData} clicked={this.openLikes}/>
                            }
                        </div>
                        <div className={classesPost.commentsDiv}>
                            {this.state.commentsData ?
                                (<div className={classesPost.countDiv}>
                                    <h2 className={classesPost.count}>{this.state.postData.postData.commentCount}&nbsp;Comments</h2>
                                </div>) : null
                            }
                            {(!this.state.commentsLoading && this.state.loading) ? null : 
                                (this.state.commentsLoading && !this.state.loading) ? <CircularProgress size={30} className={classesPost.commentsLoading}/> : 
                                    this.state.commentsData ? <div className={classesPost.commentsBox}>
                                        {this.state.commentsData.map((data) => {
                                            return <PostComment key={data.id} data={data} />
                                        })} </div>: <p className={classes.p}>No Comments Yet</p>
                            }
                        </div>
                    </Grid>
                    <Grid item sm={4} xs={1}/>
                </Grid>
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    className={classes.modal}
                    open={this.state.open}
                    onClose={this.handleClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                    timeout: 500,
                }} >
                    <Fade in={this.state.open}>
                        <div className={classes.paper}>
                            {this.state.likesLoading ? <CircularProgress size={30} className={classes.likesLoader}/> :
                                this.state.likesData ?
                                <div className={classesPost.backdrop}>
                                    <div className={classesPost.h2Div}>
                                        <h2 className={classesPost.h2}>Likes</h2>
                                    </div>
                                    <div className={classesPost.outerDiv}> 
                                    <div className={classesPost.likesArea}>
                                        {this.state.likesData ? this.state.likesData.map((data) => {
                                                console.log(data);
                                                return <HomepagePostLikes key={data.userId} likesData={data}/>
                                            }) : null
                                        }
                                    </div>
                                </div>
                            </div> : null
                            } 
                        </div>
                    </Fade>
                </Modal>
            </div>
        )
    }
}

export default withStyles(styles)(UserPost);
