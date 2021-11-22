import { LightningElement, wire, api, track } from 'lwc';
import printQuoteLines from '@salesforce/apex/QuoteController.printQuoteLines'; 

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
    
    @track columns;    
    
    @track quoteLines = []; 
    @track aux = 2; 
    @track listQuoteLines = []; 
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

    /*@wire(printQuoteLines, { quoteId: '$recordId'})
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
    }*/

    //Add rows to table (Not working yet)
    addRow(){
        this.listQuoteLines = this.quoteLines[this.aux2];
        this.aux2 += 1; 
        this.addVariable = 'Added'; 
    }

    //Click to see Tiers and Delete Row (Not working yet)
    handleRowAction(event) {
        if (event.detail.action.name === 'More') {
            this.popup ==="Clickeado!" ? this.popup="Desclickeado!" : this.popup="Clickeado!";
            const dataRow = event.detail.row;
            this.quoteLineRow = dataRow;
            this.modalContainer = true;

        } else if(event.detail.action.name === 'Delete') {
            const dataRow = event.detail.row;
            this.quoteLineRow = dataRow;
            this.popup="Eliminado: "+ quoteLineRow.Name;
            const index = this.quoteLines.indexOf(quoteLineRow); 
            this.quoteLines.splice(index,1); 
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