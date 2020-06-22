import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';

import NavBarApp from '../../../components/UI/NavBar/NavbarApp';
import Notification from './Notification/Notification';
import classes from './Notifications.module.css';

class Notifications extends Component {
    constructor(props) {
        super(props);
        this.state = {
            notificationData: null,
            loading: true
        }
    }
    
    componentDidMount() {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        console.log('inside did mount')
        axios.get(`http://localhost:4000/notification/${userId}`,{
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
        .then((result) => {
            console.log(result);
            this.setState({
                loading: false,
                notificationData: result.data
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
                            this.state.notificationData ?
                            this.state.notificationData.map((data) => {
                                return <Notification key={data.notificationData._id} data={data}/>
                            }) : <p>No Notifications</p>
                        }
                    </Grid>
                    <Grid item sm={4} xs={1}/>
                </Grid>
            </div>
        )
    }
}

export default Notifications;
