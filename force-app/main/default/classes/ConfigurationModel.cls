public with sharing class ConfigurationModel {
    public Id configuredProductId; 
    public Id optionId; 
    public SBQQ__ProductOption__c optionData; // Editable data about the option in question, such as quantity or discount 
    public SBQQ__ProductOption__c configurationData; 
    public SBQQ__ProductOption__c inheritedConfigurationData; 
    public ConfigurationModel[] optionConfigurations; 
    public Boolean configured; 
    public Boolean changedByProductActions; 
    public Boolean isDynamicOption; 
    public Boolean isUpgrade; 
    public Set<Id> disabledOptionIds; 
    public Set<Id> hiddenOptionIds; 
    public Decimal listPrice; 
    public Boolean priceEditable; 
    public String[] validationMessages; 
    public String dynamicOptionKey; 

	public Id getConfiguredProductId() {
		return this.configuredProductId;
	}

	public void setConfiguredProductId(Id configuredProductId) {
		this.configuredProductId = configuredProductId;
	}

	public Id getOptionId() {
		return this.optionId;
	}

	public void setOptionId(Id optionId) {
		this.optionId = optionId;
	}

	public SBQQ__ProductOption__c getOptionData() {
		return this.optionData;
	}

	public void setOptionData(SBQQ__ProductOption__c optionData) {
		this.optionData = optionData;
	}

	public SBQQ__ProductOption__c getConfigurationData() {
		return this.configurationData;
	}

	public void setConfigurationData(SBQQ__ProductOption__c configurationData) {
		this.configurationData = configurationData;
	}

	public SBQQ__ProductOption__c getInheritedConfigurationData() {
		return this.inheritedConfigurationData;
	}

	public void setInheritedConfigurationData(SBQQ__ProductOption__c inheritedConfigurationData) {
		this.inheritedConfigurationData = inheritedConfigurationData;
	}

	public ConfigurationModel[] getOptionConfigurations() {
		return this.optionConfigurations;
	}

	public void setOptionConfigurations(ConfigurationModel[] optionConfigurations) {
		this.optionConfigurations = optionConfigurations;
	}

	public Boolean getConfigured() {
		return this.configured;
	}

	public void setConfigured(Boolean configured) {
		this.configured = configured;
	}

	public Boolean getChangedByProductActions() {
		return this.changedByProductActions;
	}

	public void setChangedByProductActions(Boolean changedByProductActions) {
		this.changedByProductActions = changedByProductActions;
	}

	public Boolean getIsDynamicOption() {
		return this.isDynamicOption;
	}

	public void setIsDynamicOption(Boolean isDynamicOption) {
		this.isDynamicOption = isDynamicOption;
	}

	public Boolean getIsUpgrade() {
		return this.isUpgrade;
	}

	public void setIsUpgrade(Boolean isUpgrade) {
		this.isUpgrade = isUpgrade;
	}

	public Set<Id> getDisabledOptionIds() {
		return this.disabledOptionIds;
	}

	public void setDisabledOptionIds(Set<Id> disabledOptionIds) {
		this.disabledOptionIds = disabledOptionIds;
	}

	public Set<Id> getHiddenOptionIds() {
		return this.hiddenOptionIds;
	}

	public void setHiddenOptionIds(Set<Id> hiddenOptionIds) {
		this.hiddenOptionIds = hiddenOptionIds;
	}

	public Decimal getListPrice() {
		return this.listPrice;
	}

	public void setListPrice(Decimal listPrice) {
		this.listPrice = listPrice;
	}

	public Boolean getPriceEditable() {
		return this.priceEditable;
	}

	public void setPriceEditable(Boolean priceEditable) {
		this.priceEditable = priceEditable;
	}

	public String[] getValidationMessages() {
		return this.validationMessages;
	}

	public void setValidationMessages(String[] validationMessages) {
		this.validationMessages = validationMessages;
	}

	public String getDynamicOptionKey() {
		return this.dynamicOptionKey;
	}

	public void setDynamicOptionKey(String dynamicOptionKey) {
		this.dynamicOptionKey = dynamicOptionKey;
	}

}