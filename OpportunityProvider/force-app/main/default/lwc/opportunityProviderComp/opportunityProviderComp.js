// 'lwc' - Core Module of Lightning Web Component
// LightningElement - Custom Wrapper of standard HTML element
import { LightningElement, api, track } from 'lwc';

//Imports 'getRecord' wire adapter from 'lightning/uiRecordApi' module, built on top of LDS
//User Interface API > Lightning Data Service > lightning/uiRecordApi
//import { getRecord } from 'lightning/uiRecordApi';

import getRecordList from '@salesforce/apex/OpportunityProviderController.getRecordList';
import updateRecord from '@salesforce/apex/OpportunityProviderController.updateRecord';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';

//Import Custom Labels - Action, Cancel, Save
import action from '@salesforce/label/c.Action';
import cancel from '@salesforce/label/c.Cancel';
import save from '@salesforce/label/c.Save';

export default class OpportunityProviderComp extends LightningElement {
    //@api decorator is used to enable the Lightning Page to set value of recordId 
    @api recordId;
    @api sourceComp;

    //@wire decorator tells getRecord to get values of fields, if specified, for the record Id
    //$ - Value is passed dynamically i.e. if the value changes, the wire service provisions data and the component rerenders
    //The data is provisioned to 'data' and 'error' objects of the 'opportunity' property
    //@wire(getRecord, {recordId: '$recordId'})
    //opportunity;

    @track dataReady = false;
    @track listRecord = [];
    @track mapFieldResult = {};
    @track objConfig = {};
    @track listFieldLabel = [];
    @track showFooter = false;
    @track editedRecordId = '';                 //Gives the Record Id of record that's been edited
    @track editedRowIndex;
    @track error;

    //Expose Custom Label to use in the template
    label = {action, cancel, save};

    connectedCallback(){
        getRecordList({recordId: this.recordId, sourceComp : this.sourceComp})
            .then(result => {
                this.listRecord = JSON.parse(result.listRecord);
                this.mapFieldResult = JSON.parse(result.mapFieldResult);
                this.objConfig = JSON.parse(result.objConfig);
                this.listFieldLabel = JSON.parse(result.objConfig).Field_Labels__c.split(',');
                this.error = undefined;
                this.dataReady = true;
            })
            .catch(error => {
                this.listRecord = undefined;
                this.mapFieldResult = undefined;
                this.objConfig = undefined;
                this.listFieldLabel = undefined;
                this.error = error;
            });
    }

    editRecordHandler(event){
        var i = 0;
        this.showFooter = event.detail.showFooter;
        this.editedRecordId = event.detail.editedRecordId;
        this.editedRowIndex = event.detail.editedRowIndex;

        const listDataTableRow = this.template.querySelectorAll('c-data-table-row');
        for(i = 0; i < listDataTableRow.length; i++){
            listDataTableRow[i].resetIsEditProperty(this.editedRowIndex);
        }
    }

    cancelActionHandler(){
        this.showFooter = false;
        const dataTableRow = this.template.querySelector('c-data-table-row[data-id="'+this.editedRecordId+'"]');
        dataTableRow.setUpdatedRecord();
    }

    saveActionHandler(){
        this.dataReady = false;
        const dataTableRow = this.template.querySelector('c-data-table-row[data-id="'+this.editedRecordId+'"]');
        var updatedRecord = null;
        var listRecord = this.listRecord;

        if(dataTableRow){
            updatedRecord = dataTableRow.sendDataToComp;
            updatedRecord.sobjectType = this.objConfig.Child_Object__c;
            updatedRecord.Id = this.editedRecordId;

            //Update the record using Apex Method or Lightning Data Service
            //updateRecord({listRecordConfig: this.objConfig}) - Results in error: Unable to read SObject
            updateRecord({recordToUpdate: updatedRecord, sobjToUpdate: this.objConfig.Child_Object__c, fieldNames: this.objConfig.Field_Names__c})
                .then(returnValue => {
                    this.showFooter = false;
                    //If update is successful, update the 'record' property of DataTableRow 
                    dataTableRow.setUpdatedRecord();
                    
                    if(returnValue.status === "SUCCESS"){
                        listRecord[this.editedRowIndex] = JSON.parse(returnValue.result);
                        this.listRecord = listRecord;
                    }
                    else{
                        //Throwing an Exception or AuraHandledException leads to the error message: An internal server error has occurred
                        //Root cause of the error is not mentioned in error.body
                        const toastEvent = new ShowToastEvent({
                            title: 'Error!',
                            message: returnValue.result,
                            variant: 'error'
                        });
                        this.dispatchEvent(toastEvent);
                    }
                    this.dataReady = true;
                })
                .catch(error => {
                    console.log("Error: " + JSON.stringify(error));
                });
                
        }
    }
}