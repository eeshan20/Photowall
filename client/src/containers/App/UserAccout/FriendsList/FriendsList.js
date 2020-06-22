import React, { Component } from 'react';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';

import NavBarApp from '../../../../components/UI/NavBar/NavbarApp';
import classes from './FriendsList.module.css';
import Friend from './Friend/Friend';

class FriendsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            friendData: null,
            loading: true
        }
    }
    
    componentDidMount() {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        console.log('inside did mount')
        axios.get(`http://localhost:4000/friends/${userId}`,{
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
        .then((result) => {
           // console.log(result);
            this.setState({
                loading: false,
                friendData: result.data
            })
        })
        .catch((err) => {
            console.log(err);
            this.setState({
                loading: false
            })
        })
    }

    render() {
        return (
            <div>
                <NavBarApp />
                <Grid container className={classes.container}>
                <Grid item sm={4} xs={1}/>
                    <Grid item sm={4} xs={10}>
                        {this.state.loading ?  <CircularProgress size={70} className={classes.loading}/> : 
                            this.state.friendData ?
                            this.state.friendData.map((data) => {
                                return <Friend key={data.friendId} data={data}/>
                            }) : <p>No Friends</p>
                        }
                    </Grid>
                    <Grid item sm={4} xs={1}/>
                </Grid>
            </div>
        )
    }
}

export default FriendsList;