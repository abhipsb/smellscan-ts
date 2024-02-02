import { TypeMetrics } from "../../metrics/typemetrics.component";
import { SourceItemInfo } from "../../sourcemodel/sourceiteminfo.component";
import { DesignCodeSmell } from "../models/designcodesmell.component";
import { DesignSmellDetector } from "./designsmelldetector.component";

export class ModularizationSmellDetector extends DesignSmellDetector
{
	
	private BROKEN_MODULARIZATION = "Broken Modularization";
	private CYCLIC_DEPENDENT_MODULARIZATION = "Cyclic-Dependent Modularization";
	private INSUFFICIENT_MODULARIZATION = "Insufficient Modularization";
	private HUB_LIKE_MODULARIZATION = "Hub-like Modularization";
	
	constructor (typeMetrics: TypeMetrics, info: SourceItemInfo)
    {
		super(typeMetrics, info);
	}
	
	public detectCodeSmells(): Array<DesignCodeSmell>
    {
		this.detectBrokenModularization();
		//this.detectCyclicDependentModularization();
		//this.detectInsufficientModularization();
		//this.detectHubLikeModularization();
		return this.getSmells();
	}
	
	public detectBrokenModularization(): Array<DesignCodeSmell>
    {
		if (this.hasBrokenModularization()) {
			this.addToSmells(this.initializeCodeSmell(this.BROKEN_MODULARIZATION));
		}
		return this.getSmells();
	}
	
	private hasBrokenModularization(): boolean
    {
		return this.getTypeMetrics().getNumOfMethods() == 0
				&& this.getTypeMetrics().getNumOfFields() >= this.getThresholdsDTO().getBrokenModularizationLargeFieldSet();
	} 
	
	public detectCyclicDependentModularization():  Array<DesignCodeSmell>
    {
		//if (this.hasCyclicDependentModularization())
        {
			this.addToSmells(this.initializeCodeSmell(this.CYCLIC_DEPENDENT_MODULARIZATION));
		}
		return this.getSmells();
	}
	
	// private hasCyclicDependentModularization(): boolean
    // {
	// 	Graph dependencyGraph = this.getTypeMetrics().getType().getParentPkg().getParentProject().getDependencyGraph();
	// 	if (dependencyGraph.getStrongComponentOfVertex(this.getTypeMetrics().getType()).size() > 1) {
	// 		return true;
	// 	}
	// 	return false;
	// }
	
	public detectInsufficientModularization():  Array<DesignCodeSmell>
    {
		//if (this.hasInsufficientModularization())
        {
			this.addToSmells(this.initializeCodeSmell(this.INSUFFICIENT_MODULARIZATION));
		}
	
        return this.getSmells();
	}
	
	// private hasInsufficientModularization(): boolean
    // {
	// 	return this.hasLargePublicInterface()
    //     || this.hasLargeNumberOfMethods()
    //     || this.hasHighComplexity();
	// }
	
	private hasLargePublicInterface(): boolean
    {
		return this.getTypeMetrics().getNumOfPublicMethods() 
        >= this.getThresholdsDTO().getInsufficientModularizationLargePublicInterface();
	}
	
	private hasLargeNumberOfMethods(): boolean
    {
		return this.getTypeMetrics().getNumOfMethods() 
        >= this.getThresholdsDTO().getInsufficientModularizationLargeNumOfMethods();
	}
	
	// private hasHighComplexity(): boolean
    // {
	// 	return this.getTypeMetrics().getWeightedMethodsPerClass()
    //     >= this.getThresholdsDTO().getInsufficientModularizationHighComplexity();
	// }
	
	public detectHubLikeModularization(): Array<DesignCodeSmell>
    {
		//if (this.hasHubLikeModularization())
        {
			this.addToSmells(this.initializeCodeSmell(this.HUB_LIKE_MODULARIZATION));
		}
	
        return this.getSmells();
	}
	
	// private hasHubLikeModularization(): boolean
    // {
	// 	return this.getTypeMetrics().getNumOfFanInTypes()
    //     >= this.getThresholdsDTO().getHubLikeModularizationLargeFanIn()
    //     && this.getTypeMetrics().getNumOfFanOutTypes()
    //     >= this.getThresholdsDTO().getHubLikeModularizationLargeFanOut();
	// }

}
