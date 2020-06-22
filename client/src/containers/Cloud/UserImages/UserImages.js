import React, { Component } from 'react'
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import DeleteIcon from '@material-ui/icons/Delete';
import GetAppIcon from '@material-ui/icons/GetApp';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { withStyles } from '@material-ui/core/styles';

import classCard from './UserImages.module.css';


const styles = (theme) => ({
    root: {
		// maxWidth: 145,
		// marginBottom: '5px',
	},
	modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }
    // paper: {
    //     backgroundColor: theme.palette.background.paper,
    //     border: '2px solid #000',
    //     boxShadow: theme.shadows[5],
    //     padding: theme.spacing(2, 4, 3),
	// }	
});

class UserImages extends Component {
	constructor(props) {
		super(props);
		this.state = {
			image: null,
			open: false,
			viewImage: null
		}
		this.handleClose = this.handleClose.bind(this);
		this.handleOpen = this.handleOpen.bind(this);
		this.userImage = this.userImage.bind(this);
		this.arrayBufferToBase64 = this.arrayBufferToBase64.bind(this);
	}

	arrayBufferToBase64 = (buffer) => {
		var binary = '';
		var bytes = [].slice.call(new Uint8Array(buffer));
		bytes.forEach((byte) => binary += String.fromCharCode(byte));
		return window.btoa(binary);
	};
	
	handleClose = () => {
        console.log("handleclose");
        this.setState({open: false});
    };

    handleOpen = () => {
        console.log("handletoggle");
        const open = true;
        // console.log(open)
        // console.log(`state ${this.state.open}`)
        this.setState({open: open});
    };

	
	userImage = (data) => {
		console.log("in");
		this.handleOpen();
		//let imageData = `data:image/*;base64,${this.arrayBufferToBase64(data)}`;
	}


    render() {
		const { classes } = this.props;
		// console.log(this.props.data);
		let imageData = `data:image/*;base64,${this.arrayBufferToBase64(this.props.data.image.data)}`;
		return (
            <div>
				<div className={classCard.card}>
					<Card  raised="true" className={classes.root}>
						<CardActionArea onClick={() => this.userImage({data: this.props.data.image.data})}>
							<CardMedia
								className={classCard.cardMedia}
								component="img"
								alt="Contemplative Reptile"
								height="140"
								image={imageData}
								title="userPhotoes" />
						</CardActionArea>
						<CardActions style={{backgroundColor: '#f3f3f3fa'}}>
							<DeleteIcon  color="secondary" className={classCard.deleteIcon} onClick={() => this.props.delete(this.props.data.id)} />
							<GetAppIcon  color="primary" className={classCard.getIcon} onClick={() => this.props.download(this.props.data.id)} />
						</CardActions>
					</Card>
				</div>
				<Modal
                    className={classes.modal}
                    open={this.state.open}
                    onClose={this.handleClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                    timeout: 500,
                    }} >
                    <Fade in={this.state.open}>
                        {/* <div className={classes.paper + ' ' + classCard.paper}> */}
							<img src={imageData} className={classCard.modalImage} alt="userImage"/>
                        {/* </div> */}
                    </Fade>
                </Modal>
            </div>
        )
    }
}

export default withStyles(styles)(UserImages);



