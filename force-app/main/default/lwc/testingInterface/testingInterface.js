import { api, LightningElement, track, wire } from 'lwc';
/** get the current Quote's ID */
// import Id from '@salesforce/sbqq__quote__c/Id';
import printQuote from '@salesforce/apex/QuoteController.printQuoteInfo';
import addQuoteLine from '@salesforce/apex/QuoteController.addQuoteLine';

export default class TestingInterface extends LightningElement {
    @track quote;
    @wire (printQuote,{quoteId: '$Id'})quotes;
    handleLoad(event){
        this.quote = event.target.value;
      }
    // // @track quoteId = Id;
    // @api printQuote;
    // @api quoteId;
    // @track error;

    // handleLoad() {
    //     printQuote({quoteId: this.quoteId})
    //         .then(result => {
    //             this.printQuote = result;
    //         })
    //         .catch(error => {
    //             this.error = error;
    //         });
    // }
}