import { LightningElement, api, wire, track} from 'lwc';
import printQuoteLines from '@salesforce/apex/QuoteInformation.printQuoteLines'; 
import printQuoteInfo from '@salesforce/apex/QuoteController.printQuoteInfo';

const COLUMNS = [
    { label: 'ID', fieldName: 'id',editable: true  },
    { label: 'Name', fieldName: 'name',editable: true  },
    { type: 'button-icon',initialWidth: 34,typeAttributes:{iconName: 'action:delete',name: 'Hey', variant:'brand'}}
];

export default class AuxiliarShowQuoteLines extends LightningElement {
    columns = COLUMNS; 

    @api recordId = 'a0q5f0000013pc3AAA';
    @track quoteLines = [];
    @track quote; 
    aux55;
    buttonClone; 

    @wire(printQuoteLines, {quoteId: '$recordId'})
    quoteLinesWire({error, data})
    {
        if (data){
            //REMEMBER TO GET THIS INFORMATION, IN THE APEX RETURN A STRING WITH JSON.SERIALIZE(DATA)
            //SEE IN QuoteInformarion.printQuoteLines to undertan the cahanges of it. 
            this.quoteLines = JSON.parse(data);
            this.error = undefined;
        } else if (error){
            this.error = JSON.parse(error.body.message); 
            this.quoteLines = undefined; 
        }
    }
    
    //Chang ethis method to return the serialize string. 
    @wire(printQuoteInfo, {quoteId: '$recordId'})
    quote; 

    //Button for auxiliar jobs
    handleClone(event){
        this.buttonClone === 'Click' ? this.buttonClone = event.target.label :  this.buttonClone = 'Click'; 
    } 
    
    //Button in tables 
    handleRowAction(event){
        if (event.detail.action.name === 'Hey') {
            this.buttonClone === 'Hey' ? this.buttonClone = 'No Hey':  this.buttonClone = 'Hey'; 
            const dataRow = event.detail.row;
            this.aux55 = dataRow.id;
        }
    }

}