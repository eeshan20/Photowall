import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import NavBarApp from '../../../components/UI/NavBar/NavbarApp';
import classes from './EditProfile.module.css';
import ChangePassword from './ChangePassword';
import DeleteAccount from './DeleteAccount';
import avatar from '../../../assets/images/avatar_for_photoApp.jpg';


export class EditProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userData: null,
            disabled: true,
            succes: {},
            loading: false
            // selectedFile: null
        }
        this.arrayBufferToBase64 = this.arrayBufferToBase64.bind(this);
        this.inputReference = React.createRef();
        this.fileUploadAction = this.fileUploadAction.bind(this);
        this.submitImage = this.submitImage.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.submitData = this.submitData.bind(this);
    }

    componentDidMount() {
        const userId = this.props.match.params.id;
        const token = localStorage.getItem("token");
        console.log("inside did mount");
        axios.get(`http://localhost:4000/useraccount/${userId}`,{
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
        .then((result) => {
            console.log(result);
            this.setState({
                userData: result.data
            })
            // console.log(this.state.userData);
        })
        .catch((err) => {
            console.log(err);
        })
    }

    componentDidUpdate() {
        console.log("didUpdate");
    }

    arrayBufferToBase64 = (buffer) => {
		var binary = '';
		var bytes = [].slice.call(new Uint8Array(buffer));
		bytes.forEach((byte) => binary += String.fromCharCode(byte));
		return window.btoa(binary);
    };
    
    fileUploadAction = () => {
        this.inputReference.current.click();
    }

    submitImage = (event) => {
        console.log(event.target.files);
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");
        
        let data = new FormData();
        
        for(const key of Object.keys(event.target.files)) {
            data.append('file',event.target.files[key]);
        }
        data.append('use','profilePicture')

        axios.post(`http://localhost:4000/profile/${userId}`,data,{
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
        .then((result) => {
            console.log(result);
            const updatedData = { ...this.state.userData };
            updatedData.image = result.data;
            this.setState({
                userData: updatedData 
            })
        })
        .catch((err) => {
            console.log(err);
        })
        console.log("in submit");
    }

    handleChange = (event) => {
        const updatedData = {...this.state.userData};
        // console.log(updatedData)
        // console.log(event.target.name + event.target.value)
        const temp = event.target.name;
        updatedData[temp] = event.target.value
        this.setState({
            userData: updatedData,
            disabled: false,
            succes: {}
        })
    }

    submitData = (event) => {
        event.preventDefault();
        this.setState({
            disabled: true,
            loading: true
        })
        if(!this.state.disabled) {
            const userId = localStorage.getItem("userId");
            const token = localStorage.getItem("token");
    
            // console.log(event.target.value);
            const userData = {
                name: this.state.userData.name,
                // user: this.state.userData.username,
                website: this.state.userData.website,
                bio: this.state.userData.bio
            }
            
            // let data = new FormData();
            // for(const key of Object.keys(this.state.userData)) {
            //     console.log("in")
            //     data.append(key,this.state.userData[key]);
            //     console.log(key,this.state.userData[key]);
            // }
            // data.append('name', this.state.userData.name)
            // data.append('username', this.state.userData.username)
            // data.append('website', this.state.userData.website)
            // data.append('bio', this.state.userData.bio)
            // JSON.stringify(userData)

            // console.log({...data});
            // console.log(JSON.stringify(userData));
            axios.post(`http://localhost:4000/profile/${userId}`, userData,{
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })
            .then((result) => {
                console.log(result);
                // const updatedData = { ...this.state.userData };
                // updatedData = result.data;
                this.setState({
                    succes: result.data,
                    loading: false
                })
            })
            .catch((err) => {
                console.log(err);
            })
        }
    }

    render() {
        console.log(this.state.userData);
        const { loading, succes } = this.state;
        let imageData;
        if(this.state.userData){
            if(this.state.userData.image.data[0]) {
                imageData = `data:image/*;base64,${this.arrayBufferToBase64(this.state.userData.image.data)}`;
            }
            else {
                imageData = avatar;
            }
        }
        const userId = localStorage.getItem("userId");
        var editLink = this.props.match.path.split("/")[1] === "edit-profile" ? classes.activeLink : classes.link;
        var changeLink = this.props.match.path.split("/")[1] === "change-password" ? classes.activeLink : classes.link;
        var deleteLink = this.props.match.path.split("/")[1] === "delete-account" ? classes.activeLink : classes.link;
        return (
            <div>
                <NavBarApp />
                {!this.state.userData ? <CircularProgress size={70} className={classes.loading}/> : 
                    <div className={classes.outerBox}>
                        <ul className={classes.ul}>
                            <li> 
                                <Link to={"/edit-profile/" + userId} className={editLink}>
                                    Edit Profile
                                </Link>
                            </li>
                            <li>
                                <Link to={"/change-password/" + userId} className={changeLink}>
                                    Change Password
                                </Link>
                            </li>
                            <li>
                                <Link to={"/delete-account/" + userId} className={deleteLink}>
                                    Delete Account
                                </Link>
                            </li>
                        </ul>
                        {this.props.match.path.split("/")[1] === "edit-profile" ? 
                            <article className={classes.article}>
                                <div className={classes.imagediv}>
                                    <div className={classes.imageBorder}>
                                        <img src={imageData} alt="profilepicture" className={classes.image}/>
                                    </div>
                                    <div style={{height: '50px'}}>
                                        <p className={classes.username}>{this.state.userData.username}</p>
                                            <button type="button" name="file" className={classes.changePhoto} onClick={this.fileUploadAction}>Change Profile Photo</button>
                                            <input id="input" type="file" accept="image/*" ref={this.inputReference} onChange={this.submitImage} style={{display: 'none'}}/>
                                    </div>
                                </div>
                                <form encType="multipart/form-data" onSubmit={this.submitData} className={classes.form}>
                                    <div className={classes.div}>
                                        <aside className={classes.aside}>
                                            <label>Name</label>
                                        </aside>
                                        <div className={classes.rightOuterDiv}>
                                            <div className={classes.rightInnerDiv}>
                                                <input type="text" name="name" value={this.state.userData.name} className={classes.input} onChange={this.handleChange} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className={classes.div}>
                                        <aside className={classes.aside}>
                                            <label>Username</label>
                                        </aside>
                                        <div className={classes.rightOuterDiv}>
                                            <div className={classes.rightInnerDiv}>
                                                <input type="text" name="username" disabled value={this.state.userData.username} style={{backgroundColor: '#e3e3e3'}}className={classes.input} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className={classes.div}>
                                        <aside className={classes.aside}>
                                            <label>website</label>
                                        </aside>
                                        <div className={classes.rightOuterDiv}>
                                            <div className={classes.rightInnerDiv}>
                                                <input type="text" name="website" value={this.state.userData.website} className={classes.input} onChange={this.handleChange} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className={classes.div}>
                                        <aside className={classes.aside}>
                                            <label>Bio</label>
                                        </aside>
                                        <div className={classes.rightOuterDiv}>
                                            <textarea name="bio" className={classes.textarea} value={this.state.userData.bio} onChange={this.handleChange}></textarea>
                                        </div>
                                    </div>
                                    <div className={classes.div}>
                                        <aside className={classes.aside}>
                                            <label></label>
                                        </aside>
                                        <div className={classes.rightOuterDiv}>
                                            <div className={classes.rightInnerDiv}>
                                                <Button variant="contained" color="primary" type="submit" disabled={this.state.disabled} className={classes.button}>
                                                    Submit
                                                    {loading && (
                                                        <CircularProgress size={30} className={classes.loading} />
                                                    )}
                                                </Button>
                                                {succes.general && (
                                                    <Typography variant="body2" className={classes.customError}>
                                                        {succes.general}
                                                    </Typography>
                                                )}
                                            </div>
                                        </div>    
                                    </div>
                                </form>
                            </article> : null
                        }
                        {this.props.match.path.split("/")[1] === "change-password" ? 
                            <ChangePassword data={this.state.userData}/> : null
                        }
                        {this.props.match.path.split("/")[1] === "delete-account" ? 
                            <DeleteAccount/> : null
                        }
                    </div>
                }
            </div>
        )
    }
}

export default EditProfile;
