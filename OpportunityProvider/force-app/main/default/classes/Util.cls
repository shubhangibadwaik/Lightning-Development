public with sharing class Util {
    
    public static String format( String str , String[] valueArray ) {
    	String pattern;
    	if( ( str == null ) || ( valueArray == null ) ) {
    		return '';
    	}
    	pattern = '([{][index][}])';
    	Integer length = valueArray.size();
    	for( Integer i=0;i<length;i++){
    		str = str.replaceAll( pattern.replace( 'index', ''+i ) ,  valueArray[ i ] );
    	}
    	return str;
    }

	public static Map<String,Object> getFieldMetadata(String strObjectName, String strFieldNames){
		Map<String,Object> mapFieldResult = new Map<String,Object>();

		List<String> listSObjName = new List<String>{strObjectName};
		List<Schema.DescribeSObjectResult> listSObjResult = Schema.describeSObjects(listSObjName);
		Map<String, Schema.SObjectField> mapObjectField = listSObjResult[0].fields.getMap();

		List<String> listFieldName = strFieldNames.split(',');
		for(String strFieldName : listFieldName){
			strFieldName = strFieldName.trim();

			if(strFieldName.contains('__r')){
				String strLookupField = strFieldName.split('\\.')[0];
				strLookupField = strLookupField.replace('__r', '__c');
				mapFieldResult.put(strFieldName, mapObjectField.get(strLookupField).getDescribe());
			}else{
				mapFieldResult.put(strFieldName, mapObjectField.get(strFieldName).getDescribe());
			}
		}
		return mapFieldResult;
	}
}