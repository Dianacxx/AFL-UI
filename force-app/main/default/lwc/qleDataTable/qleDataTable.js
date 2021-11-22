import { LightningElement, wire, api, track } from 'lwc';
import printQuoteLines from '@salesforce/apex/QuoteController.printQuoteLines'; 
//import addQuoteLine from '@salesforce/apex/QuoteController.addQuoteLine'; 

import { subscribe, MessageContext } from 'lightning/messageService';
import QLE_CHANNEL from  '@salesforce/messageChannel/Qle_Comms__c';



const COLUMNS = [
    { label: 'ID', fieldName: 'id'},
    { label: 'Name', fieldName: 'name',editable: true},
    { type: 'button-icon',initialWidth: 34,typeAttributes:{iconName: 'action:description', name: 'More', variant:'brand'}},
    { type: 'button-icon',initialWidth: 34,typeAttributes:{iconName: 'action:delete', name: 'Delete', variant:'brand'}}
];
const COLUMNS2 = [
    { label: 'ID 2', fieldName: 'id'},
    { label: 'Name 2', fieldName: 'name',editable: true},
    { type: 'button-icon',initialWidth: 34,typeAttributes:{iconName: 'action:description', name: 'More', variant:'brand'}},
    { type: 'button-icon',initialWidth: 34,typeAttributes:{iconName: 'action:delete', name: 'Delete', variant:'brand'}}
];


export default class QleDataTable extends LightningElement {
    @api recordId;
    productId; 
    
    @track columns;    
    
    @track quoteLines = []; 
    @track quoteLinesCopy = []; 
    @track aux = 1; 
    @track addVariable = 'Not Yet';
    @track aux2 = 0; 

    @api popup = "Desclickeado!";
    @api quoteLineRow;
    @track modalContainer = false;


    //Quotelines data
    @wire(printQuoteLines, {quoteId: '$recordId'})
    quoteLinesWire({error, data})
    {
        if (data){
            this.quoteLines = JSON.parse(data);
            this.error = undefined;
            //To change the columns value
            if (this.aux === 1){
                this.columns = COLUMNS; 
            } else {
                this.columns = COLUMNS2; 
            }
        } else if (error){
            this.error = JSON.parse(error.body.message); 
            this.quoteLines = undefined; 
        }
    }
    //Add rows to table (ADDING FROM THE SAME LIST, MISSING ADDING FROM LOOK UP FIELD)
    @wire(MessageContext)
    messageContext;
    subscribeToMessageChannel() {
        this.subscription = subscribe(
          this.messageContext,
          QLE_CHANNEL,
          (message) => this.handleMessage(message)
        );
    }
    handleMessage(message) {
        this.productId = message.recordId;
        this.quoteLines = [...this.quoteLines, {id: message.recordId[this.aux2], name: 'New Addition'}];
        this.aux2 += 1; 
    }
    connectedCallback() {
        this.subscribeToMessageChannel();
    }
    //ASK IF THIS IS THE METHOD TO ADD THOSE
    //@wire(addQuoteLine,{quoteId: '$recordId', productId: '$productId'})


    //Click to see Tiers and Delete Row (Not working yet)
    handleRowAction(event) {
        if (event.detail.action.name === 'More') {
            this.popup ==="Clickeado!" ? this.popup="Desclickeado!" : this.popup="Clickeado!";
            const dataRow = event.detail.row;
            this.quoteLineRow = dataRow;
            this.modalContainer = true;

        } else if(event.detail.action.name === 'Delete') {
            let dataRow = event.detail.row;
            let row = this.quoteLines.findIndex(x => x.id === dataRow.id);
            this.popup = "Eliminado: " + dataRow.name + " Row: " + row;
            this.quoteLines.splice(row,1); 
        }
    }

    //To close the pop-up
    closeModalAction(){
        this.modalContainer=false;
    }


    //Table information in Tiers and Contracts
    clickedButtonLabel = true;
    @api columnsTiers; 

    handleClick1(event) {
        this.clickedButtonLabel = true;
        this.columnsTiers = [
            { label: 'Tier Name', fieldName: 'name' },
            { label: 'Number', fieldName: 'number', type: 'number' },
            { label: 'Discount', fieldName: 'discount', type: 'number' },
        ];
    }
    handleClick2(event) {
        this.clickedButtonLabel = false;
        this.columnsTiers = [
            { label: 'Contract', fieldName: 'contract' },
            { label: 'Effective Date', fieldName: 'effectiveDate', type: 'date' },
            { label: 'Price', fieldName: 'price', type: 'currency' },
        ];
    }
    


}