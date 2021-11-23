import { LightningElement, wire, api, track } from 'lwc';
import printQuoteLines from '@salesforce/apex/QuoteController.printQuoteLines'; 
//import addQuoteLine from '@salesforce/apex/QuoteController.addQuoteLine'; 

import { publish, subscribe, MessageContext } from 'lightning/messageService';
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

//TRY TO CHANGE THIS WITH                             
//<!--Tier Name - Number - Discount-->
const COLUMNS_TIERS = [
    { label: 'Tier Id', fieldName: 'id' },
    { label: 'Tier Name', fieldName: 'name' },
    { label: 'Upper Bound', fieldName: 'upperBound' },
];

const COLUMNS_CONTRACTS = [
    { label: 'Tier Id', fieldName: 'id' },
    { label: 'Tier Name', fieldName: 'name' },
    { label: 'Upper Bound', fieldName: 'upperBound' },
];
/*CHANGE TO CONTRACTS  <!--Contract - Effective Date - Price-->
{ label: 'Contract', fieldName: 'contract' },
            { label: 'Effective Date', fieldName: 'effectiveDate', type: 'date' },
            { label: 'Price', fieldName: 'price', type: 'currency' },
*/

export default class QleDataTable extends LightningElement {
    @api recordId;
    productId; 
    
    @track columns; 
    @api columnsTiers = COLUMNS_TIERS;   
    @api columnsContracts = COLUMNS_CONTRACTS; 

    
    @track quoteLines = []; 
    @track quoteLinesCopy = []; 
    copyQL = false; 
    @track aux = 1; //To change columns
    @track aux2 = 0; //To add products to list 
    @track cloneRows = false; //To clone the rows

    @api popup = "Desclickeado!"; //To see activity
    @api quoteLineRow; //When click buttons from row
    @track modalContainer = false; //To open pop-up
    @track tiersSize = []; //To get tiers information


    //Quotelines data
    @wire(printQuoteLines, {quoteId: '$recordId'})
    quoteLinesWire({error, data})
    {
        if (data){
            this.quoteLines = JSON.parse(data);
            if (!this.copyQL){
                this.quoteLinesCopy = this.quoteLines; 
                this.copyQL = true; 
            }
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
        this.popup = message.recordData; 
        if (message.recordData == 'Checked'){
            this.productId = message.recordId;
            this.quoteLinesCopy = [...this.quoteLinesCopy, {id: message.recordId[this.aux2], name: 'New Addition'}];
            this.aux2 += 1; 
        }
        else if (message.recordData == 'Cloned'){
            this.cloneRows = true; 
        }
        else if (message.recordData == 'Reorder'){
            this.popup = 'Reorder'; 
            const payload = { 
                recordId: this.quoteLinesCopy,
                recordData: 'Reordering'
            };
            publish(this.messageContext, QLE_CHANNEL, payload);
        }
    }
    connectedCallback() {
        this.subscribeToMessageChannel();
    }
    //ASK IF THIS IS THE METHOD TO ADD THOSE
    //@wire(addQuoteLine,{quoteId: '$recordId', productId: '$productId'})

    getSelectedName(event){
        if (this.cloneRows){
            const selectedRows = event.detail.selectedRows;
            for (let i = 0; i < selectedRows.length; i++) {
                //alert('You selected: ' + selectedRows[i].name);
                this.quoteLinesCopy = [...this.quoteLinesCopy, selectedRows[i]];
            }
            this.cloneRows = false;
        }
    }

    //Click to see Tiers and Delete Row (Not working yet)
    handleRowAction(event) {
        if (event.detail.action.name === 'More') {
            this.popup ==="Clickeado!" ? this.popup="Desclickeado!" : this.popup="Clickeado!";
            let dataRow = event.detail.row;
            let row = this.quoteLines.findIndex(x => x.id === dataRow.id);
            this.quoteLineRow = dataRow;
            this.clickedButtonLabel = true;
            this.tiersSize = JSON.parse(this.quoteLineRow.tiers);
            //ASK HOW MANY TIERS THERE ARE, TO CHANGE THIS
            /*for (var i=0;i<this.tiersSize.length;i++){
                this.tiersData[i] = [ {id: this.tiersSize.id[i], name: this.tiersSize.name[i], upperBound: this.tiersSize.upperBound[i]}];

            }*/ 
            this.tiersData = [ {id: this.tiersSize.id, name: this.tiersSize.name, upperBound: this.tiersSize.upperBound}];
            /*[
                {id: '123', name: 'Tier 1', upperBound:5},
                {id: '124', name: 'Tier 2', upperBound:6},
                {id: '122', name: 'Tier 3', upperBound:9}
            ];*/
            //
            this.modalContainer = true;

        } else if(event.detail.action.name === 'Delete') {
            let dataRow = event.detail.row;
            let row = this.quoteLinesCopy.findIndex(x => x.id === dataRow.id);
            this.popup = "Eliminado: " + dataRow.name + " Row: " + row;
            this.quoteLinesCopy.splice(row,1); 
            this.quoteLines =  this.quoteLinesCopy;
        }
    }

    //To close the pop-up
    closeModalAction(){
        this.modalContainer=false;
    }


    //Table information in Tiers and Contracts
    clickedButtonLabel = true;
    handleClick1(event) {
        this.clickedButtonLabel = true;
    }
    handleClick2(event) {
        this.clickedButtonLabel = false;
    }
    
    handleResize(event) {
        const sizes = event.detail.columnWidths;
    }


}