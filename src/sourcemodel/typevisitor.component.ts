import ts = require("typescript");
import { InputArgs } from "../inputargs.component";
import { Package } from "./package.component";
import { Type } from "./type.component";

export class TypeVisitor
{
	private types = new Array<Type>();
	private compilationUnit:ts.SourceFile;
	private newType:Type;
	private pkgObj:Package;
	private inputArgs:InputArgs;
	
	public TypeVisitor(unit:ts.SourceFile, pkgObj:Package, inputArgs:InputArgs)
    {
		this.compilationUnit = unit;
		this.pkgObj = pkgObj;
		this.inputArgs = inputArgs;
	}	
}