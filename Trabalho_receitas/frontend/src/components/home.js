import React from 'react';
import { Typography, Button, TextField, CircularProgress, Tooltip, IconButton, Paper, TextareaAutosize } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import MUIDataTable from "mui-datatables";
import { withStyles } from '@material-ui/core/styles';
import EventNoteIcon from '@material-ui/icons/EventNote';
import CheckIcon from '@material-ui/icons/Check';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import { ToastErr, ToastSuccess } from './ToastFunction.js';

import { Connectors } from 'web3-react'
import { textAlign } from '@material-ui/system';

const styles = {
  TextField:{
    width:200,
    marginRight:50,
  },
  paper:{
    width:"95%",
    padding:20,
    marginTop: 20,
    marginLeft: "auto",
    marginRight: "auto",
    textAlign: "center",
    display: "flex",
    backgroundColor: "#fcfafa",
  }
}




class Home extends React.Component{
  

  constructor(props){
    super(props);
    this.state = {
      user:props.user.userInfo,
      contract:props.contract,
      accounts:props.accounts,
      patientCPF:"",
      medicineName:"",
      quantity:0,
      isPatientsPrescriptionsLoading:true,
      prescriptionsData:[],
      displayedData:[],
      page:0,
      count:0,
      rowsPerPage:10,
      prescriptionDialogOpen:false,
      medicinePIN: null,
      prescriptionBeingCreated:false,
      prescriptionBeingSold:false,
      currentAccount: "",
    }
    this.classes = props.classes;
    this.web3 = props.web3;
  }

  componentDidMount(){
    console.log("home, user:", this.state.user)
    this.getPatientPrescriptions()
  }

  componentDidUpdate(prevProps){
    if(prevProps != this.props){
      console.log('HOME ATUALIZOU',prevProps,this.props)
      this.setState({user:this.props.user.userInfo, contract:this.props.contract,accounts:this.props.accounts})
    }
  }

  handleChange(name,event) {
    this.setState({[name]: event.target.value});
  }

  makePrescription(){
    var account = "";
    this.web3.eth.getAccounts((err,accounts) => {
      if(err) console.log("err",err);
      // this.setState({currentAccount:accounts[0]})
      if(accounts.length == 0){
        ToastErr("Please utilize Metamask to make prescriptions")
        this.setState({prescriptionBeingCreated:false})
        return;
      }
      account = accounts[0]
      //salvar prescription no bd, checar se há um usuario com esse cpf, retornar informações para inserir na blockChain
      fetch("/prescriptions/save",{
        method: "POST",
        accept:'application/json',
        body: JSON.stringify({
          cpf:this.state.patientCPF,
          medicine:this.state.medicineName,
          quantity:this.state.quantity,
          metamaskAccount:account.slice(2),
        })
      }).then(res => {
        console.log("Res", res)
        if(res.status == 300){
          ToastErr("There is no patient with the given CPF");
          this.setState({prescriptionBeingCreated:false})
        }
        else if(res.status == 301){
          res.json().then(data=>{
            ToastErr("Please utilize the this accounts' Metamask wallet: 0x" + data.accountPrefix + "...");
            this.setState({prescriptionBeingCreated:false})
          })
        }
        else if(res.status == 200){
          res.json().then(data => {
            console.log("data",data)
            this.state.contract.methods.makePrescription(this.state.medicineName,this.state.quantity,data.crm,this.state.patientCPF,data.dateTime).send({
              from:this.props.web3.eth.defaultAccount,
              gas:4000000,
            }).then((receipt) => {
              ToastSuccess("Prescription saved with sucess!")
              this.setState({prescriptionBeingCreated:false})
              console.log("Receipt from make:",receipt)
              console.log("Events",receipt.events)
            })
          })
        }
      })
    })
  }

  sellMedicine(){
    var cpf = this.state.patientCPF
    var pin = this.state.medicinePIN
    fetch("/prescriptions/info", {
      method: "POST",
      accept:"application/json",
      body:JSON.stringify({
        cpf:cpf,
        pin:pin
      })
    }).then(res => {
      console.log("Res", res)
      if(res.status == 300){
        ToastErr("There is no prescription with that data.")
        this.setState({prescriptionBeingSold:false})
      }
      else if(res.status == 200){
        res.json().then(data => {
          console.log("Data", data)
          this.getPrescriptionValidity(data.crm,cpf,data.dateTime).then(result =>{
            if(result == true){
              this.state.contract.methods.sellMedicine(data.crm,cpf,data.dateTime,data.cnpj).send({
                from:this.props.web3.eth.defaultAccount,
                gas:4000000,
              }).then(receipt => {
                console.log("Receipt from sell:",receipt)
                ToastSuccess("Sucessfuly sold!")
                this.setState({prescriptionBeingSold:false})
              })
            }
            else /* receita ja vendida */ {
              ToastErr("This prescription has already been used.")
              this.setState({prescriptionBeingSold:false})
            }
          })
        })
      }
    })
  }

