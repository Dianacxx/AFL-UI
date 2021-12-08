import { LightningElement, wire, api, track } from 'lwc';
import printQuoteLines from '@salesforce/apex/QuoteController.printQuoteLines'; 
//import addQuoteLine from '@salesforce/apex/QuoteController.addQuoteLine'; 
import saveAndCalculateQuote from '@salesforce/apex/QuoteController.saveAndCalculateQuote';
import saveQuote from '@salesforce/apex/QuoteController.saveQuote';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


import { publish, subscribe, MessageContext } from 'lightning/messageService';
import QLE_CHANNEL from  '@salesforce/messageChannel/Qle_Comms__c';
import TABLE_CHANNEL from '@salesforce/messageChannel/Table_Comms__c'; 
//import PPQ_CHANNEL from  '@salesforce/messageChannel/Product_Plus_Qle_Comms__c';



const COLUMNS = [
    { label: 'ID', fieldName: 'id'},
    { label: 'Name', fieldName: 'name',editable: true},
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
    @api quoteLinesApex; 
    productId; 
    
    @track columns = COLUMNS; 
    @api columnsTiers = COLUMNS_TIERS;   
    @api columnsContracts = COLUMNS_CONTRACTS; 
    @track isLoading = true; 
    
    @track quoteLines = []; 
    @track quoteLinesCopy = []; 
    @track quoteLinesEdit = [];
    //@track quoteLinesDeleted = []; 
    copyQL = false; 
    @track aux = 1; //To change columns
    @track aux2 = 0; //To add products to list 
    @track cloneRows = false; //To clone the rows

    @api popup = "Desclickeado!"; //To see activity
    @api quoteLineRow; //When click buttons from row
    @track modalContainer = false; //To open pop-up
    @track tiersSize = []; //To get tiers information

    //Pagination
    @track startingRecord = 1;
    @track endingRecord = 0; 
    @track page = 1; 
    @track totalRecountCount = 0;
    @track dataPages = []; 
    @track totalPage = 0;
    @track pageSize = 10; 

    connectedCallback() {
        this.subscribeToMessageChannel();
        console.log('RELOADING THE COMP'+this.quoteLinesApex);
        //THIS IS GOING TO CHANGE WHEN VALUES RETURNING FROM PS ARE GOOD
        if (this.quoteLinesApex == '[]'){
            //Quotelines data
            printQuoteLines({quoteId: '$recordId'})
            .then((data) => {
                this.quoteLinesApex = data; 
                this.quoteLinesCopy = JSON.parse(data);
                this.error = undefined;
                console.log('FOUND QUOTELINES');
                this.isLoading = true; 
                this.totalRecountCount = this.quoteLinesCopy.length;  
                this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize); 
                this.dataPages = this.quoteLinesCopy.slice(0,this.pageSize); 
                this.endingRecord = this.pageSize;
            })
            .catch(error => {
                this.errorString = JSON.parse(error.body.message); 
                this.quoteLinesCopy = undefined;
                console.log('RELOAD PAGE NOT FINDING QUOTELINES'); 
            });
        }
        else if(this.quoteLinesApex == '[id: \"none\"]'){
            this.quoteLinesCopy = [];
            console.log('NONE VALUE IN QUOTE'); 
        }
        else {
            //add here when there is no quotelines in the quote to set vlaues as empty array!!!!
            this.quoteLinesCopy = JSON.parse(this.quoteLinesApex);
            //console.log('Parameters'+Object.getOwnPropertyNames(this.quoteLinesCopy[0]));
            console.log('First QuoteLi: Name '+this.quoteLinesCopy[0].name + ' and Id '+ this.quoteLinesCopy[0].id);
            this.totalRecountCount = this.quoteLinesCopy.length;  
            this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize); 
            this.dataPages = this.quoteLinesCopy.slice(0,this.pageSize); 
            this.endingRecord = this.pageSize;
        }        
    }

    previousHandler() {
        if (this.page > 1) {
            this.page = this.page - 1; //decrease page by 1
            this.displayRecordPerPage(this.page);
        }
    }
    nextHandler() {
        if((this.page<this.totalPage) && this.page !== this.totalPage){
            this.page = this.page + 1; //increase page by 1
            this.displayRecordPerPage(this.page);            
        }             
    }
    displayRecordPerPage(page){
        this.startingRecord = ((page -1) * this.pageSize) ;
        this.endingRecord = (this.pageSize * page);
        this.endingRecord = (this.endingRecord > this.totalRecountCount) 
                            ? this.totalRecountCount : this.endingRecord; 
        this.dataPages = this.quoteLinesCopy.slice(this.startingRecord, this.endingRecord);
        this.startingRecord = this.startingRecord + 1;
    }    

    draftValues = [];

    //Editing Table
    handleSave(event){
        this.quoteLinesEdit = event.detail.draftValues; 
        this.popup = "Table Changed"; 
        for (let i =0; i< this.quoteLinesEdit.length; i++){
            console.log('Id editada: '+this.quoteLinesEdit[i].id);
            const index = this.quoteLinesCopy.findIndex(x => x.id === this.quoteLinesEdit[i].id);
            console.log('Index en quoteLinesCopy '+index); 
            this.quoteLinesCopy[index] = this.quoteLinesEdit[i];
            console.log('New data in qlC '+ this.quoteLinesCopy[index].name); 
        }
        this.quoteLinesApex = JSON.stringify(this.quoteLinesCopy); 

        //TO COMMUNICATE THE CHANGES WITH THE PARENTS (TAB SET + UI + ADD PRODUCT)
        event.preventDefault();
        this.dispatchEvent(new CustomEvent('edition', { detail: this.quoteLinesApex }));
        //TO ALERT USER THE CHANGES IN TABLE HAVE BEEN MADE
        console.log('HERE CHANGES EDITING TABLE '+ this.quoteLinesApex);
        
        const evt = new ShowToastEvent({ title: 'Editing Table Values', message: 'Changes Done in Table',
            variant: 'success', mode: 'dismissable' });
        this.dispatchEvent(evt);
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
            //here use the addQuoteLine method to trasform the product into quote
            this.quoteLinesCopy = [...this.quoteLinesCopy, {id: message.recordId[this.aux2], name: 'New Addition'}];
            this.totalRecountCount = this.quoteLinesCopy.length; 
            this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize); 
            this.dataPages = this.quoteLinesCopy.slice(0,this.pageSize); 
            this.endingRecord = this.pageSize;
            this.aux2 += 1; 
            
            this.quoteLinesApex = JSON.stringify(this.quoteLinesCopy); 
            //TO COMMUNICATE THE CHANGES WITH THE PARENTS (TAB SET + UI + ADD PRODUCT)
            this.dispatchEvent(new CustomEvent('edition', { detail: this.quoteLinesApex }));
            //TO ALERT USER THE CHANGES IN TABLE HAVE BEEN MADE
            console.log('HERE ADDITION FROM LOOK UP SEARCH'+this.quoteLinesApex);
        }
        else if (message.recordData == 'Cloned'){
            this.cloneRows = true; 
        }
        else if (message.recordData == 'Reorder'){
            this.popup = 'Reorder'; 
            const payload = { 
                dataTable: this.quoteLinesCopy,
                check: 'PopUpOrder'
            };
            publish(this.messageContext, TABLE_CHANNEL, payload);
        }
        else if (message.recordData == 'Deleting'){
            this.popup = 'Deleting'; 
            this.quoteLinesCopy = message.recordId;
            this.totalRecountCount = this.quoteLinesCopy.length; 
            this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize); 
            this.dataPages = this.quoteLinesCopy.slice(0,this.pageSize); 
            this.endingRecord = this.pageSize;
            let payload = { 
                recordId: null,
                recordData: 'Done'
            };
            publish(this.messageContext, QLE_CHANNEL, payload);
            console.log('When Done '+payload.recordData);
        }
        else if (message.recordData == 'NewOrder'){
            this.popup = 'New order Came'; 
            this.quoteLinesApex = message.recordId; 
            this.quoteLinesCopy = JSON.parse(this.quoteLinesApex);
            this.totalRecountCount = this.quoteLinesCopy.length; 
            this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize); 
            this.dataPages = this.quoteLinesCopy.slice(0,this.pageSize); 
            this.endingRecord = this.pageSize;
        }
    }


    //ASK IF THIS IS THE METHOD TO ADD THOSE
    //@wire(addQuoteLine,{quoteId: '$recordId', productId: '$productId'})

    handleRowSelection(event){
        //AQUI ENVIAR UN MENSAJE EN CANAL PARA ACTIVAR EL BOTON DE CLONAR Y LA INFO PARA CLONAR
        if (this.cloneRows){
            const selectedRows = event.detail.selectedRows;
            for (let i = 0; i < selectedRows.length; i++) {
                //alert('You selected: ' + selectedRows[i].name);
                this.quoteLinesCopy = [...this.quoteLinesCopy, selectedRows[i]];
                 
            }
            this.totalRecountCount = this.quoteLinesCopy.length; 
            this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize);
            this.dataPages = this.quoteLinesCopy.slice(0,this.pageSize); 
            this.endingRecord = this.pageSize;
            this.cloneRows = false;
        }
    }

    //Click to see Tiers and Delete Row (Not working yet)
    handleRowAction(event) {
        //CHECK HERE WHEN THERE ARE NO TIERS!!!!!!!!!!
        if (event.detail.action.name === 'More') {
            this.popup ==="Clickeado!" ? this.popup="Desclickeado!" : this.popup="Clickeado!";
            let dataRow = event.detail.row;
            let row = this.quoteLinesCopy.findIndex(x => x.id === dataRow.id);
            this.totalRecountCount = this.quoteLinesCopy.length; 
            this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize);
            this.dataPages = this.quoteLinesCopy.slice(0,this.pageSize); 
            this.endingRecord = this.pageSize;

            this.quoteLineRow = dataRow;
            this.clickedButtonLabel = true;
            this.tiersSize = JSON.parse(this.quoteLineRow.tiers);
            //ASK HOW MANY TIERS THERE ARE, TO CHANGE THIS
            /*for (var i=0;i<this.tiersSize.length;i++){
                this.tiersData[i] = [ {id: this.tiersSize.id[i], name: this.tiersSize.name[i], upperBound: this.tiersSize.upperBound[i]}];

            }*/ 
            this.tiersData = [ {id: this.tiersSize.id, name: this.tiersSize.name, upperBound: this.tiersSize.upperBound}];
            this.modalContainer = true;

        } else if(event.detail.action.name === 'Delete') {
            let dataRow = event.detail.row;
            let quoteLinesDeleted = this.quoteLinesCopy; 
            let row = quoteLinesDeleted.findIndex(x => x.id === dataRow.id);
            this.popup = "Eliminado: " + dataRow.name + " Row: " + row;
            if (quoteLinesDeleted.length > 1){
                quoteLinesDeleted.splice(row,1); 
            }
            else {
                quoteLinesDeleted = []; 
            }
            let payload = { 
                recordId: quoteLinesDeleted,
                recordData: 'Deleting'
            };
            console.log('When Delete ' +payload.recordData);
            publish(this.messageContext, QLE_CHANNEL, payload);
            
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


    //BUTTON TO ACTIVE THE APEX SAVERS. 
    @api sending; 
    @api spinnerSaving = false; 
    async handleSend(event){
        console.log('BUTTON CLICKED');
        this.sending = JSON.stringify(this.quoteLinesCopy);
        this.popup = 'Sending To Apex';
        var startTime = performance.now();
        this.spinnerSaving = true;
        await 
        saveAndCalculateQuote({quoteId: this.recordId , quoteLines: this.sending})
        .then((result) => {
            console.log("TOTAL value");
            console.log(result);
            this.spinnerSaving = false;
            const evt = new ShowToastEvent({ title: 'Success saving changes', message: 'Changes are saved',
            variant: 'success', mode: 'dismissable' });
            this.dispatchEvent(evt);
        })
        .catch((error) => {
            //console.log(error);
            console.log("THIS ERROR IS THE CONVERTION IN APEX")
            console.log(error);
            console.log(error.status + " " + error.body.message);
            console.log('error.body.stackTrace: '+ error.body.stackTrace);
        })
        var endTime = performance.now();
        console.log(`Call to saveAndCalculateQuote took ${endTime - startTime} milliseconds`);
        console.log('DONE FROM JS');
    }
    
}