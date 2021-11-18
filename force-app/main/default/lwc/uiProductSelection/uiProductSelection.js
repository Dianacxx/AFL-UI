import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class UiProductSelection extends NavigationMixin(LightningElement) {
    @api recordId; 

    handleSaveExit(){
        //JUST NAVIGATE
    }
}