import { LightningElement, api, wire, track} from 'lwc';
import { getPicklistValues, getObjectInfo } from 'lightning/uiObjectInfoApi';

export default class QleFilterCombobox extends LightningElement {
    @api objectName = 'Quote';
    @api fieldName = 'SBQQ__ContractingMethod';
    @track fieldLabel;
    @api recordTypeId;
    @api value;
    @track options;
    apiFieldName;

    get optionsExample() {
        return [
            { label: 'Discount 1', value: 'Discount1' },
            { label: 'Discount 2', value: 'Discount2' },
            { label: 'Discount 3', value: 'Discount3' },
            { label: 'Discount 4', value: 'Discount4' },
            { label: 'Discount 5', value: 'Discount5' },
        ];
    }

    @wire(getObjectInfo, { objectApiName: '$objectName' })
    getObjectData({ error, data }) {
        if (data) {
            if (this.recordTypeId == null)
                this.recordTypeId = data.defaultRecordTypeId;
            this.apiFieldName = this.objectName + '.' + this.fieldName;
            this.fieldLabel = data.fields[this.fieldName].label;
            
        } else if (error) {
            // Handle error
            console.log('==============Error  ');
            console.log(error);
        }
    }

    @wire(getPicklistValues, { recordTypeId: '$recordTypeId', fieldApiName: '$apiFieldName' })
    getPicklistValues({ error, data }) {
        if (data) {
            // Map picklist values
            this.options = data.values.map(plValue => {
                return {
                    label: plValue.label,
                    value: plValue.value
                };
            });

        } else if (error) {
            // Handle error
            console.log('==============Error  ' + error);
            console.log(error);
        }
    }

    handleChange(event) {
        this.value = event.detail.value;
    }
}