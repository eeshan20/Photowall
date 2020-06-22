import React, { Component } from 'react'
import NavbarApp from '../components/UI/NavBar/NavbarApp';
import Classes from './Temp.module.css';
import axios from 'axios';
// import Login from './Login';
// import Signup from './Signup';

class HomePage extends Component {

    state = {
        temp: ''
    }
    componentDidMount() {
        const token = localStorage.getItem('token');
        console.log(token);
        axios.get('http://localhost:4000/temp',{
            headers: {
              Authorization: 'Bearer ' + token
            }
        })
            .then((res) => {
                console.log("inside then");
                console.log(res);
                this.setState({
                    temp: res.data.temp,
                });
                // this.props.history.push("/");
            })
            .catch((err) => {
                console.log("not valid");
                localStorage.clear();
                this.props.history.push("/");
                console.log(err);
                // this.setState({
                    // errors: err.response.data
                    // loading: false
                // })
            })
    }
    render() {
        return (
            <div>
                <NavbarApp/>
                <div  className={Classes.container}>
                <h1>Temp</h1>
                <h1>{this.state.temp}</h1>
                </div>
            </div>
        )
    }
}

export default HomePage;
