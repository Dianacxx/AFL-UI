import { LightningElement, wire, api, track } from 'lwc';
import printQuoteLines from '@salesforce/apex/QuoteInformation.printQuoteLines'

const COLUMNS = [
    { label: 'Name 1', fieldName: 'Name' },
    { label: 'SBQQ__ProductSubscriptionType__c', fieldName: 'SBQQ__ProductSubscriptionType__c' },
    {type: 'button-icon',initialWidth: 34,typeAttributes:{iconName: 'action:description',name: 'More', variant:'brand'}},
    {type: 'button-icon',initialWidth: 34,typeAttributes:{iconName: 'action:delete',name: 'Delete', variant:'brand'}}
];
const COLUMNS2 = [
    { label: 'Name 2', fieldName: 'Name' },
    { label: 'SBQQ__ProductSubscriptionType__c', fieldName: 'SBQQ__ProductSubscriptionType__c' },
    {type: 'button-icon',initialWidth: 34,typeAttributes:{iconName: 'action:description',name: 'More', variant:'brand'}},
    {type: 'button-icon',initialWidth: 34,typeAttributes:{iconName: 'action:delete',name: 'Delete', variant:'brand'}}
];


export default class QleDataTable extends LightningElement {
    @api recordId;
    //columns = COLUMNS; 
    @track columns; 
    @track quoteLines = []; 
    @track aux; 
    @track datos;
    @track listQuoteLines = []; 
    @track listQuoteLines2 = []; 
    @track addVariable = 'Not Yet';
    @track aux2 = 0; 



    @wire(printQuoteLines, { quoteId: '$recordId'})
    wiredSeatList({error,data}) {
        if (data) {
            for (let key in data) {
               this.quoteLines.push({value:data[key], key:key});
               this.listQuoteLines = [...data[key]];
               this.aux = key; 
               //CHANGE OF COLUMNS DEPENDING DATA RETRIEVING
               if (this.aux == 1){this.columns = COLUMNS;}
               else {this.columns = COLUMNS2;} //Depending key, it shows, columns names. 
            }

        } else if (error) {
            window.console.log(error);
        }
    }

    get datos(){
        const valor = this.aux;
        return valor;
    }

    addRow(){
        this.listQuoteLines2 = [...[this.listQuoteLines[this.aux2]]];
        this.aux2 += 1; 
        this.addVariable = 'Added'; 
    }

    


}