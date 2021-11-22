public with sharing class QuoteController {
    public class QuoteWrapperClass{
        String name;
        String status;
        
     }
    public class QuoteLineWrapperClass{
        String id;
        String name;
        String tiers;        
     }
    public class ProductWrapperClass{
        String id;
        String name;
        
     }
    public class FieldSetWrapperClass{
        String label;
        Boolean required;
        Schema.DisplayType type;
        
     }
    @AuraEnabled(cacheable=true)
    public static String printQuoteLines(String quoteId) {
        QuoteReader quoteReader = new QuoteReader();
        // QuoteModel quote = quoteReader.read('a0q5f0000013pc3AAA');
        QuoteModel quote = quoteReader.read(quoteId);

        QuoteLineModel[] quoteLines = quote.getLineItems();
        List<QuoteLineWrapperClass> displayQuoteLine = new List<QuoteLineWrapperClass> ();

        for (QuoteLineModel line : quoteLines) {
            //  System.debug('id '+ line.record.id + ' name: ' + line.record.Name);

            QuoteLineWrapperClass wrapper = new QuoteLineWrapperClass();
            wrapper.id = line.record.id;
            wrapper.name = line.record.name;

            system.debug(wrapper);
            displayQuoteLine.add (wrapper);
        }

        System.debug(displayQuoteLine);
        System.debug(displayQuoteLine.size());
        return JSON.serialize(displayQuoteLine);
    } 
    
    @AuraEnabled(cacheable=true)
    public static String printQuoteInfo(String quoteId) {
        QuoteReader quoteReader = new QuoteReader();
        // QuoteModel quote = quoteReader.read('a0q5f0000013pc3AAA');
        QuoteModel quote = quoteReader.read(quoteId);

        QuoteWrapperClass wrapper = new QuoteWrapperClass();
        wrapper.name = quote.record.name;
        wrapper.status = quote.record.SBQQ__Status__c;
        
       System.debug('name '+quote.record.Name + ' Status ' + quote.record.SBQQ__Status__c);
       return JSON.serialize(wrapper);
    } 
    @AuraEnabled(cacheable=true)
    public static void addQuoteLine(String quoteId, String productId) {
        QuoteReader quoteReader = new QuoteReader();
        // QuoteModel quote = quoteReader.read('a0q5f0000013pc3AAA');
        QuoteModel quote = quoteReader.read(quoteId);
        ProductReader productReader = new ProductReader();
        Pricebook2 prodPriceBook = [SELECT Id FROM Pricebook2 WHERE Id IN (SELECT SBQQ__PriceBook__c FROM SBQQ__Quote__c WHERE Id =: quoteId) LIMIT 1];
        ProductModel product = productReader.read(productId,prodPriceBook.Id,'USD');
        // ProductModel product = productReader.read(productId,'01s5f000006Z5SDAA0','USD');

        List<ProductModel> productModels = new List<ProductModel>();
        productModels.add(product);
        ProductAdder adder = new ProductAdder(); 
        QuoteModel quoteWithProducts = adder.add(quote, productModels, 0);
        QuoteSaver saver = new QuoteSaver();
        QuoteModel savedQuote = saver.save(quoteWithProducts);
        System.debug(savedQuote);
    }
    @AuraEnabled (cacheable = true)
    public static String printProduct(String quoteId, String productId){
        ProductReader reader = new ProductReader();
        Pricebook2 prodPriceBook = [SELECT Id FROM Pricebook2 WHERE Id IN (SELECT SBQQ__PriceBook__c FROM SBQQ__Quote__c WHERE Id =: quoteId) LIMIT 1];
        ProductModel product = reader.read(productId,prodPriceBook.Id,'USD');
        // System.debug(product);
        
        ProductWrapperClass wrapper = new ProductWrapperClass();
        wrapper.id = product.record.Id;
        wrapper.name = product.record.Name;

        System.debug(wrapper);
        return JSON.serialize(wrapper);
    }
    @AuraEnabled (cacheable = true)
    public static void printProductConfig(String quoteId, String productId ){
        // try {
            QuoteReader quoteReader = new QuoteReader();

            // QuoteModel quote = quoteReader.read('a0q5f0000013pc3AAA');
            QuoteModel quote = quoteReader.read(quoteId);

            ConfigLoader loader = new ConfigLoader();
            ProductModel product = loader.load(productId, quote, null);
            // return product;
            System.debug(product);
        // } catch (Exception e) {
        //     throw new AuraHandledException(e.getMessage());
        // }
    }
    @AuraEnabled (cacheable = true)
    public static String displayFieldSet(String quoteId){
        SBQQ__Quote__c quote = [SELECT Id, AccountIndustry__c FROM SBQQ__Quote__c WHERE Id =: quoteId];
        String fieldSetName ;
        if (quote.AccountIndustry__c == 'Education') {
            fieldSetName = 'SBQQ__ConsumptionSchedule';
        }
        else if (quote.AccountIndustry__c == 'Technology') {
            fieldSetName = 'SBQQ__LineEditor';
        }
        else if (quote.AccountIndustry__c == 'Consulting') {
            fieldSetName = 'SBQQ__NonCurrentQuoteLineLockedFields';
        }
        else if (quote.AccountIndustry__c == 'Transportation') {
            fieldSetName = 'SBQQ__SegmentedLineEditor';
        }
        else if (quote.AccountIndustry__c == 'Hospitality') {
            fieldSetName = 'SBQQ__SegmentedLineEditorSummary';
        }
        else if (quote.AccountIndustry__c == 'Apparel') {
            fieldSetName = 'SBQQ__StandardLineItemDrawer';
        }else {
            fieldSetName = 'SBQQ__SummaryFields';
        }

        System.debug('Field set Name: ' + fieldSetName);
        List<Schema.FieldSetMember> fieldSetMemberList =  QuoteDetails.getQuote(fieldSetName,'SBQQ__QuoteLine__c');
        List<FieldSetWrapperClass> fields = new List<FieldSetWrapperClass>();

        for(Schema.FieldSetMember fieldSetMemberObj : fieldSetMemberList){
            FieldSetWrapperClass wrapper = new FieldSetWrapperClass();
            wrapper.label = fieldSetMemberObj.getLabel();
            wrapper.required = fieldSetMemberObj.getRequired();
            wrapper.type = fieldSetMemberObj.getType();

            fields.add(wrapper);
        }

        System.debug(fields);
        System.debug(fields.size());
        return JSON.serialize(fields);
    }

}