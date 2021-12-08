import { LightningElement, api, track, wire} from 'lwc';
import printQuoteInfo from '@salesforce/apex/QuoteController.printQuoteInfo'; 
import { NavigationMixin } from 'lightning/navigation';
import { publish, subscribe, MessageContext } from 'lightning/messageService';
import QLE_CHANNEL from  '@salesforce/messageChannel/Qle_Comms__c';

export default class UI extends NavigationMixin(LightningElement) {
    @api recordId;
    @api quoteLinesApex; 
    @api objectApiName; 
    @api text; 
    @track UI = false; 
    //QuoteLines as objects
    @track quoteLinesObj; 
    //To show Quote Line total information
    @api quoteDetail; 
    @api totalValue; 

    //THE POP-UP TABLE + DRAG AND DROP ACTION
    @track dragStart;
    @track ElementList; 
    @api longitud; 
    @track PopUpReorder =''; 


   

    connectedCallback(){
        //this.subscribeToMessageChannel();

        console.log(this.quoteLinesApex);
        if(this.quoteLinesApex == '[id: \"none\"]'){
            this.quoteLinesObj = [];
            console.log('NONE VALUE IN QUOTE'); 

        } else {
            console.log(this.quoteLinesApex);
            console.log(JSON.parse(this.quoteLinesApex));
            this.quoteLinesObj = JSON.parse(this.quoteLinesApex);
        }
       
       this.ElementList = this.quoteLinesObj;
       this.longitud = this.ElementList.length; 
    }

    //message when edited the table FROM CLIND TO PARENT
    editTable(event){
        console.log('IS IN THE UI');
        //console.log(Object.getOwnPropertyNames(event));
        this.quoteLinesApex = event.detail; 
        this.quoteLinesObj = JSON.parse(this.quoteLinesApex);
        this.ElementList = this.quoteLinesObj;
        console.log('Totally Legal');
    }

    //EXAMPLE TO DISPLAY VALUES IN COMBOBOX OF DISCCOUNT 
    get optionsExample() {
        return [
            { label: 'Discount 1', value: 'Discount1' },
            { label: 'Discount 2', value: 'Discount2' },
            { label: 'Discount 3', value: 'Discount3' },
            { label: 'Discount 4', value: 'Discount4' },
            { label: 'Discount 5', value: 'Discount5' },
        ];
    }
    //SEE THIS IS NOT WORKING TO MANAGE CHANGES
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
        console.log('Channel Movement');
        console.log('Data '+message.recordData);
        console.log('Id '+message.recordId);
    }

    //QUOTE TOTAL VALUE INFORMATION
    @wire(printQuoteInfo, {quoteId: '$recordId'})
    quoteDetailWire({error, data}){
        if (data){
            this.quoteDetail = JSON.parse(data);
            this.totalValue = this.quoteDetail.totalValue; 
            this.error = undefined;
            this.isLoadingHeader = false; 
        } else if (error){
            this.error = JSON.parse(error.body.message);
            this.quoteDetail = undefined; 
        }
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

    //POP UP TO REORDER LINES IN TABLE
    @track isModalOpen = false;
    openModal() {
        this.isModalOpen = true;
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

}