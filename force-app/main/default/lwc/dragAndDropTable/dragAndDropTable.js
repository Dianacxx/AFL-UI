import { LightningElement, api, wire, track } from 'lwc';
import { subscribe, publish, MessageContext } from 'lightning/messageService';
import TABLE_CHANNEL from '@salesforce/messageChannel/Table_Comms__c'; 

export default class DragAndDropTable extends LightningElement {
    @track quoteLinesReorder; 
    @track dragStart;
    @track ElementList = [];  
    /*[
        {id: 1, name:'A'},
        {id: 2, name:'B'},
        {id: 3, name:'C'},
        {id: 4, name:'D'},
        {id: 5, name:'E'},
        {id: 6, name:'F'}
    ];*/
    @api PopUpReorder = false; 
   
    //------CHANNEL TO SEND INFORMATION
    @wire(MessageContext)
    messageContext;
    subscribeToMessageChannel() {
      this.subscription = subscribe(
        this.messageContext,
        TABLE_CHANNEL,
        (message) => this.handleMessage(message)
      );
    }
    handleMessage(message) { 
      if (message.check == 'PopUpOrder'){
          this.quoteLinesReorder = message.dataTable;
          this.ElementList = this.quoteLinesReorder; 
      }
    }
    connectedCallback() {
      this.subscribeToMessageChannel();
    }

    DragStart(event) {
      this.dragStart = event.target.title;
      event.target.classList.add("drag");
    }
  
    DragOver(event) {
      event.preventDefault();
      return false;
    }
  
    Drop(event) {
      event.stopPropagation();
      const DragValName = this.dragStart;
      const DropValName = event.target.title;
      if (DragValName === DropValName) {
        return false;
      }
      const index = DropValName;
      const currentIndex = DragValName;
      const newIndex = DropValName;
      Array.prototype.move = function (from, to) {
        this.splice(to, 0, this.splice(from, 1)[0]);
      };
      this.ElementList.move(currentIndex, newIndex);
    }

}