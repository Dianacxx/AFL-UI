public with sharing class QuoteDetails {
    public SBQQ__Quote__c quote { get;set; }
    
    public static List<Schema.FieldSetMember> getQuote(String fieldSetName, String ObjectName)
    {
        Map<String, Schema.SObjectType> GlobalDescribeMap = Schema.getGlobalDescribe(); 
        Schema.SObjectType SObjectTypeObj = GlobalDescribeMap.get(ObjectName);
        Schema.DescribeSObjectResult DescribeSObjectResultObj = SObjectTypeObj.getDescribe();

        //system.debug('====>' + DescribeSObjectResultObj.FieldSets.getMap().get(fieldSetName));

        Schema.FieldSet fieldSetObj = DescribeSObjectResultObj.FieldSets.getMap().get(fieldSetName);

        //List<Schema.FieldSetMember> fieldSetMemberList =  fieldSetObj.getFields();
        //system.debug('fieldSetMemberList ====>' + fieldSetMemberList);  
        return fieldSetObj.getFields(); 
    }  
}