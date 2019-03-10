public with sharing class OpportunityProviderController {
    
    @AuraEnabled
    //public static ResultBean getRecordList(Id recordId, String sourceComp){
    public static Map<String,String> getRecordList(Id recordId, String sourceComp){
        Map<String,String> mapResult = new Map<String,String>();
        Schema.SObjectType parentObjectName = recordId.getSobjectType();
        
        List<Custom_Related_List__mdt> listConfig = [SELECT MasterLabel, Child_Object__c, Field_Labels__c, 
                                                    Field_Names__c, Filter_String_1__c FROM Custom_Related_List__mdt 
                                                    WHERE Parent_Object__c =: String.valueOf((Object)parentObjectName) AND Source_Component__c =: sourceComp
                                                    LIMIT 1];

        if(!listConfig.isEmpty()){
            //Get Map<String, Schema.SObjectField> for the child object
            Map<String,Object> mapFieldResult = Util.getFieldMetadata(listConfig[0].Child_Object__c, listConfig[0].Field_Names__c);
        
            String strPlaceHolderValue = '\'' + recordId + '\'';
            String strFilterString = Util.format(listConfig[0].Filter_String_1__c, new String[]{strPlaceHolderValue});
            String strQuery = 'SELECT Id, ' + listConfig[0].Field_Names__c + ' FROM ' + listConfig[0].Child_Object__c + 
                              ' WHERE ' + strFilterString;
            List<SObject> listRecord = Database.query(strQuery);
            
            //return new ResultBean(mapFieldResult, listRecord, listConfig[0]);
            mapResult.put('mapFieldResult', JSON.serialize(mapFieldResult));
            mapResult.put('listRecord', JSON.serialize(listRecord));
            mapResult.put('objConfig', JSON.serialize(listConfig[0]));
        }                                                    
        return mapResult;
        //return null;
    }

    @AuraEnabled
    public static Map<String, String> updateRecord(SObject recordToUpdate, String sobjToUpdate, String fieldNames){
        /*Database.SaveResult[] listSaveResult = Database.update(new List<SObject>{sobjToUpdate});
        for(Database.SaveResult sr : listSaveResult){
            if(!sr.isSuccess()){
                throw new AuraHandledException(sr.getErrors()[0].getMessage());
            }
        }
        return true;*/
        Map<String, String> mapError = new Map<String, String>();
        try{
           update recordToUpdate;
           List<SObject> listUpdatedRecord = OpportunityProviderController.getUpdatedRecord((Id)recordToUpdate.get('Id'), sobjToUpdate, fieldNames);
           mapError.put('status', 'SUCCESS');
           mapError.put('result', JSON.serialize(listUpdatedRecord[0])); 
        }catch(Exception e){
            mapError.put('status', 'ERROR');
            mapError.put('result', e.getMessage()); 
        }
        return mapError;
    }

    private static List<SObject> getUpdatedRecord(Id idUpdatedRecord, String sobjToUpdate, String fieldNames){
        String strQuery = 'SELECT Id, ' + fieldNames + ' FROM ' + sobjToUpdate + ' WHERE Id = \''
                        + idUpdatedRecord + '\' LIMIT 1';
        List<SObject> listSObject = Database.query(strQuery);
        
        return listSObject;
    }

    public class ResultBean{
        @AuraEnabled public List<SObject> listRecord {get; set;}
        @AuraEnabled public Map<String,Object> mapFieldResult {get; set;}
        @AuraEnabled public Custom_Related_List__mdt objConfig {get; set;}

        public ResultBean(Map<String,Object> mapFieldResult, List<SObject> listRecord, Custom_Related_List__mdt objConfig){
            this.mapFieldResult = mapFieldResult;
            this.listRecord = listRecord;
            this.objConfig = objConfig;
        }
    }
}