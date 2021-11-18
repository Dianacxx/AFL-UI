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

    @AuraEnabled(cacheable=true)
    public static Map<Integer, List<SBQQ__QuoteLine__c>> printQuoteLines(String quoteId){
        List<SBQQ__QuoteLine__c> quoteLines = [Select Name, SBQQ__ProductSubscriptionType__c From SBQQ__QuoteLine__c Where SBQQ__Quote__c =:quoteId]; 
        Integer columns = 1; 
        Map<Integer, List<SBQQ__QuoteLine__c>> Mapa = new Map<Integer,List<SBQQ__QuoteLine__c>>();
        if (columns == 1){
            Mapa.put(columns,quoteLines);
            return Mapa; 
        }
        else {
            return null; 
        }
    }
    
    
}