public with sharing class QuoteController {
    public class QuoteWrapperClass{
        String name;
        String status;
        
     }
    public class QuoteLineWrapperClass{
        String id;
        String name;
        String product;
        String tiers;
        String productName;
        String quantity;
        String listPrice;
        String discount;
        String additionalDiscountAmount;
        String additionalQuantity;
        String allowAssetRefound;
        String batchQuantity;
        String billingFrequency;
        String billingType;
        String bundled;
        String componentCost;
        String componentSubscription;
        String compoundDiscountRate;
        String configurationRequired;
        String customerPrice;
        String defaultSubsTerm;
        String description;
        String distributorDisc;
        String dynamOptionID;
        String earliestValidAmendStartDate;
        String endDate;
        String generateContractedPrice;
        String grossProfit;
        String grp;
        String guidance;
        String hasConsumptSchedule;
        String hidden;
        String markupRate;
        String markupAmount;
        String maxPrice;
        String minPrice;
        String netPrice;
        String nonDisc;
        String nonPartnerDisc;
        String nmber;
        String optionDisc;
        String optionDiscAmount;
        String optionLvl;
        String optionType;
        String optional;
        String originalPrice;
        String bundledQuantity;
        String originalUnitCost;
        String bundle;
        String packageProductCode;
        String packageProdDescription;
        String partnerPrice;
        String subsPercent;
        String subsBase;
        String subsCategory;
        String subsScope;
        String subsTargetPrice;
        String prevSegmentPrice;
        String prevSegmentUplift;
        String pricebookEntryID;
        String pricingMethod;
        String renewal;
        String specialPrice;
        String startDate;
        String taxCode;
        String taxable;
        String unitCost;
        

     }
    public class DiscountTierWrapperClass{
        String id;
        String name;
        Decimal discount;
        Decimal lowerBound;        
        Decimal upperBound;        
        Decimal discountAmount;        
        Decimal price;        
     }
    public class ProductWrapperClass{
        String id;
        String name;
        
     }
    public class FieldSetWrapperClass{
        String label;
        String apiName;
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
            QuoteLineWrapperClass wrapper = new QuoteLineWrapperClass();
            DiscountTierWrapperClass tierWrapper = new DiscountTierWrapperClass();
            Id discountTier = line.record.SBQQ__DiscountTier__c;
            wrapper.id = line.record.id;
            wrapper.name = line.record.name;
            wrapper.product = JSON.serialize(line.record.SBQQ__Product__c);
            wrapper.quantity = String.valueOf(line.record.SBQQ__Quantity__c);
            if (discountTier != null) {
                SBQQ__DiscountTier__c tier = [SELECT Id, Name,SBQQ__LowerBound__c,SBQQ__UpperBound__c,SBQQ__Discount__c,SBQQ__DiscountAmount__c,SBQQ__Price__c FROM SBQQ__DiscountTier__c WHERE Id =: discountTier LIMIT 1];
                tierWrapper.id = tier.Id;
                tierWrapper.name = tier.Name;
                tierWrapper.lowerBound = tier.SBQQ__LowerBound__c;
                tierWrapper.upperBound = tier.SBQQ__UpperBound__c;
                tierWrapper.discount = tier.SBQQ__Discount__c;
                tierWrapper.discountAmount = tier.SBQQ__DiscountAmount__c;
                tierWrapper.price = tier.SBQQ__Price__c;
            }
            wrapper.tiers = JSON.serialize(tierWrapper);

            //system.debug(wrapper);
            System.debug('products - '+ line.record.SBQQ__Product__r.Name);
            System.debug('tiers - '+ line.record.SBQQ__DiscountTier__c);
            System.debug('tiers information- ' + wrapper.tiers);
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
            wrapper.apiName = fieldSetMemberObj.getFieldPath();
            wrapper.required = fieldSetMemberObj.getRequired();
            wrapper.type = fieldSetMemberObj.getType();

            fields.add(wrapper);
        }

        System.debug(fields);
        System.debug(fields.size());
        return JSON.serialize(fields);
    }
    @AuraEnabled (cacheable = true)
    public static String saveAndCalculateQuote(String quoteId, String quoteLines){
        QuoteReader quoteReader = new QuoteReader();
        QuoteModel quote = quoteReader.read(quoteId);
        // List<QuoteLineModel> untypedQuoteLines = (List<QuoteLineModel>) JSON.deserializeUntyped(quoteLines);
        // Map<String, QuoteLineModel> untypedQuoteLines = (Map<String, QuoteLineModel>) JSON.deserialize(quoteLines, Map<String, QuoteLineModel>.class);
        Map<String,Object> untypedQuoteLines = (Map<String,Object>) JSON.deserializeUntyped(quoteLines);
        System.debug(untypedQuoteLines);
        QuoteSaver saver = new QuoteSaver();
        QuoteCalculator calculator = new QuoteCalculator();
        String quoteLineID = String.valueOf(untypedQuoteLines.get('id'));
        String fieldSetJSON = displayFieldSet(quoteId);
        List<FieldSetWrapperClass> fieldset = (List<FieldSetWrapperClass>)JSON.deserialize(fieldSetJSON,List<FieldSetWrapperClass>.class);
        List<SBQQ__QuoteLine__c> existingQuoteLines = [SELECT ID FROM SBQQ__QuoteLine__c];
        Set<Id> quoteLineIDs = new Set<Id>();
        System.debug(fieldset);
        List<QuoteLineModel> quoteLinesToInsert = new List<QuoteLineModel>();
        //Add the existing quote line ids to a set
        for (SBQQ__QuoteLine__c line : existingQuoteLines) {
            quoteLineIDs.add(line.id);
        }

        for (Integer i; i==0; i<untypedQuoteLines.size()) {
            if (quoteLineIDs.contains(String.valueOf(untypedQuoteLines.get('id')))) {
                QuoteLineModel quoteLine = new QuoteLineModel();
                quoteLine.setRecord([SELECT ID, SBQQ__Quote__c, SBQQ__Product__c FROM SBQQ__QuoteLine__c WHERE ID =: quoteLineID LIMIT 1]);
                
                // quoteLine.record.SBQQ__Quantity__c = Decimal.valueOf(untypedQuoteLines.get('quantity'));
                quoteLinesToInsert.add(quoteLine);
            }
        }
        

        quote.setLineItems(quoteLinesToInsert);
        // quote.setLineItems(untypedQuoteLines.values());
        System.debug('Qoute line info : ' + quoteLinesToInsert);
       // quote.setLineItems(untypedQuoteLines);
        // QuoteModel quote = quoteReader.read('a0q5f0000013pc3AAA');
        
        // for (QuoteLineModel line : untypedQuote.lineItems) {
        //quote.lineItems[0].record.SBQQ__Quantity__c = 14;    
        // }
        QuoteModel savedQuote = saver.save(quote);
        calculator.calculate(savedQuote, 'MyCallback');
        String total = String.valueOf(savedQuote.netTotal);
        
        System.debug('TOTAL ' + total);

        return JSON.serialize(total);
    }
    @AuraEnabled (cacheable = true)
    public static String saveQuote(String quoteId, String quoteLines){
        // QuoteReader quoteReader = new QuoteReader();
        // QuoteSaver saver = new QuoteSaver();

        // QuoteModel quote = quoteReader.read(quoteId);
        // QuoteModel savedQuote = saver.save(quote);
        return quoteLines;
    }

}