  getPrescriptionValidity(crm, patientCpf, dateTime){
    return new Promise((resolve, reject) => {
      this.state.contract.methods.getPrescriptionValidity(crm,patientCpf,dateTime).call({
        from:this.props.web3.eth.defaultAccount
      }).then(result=>{
        console.log("Result from validity:", result)
        resolve(result)
      })
    })
  }

  getPatientPrescriptions () {
    fetch("/prescriptions/get",{
      method:'GET',
      accept:"application/json"
    }).then(res => {
      console.log("Res:",res)
      if(res.status == 200 ){
        res.json().then(data=>{
          var tempData = [];
          var cont = 0;
          console.log("Data from prescriptions get:",data)
          if(data.values.length == 0){
            this.setState({isPatientsPrescriptionsLoading:false})
          }
          new Promise((resolve, reject) => {
            data.values.map((value,index) => {
              this.getPrescriptionValidity(value.crm,value.patientCpf,value.dateTime).then((status) => {
                value.status = status
                console.log("value after:",value)
                tempData.push(value);
                if( cont++ == (data.values.length - 1)) return resolve();
              })
            })
          }).then(() => {
            tempData.sort(function(a,b){return b.id - a.id})
            console.log("tempData",tempData)
            this.setState({prescriptionsData:tempData,displayedData:tempData.slice(0,this.state.rowsPerPage*(this.state.page+1)),isPatientsPrescriptionsLoading:false,count:tempData.length})
          })
          
        })
      }
    })
  }


  handlePrescriptionDialog(pin){
    console.log(pin)
    this.setState({prescriptionDialogOpen:true, pin: pin});
  }


  handleChange(name, event){
    this.setState({[name]:event.target.value});
  }

  changePage = (page) => {
    this.setState({
      page:page,
      displayedData:this.state.prescriptionsData.slice(page*this.state.rowsPerPage,(page+1)*this.state.rowsPerPage)
    })
  };

  changeRowsPerPage = (rowsPerPage) => {
    this.setState({
      rowsPerPage: rowsPerPage,
      displayedData:this.state.prescriptionsData.slice(this.state.page*rowsPerPage,(this.state.page+1)*rowsPerPage)

    })
  }

