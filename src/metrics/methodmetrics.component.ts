import { ASTProvider } from "../astprovider.component";
import { Field } from "../sourcemodel/field.component";
import { Method } from "../sourcemodel/method.component";
import { Type } from "../sourcemodel/type.component";

export class MethodMetrics implements MetricExtractor {

	private numOfParameters: number;
	private cyclomaticComplexity: number;
	private numOfLines: number;
	private method: Method;
    private astProvider: ASTProvider;
	
	constructor (method: Method)
    {
		this.method = method;
        this.astProvider = new ASTProvider();
	}
	
	public extractMetrics(): void
    {
		this.extractNumOfParametersMetrics();
		this.extractCyclomaticComplexity();
		this.extractNumberOfLines();
	}
	
	private extractNumOfParametersMetrics(): void
    {
		this.numOfParameters = this.astProvider.parameterList.length;
	}
	
	private extractCyclomaticComplexity(): void
    {
		this.cyclomaticComplexity = this.calculateCyclomaticComplexity();
	}
	
	private calculateCyclomaticComplexity(): number
    {
        this.astProvider.visitMethodDeclaration(this.method.getMethodDeclaration);
		return this.astProvider.doStatementsList.length 
        + this.astProvider.whileStatementsList.length
		+ this.astProvider.ifStatementsList.length
		+ this.astProvider.forStatementsList.length
		+ this.astProvider.switchStatementsList.length
		+ 1;
	}
	
	private extractNumberOfLines(): void
    {
		if (this.methodHasBody())
        {
			const body = this.method.getMethodDeclaration().getFullText();
			this.numOfLines = body.length - body.replace("\n", "").length;
		}
	}
	
	private methodHasBody(): boolean
    {
        const method:any = this.method.getMethodDeclaration();
		return !(method.body === undefined);
	}
	
	public getNumOfParameters(): number
    {
		return this.numOfParameters;
	}

	public getCyclomaticComplexity(): number
    {
		return this.cyclomaticComplexity;
	}

	public getNumOfLines(): number
    {
		return this.numOfLines;
	}

	// public getDirectFieldAccesses(): Array<Field>
    // {
	// 	return this.method.getDirectFieldAccesses();
	// }
	
	// public getSMTypesInInstanceOf(): Array<Type>
    // {
	// 	return this.method.getSMTypesInInstanceOf();
	// }
	
	public getMethod(): Method
    {
		return this.method;
	}
}
