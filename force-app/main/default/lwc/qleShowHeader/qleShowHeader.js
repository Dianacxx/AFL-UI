import { LightningElement, api, wire, track } from 'lwc';
//import { getRecord } from 'lightning/uiRecordApi';
//import printQuote from '@salesforce/apex/QuoteController.printQuote';
import printHeader from '@salesforce/apex/QuoteInformation.printHeader';
import printName from '@salesforce/apex/QuoteInformation.printName';

export default class QleShowHeader extends LightningElement {
    @track quote; 
    @api recordId;
    accData;
    finalData;

    //a0q5f000001B124AAC
    @wire(printHeader, { quoteId: '$recordId'})
    quote; 
    
    @wire(printName, { quoteId: '$recordId'})
    name; 
    /*
    get name(){
        
    }
    /*
    get sbqqStatus() {
        return this.quote.fields.SBQQ__Status__c.value;
    }
    /*
    get fields(){
        return this.quote.data.fields;
    }
    get sbqqAccount() {
        return this.quote.data.fields.QuoteID.value;
    }

    get accountSla() {
        return this.quote.data.fields.PricebookEntryId.value;
    }

    get sbqqType() {
        return this.quote.data.fields.Discount.value;
    }
    
    get sbqqExpirationDate() {
        return this.quote.data.fields.Unitprice.value;
    }
    */
}