import { LightningElement, api, track } from 'lwc';

export default class UI extends LightningElement {
    @api recordId;
    @api quoteLinesApex; 
    @api objectApiName; 
    @api text; 
    @track UI = false; 

    editTable(event){
        console.log('IS IN THE UI');
        console.log(Object.getOwnPropertyNames(event));
        this.quoteLinesApex = event.detail; 
        console.log('Totally Legal');
    }
}