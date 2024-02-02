export class ThresholdsDTO
{	
	private complexCondition = 3;
	private complexMethod = 8;
	private longIdentifier = 30;
	private longMethod = 100;
	private longParameterList = 5;
	private longStatement = 120;
	
	private imperativeAbstractionLargeNumOfLines = 50;
	private multifacetedAbstractionLargeLCOM = 0.8;
	private multifacetedAbstractionManyFields = 7;
	private multifacetedAbstractionManyMethods = 7;
	private unnecessaryAbstractionFewFields = 5;
	
	private deepHierarchy = 6;
	private wideHierarchy = 10;
	
	private brokenModularizationLargeFieldSet = 5;
	private hubLikeModularizationLargeFanIn = 20;
	private hubLikeModularizationLargeFanOut = 20;
	private insufficientModularizationLargePublicInterface = 20;
	private insufficientModularizationLargeNumOfMethods = 30;
	private insufficientModularizationHighComplexity = 100;
	
	public getComplexCondition()
    {
		return this.complexCondition;
	}

	public setComplexCondition(complexCondition: number)
    {
		this.complexCondition = complexCondition;
	}

	public getComplexMethod()
    {
		return this.complexMethod;
	}

	public setComplexMethod(complexMethod: number)
    {
		this.complexMethod = complexMethod;
	}

	public getLongIdentifier()
    {
		return this.longIdentifier;
	}

	public setLongIdentifier(longIdentifier: number)
    {
		this.longIdentifier = longIdentifier;
	}

	public getLongMethod()
    {
		return this.longMethod;
	}

	public setLongMethod(longMethod: number)
    {
		this.longMethod = longMethod;
	}
	
	public getLongParameterList() {
		return this.longParameterList;
	}

	public setLongParameterList(longParameterList: number)
    {
		this.longParameterList = longParameterList;
	}
	
	public setLongStatement(longStatement: number)
    {
		this.longStatement = longStatement;
	}
	
	public getLongStatement()
    {
		return this.longStatement;
	}

	public getImperativeAbstractionLargeNumOfLines()
    {
		return this.imperativeAbstractionLargeNumOfLines;
	}

	public setImperativeAbstractionLargeNumOfLines(imperativeAbstractionLargeNumOfLines: number)
    {
		this.imperativeAbstractionLargeNumOfLines = imperativeAbstractionLargeNumOfLines;
	}

	public getMultifacetedAbstractionLargeLCOM()
    {
		return this.multifacetedAbstractionLargeLCOM;
	}

	public setMultifacetedAbstractionLargeLCOM(multifacetedAbstractionLargeLCOM: number)
    {
		this.multifacetedAbstractionLargeLCOM = multifacetedAbstractionLargeLCOM;
	}

	public getMultifacetedAbstractionManyFields()
    {
		return this.multifacetedAbstractionManyFields;
	}

	public setMultifacetedAbstractionManyFields(multifacetedAbstractionManyFields: number)
    {
		this.multifacetedAbstractionManyFields = multifacetedAbstractionManyFields;
	}

	public getMultifacetedAbstractionManyMethods()
    {
		return this.multifacetedAbstractionManyMethods;
	}

	public setMultifacetedAbstractionManyMethods(multifacetedAbstractionManyMethods: number)
    {
		this.multifacetedAbstractionManyMethods = multifacetedAbstractionManyMethods;
	}

	public getUnnecessaryAbstractionFewFields()
    {
		return this.unnecessaryAbstractionFewFields;
	}

	public setUnnecessaryAbstractionFewFields(unnecessaryAbstractionFewFields: number)
    {
		this.unnecessaryAbstractionFewFields = unnecessaryAbstractionFewFields;
	}

	public getDeepHierarchy()
    {
		return this.deepHierarchy;
	}
	
	public setDeepHierarchy(deepHierarchy: number)
    {
		this.deepHierarchy = deepHierarchy;
	}
	
	public getWideHierarchy()
    {
		return this.wideHierarchy;
	}
	
	public setWideHierarchy(wideHierarchy: number)
    {
		this.wideHierarchy = wideHierarchy;
	}
	
	public getBrokenModularizationLargeFieldSet()
    {
		return this.brokenModularizationLargeFieldSet;
	}

	public setBrokenModularizationLargeFieldSet(brokenModularizationLargeFieldSet: number)
    {
		this.brokenModularizationLargeFieldSet = brokenModularizationLargeFieldSet;
	}
	
	public getHubLikeModularizationLargeFanIn()
    {
		return this.hubLikeModularizationLargeFanIn;
	}

	public setHubLikeModularizationLargeFanIn(hubLikeModularizationLargeFanIn: number)
    {
		this.hubLikeModularizationLargeFanIn = hubLikeModularizationLargeFanIn;
	}

	public getHubLikeModularizationLargeFanOut()
    {
		return this.hubLikeModularizationLargeFanOut;
	}

	public setHubLikeModularizationLargeFanOut(hubLikeModularizationLargeFanOut: number)
    {
		this.hubLikeModularizationLargeFanOut = hubLikeModularizationLargeFanOut;
	}

	public getInsufficientModularizationLargePublicInterface()
    {
		return this.insufficientModularizationLargePublicInterface;
	}
	
	public setInsufficientModularizationLargePublicInterface(insufficientModularizationLargePublicInterface: number)
    {
		this.insufficientModularizationLargePublicInterface = insufficientModularizationLargePublicInterface;
	}
	
	public getInsufficientModularizationLargeNumOfMethods()
    {
		return this.insufficientModularizationLargeNumOfMethods;
	}
	
	public setInsufficientModularizationLargeNumOfMethods(insufficientModularizationLargeNumOfMethods: number)
    {
		this.insufficientModularizationLargeNumOfMethods = insufficientModularizationLargeNumOfMethods;
	}
	
	public getInsufficientModularizationHighComplexity()
    {
		return this.insufficientModularizationHighComplexity;
	}
	
	public setInsufficientModularizationHighComplexity(insufficientModularizationHighComplexity: number)
    {
		this.insufficientModularizationHighComplexity = insufficientModularizationHighComplexity;
	}
}
