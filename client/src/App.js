import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import axios from 'axios';

import './App.css';
import Login from './containers/Login/Login';
import Signup from './containers/SignUp/Signup';
import HomePage from './containers/App/HomePage/HomePage';
import Post from './containers/App/UserPosts/UserPost/UserPost';
import Account from './containers/App/UserAccout/UserAccount';
import FriendsList from './containers/App/UserAccout/FriendsList/FriendsList';
import Logout from './containers/Login/Logout';
import Cloud from './containers/Cloud/Cloud';
import UserProfile from './containers/App/UserProfile/UserProfile';
import EditProfile from './containers/App/EditProfile/EditProfile';
import Notification from './containers/App/Notifications/Notifications';

const theme = createMuiTheme({
	palette: {
		primary: {
			light: '#33c9dc',
			main: '#00bcd4',
			dark: '#008394',
			contrastText: '#fff'
		},
		secondary: {
			light: '#ff6333',
			main: '#ff3d00',
			dark: '#b22a00',
			contrastText: '#fff'
		},
	}
	// typography: {
	//   useNextVariants: true
	// }
});

class App extends Component {

    componentDidMount() {
		setInterval(() => {
		  const token = localStorage.getItem('token');
		  if(token) {
			axios.get("http://localhost:4000/checktokenexpiry",{
			  headers: {
				Authorization: 'Bearer ' + token
			}
			})
			.then((res) => {
				console.log("res");
			  console.log(res);
			})
			.catch((err) => {
				console.log("error");
			  console.log(err);
			  if(err) {
				  console.log("error1")
				  console.log(this.props);
				localStorage.clear();
				window.location.href = "/";
				alert("Session Timed Out\nPlease Login Again")       
			  }
			})
		  }
		},120000);
	}

  render(){
    return (
		<MuiThemeProvider theme={theme}>  
			<div className="App">
				<Router>
					<Switch>
						<Route exact path="/" component={Login}/>
						<Route exact path="/signup" component={Signup}/>
						<Route exact path="/logout" component={Logout}/>
						<Route path="/cloud" component={Cloud} />
						<Route exact path="/homepage" component={HomePage}/>
						<Route exact path="/post/:id" component={Post} />
						<Route exact path="/notifications" component={Notification}/> 
						<Route exact path="/account/:id" component={Account}/>
						<Route exact path="/friends" component={FriendsList}/>
						<Route exact path="/profile/:id" component={UserProfile}/>
						<Route exact path="/edit-profile/:id" component={EditProfile}/>
						<Route exact path="/change-password/:id" component={EditProfile}/>
						<Route exact path="/delete-account/:id" component={EditProfile}/>
					</Switch>
				</Router>
			</div>
		</MuiThemeProvider>
    );
  }
}

export default App;
