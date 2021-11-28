import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class UiProductSelection extends NavigationMixin(LightningElement) {
    @api recordId; 

    handleSaveExit(){
        //JUST NAVIGATE
        var url = window.location.href; 
        var value = url.substr(0,url.lastIndexOf('/') + 1);
        window.history.back();
        return false;
    }
}