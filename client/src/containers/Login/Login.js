import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import axios from 'axios';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = {
    // ...theme
    form: {
        textAlign: 'center',
    },
    pageTitle: {
        margin: '10px auto 10px auto'
    },
    textField: {
        margin: '10px auto 10px auto'
    },
    button: {
        marginTop: 20,
        position: 'relative'
    },
    customError: {
        color: 'red',
        fontSize: '0.8rem',
        marginTop: '10px'
    },
    progess: {
        position: 'absolute'
    }
};

class Login extends Component {
    state = {
        email: '',
        password: '',
        loading: false,
        token: null,
        userId: null,
        errors: {}
    }


    // componentDidMount() {
    //     const token = localStorage.getItem('token');
    //     const expiryDate = localStorage.getItem('expiryDate');
    //     console.log(token);
    //     console.log(expiryDate);
    //     if (!token || !expiryDate) {
    //         return;
    //     }
    //     if (new Date(expiryDate) <= new Date()) {
    //         this.logoutHandler();
    //         return;
    //     }
    //     const userId = localStorage.getItem('userId');
    //     const remainingMilliseconds =
    //     new Date(expiryDate).getTime() - new Date().getTime();
    //     this.setState({ token: token, userId: userId });
    //     this.setAutoLogout(remainingMilliseconds);
    // }

    // logoutHandler = () => {
    //     // this.setState({ token: null, userId: null });
    //     localStorage.removeItem('token');
    //     localStorage.removeItem('expiryDate');
    //     localStorage.removeItem('userId');
    //     console.log(`myprops ${this.props}`);
    //     window.location.href = "/";
    // };

    // setAutoLogout = milliseconds => {
    //     console.log("inside auto logout");
    //     console.log(milliseconds);
    //     setTimeout(() => {
    //     this.logoutHandler();
    //     }, milliseconds);
    // };

    handleSubmit = (event) => {
        event.preventDefault();
        this.setState({
            loading: true
        });
        const userData = {
            email: this.state.email,
            password: this.state.password,
        }
        axios.post('http://localhost:4000/login',userData)
            .then((res) => {
                console.log(this.props);
                this.setState({
                    loading: false,
                    token: res.data.token,
                    userId: res.data.userId
                });
                console.log("after setState");
                // console.log(this.state);
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('userId', res.data.userId);
                this.props.history.push("/homepage");
                // const remainingMilliseconds = 60*60*1000;
                // const expiryDate = new Date(
                //     new Date().getTime() + remainingMilliseconds
                //     );
                // localStorage.setItem('expiryDate',expiryDate.toISOString());
                // this.setAutoLogout(remainingMilliseconds);
            })
            .catch((err) => {
                console.log("inside catch")
                this.setState({
                    errors: err.response.data,
                    loading: false
                })
            })
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value 
        })
    }

    render() {
        const { classes } = this.props;
        const { errors, loading } = this.state;
        return (
            <Grid container className={classes.form}>
                <Grid item sm={4} xs={1}/>
                <Grid item sm={4} xs={10}>
                    <Typography variant="h2" className={classes.pageTitle}>
                        Login
                    </Typography>
                    <form noValidate onSubmit={this.handleSubmit}>
                        <TextField
                            id="email"
                            name="email"
                            type="email"
                            label="Email"
                            className={classes.textField}
                            helperText={errors.email}
                            error={errors.email ? true : false}
                            value={this.state.email}
                            onChange={this.handleChange}
                            fullWidth />
                        <TextField
                            id="password"
                            name="password"
                            type="password"
                            label="Password"
                            className={classes.textField}
                            helperText={errors.password}
                            error={errors.password ? true : false}
                            value={this.state.password}
                            onChange={this.handleChange}
                            fullWidth />
                        {errors.general && (
                        <Typography variant="body2" className={classes.customError}>
                            {errors.general}
                        </Typography>
                        )}
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            disabled={loading}>
                        Login
                        {loading && (
                            <CircularProgress size={30} className={classes.progress} />
                        )}
                        </Button>
                        <br />
                        <small>
                        Don't have an account ? sign up <Link to="/signup">here</Link>
                        </small>
                    </form>
                </Grid>
                <Grid item sm={4} xs={1}/>
            </Grid>
        )
    }
}

Login.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Login);
