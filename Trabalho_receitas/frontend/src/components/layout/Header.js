import React, { Component } from 'react';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { Typography, Grid, Link, IconButton } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

export class Header extends Component {
  constructor(props){
    super(props);
    this.state = {
      userIsAutheticated:props.user.userIsAutheticated,
      userInfo:props.user.userInfo,
    }
  }

  componentDidMount(){

  }

  componentDidUpdate(prevProps){
    if(prevProps != this.props){
      this.setState({...this.state,...this.props.user})
    }
  }

  LogOut(){
    fetch('/accounts/LogOut/',{
      method:'GET',
      accept:'application/json'
    }).then(res => {
      console.log("LogOut res:",res)
      if(res.status == 200){
        this.setState({userIsAutheticated:false,userInfo:null})
        this.props.history.push('/login')
        this.props.LogOut();
      }
      res.text().then(data => {
        console.log("LogOut data:",data)
      })
    })

  }

  render(){
    return (
      <nav className="navbar navbar-expand-sm navbar-light bg-light">
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
          <a className="navbar-brand" href="#">Prescriptions</a>
          <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
          </ul>
        </div>
        <div style={{right:5}}>
          {
            this.state.userIsAutheticated ?
            (
                <Grid container spacing={2}>
                  <Grid item xs={2}>
                    <AccountCircleIcon />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography style={{paddingTop:2}} variant='body1'>{this.state.userInfo.username}</Typography>
                  </Grid>
                  <Grid item xs={2}>
                  <IconButton onClick={() => this.LogOut()} size="small">
                    <ExitToAppIcon />
                  </IconButton>
                  </Grid>
                </Grid>
            )
            :
            (
              <div></div>
            )
          }
          </div>
      </nav>
    )
  }
}

export default withRouter(Header);
