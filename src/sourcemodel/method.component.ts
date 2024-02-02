import * as ts from "typescript";
import { FileSystem } from 'vscode';
import { ASTProvider } from "../astprovider.component";
import { AccessStates } from "./AccessStates";
import { Resolver } from "./resolver.component";
import { SourceItem } from './sourceitem.component';
import { Type } from "./type.component";
import { Vertex } from './utils/models/vertex.interface';

export class Method extends SourceItem implements Vertex
{
	public methodType:any;
    private parentType: Type;
	private methodDeclaration:ts.Node;
    private isMethod = false;
    private isConstructor = false;
    private isStatic = false;
    private isAbstract = false;
    private methodInvocationList: Array<ts.CallExpression> = [];
    private calledMethodsList: Array<Method> = [];
    public astProvider = new ASTProvider();

    constructor(methodDeclaration:ts.Node, typeObj:Type)
    {
        super();
		this.parentType = typeObj;
		this.methodDeclaration = methodDeclaration;
        this.setInfo();
        this.setModifiers();
    }

	public isAbstractMethod(): boolean
    {
		return this.isAbstract;
	}
    
    public printDebugLog(writer: FileSystem): void {
        throw new Error('Method not implemented.');
    }
    
    public parse(): void
    {
        this.astProvider.visitMethodDeclaration(this.methodDeclaration);
        this.methodInvocationList = this.astProvider.calledMethodsList;
    }
    
    public resolve(): void
    {
        const resolver = new Resolver();
        resolver.inferCalledMethods(this.methodInvocationList, this.parentType);
        //console.log("Method resolving");
    }

    public getMethodDeclaration(): ts.Node
    {
        return this.methodDeclaration;
    }

    private setInfo(): void
    {
        if (ts.isMethodDeclaration(this.methodDeclaration))
        {
            const method = this.methodDeclaration as ts.MethodDeclaration;
            this.name = (method.name as ts.Identifier).escapedText.toString();
            this.isMethod = true;
            return;
        }

        this.name = "constructor";
        this.isConstructor = true;
    }

    private setModifiers(): void
    {
        // if (this.isMethod)
        // {
        //     this.methodType = this.methodDeclaration as ts.MethodDeclaration;
        // }
        // else
        // {
        //     this.methodType = this.methodDeclaration as ts.ConstructorDeclaration;
        // }

        if (this.methodDeclaration.modifiers === undefined)
        {
            this.accessModifier = AccessStates.PUBLIC;
            return;
        }
        
        for (const modifier of this.methodDeclaration.modifiers)
        {
            if (modifier.kind === ts.SyntaxKind.AbstractKeyword)
            {
                this.isAbstract = true;
                continue;
            }

            if (modifier.kind === ts.SyntaxKind.StaticKeyword)
            {
                this.isStatic = true;
                continue;
            }

            this.setAccessModifier(modifier.kind);
        }
    
        return;
    }
}