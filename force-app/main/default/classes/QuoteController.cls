public with sharing class QuoteController {
    @AuraEnabled(cacheable=true)
    public static List<SBQQ__QuoteLine__c> printQuote(String quoteId) {
        QuoteReader quoteReader = new QuoteReader();
        // QuoteModel quote = quoteReader.read('a0q5f0000013pc3AAA');
        QuoteModel quote = quoteReader.read(quoteId);

        QuoteLineModel[] quoteLines = quote.getLineItems();
        List<SBQQ__QuoteLine__c> displayQuoteLine = new List<SBQQ__QuoteLine__c> ();
        
        for (QuoteLineModel line : quoteLines) {
            //  System.debug('id '+ line.record.id + ' name: ' + line.record.Name);

            SBQQ__QuoteLine__c newQuoteLine = new SBQQ__QuoteLine__c();
            newQuoteLine.id = line.record.id;
            //newQuoteLine.SBQQ__Product__c = line.record.Name;

            displayQuoteLine.add (newQuoteLine);
        }

        System.debug(displayQuoteLine);
        System.debug(displayQuoteLine.size());
        return displayQuoteLine;
    }
    } 
    @AuraEnabled(cacheable=true)
    public static void addQuoteLine(String quoteId) {
        QuoteReader quoteReader = new QuoteReader();
        // QuoteModel quote = quoteReader.read('a0q5f0000013pc3AAA');
        QuoteModel quote = quoteReader.read(quoteId);
        ProductReader productReader = new ProductReader();
        ProductModel product = productReader.read('01t5f000001yHYDAA2','01s5f000006Z5SDAA0','USD');

        List<ProductModel> productModels = new List<ProductModel>();
        productModels.add(product);
        ProductAdder adder = new ProductAdder(); 
        QuoteModel quoteWithProducts = adder.add(quote, productModels, 0);
        QuoteSaver saver = new QuoteSaver();
        QuoteModel savedQuote = saver.save(quoteWithProducts);
        System.debug(savedQuote);
    }
    // @AuraEnabled (cacheable = true)
    public static void printProductConfig(String quoteId ){
        try {
            QuoteReader quoteReader = new QuoteReader();

            // QuoteModel quote = quoteReader.read('a0q5f0000013pc3AAA');
            QuoteModel quote = quoteReader.read(quoteId);

            ConfigLoader loader = new ConfigLoader();
            ProductModel product = loader.load('a0x5C000000G1CV', quote, null);
            // return product;
            System.debug(product);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }


}