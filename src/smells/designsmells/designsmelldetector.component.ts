import { type } from "os";
import { TypeMetrics } from "../../metrics/typemetrics.component";
import { SourceItemInfo } from "../../sourcemodel/sourceiteminfo.component";
import { DesignCodeSmell } from "../models/designcodesmell.component";
import { ThresholdsDTO } from "../thresholdsdto.component";

export abstract class DesignSmellDetector
{
    private smells:Array<DesignCodeSmell> = [];
    private typeMetrics: TypeMetrics;
    private info:SourceItemInfo;
    private thresholdsDTO = new ThresholdsDTO();

    constructor(typeMetrics: TypeMetrics, info:SourceItemInfo)
    {
        this.typeMetrics = typeMetrics;
        this.info = info;
        this.smells = [];
    }

    public abstract detectCodeSmells(): Array<DesignCodeSmell>;

    public getSmells(): Array<DesignCodeSmell>
    {
        return this.smells;
    }

    public initializeCodeSmell(smellName:string): DesignCodeSmell
    {
		return new DesignCodeSmell(this.info.getProjectName()
				, this.info.getPackageName()
				, this.info.getTypeName()
				, smellName);
	}

	protected getTypeMetrics(): TypeMetrics
    {
		return this.typeMetrics;
	}

	protected addToSmells(smell:DesignCodeSmell): void
    {
		this.smells.push(smell);
	}
	
  protected getSourceItemInfo(): SourceItemInfo
  {
		return this.info;
	}

	protected getThresholdsDTO(): ThresholdsDTO
    {
		return this.thresholdsDTO;
	}
}