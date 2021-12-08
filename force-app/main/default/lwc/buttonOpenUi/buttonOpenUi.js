import { LightningElement , api, wire} from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import printQuoteLines from '@salesforce/apex/QuoteController.printQuoteLines'; 
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


export default class ButtonOpenUi extends NavigationMixin(LightningElement) {
    clickedButtonLabel;
    @api recordId;
    @api quoteLinesString;
    @api isLoading = false; 

    //Quotelines data
    @wire(printQuoteLines, {quoteId: '$recordId'})
    quoteLinesWire({error, data})
    {
        if (data){
            this.quoteLinesString = data;//JSON.parse(data);
            this.error = undefined;
            console.log('QuoteLines In String');
            this.isLoading = true; 
            console.log('Values: '+this.quoteLinesString); 
        } else if (error){
            this.errorString = error.body.message;//JSON.parse(error.body.message); 
            this.quoteLinesString = undefined;
            console.log('QuoteLines ERROR in string'); 
        }
    }


     handleNavigate() {
         
         if (!(this.quoteLinesString == '[]')){
            var compDefinition = {
                componentDef: "c:uI",
                attributes: {
                    recordId: this.recordId,
                    quoteLinesApex:  this.quoteLinesString, 
                    text: 'Recived'
                }
            };
            // Base64 encode the compDefinition JS object
            var encodedCompDef = btoa(JSON.stringify(compDefinition));
            this[NavigationMixin.Navigate]({
                type: 'standard__webPage',
                attributes: {
                    url: '/one/one.app#' + encodedCompDef
                }
            });
         }
        else if (this.quoteLinesString == '[]'){
            this.quoteLinesString = '[id: \"none\"]';
            console.log(this.quoteLinesString);

            const evt = new ShowToastEvent({ title: 'This Quote has no quotelines', message: 'There are no quotelines yet',
            variant: 'warning', mode: 'dismissable' });
            this.dispatchEvent(evt);

            var compDefinition = {
                componentDef: "c:uI",
                attributes: {
                    recordId: this.recordId,
                    quoteLinesApex:  this.quoteLinesString, 
                    text: 'Recived'
                }
            };
            // Base64 encode the compDefinition JS object
            var encodedCompDef = btoa(JSON.stringify(compDefinition));
            this[NavigationMixin.Navigate]({
                type: 'standard__webPage',
                attributes: {
                    url: '/one/one.app#' + encodedCompDef
                }
            });
        }
    }
}