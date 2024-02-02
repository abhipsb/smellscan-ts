import { FileSystem } from 'vscode';
import { SourceItem } from './sourceitem.component';
import { Method } from './method.component';
import { Vertex } from './utils/models/vertex.interface';
import ts = require('typescript');
import { Package } from './package.component';
import { InputArgs } from '../inputargs.component';
import { ASTProvider } from '../astprovider.component';
import { Field } from './field.component';
import { MethodMetrics } from '../metrics/methodmetrics.component';

export class Type extends SourceItem implements Vertex
{
    private parentPkg:Package;
    private inputArgs:InputArgs;
    private nestedTypesList:Array<Type> = [];
    private superTypes:Array<Type> = [];
    private subTypes:Array<Type> = [];
    private methodList:Array<Method> = [];
    private fieldList:Array<Field> = [];
    private importList:Array<ts.ImportDeclaration> = [];
    private metricsMapping = new Map<Method, MethodMetrics>();
    private astProvider = new ASTProvider();
	private isAbstract = false;
	private isInterface = false;
    private nestedClass:boolean;
    private containerClass:ts.Node;
    private typeDeclaration:ts.Node;
    private referencedTypeList: any;

    constructor (typeDeclaration:ts.Node, compilationUnit:ts.SourceFile, pkg:Package, inputArgs:InputArgs)
    {
        super();
		this.parentPkg = pkg;
		this.typeDeclaration = typeDeclaration;
		this.inputArgs = inputArgs;
		this.setInfo();
		this.setModifiers();
		this.setImportList(compilationUnit);
    }
    
    public printDebugLog(writer: FileSystem): void {
        throw new Error('Method not implemented.');
    }

    public isInterfaceType(): boolean
    {
		return this.isInterface;
	}
    
    public parse(): void
    {
        try
        {
            this.astProvider.visitTypeDeclarations(this.typeDeclaration, this);
        }
        catch(exp)
        {
            console.log(exp);
        }
        
        this.methodList = this.astProvider.methodList;
        this.parseMethods();
        this.fieldList = this.astProvider.fieldList;
    }
    
    public resolve(): void
    {
        //console.log("Type resolve ...");
		for (const method of this.methodList)
        {
            method.resolve();
        }
		// for (SM_Field field : fieldList)
		// 	field.resolve();
		// setStaticAccessList();
		// this.setReferencedTypes();
		// this.setTypesThatReferenceThis();
		this.setSuperTypes();
		// updateHierarchyGraph();
		// updateDependencyGraph();
    }

    public getMethodList(): Array<Method>
    {
        return this.methodList;
    }

    public getSubTypes(): Array<Type>
    {
		return this.subTypes;
	}
	
    public addNestedClass(type:Type): void
    {
		if (!this.nestedTypesList.includes(type))
        {
			this.nestedTypesList.push(type);
		}
	}

	public setNestedClass(referredClass:ts.Node): void
    {
		this.nestedClass = true;
		this.containerClass = referredClass;
	}

	public getTypeDeclaration(): ts.Node
    {
		return this.typeDeclaration;
	}

    public getSuperTypes(): Array<Type>
    {
		return this.superTypes;
	}

    public getFieldList(): Array<Field>
    {
		return this.fieldList;
	}

	public getNestedTypes(): Array<Type>
    {
		return this.nestedTypesList;
	}

	public getParentPkg(): Package
    {
		return this.parentPkg;
	}

    public extractMethodMetrics(): void
    {
		for (const method of this.methodList)
        {
			const metrics = new MethodMetrics(method);
			metrics.extractMetrics();
			this.metricsMapping.set(method, metrics);
			//exportMethodMetricsToCSV(metrics, method.getName());
		}
	}
	
	public getMetricsFromMethod(method: Method): MethodMetrics
    {
		return this.metricsMapping.get(method);
	}

	private setSuperTypes(): void
    {
        const currentType:any = this.typeDeclaration;
        if (currentType.heritageClauses === undefined)
        {
            return;
        }
        
        for (const clause of currentType.heritageClauses)
        {
          for (const type of clause.types)
          {
            const baseTypeName = type.expression.escapedText.toString();
            const foundBaseType = this.getParentPkg().getParentProject().searchType(baseTypeName);
            if (foundBaseType != null)
            {
              this.superTypes.push(foundBaseType);
              foundBaseType.addThisAsChildToSuperType(this);
            }
          }
        }
    
        //this.superTypes = this.astProvider.typesList;
	}

	private addThisAsChildToSuperType(child: Type): void
    {
		if (!this.subTypes.includes(child))
        {
			this.subTypes.push(child);
		}
	}

	private setReferencedTypes(): void
    {
		// for (SM_Field field:fieldList)
		// {
        //     if(!field.isPrimitiveType())
        //     {
		// 		addUniqueReference(this, field.getType(), false);
		// 	}
        // }
		
        // for (const method of this.methodList)
        // {
		// 	for (const refType of method.getReferencedTypeList())
        //     {
		// 		this.addUniqueReference(this, refType, false);
		// 	}
		// }
		
        // for (SM_Type staticAccessType : staticFieldAccessList)
        // {
		// 	addUniqueReference(this, staticAccessType, false);
		// }
		
        // for (SM_Type methodInvocation : staticMethodInvocations)
        // {
		// 	addUniqueReference(this, methodInvocation, false);
			
		// }
	}

	private setTypesThatReferenceThis(): void
    {
		for (const refType of this.referencedTypeList)
        {
			this.addUniqueReference(refType, this, true);
		}
	}
    
    private addUniqueReference(refType: any, arg1: this, arg2: boolean)
    {
        throw new Error('Method not implemented.');
    }

    private setInfo(): void
    {
        if (ts.isClassDeclaration(this.typeDeclaration))
        {
            const classType = this.typeDeclaration as ts.ClassDeclaration;
            this.name = classType.name.escapedText.toString();
            this.isInterface = false;
            return;
        }

        const interfaceType = this.typeDeclaration as ts.InterfaceDeclaration;
        this.name = interfaceType.name.escapedText.toString();
        this.isInterface = true;
    }

    private setModifiers(): void
    {
        let typeDeclaration:any;
        if (this.isInterface)
        {
            typeDeclaration = this.typeDeclaration as ts.InterfaceDeclaration;
        }
        else
        {
            typeDeclaration = this.typeDeclaration as ts.ClassDeclaration;
        }
        
        if (typeDeclaration.modifiers == undefined)
        {
            return;
        }
        
        for (const modifier of typeDeclaration.modifiers)
        {
            if (modifier.kind === ts.SyntaxKind.AbstractKeyword)
            {
                this.isAbstract = true;
                continue;
            }

            this.setAccessModifier(modifier.kind);
        }
    
        return;
    }

    private setImportList(compilationUnit:ts.SourceFile): void
    {
        this.astProvider.visitImports(compilationUnit);
        this.importList = this.astProvider.importList;
    }

	private parseMethods(): void
    {
		for (const method of this.methodList)
        {
			method.parse();
		}
	}
}