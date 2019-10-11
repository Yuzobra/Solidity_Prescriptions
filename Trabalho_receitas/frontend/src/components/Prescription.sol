pragma solidity ^0.5.11;

contract Prescription{
    
    constructor() public{ 
        siteWallet = msg.sender;
    }
    
    address siteWallet;
    struct prescriptionInfo {
        string cpfPatient;
        string crmmedic;
        string medicineName;
        bool stillValid;
        uint16 quantity; // in miligrams
        string cnpjPharmacy;
    }
    
    mapping ( bytes32 => prescriptionInfo ) prescriptions;
    
    //fazer o require(cpfMedico != cpfPaciente ) no frontEnd
    function makePrescription(string memory _medicineName, uint16 _quantity, string memory _crm, string memory _cpf, string memory _dateTime) onlyPrescriptionSite() payable public {
        bytes32 hash = keccak256(abi.encodePacked(_crm,_cpf,_dateTime));
        prescriptions[hash] = prescriptionInfo(_cpf,_crm,_medicineName,true,_quantity,"");
    }

    function sellMedicine(string memory _crm,string memory _cpf, string memory _prescriptionDateTime, string memory _cnpjPharmacy) onlyPrescriptionSite() public{
        prescriptionInfo storage prescription = getPrescription(_crm, _cpf, _prescriptionDateTime);
        require(stringsEqual(prescription.cpfPatient, _cpf), "You can only sell the medicine to the prescribed patient");
        require(prescription.stillValid == true, "This prescription has already been used");
        prescription.cnpjPharmacy = _cnpjPharmacy;
        prescription.stillValid = false;
    }

    function getPrescriptionValidity(string memory _crm,string memory _cpf, string memory _prescriptionDateTime) onlyPrescriptionSite() public view returns(bool) {
        prescriptionInfo storage prescription = getPrescription(_crm, _cpf, _prescriptionDateTime);
        return prescription.stillValid;
    }
    
    
    function getPrescription(string memory _crm,string memory _cpf, string memory _prescriptionDateTime) onlyPrescriptionSite() private view returns(prescriptionInfo storage){
        bytes32 hash = keccak256(abi.encodePacked(_crm,_cpf,_prescriptionDateTime));
        prescriptionInfo storage prescription = prescriptions[hash]; // Use of memory to make contract non-payable
        return prescription;
    }

    modifier onlyPrescriptionSite(){
        require(msg.sender == siteWallet, "Please utilize the prescription site to contact this contract.");
        _;
    }
    
    
    function stringsEqual(string storage _a, string memory _b) internal pure returns (bool) {
        if(uint(keccak256(abi.encodePacked(_a))) == uint(keccak256(abi.encodePacked(_b)))) {
    		return true;
    	}
    	else{
    		return false;
    	}
    }
 }