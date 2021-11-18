public with sharing class ProductAdder {
    public QuoteModel add(QuoteModel quote, ProductModel[] products, Integer groupKey) {
        AddProductsContext ctx = new AddProductsContext(quote, products, groupKey);
        String quoteJSON = SBQQ.ServiceRouter.load('SBQQ.QuoteAPI.QuoteProductAdder', null, JSON.serialize(ctx));
        Object response =  JSON.deserialize(quoteJSON, QuoteModel.class);
        QuoteModel newModel =(QuoteModel) response;
        QuoteLineModel[] quoteLines = newModel.getLineItems();

        for (QuoteLineModel line : quoteLines) {
            System.debug(' Product Name: ' + line.record.SBQQ__Product__r.Name);
        }
        system.debug('quote Lines: ' + quoteLines.size());

        return (QuoteModel) response;
    }

    private class AddProductsContext {
        private QuoteModel quote;
        private ProductModel[] products;
        private Integer groupKey;
        private final Boolean ignoreCalculate = true; //Must be hardcoded to true

        private AddProductsContext(QuoteModel quote, ProductModel[] products, Integer groupKey) {
            this.quote = quote;
            this.products = products;
            this.groupKey = groupKey;
        }
    }
}

//------------>>>>>CODE TO ADD PRODUCTS FROM THE DEVELOPER CONSOLE <<<<<-------------------
// QuoteReader quoteReader = new QuoteReader();
// QuoteModel quote = quoteReader.read('a0q5f0000013pc3AAA');
// ProductReader productReader = new ProductReader();
// ProductModel product = productReader.read('01t5f000001yHYDAA2','01s5f000006Z5SDAA0','USD');

// List<ProductModel> productModels = new List<ProductModel>();
// productModels.add(product);
// ProductAdder adder = new ProductAdder(); 
// QuoteModel quoteWithProducts = adder.add(quote, productModels, 0);
// ------------>>>>> THIS PART WILL SAVE THE NEW VERSION OF THE QUOTE <<<<<-------------------
// QuoteSaver saver = new QuoteSaver();
// QuoteModel savedQuote = saver.save(quoteWithProducts);
// System.debug(savedQuote);