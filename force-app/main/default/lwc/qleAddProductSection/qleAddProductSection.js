import { LightningElement , api, wire, track} from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import printQuoteInfo from '@salesforce/apex/QuoteController.printQuoteInfo'; 

import { subscribe, publish, MessageContext } from 'lightning/messageService';
import QLE_CHANNEL from  '@salesforce/messageChannel/Qle_Comms__c';
import TABLE_CHANNEL from '@salesforce/messageChannel/Table_Comms__c'; 

const COLUMNS = [
    { label: 'ID', fieldName: 'id'},
    { label: 'Name', fieldName: 'name'},
];

export default class QleAddProductSection extends NavigationMixin(LightningElement) {
    //Send string trought LWC to keep data
    @api quoteLinesApex; 

    //To display the total value
    @track totalValueQuote; 
    @track totalValue; 
    //Reorder the quotelines
    @api recordId;
    @track quoteLinesOrder = []; 
    @track dragStart;
    @track columns = COLUMNS;
    //--THE POP-UP TABLE + DRAG AND DROP ACTION
    @track quoteLinesReorder;
    @track dragStart;
    @track ElementList = []; 
    @api longitud; 
      
    @track PopUpReorder =''; 
     
    //---DRAG SITUATION ---------------
     DragStart(event) {
        this.dragStart = event.target.title;
        event.target.classList.add("drag");
      }
      DragOver(event) {
        event.preventDefault();
        return false;
      }
      Drop(event) {
        event.stopPropagation();
        const DragValName = this.dragStart;
        const DropValName = event.target.title;
        if (DragValName === DropValName) {
          return false;
        }
        const index = DropValName;
        const currentIndex = DragValName;
        const newIndex = DropValName;
        Array.prototype.move = function (from, to) {
          this.splice(to, 0, this.splice(from, 1)[0]);
        };
        this.ElementList.move(currentIndex, newIndex);
      }

    //------CHANNEL TO SEND INFORMATION
    @wire(MessageContext)
    messageContext;

    //GETTING LIST AMOUNT TO SHOW IN QUOTE TOTAL VALUE
    @wire(printQuoteInfo, {quoteId: '$recordId'})
    quoteTotalValue({error, data}){
        if (data){
            this.totalValueQuote = JSON.parse(data);
            console.log('VALUE RECIVED '+ this.totalValueQuote.totalValue);
            this.totalValue = this.totalValueQuote.totalValue;
            this.error = undefined;
            //this.isLoadingHeader = false; 
        } else if (error){
            this.error = JSON.parse(error.body.message);
            this.totalValueQuote = undefined; 
            this.totalValue = undefined;
        }
    }

    //POP UP TO REORDER LINES IN TABLE
    @track isModalOpen = false;
    openModal() {
        this.isModalOpen = true;
        //SENDING MESSAGE TO CHANNEL OPEN POP UP
        const payload = { 
            recordId: null,
            recordData: 'Reorder'
        };
        publish(this.messageContext, QLE_CHANNEL, payload);

    }

    closeModal() {
        this.isModalOpen = false;
    }

    submitDetails() {
        // to close modal set isModalOpen tarck value as false
        //Add your code to call apex method or do some processing
        this.quoteLinesApex = JSON.stringify(this.ElementList);
        //TO COMMUNICATE THE CHANGES WITH THE PARENTS (TAB SET + UI + ADD PRODUCT)
        const payload = { 
            recordId: this.quoteLinesApex,
            recordData: 'NewOrder'
        };
        publish(this.messageContext, QLE_CHANNEL, payload);
        console.log('HERE REORDERED TABLE '+ this.quoteLinesApex);
        this.isModalOpen = false;

    }

    //NAVIGATE TO QUOTE RECORD PAGE (MISSING SAVING INFORMATION)
    navigateToQuoteRecordPage() {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.recordId,
                objectApiName: this.objectApiName,
                actionName: 'view'
            },
        });
    }

    //NAVIGATION TO PRODUCT SELECTION PAGE
    navitageToProductSelection(event) {

        //this.dispatchEvent(new CustomEvent('openproductselection'));
        //console.log('CAMBIE!'); 
        event.preventDefault();
        let componentDef = {
            componentDef: "c:uiProductSelection",
            attributes: {
                recordId: this.recordId,
                quoteLinesApex: this.quoteLinesApex, //THIS HAS TO CHANGE TO quoteLinesCopy
            }
        };
        // Encode the componentDefinition JS object to Base64 format to make it url addressable
        let encodedComponentDef = btoa(JSON.stringify(componentDef));
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: '/one/one.app#' + encodedComponentDef
            }
        });
    }
    
    //TO CLONE SELECTED ROWS IN TABLE
    cloneRowsInTable(){
        //SENDING MESSAGE TO CHANNEL
        const payload = { 
            recordId: null,
            recordData: 'Cloned'
        };
        publish(this.messageContext, QLE_CHANNEL, payload);
    }

    subscribeToMessageChannel() {
        this.subscription = subscribe(
          this.messageContext,
          TABLE_CHANNEL,
          (message) => this.handleMessage(message)
        );
    }
    handleMessage(message) { 
        if (message.check == 'PopUpOrder'){
            this.ElementList = [];
            this.PopUpReorder = 'Hey';
            this.quoteLinesOrder = message.dataTable;
            this.longitud = this.quoteLinesOrder.length; 
            /*
            if (this.longitud <=  this.ElementList.length){
                
            }*/
            for(let i=0; i< this.longitud; i++){
                this.ElementList.push(this.quoteLinesOrder[i]); 
            } 
            //this.PopUpReorder = message.check;
            console.log('quoteLinesOrder properties: '+Object.getOwnPropertyNames(this.quoteLinesOrder[0]));
            console.log('ElementList properties: '+Object.getOwnPropertyNames(this.ElementList[0]));

        }
    }
    connectedCallback() {
        this.subscribeToMessageChannel();
    }
    
}