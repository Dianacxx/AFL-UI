import { LightningElement , api} from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class ButtonOpenUi extends NavigationMixin(LightningElement) {
    clickedButtonLabel;
    @api recordId;

     handleNavigate() {
        var compDefinition = {
            componentDef: "c:uI",
            attributes: {
                recordId: this.recordId
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