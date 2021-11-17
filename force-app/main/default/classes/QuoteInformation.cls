public with sharing class QuoteInformation {

    @AuraEnabled(cacheable=true)
    public static List<SBQQ__Quote__c> printHeader(String quoteId) {
        return [Select Id,Name,SBQQ__Status__c, SBQQ__Account__c,AccountSLA__c, SBQQ__Type__c, 
                SBQQ__ExpirationDate__c From SBQQ__Quote__c  Where Id =: quoteId];
    }

    @AuraEnabled(cacheable=true)
    public static String printName(String quoteId) {
        List<SBQQ__Quote__c> quoteRetrieve = [Select Name From SBQQ__Quote__c Where Id =: quoteId];
        String name = quoteRetrieve[0].Name; 
        return name; 
    }

    @AuraEnabled(cacheable=true)
    public static Decimal printListAmount(String quoteId) {
        List<SBQQ__Quote__c> quoteRetrieve = [Select SBQQ__ListAmount__c From SBQQ__Quote__c Where Id =: quoteId];
        Decimal Amount = quoteRetrieve[0].SBQQ__ListAmount__c; 
        return Amount; 
    }
}
