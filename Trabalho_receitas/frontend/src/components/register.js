import React from 'react';
import { TextField, Grid, Button, MenuItem, Typography } from '@material-ui/core'
import { withRouter, Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  TextField:{
    width:400,
  }
}


class Register extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      email:'',
      username:'',
      password:'',
      type:'',
      cpf:'',
      crm:'',
      cnpj:''
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
      delete state.cnpj;
    }
    else if(state.type == 'Patient'){
      delete state.crm;
      delete state.cnpj;
    }
    else{
      delete state.cpf;
      delete state.crm;
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
