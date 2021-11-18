public with sharing class ProductModel {
    public Product2 record;
    public Id upgradedAssetId;
    public String currencySymbol;
    public String currencyCode;
    public String[] featureCategories;
    public OptionModel[] options;
    public FeatureModel[] features;
    public ConfigurationModel configuration;
    public ConfigAttributeModel[] configurationAttributes;
    public ConfigAttributeModel[] inheritedConfigurationAttributes;
    public ConstraintModel[] constraints; 

	public Product2 getRecord() {
		return this.record;
	}

	public void setRecord(Product2 record) {
		this.record = record;
	}

	public Id getUpgradedAssetId() {
		return this.upgradedAssetId;
	}

	public void setUpgradedAssetId(Id upgradedAssetId) {
		this.upgradedAssetId = upgradedAssetId;
	}

	public String getCurrencySymbol() {
		return this.currencySymbol;
	}

	public void setCurrencySymbol(String currencySymbol) {
		this.currencySymbol = currencySymbol;
	}

	public String getCurrencyCode() {
		return this.currencyCode;
	}

	public void setCurrencyCode(String currencyCode) {
		this.currencyCode = currencyCode;
	}

	public String[] getFeatureCategories() {
		return this.featureCategories;
	}

	public void setFeatureCategories(String[] featureCategories) {
		this.featureCategories = featureCategories;
	}

	public OptionModel[] getOptions() {
		return this.options;
	}

	public void setOptions(OptionModel[] options) {
		this.options = options;
	}

	public FeatureModel[] getFeatures() {
		return this.features;
	}

	public void setFeatures(FeatureModel[] features) {
		this.features = features;
	}

	public ConfigurationModel getConfiguration() {
		return this.configuration;
	}

	public void setConfiguration(ConfigurationModel configuration) {
		this.configuration = configuration;
	}

	public ConfigAttributeModel[] getConfigurationAttributes() {
		return this.configurationAttributes;
	}

	public void setConfigurationAttributes(ConfigAttributeModel[] configurationAttributes) {
		this.configurationAttributes = configurationAttributes;
	}

	public ConfigAttributeModel[] getInheritedConfigurationAttributes() {
		return this.inheritedConfigurationAttributes;
	}

	public void setInheritedConfigurationAttributes(ConfigAttributeModel[] inheritedConfigurationAttributes) {
		this.inheritedConfigurationAttributes = inheritedConfigurationAttributes;
	}

	public ConstraintModel[] getConstraints() {
		return this.constraints;
	}

	public void setConstraints(ConstraintModel[] constraints) {
		this.constraints = constraints;
	}

}