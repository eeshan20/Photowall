import React, { Component } from 'react'
import axios from 'axios';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import classes from './DeleteAccount.module.css';

class DeleteAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }
        this.delete = this.delete.bind(this);
    }

    delete = () => {
        this.setState({
            loading: true
        })

        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");
        const data = {
            userId: userId
        }
        axios.post('http://localhost:4000/delete-everything',data,{
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
        .then((result) => {
            console.log(result);
            localStorage.clear();
            window.location.href = "/signup";
        })
        .catch((err) => {
            console.log(err);
        })
    }

    render() {
        const { loading } = this.state;
        return (
            <article className={classes.article}>
                <div>
                    <div className={classes.headingdiv}>
                        <h1 className={classes.h1}>
                            Delete Account
                        </h1>
                    </div>
                    <div className={classes.textdiv}>
                        <div className={classes.text}>
                            Are you sure you want to delete your account because this lead to loss of all of your data including your Cloud Storage???
                        </div>
                        <Button variant="contained" color="primary" type="submit" disabled={loading} onClick={this.delete} className={classes.button}>
                            Delete
                            {loading && (
                                <CircularProgress size={30} className={classes.progress} />
                            )}    
                        </Button>
                    </div>
                </div>
            </article>
        )
    }
}

export default DeleteAccount;
