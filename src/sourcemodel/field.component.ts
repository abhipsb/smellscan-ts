import * as vscode from 'vscode';
import * as ts from 'typescript';
import { AccessStates } from './AccessStates';
import { EntitiesWithType } from './entitieswithtype.component';
import { Type } from './type.component';
import { Vertex } from "./utils/models/vertex.interface";
import { Resolver } from './resolver.component';


export class Field extends EntitiesWithType implements Vertex
{	
    private fieldDeclaration: ts.PropertyDeclaration;
	private parentType: Type;
	private nestedParentType: Type = null;
	private constField = false;
	private staticField = false;
	
	constructor (fieldDeclaration: ts.PropertyDeclaration, parentType: Type)
    {
        super();
		this.fieldDeclaration = fieldDeclaration;
		this.parentType = parentType;
		this.setName();
		this.setAccessModifiers(fieldDeclaration.modifiers);
		this.assignToNestedTypeIfNecessary();
	}
		
    private setName(): void
	{
		if (ts.isIdentifier(this.fieldDeclaration.name))
		{
			this.name = (this.fieldDeclaration.name as ts.Identifier).escapedText.toString();
			return;
		}

		if (ts.isStringLiteral(this.fieldDeclaration.name))
		{
			this.name = (this.fieldDeclaration.name as ts.StringLiteral).text;
		}

	}
	
	private setAccessModifiers(modifiers: ts.ModifiersArray): void
    {
        if (modifiers === undefined)
        {
            this.accessModifier = AccessStates.PUBLIC;
            return;
        }

        for (const modifier of modifiers)
        {
            if (modifier.kind === ts.SyntaxKind.ConstKeyword)
            {
                this.constField = true;
                continue;
            }

            if (modifier.kind === ts.SyntaxKind.StaticKeyword)
            {
                this.staticField = true;
                continue;
            }

            this.setAccessModifier(modifier.kind);
        }
    }
	
    private assignToNestedTypeIfNecessary(): void
    {
		if (this.parentType.getNestedTypes().length < 1)
        {
			return;			
		}
        else
        {
			let typeName = this.getNestedParentName();
			if(typeName != null)
            {
				typeName = typeName.trim();
				//this.nestedParentType = this.parentType.getNestedTypeFromName(typeName);
			}
		}
	}
	
	private getNestedParentName(): string
    {
		// const regex = "public|private[ ]{1,}class[ ]{1,}([^\\{]*)[\\{]{1}";
		// const inputString = this.fieldDeclaration.getParent().toString();
		// const Pattern pattern = Pattern.compile(regex);
		// const Matcher matcher = pattern.matcher(inputString);
		
		// String typeName = "";
		// while (matcher.find()) {
		// 	typeName = matcher.group(1);
		// 	return typeName;
		// }
		
        return "";
	}
	
	public getNestedParent(): Type
    {
		return this.nestedParentType;
	}
	
	public isFinal(): boolean
    {
		return this.constField;
	}
	
	public isStatic(): boolean
    {
		return this.staticField;
	}
	
	public getParentType(): Type
    {
		return this.parentType;
	}
	
	
	public printDebugLog(writer: vscode.FileSystem): void
    {
		// print(writer, "\t\tField name: " + getName());
		// print(writer, "\t\tParent class: " + this.parentType.getName());
		// print(writer, "\t\tAccess: " + getAccessModifier());
		// print(writer, "\t\tFinal: " + isFinal());
		// print(writer, "\t\tStatic: " + isStatic());
		// if (!isPrimitiveType()) {
		// 	if (getType() != null) {
		// 		print(writer, "\t\tField type: " + getType().getName());
		// 	} else {
		// 		print(writer, "\t\tField type: " + typeInfo.getObjPrimitiveType());
		// 	}
		// }
		// else
		// 	if (isPrimitiveType())
		// 		print(writer, "\t\tPrimitive field type: " + getPrimitiveType());
		// if (isParametrizedType()) {
		// 	print(writer, "\t\tList of parameters: " + typeInfo.getStringOfNonPrimitiveParameters());
		// }
		// print(writer, "\t\t----");
	}

	public resolve(): void
    {
		const resolver = new Resolver();
		//this.typeInfo = resolver.resolveVariableType(fieldDeclaration.getType(), this.getParentType().getParentPkg().getParentProject(), this.getParentType());
	}
	
}
