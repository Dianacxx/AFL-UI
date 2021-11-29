import { LightningElement, track, wire, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import fetchAccounts from '@salesforce/apex/QuoteInformation.fetchAccounts';

const actions = [
    {label: 'View', name: 'View'},
]; 

export default class treeProducts extends NavigationMixin( LightningElement ) {
    
    @api filterProduct = false; 
    @track gridData;

    @wire(fetchAccounts)
    accountTreeData({ error, data }) {
        if ( data ) {

            var tempData = JSON.parse( JSON.stringify( data ) );
            for ( var i = 0; i < tempData.length; i++ ) {
                tempData[ i ]._children = tempData[ i ][ 'Contacts' ];
                delete tempData[ i ].Contacts;
            }
            this.gridData = tempData;
        } else if ( error ) {
            if ( Array.isArray( error.body ) )
                console.log( 'Error is ' + error.body.map( e => e.message ).join( ', ' ) );
            else if ( typeof error.body.message === 'string' )
                console.log( 'Error is ' + error.body.message );
        }
    }

    clickToExpandAll( e ) {
        const grid =  this.template.querySelector( 'lightning-tree-grid' );
        grid.expandAll();
    }

    clickToCollapseAll( e ) {
        const grid =  this.template.querySelector( 'lightning-tree-grid' );
        grid.collapseAll();
    }

    constructor() {
        super();
        this.columns = [
            { type: 'text', fieldName: 'Name', label: '' , initialWidth: 350,},
            { type: 'text', fieldName: 'FirstName', label: '', initialWidth: 200,},
            { type: 'action', typeAttributes: { rowActions: this.getRowActions }, initialWidth: 50, },
        ]
    }

    getRowActions(row, doneCallback) {
        if(row.level == 1) {
          doneCallback([{ label: 'View', name: 'view' }]);
          console.log('LEVEL 2');
        }
        if(row.level == 2) {
          doneCallback([
              { label: 'Add', name: 'add' },
              { label: 'Clone', name: 'clone' },
              { label: 'Edit', name: 'edit' },
              { label: 'Delete', name: 'delete' },                 
          ]);
          console.log('LEVEL 3');
        }
      }

    handleRowAction( event ) {
        const action = event.detail.action;
        const row = event.detail.row;
        console.log(event.detail.row.level);
            switch (action.name) {
                case 'view':
                    alert('YOU MUST DELETE THIS ONE');
                    break; 
                case 'add':
                    this.filterProduct = true; 
                    break;
                case 'delete':
                    /*
                    const rows = this.data;
                    const rowIndex = rows.indexOf(row);
                    rows.splice(rowIndex, 1);
                    this.data = rows;
                    */
                    alert('DELETING' + JSON.stringify(row.level));
                    break;
                case 'clone':
                    alert('CLONING' + JSON.stringify(row.level));
                    break;
                case 'edit':
                    alert('EDITING' + JSON.stringify(row.level));
                    break;
            }
    }

    closeFilterProduct(){
        this.filterProduct = false;
    }
}