import { AccessStates } from "../sourcemodel/AccessStates";
import { Type } from "../sourcemodel/type.component";

export class TypeMetrics implements MetricExtractor
{
	private numOfFields = 0;
	private numOfPublicFields = 0;
	private numOfMethods = 0;
	private numOfPublicMethods = 0;
	private depthOfInheritance = 0;
	private numOfLines = 0;
	private numOfChildren = 0;
	private weightedMethodsPerClass = 0;
	private numOfFanOutTypes = 0;
	private numOfFanInTypes = 0;
	private lcom = 0.0;

    private type:Type;

    constructor (type:Type)
    {
        this.type = type;
    }

    extractMetrics(): void
    {
		this.extractNumOfFieldMetrics();
		this.extractNumOfMethodsMetrics();
		this.extractDepthOfInheritance();
		this.extractNumberOfLines();
		this.extractNumberOfChildren();
		// extractWeightedMethodsPerClass();
		// extractNumOfFanOutTypes();
		// extractNumOfFanInTypes();
		// extractLCOM();
    }

	public getType(): Type
    {
		return this.type;
	}

	public getNumOfFields(): number
	{
		return this.numOfFields;
	}

	public getNumOfPublicFields(): number
	{
		return this.numOfPublicFields;
	}
	
	public getNumOfMethods(): number
	{
		return this.numOfMethods;
	}
	
	public getNumOfPublicMethods(): number
	{
		return this.numOfPublicMethods;
	}
	
	public getInheritanceDepth(): number
	{
		return this.depthOfInheritance;
	}

	public getNumOfLines(): number
	{
		return this.numOfLines;
	}

	public getNumOfChildren(): number
	{
		return this.numOfChildren;
	}

	public getNumOfFanInTypes(): number
    {
		return this.numOfFanInTypes;
	}

	private extractNumOfFieldMetrics(): void
    {
		for (const field of this.type.getFieldList())
        {
			this.numOfFields++;
			if (field.getAccessModifier() == AccessStates.PUBLIC)
            {
				// do not calculate fields that belong to a nested class with a stricter access modifier
				const nestedParent = field.getNestedParent();
				if(nestedParent != null && nestedParent.getAccessModifier() != AccessStates.PUBLIC)
                {
					continue;
				}
				
                this.numOfPublicFields++;
			}	
		}
	}

	private extractNumOfMethodsMetrics(): void
	{
		for (const method of this.type.getMethodList())
		{
			this.numOfMethods++;
			if (method.getAccessModifier() == AccessStates.PUBLIC) {
				this.numOfPublicMethods++;
			}
		}
	}

	private extractDepthOfInheritance(): void
	{
		this.depthOfInheritance += this.findInheritanceDepth(this.type.getSuperTypes());
	}
	
	private findInheritanceDepth(superTypes: Array<Type>): number
	{
		if (superTypes.length == 0)
		{
			return 0;
		}

		let deeperSuperTypes:Array<Type> = [];
		for (const superType of superTypes)
		{
			deeperSuperTypes = deeperSuperTypes.concat(superType.getSuperTypes());
		}
		// FIXME : switch to iterative process to avoid stack overflows
		try
		{
			return this.findInheritanceDepth(deeperSuperTypes) + 1;
		}
		catch (ex)
		{
			console.log("Inheritance depth analysis step skipped due to memory overflow.");
			return 0;
		}
	}

	private extractNumberOfLines(): void
	{
		const body = this.type.getTypeDeclaration().getFullText();
		this.numOfLines = body.length - body.replace("\n", "").length;
	}

	private extractNumberOfChildren(): void
	{
		this.numOfChildren = this.type.getSubTypes().length;
	}
}