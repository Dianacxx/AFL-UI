import { LightningElement, api, wire, track } from 'lwc';
//import { getRecord } from 'lightning/uiRecordApi';
import printQuoteInfo from '@salesforce/apex/QuoteController.printQuoteInfo'; 


export default class QleShowHeader extends LightningElement {
    
    @track quoteDetail;
    @api recordId;

    //Quote data
    @wire(printQuoteInfo, {quoteId: '$recordId'})
    quoteDetailWire({error, data}){
        if (data){
            this.quoteDetail = JSON.parse(data);
            this.error = undefined;
        } else if (error){
            this.error = JSON.parse(error.body.message);
            this.quoteDetail = undefined; 
        }
    }

}