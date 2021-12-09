import { LightningElement, api , wire, track} from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import levelsOfProductsACA from '@salesforce/apex/QuoteInformation.levelsOfProductsACA'; 
import levelsOfProductsConnectivity from '@salesforce/apex/QuoteInformation.levelsOfProductsConnectivity';

import { publish, MessageContext } from 'lightning/messageService';
import PPQ_CHANNEL from  '@salesforce/messageChannel/Product_Plus_Qle_Comms__c';
import ContactMobile from '@salesforce/schema/Case.ContactMobile';


export default class UiProductSelection extends NavigationMixin(LightningElement) {
    @api recordId; 
    @api quoteLinesApex;
    @api quoteLinesList;  
    @api quoteLine1; 
    @track testValue;
    @track quoteLinesPS;
    
    @track idAuxiliar = 0;

    get quoteLine1() {
        console.log(this.quoteLinesApex);
        if (this.quoteLinesApex){ return 'SOMETHING HAS BEEN SENDED'}
        return 'NOTHING HERE';
        
    }

    handleInputChange(event) {
        this.testValue = event.detail.value;
    }

    connectedCallback(){
        this.quoteLinesPS = JSON.parse(this.quoteLinesApex);
    }


    addToArray(){
        this.idAuxiliar = this.idAuxiliar + 1;
        //console.log('ID ADD VLAUE TO STRING VALUE '+ (this.idAuxiliar.toString()));
        console.log('AUX LENGTH '+  this.quoteLinesPS.length);
        //console.log('this.quoteLinesPS[this.quoteLinesPS.length-1].id ='+this.quoteLinesPS[this.quoteLinesPS.length-1].id);
        //console.log('this.idAuxiliar.toString() = '+this.idAuxiliar.toString());
        //console.log('this.quoteLinesPS[this.quoteLinesPS.length-1].id.concat(this.idAuxiliar.toString()) =' +  this.quoteLinesPS[this.quoteLinesPS.length-1].id.concat(this.idAuxiliar.toString()));
        let nuevaId =  this.quoteLinesPS[this.quoteLinesPS.length-1].id.concat(this.idAuxiliar.toString()); 
        console.log('NEW Id '+ nuevaId); 
        this.quoteLinesPS = [...this.quoteLinesPS, {id: nuevaId, name: this.testValue}];
        console.log('quoteLinesPS push '+ this.quoteLinesPS);
        console.log('quoteLinesPS lenght '+ this.quoteLinesPS.length);
        console.log('quoteLinesPS last name add '+ this.quoteLinesPS[this.quoteLinesPS.length-1].name);
        this.quoteLinesApex = JSON.stringify(this.quoteLinesPS);
        console.log('Adding '+ this.quoteLinesApex);
    }

    handleCancel(){
        var url = window.location.href; 
        var value = url.substr(0,url.lastIndexOf('/') + 1);
        window.history.back();
        return false;
    }

    handleSaveExit(event){
        
        event.preventDefault();
        let componentDef = {
            componentDef: "c:uI",
            attributes: {
                recordId: this.recordId, 
                quoteLinesApex: this.quoteLinesApex,//CHENGE THIS WITH THE LIST OF QUOTES PLUS THE ADDITION IN PS TO RETURN TO UI 
                text: 'SAVE AND EXIT FROM PS', 
            }
        };
        // Encode the componentDefinition JS object to Base64 format to make it url addressable
        let encodedComponentDef = btoa(JSON.stringify(componentDef));
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: '/one/one.app#' + encodedComponentDef
            }
        });
        
    }

    @track productTab; 
    handleActive(event){
        this.productTab = event.target.label;
        switch (event.target.label){
            case 'ACA':
                levelsOfProductsACA()
                .then((result)=>{
                    this.productsList = JSON.parse(result);
                    console.log('LIST OF ACA');
                })
                .catch((error)=>{
                    console.log( 'Error is ' + error.body.message );
                })
                break;
            case 'Connectivity':
                levelsOfProductsConnectivity()
                .then((result)=>{
                    this.productsList = JSON.parse(result);
                    console.log('LIST OF CONNECTIVITY');
                })
                .catch((error)=>{
                    console.log( 'Error is ' + error.body.message );
                })
                break; 
            case 'Fiber Optic Cable':
                console.log('Tab '+ this.productTab);
                break;
            case 'Cable':
                console.log('Tab '+ this.productTab);
                break; 
            case 'Test & Inspection':
                console.log('Tab '+ this.productTab);
                break;
            case 'Manual Items':
                console.log('Tab '+ this.productTab);
                break; 
            default: 
                console.log('No Tab Selected');
                break;
        }

    }

}