({
	doInit: function(component, event, helper) {
        //Fetch Custom Metadata & Records to set the attributes: columns, data of lightning:datatable
        helper.initializeDataTableAttributes(component, event, helper);
	},
	
	getSelectedRecords: function(component, event, helper) {
		component.set("v.noRecordSelected", 0);
		
        var recordSelectedMap = component.get("v.recordSelectedMap");
        var selectedRowsNameList = [];
		var selectedRows = event.getParam('selectedRows');
        for(var i = 0; i < selectedRows.length; i++){
            selectedRowsNameList.push(selectedRows[i].Name);
            if(!(selectedRows[i].Name in recordSelectedMap)){
                helper.addPillToContainer(component, event, helper, selectedRows[i].Name);
            }
		}
        
        //Alternative: Convert object to array
        /*var selectedRowsNameList = Object.keys(selectedRows).map(function(key){
            return selectedRows[key].Name;
        });*/
        
        var pillsToBeAdded = component.get("v.pillsToBeAdded");
        for(var i = 0; i < pillsToBeAdded.length; i++){
            if(!(selectedRowsNameList.includes(pillsToBeAdded[i].label))){
                pillsToBeAdded.splice(i, 1);
            }
        }
        component.set("v.noRecordSelected", selectedRows.length);
	} 
})