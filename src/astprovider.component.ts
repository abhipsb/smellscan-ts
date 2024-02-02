import * as ts from "typescript";
import { InputArgs } from "./inputargs.component";
import { Field } from "./sourcemodel/field.component";
import { Method } from "./sourcemodel/method.component";
import { Package } from "./sourcemodel/package.component";
import { Type } from "./sourcemodel/type.component";

export interface ASTNode
{
  value: string;
  children?: ASTNode[];
  id: number;
  settings: any;
  tsNode: ts.Node;
}

export class ASTProvider
{
  // displayText = "This is display!"
  // astDisplay = "AST Here";
  // fileName = '';

   private nodeList:any = [];
  // counter = 1;
  public typesList:Array<Type> = [];
  public importList:Array<ts.ImportDeclaration> = [];
  public methodList:Array<Method> = [];
  public fieldList:Array<Field> = [];
  public calledMethodsList:Array<ts.CallExpression> = [];
  public doStatementsList:Array<ts.DoStatement> = [];
  public whileStatementsList:Array<ts.WhileStatement> = [];
  public forStatementsList:Array<ts.ForStatement> = [];
  public ifStatementsList:Array<ts.IfStatement> = [];
  public switchStatementsList:Array<ts.SwitchStatement> = [];
  public parameterList:Array<ts.ParameterDeclaration> = [];
  private sourceFile:ts.SourceFile;

  // onFileSelected(content:string)
  // {
  //   this.displayText = content;
  // }

  // onParseClick()
  // {
  //   const a = ts.createSourceFile('_.ts', this.displayText.toString(), ts.ScriptTarget.Latest, true);
  //   const x = this.visit(a, false);
  //   ts.SyntaxKind.ClassDeclaration;
  // }

  // public visit(node: ts.Node, pkgObj:Package, inputArgs:InputArgs, extended: boolean): ASTNode
  // {
  //   const children:any = [];
  //   if (extended)
  //   {
  //     node.getChildren().forEach(_node =>
  //       {
  //       children.push(this.visit(_node, pkgObj, inputArgs, extended));
  //     });
  //   } else {
  //     ts.forEachChild(node, _node => {
  //       children.push(this.visit(_node, pkgObj, inputArgs, extended));
  //     });
  //   }
  //   this.nodeList.push(node);
  //   const obj: ASTNode = {
  //     value: ts.SyntaxKind[node.kind],
  //     id: this.counter++,
  //     tsNode: node,
  //     settings: {
  //       rightMenu: false,
  //       static: true,
  //       cssClasses: {
  //         'expanded': 'fas fa-caret-down fa-white',
  //         'collapsed': 'fas fa-caret-right fa-white',
  //         'leaf': 'fas fa-circle fa-white',
  //         'empty': 'fas fa-caret-right disabled fa-white'
  //       }
  //     }
  //   };

  //   if (node.kind === ts.SyntaxKind.ClassDeclaration)
  //   {
  //     const type = new Type(node as ts.ClassDeclaration, pkgObj, inputArgs);
  //     this.typesList.push(type);
  //   }

  //   if (children.length) {
  //     obj.children = children;
  //   }
  //   return obj;
  // }

  public visitSourceFile(compilationUnit: ts.SourceFile, pkgObj:Package, inputArgs:InputArgs): void
  {
    for (const child of compilationUnit.statements)
    {
      if (child.kind === ts.SyntaxKind.ClassDeclaration || child.kind === ts.SyntaxKind.InterfaceDeclaration)
      {
        const type = new Type(child, compilationUnit, pkgObj, inputArgs);
        this.typesList.push(type);
      }
    }
  }

  public visitImports(compilationUnit: ts.SourceFile): void
  {
    for (const child of compilationUnit.statements)
    {
      if (child.kind === ts.SyntaxKind.ImportDeclaration)
      {
        this.importList.push(child as ts.ImportDeclaration);
      }
    }
  }

  public visitTypeDeclarations(typeDeclaration: any, typeObj:Type)
  {
    for (const child of typeDeclaration.members)
    {
      if (child.kind === ts.SyntaxKind.MethodDeclaration || child.kind === ts.SyntaxKind.Constructor)
      {
        const method = new Method(child, typeObj);
        this.methodList.push(method);
        continue;
      }

      if (child.kind === ts.SyntaxKind.PropertyDeclaration)
      {
        const field = new Field(child, typeObj);
        this.fieldList.push(field);
        continue;
      }
    }
  }
  
  public visitMethodDeclaration(methodType: any)
  {
    const children:any = [];
      ts.forEachChild(methodType, _node => 
      {
        this.visitMethodDeclaration(_node);
      });

      if (ts.isCallExpression(methodType))
      {
        this.calledMethodsList.push(methodType);
      }

      if (ts.isDoStatement(methodType))
      {
        this.doStatementsList.push(methodType);
      }

      if (ts.isWhileStatement(methodType))
      {
        this.whileStatementsList.push(methodType);
      }

      if (ts.isForStatement(methodType))
      {
        this.forStatementsList.push(methodType);
      }

      if (ts.isSwitchStatement(methodType))
      {
        this.switchStatementsList.push(methodType);
      }

      if (ts.isParameter(methodType))
      {
        this.parameterList.push(methodType);
      }

    // for (const child of methodType.body.statements)
    // {
    //   const exprStatement = child as ts.ExpressionStatement;
    //   if (ts.isCallExpression(exprStatement.expression))
    //   {
    //     this.calledMethodsList.push(exprStatement.expression);
    //   }
    // }
  }
}
