import * as vscode from 'vscode';
import { InputArgs } from './inputargs.component';
import { Project } from './sourcemodel/project.component';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext)
{
	console.log('smellscan-ts is now active!');
	const commandId = 'smellscan.detectSmells';

	const disposable = vscode.commands.registerCommand(commandId, async function (selectedFolder: vscode.Uri)
	{
		console.log("smellscan Started");
		// if (!vscode.window.activeTextEditor)
		// {
		// 	return vscode.window.showInformationMessage('Open a file first');
		// }
		if (selectedFolder === undefined)
		{
			return vscode.window.showWarningMessage('Usages: Right click on folder and select Start SmellScan');
		}

		const argsObj = parseArguments(selectedFolder);
		const project = new Project(argsObj);
		await vscode.window.withProgress(
		{
			location: vscode.ProgressLocation.Notification,
			title: 'Scanning files ...',
		}, () => project.parse());
		
		await vscode.window.withProgress(
		{
			location: vscode.ProgressLocation.Notification,
			title: 'Resolving members ...',
		}, async () => project.resolve());
		
		await vscode.window.withProgress(
		{
			location: vscode.ProgressLocation.Notification,
			title: 'Computing metrics ...',
		}, async () => project.computeMetrics());

		await vscode.window.withProgress(
		{
			location: vscode.ProgressLocation.Notification,
			title: 'Generating smells ...',
		}, async () => project.detectCodeSmells());
				
        const csvDoc = fs.createWriteStream(argsObj.getOutputFolder().path + '/designSmells.csv');
		let filePath = csvDoc.path.toString();
		filePath = filePath.substring(1, filePath.length);
		fs.writeFileSync(filePath, project.smellResult);
		csvDoc.end();
		csvDoc.close();
		const doc = await vscode.workspace.openTextDocument(filePath);
		vscode.window.showTextDocument(doc, { viewColumn: vscode.ViewColumn.Active });
		console.log("SmellScan Completed!");
	});

	context.subscriptions.push(disposable);
}

function parseArguments(selectedUri: vscode.Uri): InputArgs
{
	//const folderPath = posix.dirname(fileUri.path);
	//const folderUri = fileUri.with({ path: folderPath });

	const inputArgs = new InputArgs(selectedUri, selectedUri);
	return inputArgs;
}

//for debug purpose
function delay(ms: number)
{
  return new Promise(resolve => setTimeout(resolve, ms));
}