  render(){
    if(this.state.user != null){
      if(this.state.user.type == "Patient"){
        const columns = [
          {
            name:"medicine",
            label:"Medicine",
            options:{
              filter:false,
              sort:false,
            }
          },
          {
            name:"quantity",
            label:"Quantity",
            options:{
              filter:false,
              sort:false,
            }
          },
          {
            name:"crm",
            label:"Medic's CRM",
            options:{
              filter:false,
              sort:false,
            }
          },
          {
            name:"status",
            label:"Status",
            options:{
              filter:false,
              sort:false,
              customBodyRender: (value, tableMeta, updateValue) => {
                if(value == true){
                  return (
                    <Tooltip title="Your prescription is still valid for use">
                      <IconButton onClick={() => this.handlePrescriptionDialog(this.state.displayedData[tableMeta.rowIndex].pin)}>
                        <EventNoteIcon />
                      </IconButton>
                    </Tooltip>
                  )
                }
                else{
                  return(
                    <Tooltip title="This prescription has already been used!">
                      <CheckIcon />
                    </Tooltip>
                  )
                }
              }
            }
          }
        ]

        const { displayedData, page, count, isPatientsPrescriptionsLoading } = this.state;

        const options = {
          filter: false,
          search: false,
          selectableRows: 'single',
          filterType: 'dropdown',
          responsive: 'stacked',
          serverSide: true,
          resizableColumns: false,
          print: false,
          download: false,
          count: count,
          page: page,
          //selectedRows: selected,
          onTableChange: (action, tableState) => {
            console.log(action, tableState);
            // a developer could react to change on an action basis or
            // examine the state as a whole and do whatever they want
            switch (action) {
              case 'changePage':
                this.changePage(tableState.page);
                break;
              case 'changeRowsPerPage':
                this.changeRowsPerPage(tableState.rowsPerPage);
                break;
              // case 'rowsSelect':
              //   console.log("SELECTED_ROWS:", tableState.selectedRows, selected);
              //   //this.state.selected = tableState.selectedRows;
            }
          },
        };
        return (
          <div style={{paddingTop:50}}>
            <PrescriptionDialog open={this.state.prescriptionDialogOpen} onClose={() => this.setState({prescriptionDialogOpen:false})} pin={this.state.pin} />
            <MUIDataTable title={
                    <Typography variant="h5">
                        Your prescriptions
                        {isPatientsPrescriptionsLoading && <CircularProgress size={24} style={{ marginLeft: 15, position: 'relative', top: 4 }} />}
                    </Typography>
                } data={displayedData} columns={columns} options={options} />
          </div>
        )
      }
      else if(this.state.user.type == "Medic"){
        return(
          <div>
            <Paper className={this.classes.paper}>
            <TextField 
              className={this.classes.TextField} 
              name="patientCPF" 
              id="patientCPF" 
              label="Patient CPF" 
              onChange={(e)=>this.handleChange('patientCPF',e)} 
            />
            <TextField 
              className={this.classes.TextField} 
              name="medicineName" 
              id="medicineName" 
              label="Medicine to be prescribed" 
              onChange={(e)=>this.handleChange('medicineName',e)} 
            />
            <TextField 
              className={this.classes.TextField} 
              name="quantity" 
              id="quantity" 
              label="Quantity" 
              onChange={(e)=>this.handleChange('quantity',e)} 
            />
            {
              this.state.prescriptionBeingCreated == true ?
              (<CircularProgress size={24} style={{ marginLeft: 15, position: 'relative', top: 4 }} />)
              :
              <Button 
                onClick={() => {
                  this.setState({prescriptionBeingCreated:true});
                  this.makePrescription()
                  }}
              >
                  Make Prescription
              </Button>
            }
          </Paper>
          </div>
        )
      }
      else /* Pharmacy */ {
        return(
          <div>
            <Paper className={this.classes.paper}>
            <TextField 
              className={this.classes.TextField} 
              name="patientCPF" 
              id="patientCPF" 
              label="Patient CPF" 
              onChange={(e)=>this.handleChange('patientCPF',e)} 
            />
            <TextField 
              className={this.classes.TextField} 
              name="medicinePIN" 
              id="medicinePIN" 
              label="Medicine PIN" 
              onChange={(e)=>this.handleChange('medicinePIN',e)} 
            />
            
            {
              this.state.prescriptionBeingSold == true ?
              (<CircularProgress size={24} style={{ marginLeft: 15, position: 'relative', top: 4 }} />)
              :
              <Button 
                onClick={() => {
                  this.setState({prescriptionBeingSold:true})
                  this.sellMedicine()
                }}
              >Sell Medicine</Button>
            }
            {/* <Button onClick={() => this.getPrescriptionValidity()}>Get validity</Button> */}
            </Paper>
          </div>
        )
      }
    }
    else{
      return(null)
    }
  }
}


function PrescriptionDialog(props){
  var { open, onClose} = props;

  const [values,setValues] = React.useState({
    visibilityHidden: true,
    pin:props.pin
  })

  React.useEffect(() => {
    if(values.pin != props.pin) {
      setValues({...values, pin: props.pin})
    }
  }, [props])
  // const styles = imageDialogStyles();

  function handleClose() {
    setValues({...values,visibilityHidden:true})
    onClose();
  }

  return(
    <Dialog onClose={handleClose} aria-labelledby="prescription-dialog" open={open} >
      <DialogTitle id="prescription-dialog-title">Prescription PIN</DialogTitle>
      <DialogContent>
        <DialogContentText style={{paddingTop:20}}>
          This is the PIN for your prescription, give this pin to the pharmacy to buy your medicine.
          Be careful! Don't share this PIN with anyone.
        </DialogContentText>

        <TextField 
          type={values.visibilityHidden == true ? 'password' : "text"}
          style={{width:"100%"}}
          value={values.pin}
          InputProps={{
            endAdornment:
              <IconButton onClick={() => setValues({...values, visibilityHidden: values.visibilityHidden == true ? false : true})}>
                {
                  values.visibilityHidden == true ? 
                    <VisibilityOffIcon />
                  :
                    <VisibilityIcon />
                }
              </IconButton>
          }}
        />
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>

      </DialogContent>
    </Dialog>
  )

}


export default withRouter(withStyles(styles)(Home));