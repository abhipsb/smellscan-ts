import { Type } from "./type.component";

export class TypeInfo
{
	private typeObj: Type;
	private primitiveType: boolean;
	private objPrimitiveType: string;
	private parametrizedType: boolean;
	private nonPrimitiveTypeParameters = new Array<Type>();

	public getTypeObj(): Type
    {
		return this.typeObj;
	}
	
	public setTypeObj(typeObj: Type): void
    {
		this.typeObj = typeObj;
	}
	
	public isPrimitiveType(): boolean
    {
		return this.primitiveType;
	}
	
	public setPrimitiveType(primitiveType: boolean): void
    {
		this.primitiveType = primitiveType;
	}

	public getObjPrimitiveType(): string
    {
		return this.objPrimitiveType;
	}

	public setObjPrimitiveType(objType: string): void
    {
		this.objPrimitiveType = objType;
	}

	public isParametrizedType(): boolean
    {
		return this.parametrizedType;
	}

	public setParametrizedType(parametrizedType: boolean): void
    {
		this.parametrizedType = parametrizedType;
	}
	
	public getNonPrimitiveTypeParameters(): Array<Type>
    {
		return this.nonPrimitiveTypeParameters;
	}
	
	public getStringOfNonPrimitiveParameters(): string
    {
		let output = "[";
		for (const type of this.nonPrimitiveTypeParameters)
        {
			output += type.getName() + ", "; 
		}
		
        return this.removeLastComma(output) + "]";
	}
	
	private removeLastComma(str: string): string
    {
		return (str.length > 2) ? str.substring(0, str.length - 2) : str;
	}

	public getNumOfNonPrimitiveParameters(): number
    {
		return this.getNonPrimitiveTypeParameters().length;
	}
	
	public addNonPrimitiveTypeParameter(element: Type): void
    {
		this.nonPrimitiveTypeParameters.push(element);
	}

	public toString(): string
    {
		return "TypeInfo [typeObj=" + this.typeObj + ", primitiveType=" + this.primitiveType + ", objPrimitiveType=" + this.objPrimitiveType
						+ ", parametrizedType=" + this.parametrizedType + ", nonPrimitiveTypeParameters="
						+ this.getStringOfNonPrimitiveParameters() + "]";
	}

}
