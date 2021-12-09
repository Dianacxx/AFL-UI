import { LightningElement, track, wire, api } from 'lwc';

import { publish, MessageContext } from 'lightning/messageService';
import PPQ_CHANNEL from  '@salesforce/messageChannel/Product_Plus_Qle_Comms__c';

export default class FilterAndSelectPopUp extends LightningElement {
    @api recordsAmount = 1000; 
    @track tabOption = false; 

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
        this.tabOption = false; 
    }

    //To add and change to review tab
    addAndReview(event){
        //JUST TO RETURN TO REVIEW TAB BUT NOT CHANGING ANYTHING
        if (event.target.label == 'Review'){
            this.tabOption = true; 
        } 
        //WHEN CLICKED FROM ADD AND REVIEW IN THE FILTER PAGE, SENDING VALUES TO NEXT PAGE
        else if (event.target.label == 'Add & Review'){
             //more here....
             console.log('ADDING AND REVIEWING');
            const payload = { 
                dataInformation: this.textValue,
                booleanCheck: 'Send Value PS to QLE'
            };
            publish(this.messageContext, PPQ_CHANNEL, payload);
            this.tabOption = true; 
            //more here....
        }
    }
    //To Save and change to filter tab
    moreAdd(event){
        //JUST TO RETURN TO FILTER TAB BUT NOT CHANGING ANYTHING
        if (event.target.label == 'Filter'){
            this.tabOption = false;
        } 
        //WHEN CLICKED FROM ADD MORE IN THE REVIEW PAGE, SAVING VALUES
        else if (event.target.label == 'Add More'){
            this.tabOption = false;
             //more here....
        }
    }

    //To send information AND close popup
    saveAndExitModal(){
        this.dispatchEvent(new CustomEvent('close'));
        this.tabOption = false; 
        //more here....
    }

    //To test - sending value in input
    handleChange(){
        console.log('CHANGING FILTERS');
    }

    //Clearing filters with button
    clearFilters(){
        this.template.querySelectorAll('lightning-combobox').forEach(each => {
            each.value = undefined;
        });
    }


    //------CHANNEL TO SEND INFORMATION
    @wire(MessageContext)
    messageContext;
    @track textValue; 

    handleInputChange(event){
        this.textValue = event.detail.value;
        //SENDING MESSAGE TO CHANNEL
    }
}