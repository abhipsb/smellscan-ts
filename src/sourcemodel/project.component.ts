import * as ts from "typescript";
import * as vscode from 'vscode';
import { SourceItem } from './sourceitem.component';
import { Package } from './package.component';
import { InputArgs } from '../inputargs.component';
import { posix } from 'path';
import { Type } from "./type.component";


export class Project extends SourceItem
{
    private inputArgs:InputArgs;
    private packageList:Array<Package> = [];
    private sourceFileList = new Map<vscode.Uri, string>();
    private compilationUnitList:Array<ts.SourceFile> = [];
    public smellResult = 'Project, Class/Interface path, Class/Interface, Detected smell\n';

    constructor (args:InputArgs)
    {
        super();
        this.name = args.getProjectName();
        this.inputArgs = args;
        this.packageList = [];
        this.sourceFileList = new Map<vscode.Uri, string>();
        this.compilationUnitList = new Array<ts.SourceFile>();
    }

    public printDebugLog(writer: any): void {
        throw new Error('Method not implemented.');
    }
    
    
    public async parse(): Promise<void>
    {
		//console.log("Parsing the source code ...");
		await this.createCompilationUnits();
		await this.createPackageObjects();
		this.parseAllPackages();
    }
    
    public resolve(): void
    {
        //console.log("Resolving Project ...");
        for (const pkg of this.packageList)
        {
            pkg.resolve();
        }
    }

    public getPackageList(): Array<Package>
    {
		return [];
	}

	public computeMetrics(): void
    {
		//console.log("Extracting metrics...");
		//CSVUtils.initializeCSVDirectory(name, inputArgs.getOutputFolder());
		for (const pkg of this.packageList) 
        {
			pkg.extractTypeMetrics();
		}
    }
	
    public detectCodeSmells(): void
    {
		//console.log("Extracting code smells...");
		for (const pkg of this.packageList)
        {
			pkg.extractCodeSmells();
            this.smellResult = this.smellResult + pkg.resultsContent;
		}
	}

    public searchType(typeName:string): Type
    {
		for (const pkg of this.packageList)
        {
            for (const type of pkg.getTypeList())
            {
                if (type.getName() === typeName)
                {
                    return type;
                }
            }			
		}

        return null;
	}

	private async createCompilationUnits(): Promise<void>
    {
		try
        {
			await this.getFileList(this.inputArgs.getSourceFolder());

			for (const file of this.sourceFileList)
            {
				const fileContent = vscode.workspace.fs.readFile(file[0]);
                const fileToString = (await fileContent).toString();
				const unitName = file[0].path;
				const unit = ts.createSourceFile(unitName, fileToString, ts.ScriptTarget.Latest, true);
				if (unit != null)
					this.compilationUnitList.push(unit);
			}
		}
        catch (exp)
        {
			console.log(exp);
		}
	}

    private async getFileList(folder: vscode.Uri): Promise<void>
    {
        for (const [name, type] of await vscode.workspace.fs.readDirectory(folder)) 
        {
            const filePath = posix.join(folder.path, name);
            const filePathUri = folder.with({ path: filePath });

            if (type === vscode.FileType.File && !name.endsWith('.spec.ts') && name.endsWith('.ts'))
            {
                this.sourceFileList.set(filePathUri, name);
            }

            if (type === vscode.FileType.Directory)
            {
                this.getFileList(filePathUri);
            }
        }
    }
    
    private async createPackageObjects()
    {
		let packageName:string;
		for (const unit of this.compilationUnitList)
        {
			const lastIndex = unit.fileName.lastIndexOf('/');
            packageName = unit.fileName.substring(1, lastIndex);
			let pkgObj:Package = this.searchPackage(packageName);
			// If pkgObj is null, package has not yet created
			if (pkgObj == null)
            {
				pkgObj = new Package(packageName, this, this.inputArgs);
				this.packageList.push(pkgObj);
			}
			
            pkgObj.addCompilationUnit(unit);
		}
    }

	private searchPackage(packageName:string): Package
    {
		for (const pkg of this.packageList)
        {
			if (pkg.getName() === packageName)
            {
                return pkg;
            }
		}

        return null;
	}

	private parseAllPackages(): void
    {
		for (const pkg of this.packageList)
        {
			pkg.parse();
		}
	}
}