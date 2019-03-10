import { LightningElement, api } from 'lwc';

export default class DataTableCell extends LightningElement {
    @api isedit;
    @api fieldtype;
    @api fieldname;
    @api fieldvalue;
    @api referenceto;
    @api relationshipname;
    @api isupdateable;

    get isReference(){
        return (this.fieldtype === "reference") ? true : false;
    }

    get isBoolean(){
        return (this.fieldtype === "boolean") ? true : false;
    }

    valueChangeHandler(event){
        const fieldName = event.target.getAttribute('data-fieldname');
        const fieldValue = event.detail.checked;
        
        const valueChangeEvent = new CustomEvent('valuechange', {
            detail: {
                fieldName: fieldName,
                fieldValue: fieldValue 
            }
        });
        this.dispatchEvent(valueChangeEvent);
    }

}