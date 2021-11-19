public with sharing class QuoteDetails {
    public SBQQ__Quote__c quote { get;set; }
    // public QuoteDetails() {
    //     this.quote = getQuote();
    // }
    // public List<Schema.FieldSetMember> getFields() {
    //     return SObjectType.SBQQ__Quote__c.FieldSets.SBQQ__CalculatingFields.getFields();
    // }
    // public SBQQ__Quote__c getQuote(){
    //     String query = 'SELECT ';
    //     for (Schema.FieldSetMember f : this.getFields()) {
    //         query += f.getFieldPath() + ', ';
    //     }
    //     query += 'ID, Name FROM SBQQ__Quote__c LIMIT 1';
    //     System.debug(query);
    //     return Database.query(query);
    // }
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