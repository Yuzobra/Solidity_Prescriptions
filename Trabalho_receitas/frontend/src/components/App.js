import React , { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';



import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import Web3 from 'web3';
import Web3Provider from 'web3-react'

import Header from './layout/Header';
import Login from './login'
import Register from './register';
import Home from './home';


class App extends Component{
  constructor(props){
    super(props)
    this.state = {
      userIsAutheticated: false,
      userInfo: null,
      isLoading:true
    }
     this.web3 = new Web3(Web3.givenProvider || "ws://localhost:8546");

  }

  componentDidMount(){
    this.getUserData();
    if(window.web3){
      console.log("window web3",this.web3.eth)
      this.web3.eth.getAccounts().then(e => console.log("web3",e))
      console.log("accounts",this.web3.eth.accounts[0])
    }
  }


  getUserData(){
    fetch("/accounts/getUserData",{
      method:'GET',
      accept:'application/json'
    }).then(res => {
      console.log('Res',res)
      res.json().then(data =>{
        console.log("User data",data)
        this.setState({userIsAutheticated:data.authenticated == "True" ? true : false, userInfo:data.user === "False" ? null : data.user,isLoading:false})
      })
    })
  }

  LogOut = () => {
    this.setState({userIsAutheticated:false,userInfo:null})
  }

  render(){
    if(this.state.isLoading){
      return(
        <div>
          <p>loading...</p>
        </div>
      )
    }
    else{
      return (
        <div>
          <Router>
            <Header user={{userIsAutheticated:this.state.userIsAutheticated, userInfo:this.state.userInfo}} LogOut={this.LogOut}/>
            <Switch>
              <Route exact path='/(home|)/'>
                <Home user={{userIsAutheticated:this.state.userIsAutheticated, userInfo:this.state.userInfo}}/>
              </Route>
              <Route exact path='/login'>
                <Login Login={() => this.getUserData()}/>
              </Route>
              <Route exact path="/register">
                <Register Login={() => this.getUserData()}/>
              </Route>
            </Switch>
          </Router>
        </div>
      )
    }
  }
}


ReactDOM.render(<App/>, document.getElementById('app'));
