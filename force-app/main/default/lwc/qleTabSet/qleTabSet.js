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

    cloneRowTable(event){
        console.log('CALL TO CLONE TAB SET');
        event.preventDefault();
        this.dispatchEvent(new CustomEvent('cloneparent'));//
    }
    clonedValuesParent(event){
        console.log('SENDING VALUES CLONED TAB SET');
        event.preventDefault();
        this.dispatchEvent(new CustomEvent('clonedvaluesparent', { detail: event.detail}));
        console.log('Values cloned: '+event.detail);
    }

    deleteValues(event){
        console.log('SENDING VALUES WITHOUT DELETED TAB SET');
        event.preventDefault();
        this.dispatchEvent(new CustomEvent('deletevaluesparent', { detail: event.detail}));
        console.log('Values non deleted: '+event.detail);
    }
}