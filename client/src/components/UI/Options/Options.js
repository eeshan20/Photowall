import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

const styles ={
    uploadIcon: {
        fontSize: '12.8rem',
        margin: '320px auto auto 130px',
        cursor: 'pointer'
    },
    appIcon: {
        fontSize: '12.8rem',
        margin: '320px auto auto 130px',
        cursor: 'pointer'
    },
    iconTitle: {
        margin: 'auto auto auto 200px' 
    }

}

class Options extends Component {
    handleClick = (type) => {
        if(type === "cloud")
            this.props.history.push("/cloud");
        else
            this.props.history.push("/homepage");
    }

    render() {
        const { classes } = this.props;

        return (
            <div>
                <Grid container>
                    <Grid item sm/>
                    <Grid item sm>
                        <ExitToAppIcon color="secondary" fontSize="large" className={classes.appIcon} onClick={() => this.handleClick("app")}/>
                        <Typography variant="h4" className={classes.iconTitle}>
                            App
                        </Typography>
                    </Grid>
                    <Grid item sm>
                        <CloudUploadIcon color="primary" fontSize="large" className={classes.uploadIcon} onClick={() => this.handleClick("cloud")}/>
                        <Typography variant="h4" className={classes.iconTitle}>
                            Cloud
                        </Typography>
                    </Grid>
                    <Grid item sm />
                </Grid>
            </div>
        )
    }
}

export default withStyles(styles)(Options);
