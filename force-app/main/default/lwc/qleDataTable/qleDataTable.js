import { LightningElement, wire, api, track } from 'lwc';
import printQuoteLines from '@salesforce/apex/QuoteInformation.printQuoteLines'

const COLUMNS = [
    { label: 'Name 1', fieldName: 'Name',editable: true  },
    { label: 'SBQQ__ProductSubscriptionType__c', fieldName: 'SBQQ__ProductSubscriptionType__c',editable: true  },
    { type: 'button-icon',initialWidth: 34,typeAttributes:{iconName: 'action:description', name: 'More', variant:'brand'}},
    { type: 'button-icon',initialWidth: 34,typeAttributes:{iconName: 'action:delete', name: 'Delete', variant:'brand'}}
];
const COLUMNS2 = [
    { label: 'Name 2', fieldName: 'Name',editable: true },
    { label: 'SBQQ__ProductSubscriptionType__c', fieldName: 'SBQQ__ProductSubscriptionType__c' , editable: true },
    { type: 'button-icon',initialWidth: 34,typeAttributes:{iconName: 'action:description',name: 'More', variant:'brand'}},
    { type: 'button-icon',initialWidth: 34,typeAttributes:{iconName: 'action:delete',name: 'Delete', variant:'brand'}}
];

const COLUMN = [
    { type: 'button-icon',initialWidth: 34,typeAttributes:{iconName: 'action:delete',name: 'Delete', variant:'brand'}},
];

export default class QleDataTable extends LightningElement {
    @api recordId;
    @api column1 = COLUMN; 
    @track columns; 
    @track quoteLines = []; 
    @track aux; 
    @track datos;
    @track listQuoteLines = []; 
    @track listQuoteLines2 = []; 
    @track addVariable = 'Not Yet';
    @track aux2 = 0; 

    @api popup = "Desclickeado!";
    @api contactRow={};
    @track rowOffset = 0;  
    @track modalContainer = false;

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
               this.aux = key; 
        }
        else if (error) {
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

    clickedButtonLabel;

    handleClick(event) {
        this.clickedButtonLabel = event.target.label;
        this.modalContainer == true ? this.modalContainer = false : this.modalContainer = true;
    }



    //Click to see Tiers
    handleRowAction(event) {
        if (event.detail.action.name === 'More') {
            this.popup ==="Clickeado!" ? this.popup="Desclickeado!" : this.popup="Clickeado!";
            const dataRow = event.detail.row;
            this.contactRow = dataRow;
            this.modalContainer = true;

        } else if(event.detail.action.name === 'Delete') {
            const dataRow = event.detail.row;
            this.contactRow = dataRow;
            this.popup="Eliminado! "+ dataRow.FirstName;

            //No elimina de tabla!
            //const index = this.contacts.indexOf(dataRow.FirstName); 
            //this.contacts.splice(index,1); 
        } /*else if(event.detail.action.name === 'newContactAdded'){
            this.contactsToShow = this.contacts; 
            this.popup="RowAdded ";
        }*/
    }

    //To close the pop-up
    closeModalAction(){
        this.modalContainer=false;
    }


    //Table information in Tiers and Contracts
    clickedButtonLabel = true;
    @api columnsTiers; 
    //@track dataParent; 
    handleClick1(event) {
        this.clickedButtonLabel = true;
        this.columnsTiers = [
            { label: 'Tier Name', fieldName: 'name' },
            { label: 'Number', fieldName: 'number', type: 'number' },
            { label: 'Discount', fieldName: 'discount', type: 'number' },
        ];
        //this.dataParent = contactRow;
    }
    handleClick2(event) {
        this.clickedButtonLabel = false;
        this.columnsTiers = [
            { label: 'Contract', fieldName: 'contract' },
            { label: 'Effective Date', fieldName: 'effectiveDate', type: 'date' },
            { label: 'Price', fieldName: 'price', type: 'currency' },
        ];
        //this.dataParent = contactRow;
    }
    


}