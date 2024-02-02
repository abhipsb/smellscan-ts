export class DesignCodeSmell
{
    private projectName:string;
    private packageName:string;
    private typeName:string;
    private smellName:string;    

    constructor(projectName:string, packageName:string, typeName:string, smellName:string)
    {
        //super(projectName, packageName);
        this.projectName = projectName;
        this.packageName = packageName;
        this.typeName = typeName;
        this.smellName = smellName;
    }

	public getTypeName(): string
    {
		return this.typeName;
	}

	public getSmellName(): string
    {
		return this.smellName;
	}
	
	public toString(): string
    {
		return this.projectName
        + "," + this.packageName
        + "," + this.typeName
        + "," + this.smellName
        + "\n";
	}

}