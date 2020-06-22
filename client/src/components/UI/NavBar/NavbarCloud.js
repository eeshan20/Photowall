import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
//MUI STUFF
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import HomeIcon from '@material-ui/icons/Home';
import AddIcon from '@material-ui/icons/Add';
import { withStyles } from "@material-ui/core/styles";


const styles = {
    homeIcon: {
        fontSize: '3rem'
    },
    addIcon: {
        fontSize: '3rem',
        color: 'white',
        marginLeft: '10px',
        position: 'absolute',
        right: '80px'
    },
    logout: {
        position: 'absolute',
        right: '10px'
    }
}

class NavbarCloud extends Component {

    render() {
        const { classes } = this.props;
        return (
            <AppBar>
                <Toolbar>
                    <Link to="/homepage" style={{textDecoration: 'none', color: 'white'}}>
                        <HomeIcon className={classes.homeIcon} />
                    </Link>
                    {/* <Button color="inherit" style={{fontSize: '1.3rem'}} component={Link} to="/homepage">App</Button> */}
                    <AddIcon className={classes.addIcon} onClick={this.props.clicked}/>  
                    <Button color="inherit" className={classes.logout} component={Link} to="/logout">Logout</Button>                  
                </Toolbar>
            </AppBar>
        )
    }
}

export default withStyles(styles)(NavbarCloud);
