import * as vscode from 'vscode';

export class InputArgs
{
	private sourceFolder: vscode.Uri;
	private outputFolder: vscode.Uri;
	
	constructor (inputFolderPath: vscode.Uri, outputFolderPath: vscode.Uri)
    {
		this.sourceFolder = inputFolderPath;
		this.outputFolder = outputFolderPath;
	}

	public getSourceFolder(): vscode.Uri
    {
		return this.sourceFolder;
	}

	public getOutputFolder(): vscode.Uri
    {
		return this.outputFolder;
	}
	
    public getProjectName(): string
    {
        if (vscode.workspace.name == undefined)
        {
            return "Undefined_Project";
        }

        return vscode.workspace.name;
	}
}