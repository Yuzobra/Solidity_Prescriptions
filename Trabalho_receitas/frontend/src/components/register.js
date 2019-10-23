import React from 'react';
import { TextField, Grid, Button, MenuItem, Typography, Tooltip, IconButton, CircularProgress } from '@material-ui/core'
import FingerprintIcon from '@material-ui/icons/Fingerprint';
import { withRouter, Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { ToastErr, ToastSuccess } from './ToastFunction.js';

const styles = {
  TextField:{
    width:400,
  }
}


class Register extends React.Component{
  constructor(props){
    super(props);
    this.web3 = props.web3;
    this.state = {
      email:'',
      username:'',
      password:'',
      type:'',
      cpf:'',
      crm:'',
      cnpj:'',
      metamaskAccount:'',
      metamaskLoading:false,
    }
    this.classes = props.classes;
  }

  handleChange(name,event) {
    this.setState({[name]: event.target.value});
  }
  handleSubmit(e){
    e.preventDefault();
    var state = this.state;



    if(state.type == 'Medic'){
      if(state.cpf == '' || state.crm == '' || state.email == '' || state.username == '' || state.password == "" || state.metamaskAccount == ''){
        ToastErr("Fill all fields")
        return;
      }
      var sum = 0;
      var cpf = parseInt(state.cpf,10);
      while (cpf) {
          sum += cpf % 10;
          cpf = Math.floor(cpf / 10);
      }

      if(sum%11 != 0 || state.cpf.length != 11){
        ToastErr("Use a valid CPF number")
        return;
      }

      if(state.crm.length < 4 || state.crm.length > 10){
        ToastErr("Use a valid CRM number")
        return;
      }
      state.metamaskAccount = state.metamaskAccount.slice(2)
      delete state.cnpj;
      delete state.metamaskLoading;
    }
    else if(state.type == 'Patient'){
      if(state.cpf == '' || state.email == '' || state.username == '' || state.password == ""){
        ToastErr("Fill all fields")
        return;
      }
      var sum = 0;
      var cpf = parseInt(state.cpf,10);
      while (cpf) {
          sum += cpf % 10;
          cpf = Math.floor(cpf / 10);
      }

      if(sum % 11 != 0 || state.cpf.length != 11){
        ToastErr("Use a valid CPF number")
        return;
      }
      delete state.crm;
      delete state.cnpj;
      delete state.metamaskAccount;
      delete state.metamaskLoading;

    }
    else{
      if(state.cnpj == '' || state.email == '' || state.username == '' || state.password == ""){
        ToastErr("Fill all fields")
        return;
      }
      if(state.cnpj.length != 14){
        ToastErr("Use a valid CNPJ number")
        return;
      }
      delete state.cpf;
      delete state.crm;
      delete state.metamaskAccount;
      delete state.metamaskLoading;
    }



    fetch('accounts/register/',{
      method:'POST',
      accept:'application/json',
      body:JSON.stringify(this.state)
    }).then(res => {
      console.log('res submit:',res)
      if(res.status == 200){
        console.log("going home",this.props.history)
        this.props.Login()
        this.props.history.push('/home')
      }
      else if(res.status == 300){
        res.json().then(data=>{
          ToastErr("A user with that "+data.field+" already exists")

        })
      }
    })
  }

  getMetamaskAccount(){
    this.setState({metamaskLoading:true})
    this.web3.eth.getAccounts((err,accounts) => {
      if(err) 
        {
          console.log("err",err);
          this.setState({metamaskLoading:false})
          ToastErr("Error retrieving Metamask account")
        }
      else if(accounts.length == 0){
        this.setState({metamaskLoading:false})
        ToastErr("Please install the Metamask plugin and create an account")
      }
      console.log("wallet",this.web3.eth.accounts.wallet)
      this.setState({metamaskAccount:accounts[0], metamaskLoading:false});
    })
  }

  extraField(){
    if(this.state.type != ''){
      if(this.state.type == 'Patient'){
        return(
          <div>
            <TextField className={this.classes.TextField} name="CPF" id="CPF" label="CPF" onChange={(e)=>this.handleChange('cpf',e)}/>
          </div>
        )
      }
      else if(this.state.type == 'Medic'){
        return(
          <div>
            <div>
              <TextField className={this.classes.TextField} name="CPF" id="CPF" label="CPF" onChange={(e)=>this.handleChange('cpf',e)}/>
            </div>
            <div>
              <TextField className={this.classes.TextField} name="crm" id="crm" label="CRM" onChange={(e)=>this.handleChange('crm',e)}/>
            </div>
            <Tooltip title="This will be the account you'll need to use whenever making a prescription">
              <TextField 
                className={this.classes.TextField} 
                disabled
                name="metamaskAccount" 
                id='metamaskAccount' 
                label="Metamask Account" 
                required
                select={false}
                value={this.state.metamaskAccount}
                onChange={(e) => this.handleChange("metamaskAccount",e)}
                InputProps={{
                  endAdornment:
                    this.state.metamaskLoading == true ? 
                    (
                      <CircularProgress style={{margin:5}} size={16}/>
                    )
                    :
                    <div>
                      <IconButton onClick={() => this.getMetamaskAccount()} size="small" style={{margin:5}}>
                        <FingerprintIcon />
                      </IconButton>
                    </div>
                }}
              />
            </Tooltip>
          </div>
        )
      }
      else{
        return(
          <div>
            <TextField className={this.classes.TextField} name="cnpj" id="cnpj" label="CNPJ" onChange={(e)=>this.handleChange('cnpj',e)}/>
          </div>
        )
      }
    }
    else{
      return <div></div>
    }
  }

  render(){
    return (
      <div>
          <form onSubmit={(e) => this.handleSubmit(e)}>
            <div style={{paddingLeft:40,marginTop:75}}>
              <div>
                <TextField className={this.classes.TextField} name="email" id="email" label="email" onChange={(e)=>this.handleChange('email',e)} />
              </div>
              <div>
                <TextField className={this.classes.TextField} name="username" id="username" label="username" onChange={(e)=>this.handleChange('username',e)} />
              </div>
              <div>
                <TextField className={this.classes.TextField} select name="type" id="type" label="type" value={this.state.type} margin='normal' onChange={(e)=>this.handleChange('type',e)} >
                  <MenuItem key={"type"} value={'Medic'}>
                    Medic
                  </MenuItem>
                  <MenuItem value={'Pharmacy'}>
                    Pharmacy
                  </MenuItem>
                  <MenuItem  value={'Patient'}>
                    Patient
                  </MenuItem>
                </TextField>
              </div>
              {
                this.extraField()
              }
              <div>
                <TextField className={this.classes.TextField} name="password" id="password" type='password' label="password" onChange={(e)=>this.handleChange('password',e)}/>
              </div>
              <div>
                <Button type="submit" color="primary">Register</Button>
              </div>
              <Typography variant="body1"> Or if you have an account <Link to="/login">login</Link></Typography>
            </div>
          </form>
      </div>
    )
  }
}

export default withRouter(withStyles(styles)(Register));
