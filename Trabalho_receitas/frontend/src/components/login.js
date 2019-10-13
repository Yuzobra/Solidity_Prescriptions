import React from 'react';
import { TextField, Grid, Button, MenuItem, Typography } from '@material-ui/core'
import { withRouter, Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { ToastErr, ToastSuccess } from './ToastFunction.js';

const styles = {
  TextField:{
    width:400,
  }
}


class Login extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      username:'',
      password:'',
    }
    this.classes = props.classes;
  }

  handleChange(name,event) {
    this.setState({[name]: event.target.value});
  }
  handleSubmit(e){
    e.preventDefault();
    fetch('accounts/login/',{
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
      else{
        ToastErr("Unable to login.")
        console.log("Não foi possivel fazer login")
      }
    })
  }
  render(){
    return (
      <div>
          <form onSubmit={(e) => this.handleSubmit(e)}>
            <div style={{paddingLeft:40,marginTop:75}}>
              <div>
                <TextField className={this.classes.TextField} name="username" id="username" label="username" onChange={(e)=>this.handleChange('username',e)} />
              </div>
              <div>
                <TextField className={this.classes.TextField} name="password" id="password" type='password' label="password" onChange={(e)=>this.handleChange('password',e)}/>
              </div>
              <div>
                <Button type="submit" color="primary">Login</Button>
              </div>
              <div>
                <Typography variant="body1"> Or if you don't have an account <Link to="/register">register</Link></Typography>
              </div>
            </div>
          </form>
      </div>
    )
  }
}

export default withRouter(withStyles(styles)(Login));
