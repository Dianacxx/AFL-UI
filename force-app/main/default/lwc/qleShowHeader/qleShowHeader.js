import { LightningElement, api, wire, track } from 'lwc';

//To get quote information
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import TYPE_FIELD from '@salesforce/schema/SBQQ__Quote__c.SBQQ__Type__c';
import STATUS_FIELD from '@salesforce/schema/SBQQ__Quote__c.SBQQ__Status__c';
import NAME_FIELD from '@salesforce/schema/SBQQ__Quote__c.Name';
import NETAMOUNT_FIELD from '@salesforce/schema/SBQQ__Quote__c.SBQQ__NetAmount__c';
import ACCOUNT_ID_FIELD from '@salesforce/schema/SBQQ__Quote__c.SBQQ__Account__c'; 
import ACC_NAME_FIELD from '@salesforce/schema/Account.Name';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';


export default class QleShowHeader extends LightningElement {
    
    @api recordId;
    @track isLoadingHeader = true; 
    @api quote; //Quote Information
    @api accId; //Account Id associated to the quote
    @api account; //Account Information
    @api totalValue; //Quote Total
    @api NAME_FIELD; 
    @api quoteStatus;
    @api quoteType;
    @api accountName; 

    //GET QUOTE INFORMATION
    @wire(getRecord, { recordId: '$recordId', fields: [TYPE_FIELD, STATUS_FIELD,NAME_FIELD, NETAMOUNT_FIELD, ACCOUNT_ID_FIELD]})
    quoteData({error, data}){
        if (data){
            this.quote = data;
            this.error = undefined;
            this.accId = getFieldValue(this.quote, ACCOUNT_ID_FIELD );
            this.totalValue = this.quote.fields.SBQQ__NetAmount__c.displayValue;
            console.log('Total value '+this.totalvalue );
            this.quoteName = getFieldValue(this.quote, NAME_FIELD ); 
            this.quoteStatus = getFieldValue(this.quote, STATUS_FIELD );
            this.quoteType = getFieldValue(this.quote, TYPE_FIELD );
        
            console.log('Name '+ this.quote.fields.Name.value);//getFieldValue(this.quote, NAME_FIELD ));
            console.log('Net amount '+ this.quote.fields.SBQQ__NetAmount__c.value);
            console.log('Status '+ this.quote.fields.SBQQ__Status__c.value);
            console.log('Type '+ this.quote.fields.SBQQ__Type__c.value);
            console.log('Account Id '+ this.quote.fields.SBQQ__Account__c.value);
            //console.log(this.quote);
        } else if (error) {
            this.quote = undefined;
            this.error = error;
            const evt = new ShowToastEvent({ title: 'Please Do not reload the page without saving', message: 'Open the Ui from the button in the record page',
            variant: 'error', mode: 'dismissable' });
            this.dispatchEvent(evt);
        } 
    }
    //GET ACCOUNT ASSOCIATED TO QUOTE
    @wire(getRecord, { recordId: '$accId', fields: [ACC_NAME_FIELD]})
    accountData({error, data}){
        if (data){
            this.account = data;
            this.isLoadingHeader = false;
            console.log('Account Name'+this.account.fields.Name.value);
            this.accountName = getFieldValue(this.account, ACC_NAME_FIELD );
            this.error = undefined;
        } else if (error){
            this.account = undefined;
            this.error = error;
        }
    }
}