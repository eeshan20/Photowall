import React, { Component } from 'react'
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import CircularProgress from '@material-ui/core/CircularProgress';

import HomepagePost from './HomepagePost/HomepagePost';
import NavbarApp from '../../../components/UI/NavBar/NavbarApp';
import HomepagePostLikes from './HomepagePostLikes/HomepagePostLikes'
import classesHomepage from './HomePage.module.css';
import { Grid } from '@material-ui/core';


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


class HomePage extends Component {
    constructor(props){
        super(props);
        this.state = {
            postsData: null,
            loading: true,
            open: false,
            likesData: null,
            likesLoading: true
        }
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.openLikes = this.openLikes.bind(this);
    }

    componentDidMount() {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        console.log(token);
        console.log("inside did mount");
        axios.get(`http://localhost:4000/getfriendspost/${userId}`, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
        .then((result) => {
            console.log(result);
            this.setState({
                postsData: result.data,
                loading: false
            });
        })
        .catch((err) => {
            console.log("not valid")
            console.log(err);
            this.setState({
                // errors: err.response.data
                loading: false
            })
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
        const { classes } = this.props;
        // const { loading } = this.state;
        return (
            <div>
                <NavbarApp />
                <div className={classesHomepage.container}>
                    <Grid container /*className={classes.form}*/>
                        <Grid item sm={4} xs={1}/>
                        <Grid item sm={4} xs={10} className={classesHomepage.form}>
                            {/* <h1>{this.state.home}</h1> */}
                            {this.state.loading ? <CircularProgress size={70} className={classesHomepage.loading}/> : this.state.postsData ?
                                this.state.postsData.map((userPost) => {
                                    // if(post.posts === "no posts available") {
                                    //     return null;
                                    // }
                                    // else {
                                            return <HomepagePost key={userPost.post._id} liked={userPost.liked} postData={userPost.post} profileData={userPost.profileData} clicked={this.openLikes}/>
                                        // })
                                    // }
                                }) : <h1>No Posts from your Friends</h1>
                            }
                        </Grid>
                        <Grid item sm={4} xs={1}/>
                    </Grid>
                </div>
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
                                <div className={classesHomepage.backdrop}>
                                    <div className={classesHomepage.h2Div}>
                                        <h2 className={classesHomepage.h2}>Likes</h2>
                                    </div>
                                    <div className={classesHomepage.outerDiv}> 
                                    <div className={classesHomepage.likesArea}>
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

export default withStyles(styles)(HomePage);
