import { LightningElement , api, wire, track} from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import printListAmount from '@salesforce/apex/QuoteInformation.printListAmount';

export default class QleAddProductSection extends NavigationMixin(LightningElement) {
    //@api totalQuote = 1345692;
    @api recordId;

    //GETTING LIST AMOUNT TO SHOW IN QUOTE TOTAL VALUE
    @wire(printListAmount, {quoteId: '$recordId'})
    totalQuote; 

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
    
}