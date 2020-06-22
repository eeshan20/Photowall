import React, { Component } from 'react'
import { Link } from  'react-router-dom';
import axios from 'axios';
//MUI STUFF
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import CircularProgress from '@material-ui/core/CircularProgress';
import ClearIcon from '@material-ui/icons/Clear';
import AddIcon from '@material-ui/icons/Add';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import TextField from '@material-ui/core/TextField';

import { fade, withStyles } from '@material-ui/core/styles';

import SearchUser from '../../../containers/App/SearchUser/SearchUser';
import classesFile from './NavbarApp.module.css';

const styles = (theme) => ({
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.25),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.35),
      },
      marginRight: theme.spacing(2),
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
      },
      display: 'inline-block'
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    clear: {
        position: 'absolute',
        right: '1px',
        top: "5px",
    },
    inputRoot: {
      color: 'black',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
    addIcon: {
        position: 'absolute',
        right: '190px',
        fontSize: '2.5rem'
    },
    account: {
        position: 'absolute',
        right: '100px'
    },
    logout: {
        position: 'absolute',
        right: '20px'
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        width: '600px',
        height: '600px',
        outline: 'none',
        boxShadow: theme.shadows[5],
    },
    progess: {
        position: 'absolute'
	}	
  });

class NavbarApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            display: 'none',
            search: '',
            searchData: null,
            incomingLoading: false,
            open: false,
            caption: '',
            selectedFiles: null,
            displayImage: null,
            loading: false
        }
        this.onSearch = this.onSearch.bind(this);
        this.displayFocus = this.displayFocus.bind(this);
        this.displayBlur = this.displayBlur.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.fileUploadAction = this.fileUploadAction.bind(this);
        this.inputReference = React.createRef();
        this.showImage = this.showImage.bind(this);
    }

    fileUploadAction = () => {
        this.inputReference.current.click();
    }

    showImage = (event) => {
        this.setState({
            selectedFiles: event.target.files[0],
            displayImage: URL.createObjectURL(event.target.files[0])
        })
        this.handleOpen();
    }

    handleOpen = () => {
        console.log("handletoggle");
        const open = true;
        this.setState({open: open});
    };

    handleClose = () => {
        console.log("handleclose");
        this.setState({
            open: false,
            caption: ''
        });
    };

    handleChange = (event) => {
        console.log(event.target.value)
        this.setState({
            caption: event.target.value
        })
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");
        this.setState({
            loading: true
        });
		// console.log(this.state.selectedFiles);
		
        let data = new FormData();
        data.append('file',this.state.selectedFiles)
		data.append('userId',userId);
		data.append('caption',this.state.caption);
        console.log(...data);

        axios.post('http://localhost:4000/addpost',data,{
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
        .then((result) => {
            console.log(result);
            this.setState({
                loading: false,
                selectedFiles: null,
                caption: ''
            })
            this.handleClose();
        })
        .catch((err) => {
            console.log(err);
            this.setState({
                loading: false,
                selectedFiles: null,
                caption: ''
            })
            // localStorage.clear();
            // this.props.history.push("/");
        })
	};


    onSearch = (event) => {
        event.preventDefault();
        this.setState({
            search: event.target.value,
            incomingLoading: true
        })
        const token = localStorage.getItem('token');
        const user = {user: event.target.value};
        console.log(event.target.value);
        if(event.target.value) {
            axios.post('http://localhost:4000/searchuser', user,{
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })
            .then((result) => {
                console.log(result);
                this.setState({
                    searchData: result.data,
                    incomingLoading: false
                })
            })
            .catch((err) => {
                console.log(err);
            })
        }

        // if(!event.target.value) {
        //     this.setState({
        //         display: 'none',
        //         // search: event.target.value,
        //         searchData: null
        //     })
        // }

        if(event.target.value) {
            console.log("inside change if");
            console.log(event.target.value);
            this.setState({
                display: 'block',
                // search: event.target.value
            })
        }
        else {
            console.log("inside change else");
            console.log(event.target.value);
            this.setState({
                display: 'none',
                // search: event.target.value,
                searchData: null
            })
        }
    }

    displayFocus = () => {
        if(this.state.searchData) {
            console.log("inside focus if");
            console.log(this.state.searchData);
            this.setState({
                display: 'block'
            })
        }
        else {
            console.log("inside focus else");
            console.log(this.state.searchData);
            this.setState({
                display: 'none'
            })
        }
    }

    displayBlur = () => {
        this.setState({
            display: 'none'
        })
    }

    clearSearch = () => {
        this.setState({
            search: '',
            display: 'none',
            searchData: null
        })
    }

    render() {
        const { classes } = this.props;
        const { loading } = this.state;
        const userId = localStorage.getItem("userId");
        return (
            <>
                <AppBar>
                    <Toolbar>
                        <Button color="inherit" component={Link} to="/homepage">HomePage</Button>
                        <Button color="inherit" component={Link} to="/notifications">Notifications</Button>
                        <Button color="inherit" component={Link} to="/cloud">Cloud</Button>
                        <div className={classes.search + ' ' + classesFile.dropdown} /*tabIndex="0" onBlur={this.displayBlur}*/>
                            <div className={classes.searchIcon}>
                                <SearchIcon />
                            </div>
                            <InputBase
                                placeholder="Search…"
                                classes={{
                                    root: classes.inputRoot,
                                    input: classes.inputInput,
                                }}
                                inputProps={{ 'aria-label': 'search' }}
                                value={this.state.search}
                                onChange={this.onSearch}
                                onFocus={this.displayFocus}
                                /*onBlur={this.displayBlur}*/ />
                            {this.state.search ? <ClearIcon className={classes.clear} onClick={this.clearSearch}/> : null}
                            <div style={{display: this.state.display}} className={classesFile.dropdownContent}>
                                {this.state.display === 'block' ? this.state.incomingLoading ? <CircularProgress size={30} className={classesFile.refresh} /> :
                                    this.state.searchData.map((data) => {
                                        return  <SearchUser key={data.userId} data={data} />
                                    }) : null
                                }
                            </div>
                        </div>
                        <AddIcon className={classes.addIcon} onClick={this.fileUploadAction}/>
                        <input id="input" type="file" accept="image/*" ref={this.inputReference} onChange={this.showImage} style={{display: 'none'}}/>
                        <Button color="inherit" className={classes.account} component={Link} to={"/account/" + userId}>Account</Button>
                        <Button color="inherit" className={classes.logout} component={Link} to="/logout">Logout</Button>
                    </Toolbar>
                </AppBar>
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    className={classes.modal}
                    open={this.state.open}
                    onClose={this.handleClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                    timeout: 500,
                }} >
                <Fade in={this.state.open}>
                    <div className={classes.paper}>
                        <form onSubmit={this.handleSubmit} encType="multipart/form-data">
                            {/* <input type="file" name="file" multiple/> */}
                            <img src={this.state.displayImage} alt="postImage" className={classesFile.image}/>
                            <div className={classesFile.divTextField}>
                                <TextField
                                    id="caption"
                                    name="caption"
                                    type="text"
                                    className={classesFile.textField}
                                    placeholder="Caption..."
                                    autoComplete="off"
                                    value={this.state.caption}
                                    onChange={this.handleChange}
                                    variant="outlined"
                                    fullWidth />
                            </div>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                className={classesFile.Button} 
                                disabled={loading}>
                                UPLOAD 
                                {loading && (
                                    <CircularProgress size={30} className={classes.progress} />
                                )}   
                            </Button>
                        </form>
                    </div>
                </Fade>
            </Modal>
        </>
        )
    }
}

export default withStyles(styles)(NavbarApp);