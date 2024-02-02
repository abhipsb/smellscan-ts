import * as ts from "typescript";
import * as vscode from 'vscode';
import { SourceItem } from './sourceitem.component';
import { Type } from './type.component';
import { DesignSmellFacade } from '../smells/designsmells/designsmellfacade.component';
import { DesignCodeSmell } from '../smells/models/designcodesmell.component';
import { Project } from './project.component';
import { InputArgs } from '../inputargs.component';
import { TypeMetrics } from '../metrics/typemetrics.component';
import { SourceItemInfo } from './sourceiteminfo.component';
import { ASTProvider } from "../astprovider.component";

export class Package extends SourceItem
{
    private typeList:Array<Type> = [];
    private metricsMapping = new Map<Type, TypeMetrics>();
    private smellMapping = new Map<Type, Array<DesignCodeSmell>>();    
    private compilationUnitList = new Array<ts.SourceFile>();    
    private parentProject:Project;
    private inputArgs:InputArgs;
    public resultsContent = '';

    constructor(packageName:string, parentObj:Project, inputArgs:InputArgs)
    {
        super();
        this.name = packageName;
        this.parentProject = parentObj;
        this.inputArgs = inputArgs;
        this.compilationUnitList = new Array<ts.SourceFile>();
    }

    public printDebugLog(writer: vscode.FileSystem): void {
        throw new Error('Method not implemented.');
    }
    
    public parse(): void
    {
		for (const unit of this.compilationUnitList)
        {
            const astProvider = new ASTProvider();
            astProvider.visitSourceFile(unit, this, this.inputArgs);
			const list:Array<Type> = astProvider.typesList;
			if (list.length > 0)
            {
				if (list.length == 1)
                {
					// if the compilation unit contains only one class; simpler case, there is no nested classes
                    this.typeList = this.typeList.concat(list);
				}
                else
                {
					this.typeList.push(list[0]);
					this.addNestedClass(list);
				}
			}
		}
		
        this.parseTypes(this);
    }
    
    public resolve(): void 
    {
        //console.log("Package resolving ...");
        for (const type of this.typeList)
        {
            type.resolve();
        }
    }
    
    public getTypeList(): Array<Type>
    {
        return this.typeList;
    }

	public getParentProject(): Project
    {
		return this.parentProject;
	}

	public extractTypeMetrics(): void
    {
		for (const type of this.typeList)
        {
			type.extractMethodMetrics();
			const metrics = new TypeMetrics(type);
			metrics.extractMetrics();
			this.metricsMapping.set(type, metrics);
			//exportMetricsToCSV(metrics, type.getName());
			//updateDependencyGraph(type);
		}
	}

    public extractCodeSmells(): void
    {
		for (const type of this.typeList)
        {
            const sourceItemInfo = new SourceItemInfo(this.getParentProject().getName(), this.getName(), type.getName());
            const typeMatrix = this.metricsMapping.get(type);
			const detector = new DesignSmellFacade(typeMatrix, sourceItemInfo);
			//type.extractCodeSmells();
			
            this.smellMapping.set(type, detector.detectCodeSmells());			
            this.SetResults(type);
            //exportDesignSmellsToCSV(type);
		}
	}

    public addCompilationUnit(unit:ts.SourceFile): void
    {
        this.compilationUnitList.push(unit);
    }

	public getMetricsFromType(type:Type): TypeMetrics
    {
		return this.metricsMapping.get(type);
	}

	private parseTypes(parentPkg:Package): void
    {
		for (const type of this.typeList)
        {
			type.parse();
		}
	}

	private addNestedClass(list:Array<Type>): void
    {
		if (list.length > 1) {
			for (let i = 1; i < list.length; i++)
            {
				this.typeList.push(list[i]);
				list[0].addNestedClass(list[i]);
				list[i].setNestedClass(list[0].getTypeDeclaration());
			}
		}
	}

    private async SetResults(type: Type): Promise<void>
    {
        const designSmells = this.smellMapping.get(type);        
        for (const smell of designSmells)
        {
            this.resultsContent = this.resultsContent + smell.toString();
        }        
    }
}