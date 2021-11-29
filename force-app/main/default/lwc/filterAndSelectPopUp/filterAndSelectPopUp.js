import { LightningElement, track, wire, api } from 'lwc';

export default class FilterAndSelectPopUp extends LightningElement {
    @api recordsAmount = 1000; 
    get options() {
        return [
            { label: 'Option 1', value: 'Op1' },
            { label: 'Option 2', value: 'Op2' },
            { label: 'Option 3', value: 'Op3' },
        ];
    }
    //To close the pop-up
    closeModalAction(){
        this.dispatchEvent(new CustomEvent('close'));
    }

    addAndReview(){
        console.log('ADDING AND REVIEWING');
    }

    handleChange(){
        console.log('CHANGING FILTERS');
    }

    clearFilters(){
        this.template.querySelectorAll('lightning-combobox').forEach(each => {
            each.value = undefined;
        });
    }
}