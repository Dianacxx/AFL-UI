public with sharing class ConfigAttributeModel {
    public String name; 
    public String targetFieldName; 
    public Decimal displayOrder; 
    public String colmnOrder;
    public Boolean required;
    public Id featureId;
    public String position;
    public Boolean appliedImmediately;
    public Boolean applyToProductOptions;
    public Boolean autoSelect;
    public String[] shownValues;
    public String[] hiddenValues;
    public Boolean hidden;
    public String noSuchFieldName;
    public Id myId;

	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getTargetFieldName() {
		return this.targetFieldName;
	}

	public void setTargetFieldName(String targetFieldName) {
		this.targetFieldName = targetFieldName;
	}

	public Decimal getDisplayOrder() {
		return this.displayOrder;
	}

	public void setDisplayOrder(Decimal displayOrder) {
		this.displayOrder = displayOrder;
	}

	public String getColmnOrder() {
		return this.colmnOrder;
	}

	public void setColmnOrder(String colmnOrder) {
		this.colmnOrder = colmnOrder;
	}

	public Boolean getRequired() {
		return this.required;
	}

	public void setRequired(Boolean required) {
		this.required = required;
	}

	public Id getFeatureId() {
		return this.featureId;
	}

	public void setFeatureId(Id featureId) {
		this.featureId = featureId;
	}

	public String getPosition() {
		return this.position;
	}

	public void setPosition(String position) {
		this.position = position;
	}

	public Boolean getAppliedImmediately() {
		return this.appliedImmediately;
	}

	public void setAppliedImmediately(Boolean appliedImmediately) {
		this.appliedImmediately = appliedImmediately;
	}

	public Boolean getApplyToProductOptions() {
		return this.applyToProductOptions;
	}

	public void setApplyToProductOptions(Boolean applyToProductOptions) {
		this.applyToProductOptions = applyToProductOptions;
	}

	public Boolean getAutoSelect() {
		return this.autoSelect;
	}

	public void setAutoSelect(Boolean autoSelect) {
		this.autoSelect = autoSelect;
	}

	public String[] getShownValues() {
		return this.shownValues;
	}

	public void setShownValues(String[] shownValues) {
		this.shownValues = shownValues;
	}

	public String[] getHiddenValues() {
		return this.hiddenValues;
	}

	public void setHiddenValues(String[] hiddenValues) {
		this.hiddenValues = hiddenValues;
	}

	public Boolean getHidden() {
		return this.hidden;
	}

	public void setHidden(Boolean hidden) {
		this.hidden = hidden;
	}

	public String getNoSuchFieldName() {
		return this.noSuchFieldName;
	}

	public void setNoSuchFieldName(String noSuchFieldName) {
		this.noSuchFieldName = noSuchFieldName;
	}

	public Id getMyId() {
		return this.myId;
	}

	public void setMyId(Id myId) {
		this.myId = myId;
	}

}