({
	initializeDataTableAttributes: function(component, event, helper){
		var getRecords = component.get("c.getRecords");
		getRecords.setParams({
			"objectName": component.get("v.objectName"),
			"customMetadataName": component.get("v.customMetadataName")
		});
		getRecords.setCallback(this, function(response){
			if(response.getState() === "SUCCESS" && !$A.util.isUndefinedOrNull(response.getReturnValue())){
				component.set("v.records", JSON.parse(response.getReturnValue()['Records']));
				
				var dataTableConfig = JSON.parse(response.getReturnValue()['CustomMetadata']);
				var columnLabels = dataTableConfig.Field_Labels__c.split(',');
				var columnFields = dataTableConfig.Field_Names__c.split(',');
				var columnTypes = dataTableConfig.Field_Types__c.split(',');
				var dataTableColumns = [];
				
				for(var i = 0; i < columnLabels.length; i++){
					var column = {
						"label": columnLabels[i].trim(),
						"fieldName": columnFields[i].trim(),
						"type": columnTypes[i].trim()
					};
					dataTableColumns.push(column);
				}
				
				component.set("v.dataTableColumns", dataTableColumns);
			}
		});
		$A.enqueueAction(getRecords);
	},
	
	addPillToContainer: function(component, event, helper, pillLabel){
		var pillToBeAdded = {
			type: 'icon',
			href: '',
			label: pillLabel,
			iconName: 'standard:account',
			alternativeText: 'Account'
		};
		
		var pillsToBeAdded = component.get("v.pillsToBeAdded");
		pillsToBeAdded.push(pillToBeAdded);
		component.set("v.pillsToBeAdded", pillsToBeAdded);
        
        var recordSelectedMap = component.get("v.recordSelectedMap");
        recordSelectedMap[pillLabel] = pillToBeAdded;
	}
})