import { SourceItem } from "./sourceitem.component";
import { Type } from "./type.component";
import { TypeInfo } from "./typeinfo.component";

export abstract class EntitiesWithType extends SourceItem
{	
	protected typeInfo: TypeInfo;

	public isPrimitiveType(): boolean
    {
		return this.typeInfo.isPrimitiveType();
	}
	
	public getParentType(): Type
    {
		// Always returns null.
		// Should be overridden by subclasses
		return null;
	}
	
	public getType(): Type
    {
		return this.typeInfo.getTypeObj();
	}	
	
	public getPrimitiveType(): string
    {
		return this.typeInfo.getObjPrimitiveType();
	}
	
	public isParametrizedType(): boolean
    {
		return this.typeInfo.isParametrizedType();
	}
	
	public getNonPrimitiveTypeParameters(): Array<Type>
    {
		return this.typeInfo.getNonPrimitiveTypeParameters();
	}

	public getTypeOverallToString(): string
    {
		if (this.isPrimitiveType())
        {
			return this.getPrimitiveType();
		}
        else
        {
			return this.getType() != null 
					? this.getType().getName() 
					: "UnresolvedType"; // in case of unresolved types
		}
	}
	
	public parse(): void
    {
		return;
	}
}
