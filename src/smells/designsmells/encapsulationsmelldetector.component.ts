import { TypeMetrics } from "../../metrics/typemetrics.component";
import { Project } from "../../sourcemodel/project.component";
import { SourceItemInfo } from "../../sourcemodel/sourceiteminfo.component";
import { Type } from "../../sourcemodel/type.component";
import { DesignCodeSmell } from "../models/designcodesmell.component";
import { DesignSmellDetector } from "./designsmelldetector.component";

export class EncapsulationSmellDetector extends DesignSmellDetector
{
	
	private DEFICIENT_ENCAPSULATION = "Deficient Encapsulation";
	private UNEXPLOITED_ENCAPSULATION = "Unexploited Encapsulation";
	
	constructor (typeMetrics: TypeMetrics, info: SourceItemInfo)
    {
		super(typeMetrics, info);
	}
	
	public detectCodeSmells(): Array<DesignCodeSmell>
    {
		this.detectDeficientEncapsulation();
		//this.detectUnexploitedEncapsulation();
		return this.getSmells();
	}
	
	public detectDeficientEncapsulation(): Array<DesignCodeSmell>
    {
		if (this.hasDeficientEncapsulation())
        {
			this.addToSmells(this.initializeCodeSmell(this.DEFICIENT_ENCAPSULATION));
		}
		
        return this.getSmells();
	}
	
	private hasDeficientEncapsulation(): boolean
    {
		return this.getTypeMetrics().getNumOfPublicFields() > 0;
	}
	
	public detectUnexploitedEncapsulation(): Array<DesignCodeSmell>
    {
		//if (this.hasUnexploitedEncapsulation())
        {
			this.addToSmells(this.initializeCodeSmell(this.UNEXPLOITED_ENCAPSULATION));
		}
		
        return this.getSmells();
	}
	
	// private hasUnexploitedEncapsulation(): boolean
    // {
	// 	for (const method of this.getTypeMetrics().getType().getMethodList())
    //     {
	// 		for (const type of method.getSMTypesInInstanceOf())
    //         {
	// 			for (const crossType of method.getSMTypesInInstanceOf())
    //             {
	// 				if (!type.equals(crossType) && this.inSameHierarchy(type, crossType))
    //                 {
	// 					return true;
	// 				}
	// 			}
	// 		}
	// 	}
	// 	return false;
	// }
	
	// private inSameHierarchy(type: Type, crossType: Type): boolean
    // {
	// 	Graph hierarchyGraph = this.getProject(type).getHierarchyGraph();
	// 	return hierarchyGraph.inSameConnectedComponent(type, crossType);
	// }
	
	// private getProject(type: Type): Project
    // {
	// 	return type.getParentPkg().getParentProject();
	// }	
}
