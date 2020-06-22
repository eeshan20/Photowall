import React, { Component } from 'react'
import axios from 'axios';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import CircularProgress from '@material-ui/core/CircularProgress';
// import fs from 'fs';

import UserImages from './UserImages/UserImages';
import NavbarCloud from '../../components/UI/NavBar/NavbarCloud';
import ClassesInput from './Cloud.module.css';

const styles = (theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        width: '500px',
        // border: '2px solid #000',
        outline: 'none',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    progess: {
        position: 'absolute'
	}	
});

let oldDate = null;

class Cloud extends Component {
    constructor(props) {
        super(props);
        // this.wrapper = React.createRef();
        this.state = {
			token: null,
			userId: null,
            selectedFiles: null,
            open: false,
            loading: false,
            incomingFiles: null,
            incomingLoading: true
        }
		this.handleClose = this.handleClose.bind(this);
		this.handleOpen = this.handleOpen.bind(this);
        this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.deleteImage = this.deleteImage.bind(this);
		this.downloadImage = this.downloadImage.bind(this);
        this.checkDate = this.checkDate.bind(this);
    }

    componentDidMount() {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        axios.get(`http://localhost:4000/cloud/${userId}`,{
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
        .then((result) => {
            this.setState({
				token: token,
				userId: userId,
                incomingFiles: result.data,
                incomingLoading: false
            })
			console.log(result.data);
			// console.log(this.state.incomingFiles);
        })
        .catch((err) => {
            console.log(err);
        })
    }

    // shouldComponentUpdate (nextProps, nextState) {
    //     if(this.state.incomingFile === nextState.incomingFile )
    //         return false;
    //     else
    //         return true;
    // }
    
    handleClose = () => {
        console.log("handleclose");
        this.setState({open: false});
    };

	componentDidUpdate() {
		console.log("did update");
	}

    handleOpen = () => {
        console.log("handletoggle");
        const open = true;
        // console.log(open)
        // console.log(`state ${this.state.open}`)
        this.setState({open: open});
    };

    handleChange = (event) => {
        console.log(event.target.files)
        this.setState({
            selectedFiles: event.target.files
        })
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");
        this.setState({
            loading: true
        });
		console.log(this.state.selectedFiles);
		
		let d = new Date();
		var monthArray= ["January","February","March","April","May","June","July","August","September","October","November","December"];
		let date = d.getDate();
		let month = monthArray[d.getMonth()]; // Since getMonth() returns month from 0-11 not 1-12
		let year = d.getFullYear();
		
		let dateStr = date + "/" + month + "/" + year;

        let data = new FormData();
        for(const key of Object.keys(this.state.selectedFiles)){
			// console.log(key);
            data.append('file',this.state.selectedFiles[key]); 
        }
		data.append('userId',userId);
		data.append('date',dateStr);
        console.log(...data);


        axios.post('http://localhost:4000/cloud',data,{
            headers: {
                // 'Content-Type': 'multipart/form-data',
                Authorization: 'Bearer ' + token
            }
        })
        .then((result) => {
            console.log(result);
            const resultObject = {id: result.data[0]._id, image: result.data[0].image, date: result.data[0].date, fileName: result.data[0].fileName};
            this.setState((prevState) => ({
                loading: false,
                incomingFiles: [resultObject, ...prevState.incomingFiles]
            }))
            this.handleClose();
        })
        .catch((err) => {
            console.log(err);
            this.setState({
                loading: false
            })
            localStorage.clear();
            this.props.history.push("/");
        })
	};

	deleteImage = (imageId) => {
		const oldArray = this.state.incomingFiles;
		const updatedArray = oldArray.filter((old) => {
			return old.id !== imageId;
		})
		this.setState({incomingFiles: updatedArray});
		const userId = {userId: this.state.userId};
		console.log(imageId);
		axios.post(`http://localhost:4000/cloud/delete/${imageId}`,userId,{
			headers: {
                Authorization: 'Bearer ' + this.state.token
            }
		})
		.then((result) => {
			console.log(result);
		})
		.catch((err) => {
			console.log(err);
		})
	}

	downloadImage = (imageId) => {
        console.log("inside download");
        const oldArray = this.state.incomingFiles;
		const updatedArray = oldArray.filter((old) => {
			return old.id === imageId;
        }) 
        console.log(imageId);
        console.log(oldArray);
        console.log(updatedArray[0].image.data);
        var blob = new Blob(updatedArray[0].image.data, {type: "image/*"});
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = url;
        a.download = updatedArray.fileName;
        a.click();
    }
    

    checkDate = (newDate) => {
        console.log(`${oldDate}\n${newDate}`);
        if(oldDate !== newDate) {
            oldDate = newDate;
            console.log("false")
            return true;
        }
        else {
            oldDate = newDate;
            return false;
        }
    }

    render() {
        const { classes } = this.props;
		const { loading } = this.state;
		// let oldDate = 'null';
        return (
            <div /*ref={this.wrapper}*/>
                <NavbarCloud clicked={this.handleOpen}/>
				<div className={ClassesInput.container}>
					{this.state.incomingLoading ? <CircularProgress size={70} className={ClassesInput.refresh}/> :
						this.state.incomingFiles.map((incomingFile) => {
                        return ([this.checkDate(incomingFile.date) ? <div className={ClassesInput.date} key={incomingFile.id + String((Math.random()*100000)).substring(0,5)}><p style={{marginTop: '5px'}}>{incomingFile.date}</p></div> : null,
                            <UserImages key={incomingFile.id} data={incomingFile} delete={this.deleteImage} download={this.downloadImage}/>])
						}) 
						// null
					}
				</div>
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
                            <h2 id="transition-modal-title">UPLOAD</h2>
                            <p id="transition-modal-description">Please Select Files...</p>
                            <form onSubmit={this.handleSubmit} encType="multipart/form-data">
                                {/* <input type="file" name="file" multiple/> */}
                                <input
                                    type="file"
                                    name="file"
                                    accept="image/*"   
                                    style={{ marginTop: "10px" }} 
                                    multiple required className={ClassesInput.Input} onChange={this.handleChange}/>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    className={ClassesInput.Button} 
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
            </div>
        )
    }
}

export default withStyles(styles)(Cloud);
