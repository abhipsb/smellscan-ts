import * as ts from "typescript";
import { Method } from "./method.component";
import { Project } from "./project.component";
import { Type } from "./type.component";


export class Resolver
{
	public resolveType(type:Type, project:Project): Type
    {
		// ITypeBinding binding = type.resolveBinding();
		// if (binding == null || binding.getPackage() == null) // instanceof String[] returns null package
		// 	return null;
		// SM_Package pkg = findPackage(binding.getPackage().getName(), project);
		// if (pkg != null) {
		// 	return findType(binding.getName(), pkg);
		// }
		return null;
	}

	public inferCalledMethods(methodInvocationList: Array<ts.CallExpression>, parentType:Type): Array<Method>
	{
		let xyz:ts.PropertyAccessExpression;
		for (const invokedMethod of methodInvocationList)
		{
			if (ts.isPropertyAccessExpression(invokedMethod.expression))
			{
				xyz = invokedMethod.expression;
			}
		}
		
		return;
	}
}