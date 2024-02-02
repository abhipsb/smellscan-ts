import * as vscode from 'vscode';
import { Project } from './project.component';
import { Type } from './type.component';
import { Package } from './package.component';
import { Method } from './method.component';
import { AccessStates } from './AccessStates';
import { strict } from 'assert';
import ts = require('typescript');

export abstract class SourceItem
{
	protected name!: string;
	protected accessModifier!: AccessStates;

	/**
	 * This method prints the whole source code model For debugging purposes
	 * only
	 */
	public abstract printDebugLog(writer: vscode.FileSystem): void;

	/**
	 * This is the first pass of parsing a source code entity.
	 */
	public abstract parse(): void;

	/**
	 * This method establishes relationships among source-code entities. Such
	 * relationships include variable types, super/sub types, etc.
	 */
	public abstract resolve(): void;

	public getName(): string
    {
		return this.name;
	}

	public getAccessModifier(): AccessStates
    {
		return this.accessModifier;
	}

	// TODO check default case
	setAccessModifier(modifier: number): void
    {
		if (modifier === ts.SyntaxKind.PublicKeyword)
		{
			this.accessModifier = AccessStates.PUBLIC;
		}
		else if (modifier === ts.SyntaxKind.ProtectedKeyword)
		{
			this.accessModifier = AccessStates.PROTECTED;
		}
		else if (modifier === ts.SyntaxKind.PrivateKeyword)
		{
			this.accessModifier = AccessStates.PRIVATE;
		}
		else
			this.accessModifier = AccessStates.PUBLIC;
	}

	protected findType(parentProject: Project, typeName: string, pkgName: string): Type
    {
		for (const pkg of parentProject.getPackageList())
        {
			if (pkg.getName() === pkgName)
			{
				for(const type of pkg.getTypeList())
                if(type.getName() === typeName)
                {
                    return type;
                }
			}
        }
		
        return null;
	}
	
    private getTypesOfProject(project: Project): Array<Type>
    {
		const pkgList:Array<Package> = project.getPackageList();
		let typeList:Array<Type> = [];

        for (const pkg of pkgList)
        {
			typeList = typeList.concat(pkg.getTypeList());
        }

		return typeList;
	}

	private getMethodsOfProject(project: Project): Array<Method>
    {
		const typeList:Array<Type> = this.getTypesOfProject(project);
		let methodList:Array<Method> = [];

		for (const type of typeList)
        {
			methodList = methodList.concat(type.getMethodList());
        }

		return methodList;
	}

	private getMethodsOfPkg(pkg: Package): Array<Method>
    {
		const typeList:Array<Type> = pkg.getTypeList();
		let methodList:Array<Method> = [];

		for (const type of typeList)
        {
            methodList = methodList.concat(type.getMethodList());
        }

		return methodList;
	}

	protected convertListToString(typeList: Array<Type>): string
    {
		let result = "";
		for (const type of typeList)
        {
            if(result === "")
                result = type.getName();
            else
                result += ", " + type.getName();
        }
		
        return null;
	}
}