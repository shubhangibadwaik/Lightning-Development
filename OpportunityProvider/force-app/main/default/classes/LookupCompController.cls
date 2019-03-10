public with sharing class LookupCompController {
    
    @AuraEnabled
    public static List<SObject> getResultList(String strSearchString, String strObjectName){
        List<SObject> listResult = new List<SObject>();

        String strSanitizedSearchString = String.escapeSingleQuotes(strSearchString);
        String strSanitizedObjectName = String.escapeSingleQuotes(strObjectName);

        String strSearchQuery = 'FIND {' + strSanitizedSearchString + '*} IN ALL FIELDS RETURNING ' 
                                + strSanitizedObjectName + '(Id, Name) LIMIT 5';
        
        List<List<SObject>> searchList = search.query(strSearchQuery);
        if(!searchList.isEmpty()){
            return searchList[0];
        }
        return listResult;
    }
}