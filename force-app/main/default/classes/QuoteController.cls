public with sharing class QuoteController {
    public class QuoteWrapperClass{
        String name;
        String status;
        Decimal totalValue;
        
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
            System.debug('Quantity - '+ line.record.SBQQ__Quantity__c);
            // System.debug('tiers - '+ line.record.SBQQ__DiscountTier__c);
            // System.debug('tiers information- ' + wrapper.tiers);
            displayQuoteLine.add (wrapper);
        }

        System.debug(displayQuoteLine);
        System.debug(displayQuoteLine.size());
        return JSON.serialize(displayQuoteLine);
    } 
    
    @AuraEnabled(cacheable=true)
    public static String printQuoteInfo(String quoteId) {
       // QuoteReader quoteReader = new QuoteReader();
        // QuoteModel quote = quoteReader.read('a0q5f0000013pc3AAA');
        //QuoteModel quote = quoteReader.read(quoteId);
        SBQQ__Quote__c quoteInfo = [SELECT Name, SBQQ__Status__c, SBQQ__ListAmount__c FROM SBQQ__Quote__c WHERE ID=:quoteId LIMIT 1];

        QuoteWrapperClass wrapper = new QuoteWrapperClass();
        wrapper.name = quoteInfo.Name;
        wrapper.status = quoteInfo.SBQQ__Status__c;
        wrapper.totalValue = quoteInfo.SBQQ__ListAmount__c;
        
       return JSON.serialize(wrapper);
    } 
    @AuraEnabled(cacheable=true)
    public static List<QuoteLineWrapperClass> addQuoteLine(String quoteId, String productId) {
        QuoteReader quoteReader = new QuoteReader();
        // QuoteModel quote = quoteReader.read('a0q5f0000013pc3AAA');
        List<QuoteLineWrapperClass> linesToPrint = new List<QuoteLineWrapperClass>();
        QuoteModel quote = quoteReader.read(quoteId);
        ProductReader productReader = new ProductReader();
        Pricebook2 prodPriceBook = [SELECT Id FROM Pricebook2 WHERE Id IN (SELECT SBQQ__PriceBook__c FROM SBQQ__Quote__c WHERE Id =: quoteId) LIMIT 1];
        ProductModel product = productReader.read(productId,prodPriceBook.Id,'USD');
        // ProductModel product = productReader.read(productId,'01s5f000006Z5SDAA0','USD');

        List<ProductModel> productModels = new List<ProductModel>();
        productModels.add(product);
        ProductAdder adder = new ProductAdder(); 
        QuoteModel quoteWithProducts = adder.add(quote, productModels, 0);
        System.debug('ADDER quote lines Number ' + quoteWithProducts.getLineItems().size());

        for (Integer i = 0 ; i<quoteWithProducts.getLineItems().size(); i++) {
            QuoteLineWrapperClass wrapper = new QuoteLineWrapperClass();
            wrapper.id = quoteWithProducts.getLineItems()[i].record.id;
            wrapper.product = quoteWithProducts.getLineItems()[i].record.SBQQ__Product__c;
            linesToPrint.add(wrapper);
        }

        return linesToPrint;
        // QuoteSaver saver = new QuoteSaver();
        // QuoteModel savedQuote = saver.save(quoteWithProducts);
        // System.debug(savedQuote); retornar el quote line
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
    @AuraEnabled
    @Future
    public static void saveAndCalculateQuote(String quoteId, String quoteLines){
        QuoteReader quoteReader = new QuoteReader();
            QuoteModel quote = quoteReader.read(quoteId);

            List<QuoteLineModel> quoteLinesToInsert = new List<QuoteLineModel>();
            //Gets the quote lines and deserialize it into a quote line wrapper
            List<QuoteLineWrapperClass> untypedQuoteLines = (List<QuoteLineWrapperClass>) JSON.deserialize(quoteLines, List<QuoteLineWrapperClass>.class);
            // List<QuoteLineModel> untypedQuoteLines = (List<QuoteLineModel>) JSON.deserialize(quoteLines, List<QuoteLineModel>.class);
            System.debug('size ' + untypedQuoteLines.size() + 'QUOTE LINES FROM JSON: ' + untypedQuoteLines);
            //Check all the existig quote lines in salesforce
            List<SBQQ__QuoteLine__c> existingQuoteLines = [SELECT ID, SBQQ__Product__r.SBQQ__PricingGuidance__c, SBQQ__AdditionalDiscount__c,SBQQ__Discount__c,SBQQ__AdditionalDiscountAmount__c,SBQQ__AdditionalQuantity__c,SBQQ__AllowAssetRefund__c,SBQQ__BatchQuantity__c,SBQQ__BillingFrequency__c,SBQQ__BillingType__c,SBQQ__BlockPrice__c,SBQQ__Bundled__c,SBQQ__CarryoverLine__c,SBQQ__ChargeType__c,SBQQ__ComponentCost__c,SBQQ__ComponentDiscountedByPackage__c,SBQQ__ComponentListTotal__c,SBQQ__ComponentTotal__c,SBQQ__ComponentSubscriptionScope__c,SBQQ__ComponentUpliftedByPackage__c,SBQQ__ComponentVisibility__c,SBQQ__CompoundDiscountRate__c,SBQQ__ConfigurationRequired__c,SBQQ__ContractedPrice__c,SBQQ__Cost__c,SBQQ__CostEditable__c,SBQQ__CustomerTotal__c,SBQQ__CustomerPrice__c,SBQQ__DefaultSubscriptionTerm__c,SBQQ__Description__c,SBQQ__DiscountSchedule__c,SBQQ__DiscountScheduleType__c,SBQQ__DiscountTier__c,SBQQ__DistributorDiscount__c,SBQQ__DynamicOptionId__c,SBQQ__EarliestValidAmendmentStartDate__c,SBQQ__EffectiveEndDate__c,SBQQ__EffectiveQuantity__c,SBQQ__EffectiveStartDate__c,SBQQ__EffectiveSubscriptionTerm__c,SBQQ__EndDate__c,SBQQ__Existing__c,SBQQ__Favorite__c,SBQQ__GenerateContractedPrice__c,SBQQ__GrossProfit__c,SBQQ__Group__c,SBQQ__Guidance__c,SBQQ__HasConsumptionSchedule__c,SBQQ__Hidden__c,SBQQ__Incomplete__c,Name,SBQQ__ListTotal__c,SBQQ__ListPrice__c,SBQQ__Markup__c,SBQQ__MarkupRate__c,SBQQ__MarkupAmount__c,SBQQ__MaximumPrice__c,SBQQ__MinimumPrice__c,SBQQ__NetTotal__c,SBQQ__NetPrice__c,SBQQ__NonDiscountable__c,SBQQ__NonPartnerDiscountable__c,SBQQ__Number__c,SBQQ__OptionDiscount__c,SBQQ__OptionDiscountAmount__c,SBQQ__OptionLevel__c,SBQQ__OptionType__c,SBQQ__Optional__c,SBQQ__OriginalPrice__c,Original_Price_Formula__c,SBQQ__BundledQuantity__c,SBQQ__OriginalQuoteLineId__c,SBQQ__OriginalUnitCost__c,SBQQ__Bundle__c,SBQQ__PackageCost__c,SBQQ__PackageListTotal__c,SBQQ__PackageProductCode__c,SBQQ__PackageProductDescription__c,SBQQ__PackageTotal__c,SBQQ__PartnerDiscount__c,SBQQ__PartnerTotal__c,SBQQ__PartnerPrice__c,SBQQ__SubscriptionPercent__c,SBQQ__SubscriptionBase__c,SBQQ__SubscriptionCategory__c,SBQQ__SubscriptionScope__c,SBQQ__SubscriptionTargetPrice__c,SBQQ__PreviousSegmentPrice__c,SBQQ__PreviousSegmentUplift__c,SBQQ__Dimension__c,SBQQ__PriceEditable__c,SBQQ__PricebookEntryId__c,SBQQ__PricingMethod__c,SBQQ__PricingMethodEditable__c,SBQQ__PriorQuantity__c,SBQQ__Product__c,SBQQ__ProductCode__c,SBQQ__ProductFamily__c,SBQQ__ProductName__c,SBQQ__ProductOption__c,SBQQ__ProductSubscriptionType__c,SBQQ__ProrateMultiplier__c,SBQQ__ProratedListPrice__c,SBQQ__ProratedPrice__c,SBQQ__Quantity__c,SBQQ__Quote__c,SBQQ__RegularTotal__c,SBQQ__RegularPrice__c,SBQQ__Renewal__c,SBQQ__RenewedAsset__c,SBQQ__RenewedSubscription__c,SBQQ__RequiredBy__c,SBQQ__SegmentIndex__c,SBQQ__SegmentKey__c,SBQQ__SegmentLabel__c,SBQQ__Source__c,SBQQ__SpecialPrice__c,Special_Price_Formula__c,SBQQ__SpecialPriceDescription__c,SBQQ__SpecialPriceType__c,SBQQ__StartDate__c,SBQQ__SubscribedAssetIds__c,SBQQ__SubscriptionPricing__c,SBQQ__SubscriptionTerm__c,SBQQ__SubscriptionType__c,SBQQ__TaxCode__c,SBQQ__Taxable__c,SBQQ__TermDiscount__c,SBQQ__TermDiscountSchedule__c,SBQQ__TermDiscountTier__c,SBQQ__TotalDiscountRate__c	,SBQQ__TotalDiscountAmount__c,SBQQ__UnitCost__c,SBQQ__UnproratedNetPrice__c,SBQQ__UpgradedAsset__c,SBQQ__UpgradedQuantity__c,SBQQ__UpgradedSubscription__c,SBQQ__Uplift__c,SBQQ__UpliftAmount__c,SBQQ__VolumeDiscount__c FROM SBQQ__QuoteLine__c WHERE SBQQ__Quote__c =: quoteId];
            Set<Id> quoteLineIDs = new Set<Id>();
            Set<Id> receivedIDs = new Set<Id>();

            //Trying to add new object
            List<QuoteLineWrapperClass> newQuoteLineList = addQuoteLine(quoteId, '01t5f000001yHX1AAM');
            SBQQ__QuoteLine__c lineToAdd = new SBQQ__QuoteLine__c();
            
            System.debug('new list size: ' + newQuoteLineList.size());

            //Add the existing quote line ids to a set
            for (SBQQ__QuoteLine__c line : existingQuoteLines) {
                quoteLineIDs.add(line.id);
            }
            for (QuoteLineWrapperClass line : untypedQuoteLines) {
                receivedIDs.add(line.id);
            }
        try{

            
            for (SBQQ__QuoteLine__c line : existingQuoteLines) {
                if (receivedIDs.contains(line.id)) {
                    System.debug('Entered first');
                    QuoteLineModel newModel = new QuoteLineModel();

                    newModel.setRecord(line);
                    newModel.setParentItemKey(Integer.valueOf(line.SBQQ__Product__r.id));
                    newModel.setKey(Integer.valueOf(line.id));
                    //newModel.record.SBQQ__Quantity__c = 10;
                    quoteLinesToInsert.add(newModel);
                } 
            }
            for ( QuoteLineWrapperClass line : untypedQuoteLines) {
                if (!quoteLineIDs.contains(line.id)) {
                    System.debug('Entered second');
                    SBQQ__QuoteLine__c newQuoteLine = new SBQQ__QuoteLine__c(id = line.id);
                    newQuoteLine.SBQQ__Product__c = line.product;
                    newQuoteLine.SBQQ__Quantity__c = Decimal.valueOf(line.quantity);

                    QuoteLineModel newModel = new QuoteLineModel();
                    newModel.setRecord(newQuoteLine);
                    quoteLinesToInsert.add(newModel);
                }
            }
            //  quoteLinesToInsert[0].record.SBQQ__Quantity__c = 50;


            //Inserts the new version of the quote lines into the quote line model
            quote.setLineItems(quoteLinesToInsert);
            //System.debug('line items size : ' +quoteLinesToInsert.size() + 'New Line Items : ' + quoteLinesToInsert );
        
            

            //Saves te new version of the quote
            QuoteModel savedQuote = quoteSaverMethod(quote);
            System.debug('line items size :' +  savedQuote.getLineItems().size());
            // for (QuoteLineModel line : savedQuote.getLineItems()) {
            //     System.debug( 'new quote lines quantity: ' +  line.record.SBQQ__Quantity__c);
            // }
            System.debug('new quote '+savedQuote);

            //Queries for the new total 
            SBQQ__Quote__c quoteInfo = [SELECT SBQQ__ListAmount__c FROM SBQQ__Quote__c WHERE ID =: quoteId LIMIT 1];
            System.debug('TOTAL ' + quoteInfo.SBQQ__ListAmount__c);
        }
        catch (Exception e) {
            throw new AuraHandledException('Something went wrong: ' + e.getMessage() + 'cause: ' + e.getCause());
        }
        
        //Returns the total value
        // return String.valueOf(quoteInfo.SBQQ__ListAmount__c);
    }
    @AuraEnabled (cacheable = true)
    @Future
    public static void saveQuote(String quoteId, String quoteLines){
        // QuoteReader quoteReader = new QuoteReader();
        // QuoteSaver saver = new QuoteSaver();

        // QuoteModel quote = quoteReader.read(quoteId);
        // QuoteModel savedQuote = saver.save(quote);
        //return quoteLines;
    }
    @AuraEnabled 
    public static QuoteModel quoteSaverMethod (QuoteModel quote){
        
        QuoteSaver saver = new QuoteSaver();
        QuoteModel savedQuote = saver.save(quote);

        return savedQuote;        
    }
    @AuraEnabled 
    public static Decimal QuoteCalculatorMethod (QuoteModel quote){
        
        QuoteCalculator calculator = new QuoteCalculator();
        calculator.calculate(quote, 'MyCallback');

        return quote.netTotal;        
    }

    public static void findQuoteLine(Set<Id> quoteLineList, Set<Id> quoteLineId){
    //     List<SBQQ__QuoteLine__c> quoteLine = new List<SBQQ__QuoteLine__c>();
    //     for (SBQQ__QuoteLine__c line : quoteLineList) {
    //         if (line.id == quoteLineId) {
    //             quoteLine.add(line);
    //         }
    //     }
    //     if (quoteLine!= null) {
    //         return quoteLine[0];
    //     }else {
    //         System.debug('NOT WORKING');
    //         return quoteLine[0];
    //     }
    }

}