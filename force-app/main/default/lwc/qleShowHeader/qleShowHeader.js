import { LightningElement, api, wire, track } from 'lwc';
//import { getRecord } from 'lightning/uiRecordApi';
import printQuoteInfo from '@salesforce/apex/QuoteController.printQuoteInfo'; 


export default class QleShowHeader extends LightningElement {
    
    @track quoteDetail;
    @api recordId;
    @track isLoadingHeader = true; 
    @track totalValue;

    //Quote data
    @wire(printQuoteInfo, {quoteId: '$recordId'})
    quoteDetailWire({error, data}){
        if (data){
            this.quoteDetail = JSON.parse(data);
            //console.log('Name '+this.quoteDetail.name);
            //console.log('Total Value '+this.quoteDetail.totalValue);
            this.error = undefined;
            this.isLoadingHeader = false; 
        } else if (error){
            this.error = JSON.parse(error.body.message);
            this.quoteDetail = undefined; 
        }
    }

}