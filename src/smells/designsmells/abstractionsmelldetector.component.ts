import { TypeMetrics } from "../../metrics/typemetrics.component";
import { AccessStates } from "../../sourcemodel/AccessStates";
import { SourceItemInfo } from "../../sourcemodel/sourceiteminfo.component";
import { DesignCodeSmell } from "../models/designcodesmell.component";
import { DesignSmellDetector } from "./designsmelldetector.component";

export class AbstractionSmellDetector extends DesignSmellDetector
{
	private IMPERATIVE_ABSTRACTION = "Imperative Abstraction";
	private MULTIFACETED_ABSTRACTION = "Multifaceted Abstraction";
	private UNNECESSARY_ABSTRACTION = "Unnecessary Abstraction";
	private UNUTILIZED_ABSTRACTION = "Unutilized Abstraction";

    constructor(typeMetrics:TypeMetrics, info:SourceItemInfo)
    {
        super(typeMetrics, info);
    }

    public detectCodeSmells(): Array<DesignCodeSmell>
    {
		this.detectImperativeAbstraction();
		this.detectUnnecessaryAbstraction();
        //this.detectUnutilizedAbstraction();
        return this.getSmells();
    }

	public detectImperativeAbstraction(): Array<DesignCodeSmell>
	{
		if (this.hasImperativeAbstraction())
		{
			this.addToSmells(this.initializeCodeSmell(this.IMPERATIVE_ABSTRACTION));
		}
		
		return this.getSmells();
	}
	
	public hasImperativeAbstraction(): boolean
	{
		const currentType = this.getTypeMetrics().getType();
		if(this.getTypeMetrics().getNumOfPublicMethods() != 1 )
		{
			return false;
		}
		else
		{
			const methods = currentType.getMethodList();
			for(const method of methods)
			{
				if (method.getAccessModifier() == AccessStates.PUBLIC)
				{
					const metrics = currentType.getMetricsFromMethod(method);
					if(metrics.getNumOfLines() > this.getThresholdsDTO().getImperativeAbstractionLargeNumOfLines())
					{
						return true;
					}
				}
			}
			
			return false;
		}
	}

	public detectUnnecessaryAbstraction(): Array<DesignCodeSmell>
	{
		if (this.hasUnnecessaryAbstraction())
		{
			this.addToSmells(this.initializeCodeSmell(this.UNNECESSARY_ABSTRACTION));
		}
		return this.getSmells();
	}
	
	private hasUnnecessaryAbstraction(): boolean
	{
		return this.getTypeMetrics().getNumOfMethods() == 0 
		&& this.getTypeMetrics().getNumOfFields() 
		<= this.getThresholdsDTO().getUnnecessaryAbstractionFewFields();
	}

	public detectUnutilizedAbstraction(): Array<DesignCodeSmell>
    {
        //console.log(this.UNUTILIZED_ABSTRACTION);
		if (this.hasUnutilizedAbstraction())
        {
			this.addToSmells(this.initializeCodeSmell(this.UNUTILIZED_ABSTRACTION));
		}

		return this.getSmells();
	}

    private hasUnutilizedAbstraction(): boolean
    {
		if (this.hasSuperTypes())
        {
			return !this.hasSuperTypeWithFanIn() || !this.hasFanIn(this.getTypeMetrics());
		}
		
        return !this.hasFanIn(this.getTypeMetrics());
	}

	private hasSuperTypes(): boolean
    {
		return this.getTypeMetrics().getType().getSuperTypes().length > 0; 
	}

	private hasSuperTypeWithFanIn(): boolean
    {
		for (const superType of this.getTypeMetrics().getType().getSuperTypes())
        {
			if (this.hasFanIn(superType.getParentPkg().getMetricsFromType(superType))) {
				return true;
			}
		}
		return false;
	}
	
	private hasFanIn(metrics:TypeMetrics): boolean
    {
		return metrics.getNumOfFanInTypes() > 0;
	}
}