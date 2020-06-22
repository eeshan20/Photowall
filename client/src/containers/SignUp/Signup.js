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

class Signup extends Component {
    state = {
        email: '',
        password: '',
        username: '',
        confirmPassword: '',
        loading: false,
        errors: {}
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.setState({
            loading: true,
            errors: {}
        });
        const userData = {
            email: this.state.email,
            password: this.state.password,
            confirmPassword: this.state.confirmPassword,
            username: this.state.username
        }
        axios.post('http://localhost:4000/signup',userData)
            .then((res) => {
                this.setState({
                    loading: false,
                });
                this.props.history.push("/");
            })
            .catch((err) => {
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
        const { classes }= this.props;
        const { errors, loading } = this.state;
        // console.log(errors);
        return (
            <Grid container className={classes.form}>
                <Grid item sm={4} xs={1}/>
                <Grid item sm={4} xs={10}>
                    <Typography variant="h2" className={classes.pageTitle}>
                        SignUp
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
                        <TextField
                            id="confirmPassword"
                            name="confirmPassword"
                            type="Password"
                            label="ConfirmPassword"
                            className={classes.textField}
                            helperText={errors.confirmPassword}
                            error={errors.confirmPassword ? true : false}
                            value={this.state.confirmPassword}
                            onChange={this.handleChange}
                            fullWidth />
                        <TextField
                            id="username"
                            name="username"
                            type="username"
                            label="UserName"
                            className={classes.textField}
                            helperText={errors.username}
                            error={errors.username ? true : false}
                            value={this.state.username}
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
                        SignUp
                        {loading && (
                            <CircularProgress size={30} className={classes.progress} />
                        )}
                        </Button>
                        <br />
                        <small>
                        Already have an account ? login <Link to="/">here</Link>
                        </small>
                    </form>
                </Grid>
                <Grid item sm={4} xs={1}/>
            </Grid>
        )
    }
}

Signup.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Signup);
