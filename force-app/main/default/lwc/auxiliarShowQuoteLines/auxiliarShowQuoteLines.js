import { LightningElement, api, wire, track} from 'lwc';
//To get quote information
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import TYPE_FIELD from '@salesforce/schema/SBQQ__Quote__c.SBQQ__Type__c';
import STATUS_FIELD from '@salesforce/schema/SBQQ__Quote__c.SBQQ__Status__c';
import NAME_FIELD from '@salesforce/schema/SBQQ__Quote__c.Name';
import NETAMOUNT_FIELD from '@salesforce/schema/SBQQ__Quote__c.SBQQ__NetAmount__c';
import ACCOUNT_ID_FIELD from '@salesforce/schema/SBQQ__Quote__c.SBQQ__Account__c'; 
import ACC_NAME_FIELD from '@salesforce/schema/Account.Name';
//To navigate to other interfaces
import { NavigationMixin } from 'lightning/navigation';


export default class AuxiliarShowQuoteLines extends NavigationMixin(LightningElement){
    @api recordId = 'a0q5f0000013pblAAA'; //CHANGE THIS TO GET RECORD ID FROM BUTTON
    @api quote; //Quote Information
    @api accId; //Account Id associated to the quote
    @api account; //Account Information
    @track isLoadingHeader = false; //Spinner Loading
    @api totalValue; //Quote Total


    //Do this in UI

    //INITIALIZE UI
    connectedCallback(){
        console.log('Start the process');
    }

    //GET QUOTE INFORMATION
    @wire(getRecord, { recordId: 'a0q5f0000013pblAAA', fields: [TYPE_FIELD, STATUS_FIELD,NAME_FIELD, NETAMOUNT_FIELD, ACCOUNT_ID_FIELD]})
    quoteData({error, data}){
        if (data){
            this.quote = data;
            this.error = undefined;
            this.accId = getFieldValue(this.quote, ACCOUNT_ID_FIELD )
            this.totalValue = this.quote.fields.SBQQ__NetAmount__c.displayValue;
            this.isLoadingHeader = true;
            console.log('Total value '+this.totalvalue );
            console.log('Id '+this.quote.id);
            console.log('Name '+ this.quote.fields.Name.value);//getFieldValue(this.quote, NAME_FIELD ));
            console.log('Net amount '+ this.quote.fields.SBQQ__NetAmount__c.value);
            console.log('Status '+ this.quote.fields.SBQQ__Status__c.value);
            console.log('Type '+ this.quote.fields.SBQQ__Type__c.value);
            console.log('Account Id '+ this.quote.fields.SBQQ__Account__c.value);
            console.log(this.quote);
        } else if (error) {
            this.quote = undefined;
            this.error = error;
        }
    }
    //GET ACCOUNT ASSOCIATED TO QUOTE
    @wire(getRecord, { recordId: '$quote.fields.SBQQ__Account__c.value', fields: [ACC_NAME_FIELD]})
    accountData({error, data}){
        if (data){
            this.account = data;
            console.log('Account Name'+this.account.fields.Name.value);
            this.error = undefined;
        } else if (error){
            this.account = undefined;
            this.error = error;
        }
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
}