import { LightningElement, api, track } from 'lwc';

export default class DataTableRow extends LightningElement {
    @api record;                                                //Original record
    @api rowindex;
    @api fieldnames;
    @api mapfieldresult;

    @track areDataValuesReady = false;
    @track updatedRecord = {};
    @track isEdit = false;
    @track listDataValues = [];

    @api 
    get sendDataToComp(){
        return this.updatedRecord;
    }

    @api
    setUpdatedRecord(){
        this.isEdit = false;
        this.updatedRecord = {};
    }

    @api
    resetIsEditProperty(editedRowIndex){
        if(this.rowindex != editedRowIndex){
            this.isEdit = false;
            this.updatedRecord = {};    
        }
    }

    constructor(){
        super();
        this.template.addEventListener('lookupvaluechange', this.handleLookupValueChange.bind(this));
    }

    connectedCallback(){
        const listFieldNames = this.fieldnames.split(',');
        var i = 0;
        for(i = 0; i < listFieldNames.length; i++){
            const fieldName = listFieldNames[i];
            const fieldResult = this.mapfieldresult[fieldName];
            this.listDataValues.push({fieldType: fieldResult.type, 
                                      fieldName: fieldResult.name,
                                      fieldValue: this.getFieldValue(fieldName, fieldResult),
                                      referenceTo: (fieldResult.type === "reference") ? fieldResult.referenceTo[0] : "",
                                      relationshipName: (fieldResult.type === "reference") ? fieldResult.relationshipName : "",
                                      updateable: fieldResult.updateable
            });
        }
        this.areDataValuesReady = true;
    }

    getFieldValue(fieldName, fieldResult){
        var fieldValue = '';
        var i = 0;
        //If Field Type = Lookup
        if(fieldResult.type === "reference"){
            const listFieldName = fieldName.split('.');
            fieldValue = this.record[listFieldName[i]];
            for(i = 1; i < listFieldName.length; i++){
                //Locker restricts access to variables such as $A, Aura, Sfdc for Lightning web components
                //because they are either deprecated or would lead to cross-framework dependencies.
                if((fieldValue[listFieldName[i]] !== undefined) || (fieldValue[listFieldName[i]] !== null)){
                    fieldValue = fieldValue[listFieldName[i]];
                }else{
                    return fieldValue;
                    }
            }
        }else{
            return this.record[fieldName];
        }
        return fieldValue;
    }

    
    editRecordHandler(){
        this.isEdit = true;                                         //Edit the record
        
        const editRecordEvent = new CustomEvent('edit', {           //Creates Edit Record Event
            detail: {
                showFooter: this.isEdit,
                editedRecordId: this.record.Id,
                editedRowIndex: this.rowindex  
            }
        });            
        this.dispatchEvent(editRecordEvent);                        //Dispatches the Edit Record Event                
    }

    handleValueChange(event){
        const fieldName = event.detail.fieldName;
        const fieldValue = event.detail.fieldValue;
        this.updatedRecord[fieldName] = fieldValue;
    }

    handleLookupValueChange(event){
        const fieldName = event.detail.fieldName;
        const relationshipName = event.detail.relationshipName;
        const lookupValue = event.detail.lookupValue;
        
        this.updatedRecord[fieldName] = lookupValue.Id;
        this.updatedRecord[relationshipName] = lookupValue;
    }
}