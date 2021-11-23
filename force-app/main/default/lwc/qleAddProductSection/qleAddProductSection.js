import { LightningElement , api, wire, track} from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import printListAmount from '@salesforce/apex/QuoteInformation.printListAmount';

import { subscribe, publish, MessageContext } from 'lightning/messageService';
import QLE_CHANNEL from  '@salesforce/messageChannel/Qle_Comms__c';

const COLUMNS = [
    { label: 'ID', fieldName: 'id'},
    { label: 'Name', fieldName: 'name'},
];

export default class QleAddProductSection extends NavigationMixin(LightningElement) {
    //@api totalQuote = 1345692;
    @api recordId;
    @api quoteLinesOrder = []; 
    @track dragStart;
    @track columns = COLUMNS;
    //------CHANNEL TO SEND INFORMATION
    @wire(MessageContext)
    messageContext;

    //GETTING LIST AMOUNT TO SHOW IN QUOTE TOTAL VALUE
    @wire(printListAmount, {quoteId: '$recordId'})
    totalQuote; 

    //POP UP TO REORDER LINES IN TABLE
    @track isModalOpen = false;
    openModal() {
        this.isModalOpen = true;
        //SENDING MESSAGE TO CHANNEL
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
    navitageToLWCWithoutAura(event) {
        event.preventDefault();
        let componentDef = {
            componentDef: "c:uiProductSelection",
            attributes: {
                recordId: '$recordId'
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
          QLE_CHANNEL,
          (message) => this.handleMessage(message)
        );
    }
    handleMessage(message) { 
        if (message.recordData == 'Reordering'){
            this.quoteLinesOrder = message.recordId;
            this.popup = message.recordData;
        }
    }
    connectedCallback() {
        this.subscribeToMessageChannel();
    }
    
}