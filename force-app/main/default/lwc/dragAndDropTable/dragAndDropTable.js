import { LightningElement, api, wire, track } from 'lwc';


export default class DragAndDropTable extends LightningElement {
    @api quoteLinesReorder; 
    @track dragStart;
    @track ElementList = [
        {id: 1, name:'A'},
        {id: 2, name:'B'},
        {id: 3, name:'C'},
        {id: 4, name:'D'},
        {id: 5, name:'E'},
        {id: 6, name:'F'}
    ];
    @api PopUpReorder = false; 
   

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