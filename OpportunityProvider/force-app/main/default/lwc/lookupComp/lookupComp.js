import { LightningElement, track, api } from 'lwc';

import getResultList from '@salesforce/apex/LookupCompController.getResultList';

export default class LookupComp extends LightningElement {
    @api fieldname;
    @api lookupvalue;
    @api objectname;
    @api relationshipname;

    @track strObjectName;
    @track inputPlaceHolder;
    @track searchString = "";
    @track listResult = [];
    @track isSearchDone = false;        //Specifies if search results are ready, for the 'searchString'
    @track isLookupValue = true;        //Specifies if lookup value is present or not.

    connectedCallback(){
        this.inputPlaceHolder = "Search " + this.objectname;
    }

    clearLookupValue(){
        this.isLookupValue = false;
    }

    get areMatchesFound(){
        return (this.listResult.length) ? true : false;
    }

    handleValueChange(event){
        this.searchString = event.target.value;

        if(this.searchString.length > 2){
            getResultList({strSearchString: this.searchString, strObjectName: this.objectname})
            .then(result => {
                if(result && result.length){
                    this.listResult = result;
                }else{
                    this.listResult = [];
                }
                this.isSearchDone = true;
            });
        }else{
            this.isSearchDone = false;
        }
        
    }

    handleSelection(event){
        const objectName = event.currentTarget.getAttribute('data-name');
        const objectId = event.currentTarget.getAttribute('data-id');
        
        this.lookupvalue = objectName;
        this.isSearchDone = false;
        this.searchString = "";
        this.isLookupValue = true;

        //Send the lookup value to c-data-table-row component.
        const lookupValueEvent = new CustomEvent('lookupvaluechange', {
            detail: {
                fieldName: this.fieldname,
                relationshipName: this.relationshipname,
                lookupValue: {"Id": objectId, "Name": objectName}
            },
            bubbles: true, composed: true                //Set to true, so that this event bubbles up through DOM.
        });
        this.dispatchEvent(lookupValueEvent);
    }
}