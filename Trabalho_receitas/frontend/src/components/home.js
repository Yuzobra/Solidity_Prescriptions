import React from 'react';
import { Typography, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import MUIDataTable from "mui-datatables";


import { withWeb3Context } from './teste'
import { Connectors } from 'web3-react'
const { InjectedConnector, NetworkOnlyConnector } = Connectors
const MetaMask = new InjectedConnector({ supportedNetworks: [1, 4] })

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
      contract:props.contract
    }
  }

  componentDidMount(){
    console.log("home, user:", this.state.user)
  }

  componentDidUpdate(prevProps){
    if(prevProps != this.props){
      console.log('HOME ATUALIZOU',prevProps,this.props)
      this.setState({user:this.props.user.userInfo, contract:this.props.contract})
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
            <Button onClick={() => this.props.deployContract()}>Deploy</Button>
          </div>
        )
      }
    }
    else{
      console.log("ainda nao estou pronto");
      return(null)
    }
  }
}

export default withRouter(Home);
