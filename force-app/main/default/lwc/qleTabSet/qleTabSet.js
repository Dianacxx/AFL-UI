import { LightningElement, api} from 'lwc';

export default class QleTabSet extends LightningElement {
    @api recordId;
    @api quoteLinesApex; 

    editedTable(event){
         //this.quoteLinesApex = event.detail;
        //TO COMMUNICATE THE CHANGES WITH THE PARENTS (TAB SET + UI + ADD PRODUCT)
        console.log('IS IN THE tab set');
        event.preventDefault();
        this.dispatchEvent(new CustomEvent('editionparent', { detail: event.detail}));
        console.log('Goes to UI');
        
    }
}