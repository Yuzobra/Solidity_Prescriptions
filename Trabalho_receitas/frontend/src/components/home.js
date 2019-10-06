import React from 'react';
import { Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import MUIDataTable from "mui-datatables";

const useStyles = makeStyles(theme => ({
  TextField:{
    width:400,
  }
}))


class Home extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      user:props.user.userInfo,
    }
  }

  componentDidMount(){
    console.log("home, user:", this.state.user)
  }

  componentDidUpdate(prevProps){
    if(prevProps != this.props){
      this.setState({user:this.props.user.userInfo})
    }
  }

  handleChange(name,event) {
    this.setState({[name]: event.target.value});
  }

  render(){
    if(this.state.user != null){
      if(this.state.user.type == "Patient"){
        return (
          <div>
            <Typography variant="h1">paciente</Typography>
          </div>
        )
      }
      else if(this.state.user.type == "Medic"){
        return(
          <div>
            <Typography variant="h1">medico</Typography>
          </div>
        )
      }
      else{
        return(
          <div>
            <Typography variant="h1">farmacia</Typography>
          </div>
        )
      }
    }
    else{
      return(
        <div></div>
      )
    }
  }
}

export default withRouter(Home);
