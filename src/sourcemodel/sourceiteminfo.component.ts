import { type } from "os";

export class SourceItemInfo
{
    private projectName = '';
    private packageName = '';
    private typeName = '';
    private methodName = '';
    
    constructor (projectName:string, packageName:string, typeName:string)
    {
        this.packageName = packageName;
        this.projectName = projectName;
        this.typeName = typeName;
    }

	public getProjectName():string
    {
		return this.projectName;
	}

	public getPackageName():string
    {
		return this.packageName;
	}

	public getTypeName():string
    {
		return this.typeName;
	}

	public getMethodName():string
    {
		return this.methodName;
	}
}