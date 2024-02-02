import { TypeMetrics } from "../../metrics/typemetrics.component";
import { SourceItemInfo } from "../../sourcemodel/sourceiteminfo.component";
import { DesignCodeSmell } from "../models/designcodesmell.component";
import { AbstractionSmellDetector } from "./abstractionsmelldetector.component";
import { EncapsulationSmellDetector } from "./encapsulationsmelldetector.component";
import { HierarchySmellDetector } from "./hierarchysmelldetector.component";
import { ModularizationSmellDetector } from "./modularizationsmelldetector.component";

export class DesignSmellFacade
{
    private abstractionSmellDetector: AbstractionSmellDetector;
    private encapsulationSmellDetector: EncapsulationSmellDetector;
    private hierarchySmellDetector: HierarchySmellDetector;
    private modularizationSmellDetector: ModularizationSmellDetector;
    private smells:Array<DesignCodeSmell> = [];

    constructor (typeMetrics:TypeMetrics, info:SourceItemInfo)
    {
        this.abstractionSmellDetector = new AbstractionSmellDetector(typeMetrics, info);
        this.encapsulationSmellDetector = new EncapsulationSmellDetector(typeMetrics, info);
        this.hierarchySmellDetector = new HierarchySmellDetector(typeMetrics, info);
        this.modularizationSmellDetector = new ModularizationSmellDetector(typeMetrics, info);
        this.smells = [];
    }

	public detectCodeSmells(): Array<DesignCodeSmell> 
    {
        this.smells = this.smells.concat(this.abstractionSmellDetector.detectCodeSmells());
        this.smells = this.smells.concat(this.encapsulationSmellDetector.detectCodeSmells());
		this.smells = this.smells.concat(this.hierarchySmellDetector.detectCodeSmells());
        this.smells = this.smells.concat(this.modularizationSmellDetector.detectCodeSmells());		
		return this.smells;
	}    
}