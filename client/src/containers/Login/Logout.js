import React, { Component } from 'react'
import axios from 'axios';

class Logout extends Component {
    componentDidMount() {
        const token = localStorage.getItem('token');
        console.log(token);
        axios.get('http://localhost:4000/logout', {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })
            .then((res) => {               
                console.log("inside logout then");
                console.log(res);
                localStorage.removeItem('token');
                localStorage.removeItem('expiryDate');
                localStorage.removeItem('userId');
                this.props.history.replace("/");
            })
            .catch((err) => {
                console.log("not valid")
                // console.log(err);
                this.props.history.push("/");
                // console.log(err);
                // this.setState({
                    // errors: err.response.data
                    // loading: false
                // })
            })
    }

    render() {
        return (
            <div>  
            </div>
        )
    }
}

export default Logout;
