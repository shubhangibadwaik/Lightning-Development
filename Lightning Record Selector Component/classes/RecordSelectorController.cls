public class RecordSelectorController {

    @AuraEnabled
    public static Map<String, String> getRecords(String objectName, String customMetadataName){
    	Map<String, String> mapRecordSelectorConfig = new Map<String, String>();
    	
    	List<Record_Selector__mdt> listCustomMetadata = [SELECT Field_Labels__c, Field_Names__c, Field_Types__c 
														FROM Record_Selector__mdt WHERE DeveloperName =: customMetadataName LIMIT 1];
														
		String queryForRecords = 'SELECT Id,' +  listCustomMetadata[0].Field_Names__c + ' FROM ' + objectName + ' LIMIT 10';
		List<SObject> listSobj = Database.query(queryForRecords);
		
    	mapRecordSelectorConfig.put('CustomMetadata', JSON.serialize(listCustomMetadata[0]));														
   		mapRecordSelectorConfig.put('Records', JSON.serialize(listSobj));
   		
   		return mapRecordSelectorConfig;
    }
    
}