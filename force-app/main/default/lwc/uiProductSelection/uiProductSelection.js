import { LightningElement, api , wire, track} from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import levelsOfProductsACA from '@salesforce/apex/QuoteInformation.levelsOfProductsACA'; 
import levelsOfProductsConnectivity from '@salesforce/apex/QuoteInformation.levelsOfProductsConnectivity';

import { publish, MessageContext } from 'lightning/messageService';
import PPQ_CHANNEL from  '@salesforce/messageChannel/Product_Plus_Qle_Comms__c';


export default class UiProductSelection extends NavigationMixin(LightningElement) {
    @api recordId; 
    @api quoteLines; 
    @api quoteLine1; 

    get quoteLine1() {
        return this.quoteLines.length; //Object.getOwnPropertyNames(this.quoteLines);
    }

    handleSaveExit(){
        //JUST NAVIGATE
        var url = window.location.href; 
        var value = url.substr(0,url.lastIndexOf('/') + 1);
        window.history.back();
        return false;
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