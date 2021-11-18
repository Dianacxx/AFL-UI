import { LightningElement, wire, api, track } from 'lwc';
import printQuoteLines from '@salesforce/apex/QuoteInformation.printQuoteLines'

const COLUMNS = [
    { label: 'Name', fieldName: 'Name' },
    { label: 'SBQQ__ProductSubscriptionType__c', fieldName: 'SBQQ__ProductSubscriptionType__c' },
];
const COLUMNS2 = [
    { label: 'Phone', fieldName: 'Phone' },
    { label: 'SBQQ__ProductSubscriptionType__c', fieldName: 'SBQQ__ProductSubscriptionType__c' },
];


export default class QleDataTable extends LightningElement {
    @api recordId;
    //columns = COLUMNS; 
    @track columns; 
    @track quoteLines = []; 
    @track aux;
    @track aux2; 
    @track datos;
    
    @wire(printQuoteLines, { quoteId: '$recordId'})
    wiredSeatList({error,data}) {
        if (data) {
            for (let key in data) {
               this.quoteLines.push({value:data[key], key:key});
               this.aux = key; 
            }
            //this.aux = this.quoteLines.values()(0);
            //this.aux2 = this.aux[0];

        } else if (error) {
            window.console.log(error);
        }
    }

    get datos(){
        const valor = this.aux;
        return valor;
    }

    get columns(){
        if( this.datos == 1 ){
            const columnas = COLUMNS; 
            return columnas;
        }
        else {
            const columnas = COLUMNS2; 
            return columnas;
        }
    }
}