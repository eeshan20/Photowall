import React, { Component } from 'react';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

import classes from './EditProfile.module.css';
import classesPassword from './ChangePassword.module.css';
import avatar from '../../../assets/images/avatar_for_photoApp.jpg';


class ChangePassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newPassword: '',
            oldPassword: '',
            confirmPassword: '',
            loading: false,
            errors: {},
            succes: {}
        }
        this.arrayBufferToBase64 = this.arrayBufferToBase64.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.submitData = this.submitData.bind(this);
    }
    
    arrayBufferToBase64 = (buffer) => {
		var binary = '';
		var bytes = [].slice.call(new Uint8Array(buffer));
		bytes.forEach((byte) => binary += String.fromCharCode(byte));
		return window.btoa(binary);
    };

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
            succes: {}
        })
    }

    submitData = (event) => {
        event.preventDefault();
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        this.setState({
            loading: true
        });
        const userData = {
            userId: userId,
            oldPassword: this.state.oldPassword,
            newPassword: this.state.newPassword,
            confirmPassword: this.state.confirmPassword,
        }
        axios.post('http://localhost:4000/change-password',userData,{
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
        .then((result) => {
            console.log(result);
            this.setState({
                loading: false,
                newPassword: '',
                oldPassword: '',
                confirmPassword: '',
                errors: {},
                succes: result.data
            });
        })
        .catch((err) => {
            console.log(err);
            this.setState({
                errors: err.response.data,
                loading: false
            })
        })
    }
    
    render() {
        // console.log(this.props);
        let imageData;
        if(this.props.data){
            if(this.props.data.image.data[0]) {
                imageData = `data:image/*;base64,${this.arrayBufferToBase64(this.props.data.image.data)}`;
            }
            else {
                imageData = avatar;
            }
        }
        
        const { errors, loading, succes } = this.state;
        return (
            <article className={classes.article}>
                <div className={classes.imagediv}>
                    <div className={classes.imageBorder}>
                        <img src={imageData} alt="profilepicture" className={classes.image}/>
                    </div>
                    <div style={{height: '50px'}}>
                        <p style={{marginTop: '10px', fontSize: '30px'}} className={classes.username}>{this.props.data.username}</p>
                    </div>    
                </div>
                <form encType="multipart/form-data" onSubmit={this.submitData} className={classes.form}>
                    <div className={classes.div}>
                        <aside style={{marginTop: '17px'}} className={classes.aside}>
                            <label>Old Password</label>
                        </aside>
                        <div className={classes.rightOuterDiv}>
                            <div className={classes.rightInnerDiv}>
                                <TextField
                                    id="oldPassword"
                                    name="oldPassword"
                                    type="password"
                                    className={classesPassword.textField}
                                    helperText={errors.oldPassword}
                                    error={errors.oldPassword ? true : false}
                                    value={this.state.oldPassword}
                                    onChange={this.handleChange}
                                    variant="outlined"
                                    fullWidth />
                            </div>
                        </div>
                    </div>
                    <div className={classes.div}>
                        <aside style={{marginTop: '17px'}} className={classes.aside}>
                            <label>New Password</label>
                        </aside>
                        <div className={classes.rightOuterDiv}>
                            <div className={classes.rightInnerDiv}>
                                <TextField
                                    id="newPassword"
                                    name="newPassword"
                                    type="password"
                                    className={classesPassword.textField}
                                    helperText={errors.newPassword}
                                    error={errors.newPassword ? true : false}
                                    value={this.state.newPassword}
                                    onChange={this.handleChange}
                                    variant="outlined"                           
                                    fullWidth />
                            </div>
                        </div>
                    </div>
                    <div className={classes.div}>
                        <aside style={{marginTop: '5px'}} className={classes.aside}>
                            <label>Confirm New Password</label>
                        </aside>
                        <div className={classes.rightOuterDiv}>
                            <div className={classes.rightInnerDiv}>
                                <TextField
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    className={classesPassword.textField}
                                    helperText={errors.confirmPassword}
                                    error={errors.confirmPassword ? true : false}
                                    value={this.state.confirmPassword}
                                    onChange={this.handleChange}
                                    variant="outlined"
                                    fullWidth />
                            </div>
                        </div>
                    </div>
                    <div className={classes.div}>
                        <aside className={classes.aside}>
                            <label></label>
                        </aside>
                        <div className={classes.rightOuterDiv}>
                            <div className={classes.rightInnerDiv}>
                                <Button variant="contained" color="primary" type="submit" disabled={loading} className={classes.button}>
                                    Submit
                                    {loading && (
                                        <CircularProgress size={30} className={classesPassword.progress} />
                                    )}    
                                </Button>
                                {succes.general && (
                                    <Typography variant="body2" className={classesPassword.customError}>
                                        {succes.general}
                                    </Typography>
                                )}
                            </div>
                        </div>
                    </div>
                </form>
            </article>
        )
    }
}

export default ChangePassword;
