import { isDeepStrictEqual } from "util";
import { MethodMetrics } from "../../metrics/methodmetrics.component";
import { TypeMetrics } from "../../metrics/typemetrics.component";
import { AccessStates } from "../../sourcemodel/AccessStates";
import { Method } from "../../sourcemodel/method.component";
import { SourceItemInfo } from "../../sourcemodel/sourceiteminfo.component";
import { Type } from "../../sourcemodel/type.component";
import { DesignCodeSmell } from "../models/designcodesmell.component";
import { DesignSmellDetector } from "./designsmelldetector.component";

export class HierarchySmellDetector extends DesignSmellDetector
{	
	private BROKEN_HIERARCHY = "Broken Hierarchy";
	private CYCLIC_HIERARCHY = "Cyclic Hierarchy";
	private DEEP_HIERARCHY = "Deep Hierarchy";
	private MISSING_HIERARCHY = "Missing Hierarchy";
	private MULTIPATH_HIERARCHY = "Multipath Hierarchy";
	private REBELIOUS_HIERARCHY = "Rebellious Hierarchy";
	private WIDE_HIERARCHY = "Wide Hierarchy";
	
	private EMPTY_BODY = 0;
	private ONLY_ONE_STATEMENT = 1;
	private INSTANCE_OF_TYPES_NOT_IN_HIERARCHY_THRESHOLD = 2;
	
	constructor (typeMetrics:TypeMetrics, info:SourceItemInfo)
    {
		super(typeMetrics, info);
	}
	
	public detectCodeSmells(): Array<DesignCodeSmell>
    {
		this.detectBrokenHierarchy();
		this.detectCyclicHierarchy();
		this.detectDeepHierarchy();
		//this.detectMissingHierarchy();
		this.detectMultipathHierarchy();
		this.detectRebeliousHierarchy();
		this.detectWideHierarchy();
		return this.getSmells();
	}
	
	public detectBrokenHierarchy(): Array<DesignCodeSmell>
    {
		if (this.hasBrokenHierarchy()) {
			this.addToSmells(this.initializeCodeSmell(this.BROKEN_HIERARCHY));
		}
		
        return this.getSmells();
	}
	
	private hasBrokenHierarchy(): boolean
    {
		const type = this.getTypeMetrics().getType();
		if (this.hasSuperTypes(type) && this.hasPublicMethods())
        {
			for (const superType of type.getSuperTypes())
            {
				if (!this.methodIsOverriden(type, superType))
                {
					return true;
				}
			}
		}
		
        return false;
	}
	
	private hasSuperTypes(type: Type): boolean
    {
		return type.getSuperTypes().length > 0;
	}
	
	private hasPublicMethods(): boolean
    {
		return this.getTypeMetrics().getNumOfPublicMethods() > 0;
	}
	
	private methodIsOverriden(type: Type, superType: Type): boolean
    {
		let overrides = false;
		for (const superMethod of superType.getMethodList())
        {
			if (superMethod.getAccessModifier() == AccessStates.PUBLIC || superMethod.isAbstractMethod()
             || superType.isInterfaceType())
            {
				for (const method of type.getMethodList())
                {
					if (method.getAccessModifier() == AccessStates.PUBLIC && this.shareTheSameName(method, superMethod))
                    {
						overrides = true;
					}
				}
			}
		}
		
        return overrides;
	}
	
	private shareTheSameName(method: Method, superMethod: Method): boolean
    {
		return method.getName() === superMethod.getName();
	}
	
	public detectCyclicHierarchy(): Array<DesignCodeSmell>
    {
		if (this.hasCyclicDependency()) {
			this.addToSmells(this.initializeCodeSmell(this.CYCLIC_HIERARCHY));
		}
		
        return this.getSmells();
	}
	
	private hasCyclicDependency(): boolean
    {
		for (const superType of this.getTypeMetrics().getType().getSuperTypes()) {
			if (this.hasCyclicDependencySuper(superType))
            {
				return true;
			}
		}
		
        return false;
	}
	
	private hasCyclicDependencySuper(superType: Type): boolean
    {
		// FIXME : switch to iterative process to avoid stack overflows
		try
        {
			if (superType.getName() === (this.getSourceItemInfo().getTypeName()))
            {
				return true;
			}
			
            for (const superSuperType of superType.getSuperTypes())
            {
				if (this.hasCyclicDependencySuper(superSuperType))
                {
					return true;
				}
			}
			
            return false;
		}
        catch (er)
        {
			console.log("Cyclic dependency analysis skipped due to memory overflow.");
			return false;
		}
	}
	
	public detectDeepHierarchy(): Array<DesignCodeSmell>
    {
		if (this.hasDeepHierarchy()) {
			this.addToSmells(this.initializeCodeSmell(this.DEEP_HIERARCHY));
		}
	
        return this.getSmells();
	}
	
	private hasDeepHierarchy(): boolean
    {
		return this.getTypeMetrics().getInheritanceDepth() > this.getThresholdsDTO().getDeepHierarchy();
	}
	
	public detectMissingHierarchy(): Array<DesignCodeSmell>
    {
		//if (this.hasMissingHierarchy())
        {
			this.addToSmells(this.initializeCodeSmell(this.MISSING_HIERARCHY));
		}
	
        return this.getSmells();
	}
	
	// private hasMissingHierarchy(): boolean
    // {
	// 	const type = this.getTypeMetrics().getType();
	// 	for (const method of type.getMethodList())
    //     {
	// 		const listOfInstanceOfTypes = method.getSMTypesInInstanceOf();
	// 		const allAncestors = this.getAllAncestors(type, new Array<Type>());
	// 		if (this.setDifference(listOfInstanceOfTypes, allAncestors).length
    //         >= this.INSTANCE_OF_TYPES_NOT_IN_HIERARCHY_THRESHOLD)
    //         {
	// 			return true;
	// 		}
	// 	}
		
    //     return false;
	// }
	
	private getAllAncestors(type: Type, ancestors: Array<Type>):  Array<Type>
    {
		//FIXME : replace recursion with iterative loop to avoid stack overflows.
		try
        {
			for (const superType of type.getSuperTypes())
            {
				if (!ancestors.includes(superType))
                {
					ancestors.push(superType);
				}
				
                this.getAllAncestors(superType, ancestors);
			}
			
            return ancestors;
		}
        catch (er)
        {
			console.log("Ancestors analysis skipped due to memory overflow.");
			return ancestors;
		}
	}
	
	private setDifference(oneList: Array<Type>, otherList: Array<Type>):  Array<Type>
    {
		const outcome: Array<Type> = [];
		for (const type of oneList)
        {
			if (!otherList.includes(type)) {
				outcome.push(type);
			}
		}

        return outcome;
	}
	
	public detectMultipathHierarchy():  Array<DesignCodeSmell>
    {
		if (this.hasMultipathHierarchy()) {
			this.addToSmells(this.initializeCodeSmell(this.MULTIPATH_HIERARCHY));
		}
		return this.getSmells();
	}
	
	private hasMultipathHierarchy(): boolean
    {
		for (const superType of this.getTypeMetrics().getType().getSuperTypes())
        {
			for (const otherSuperType of this.getTypeMetrics().getType().getSuperTypes())
            {                
				if (!isDeepStrictEqual(superType, otherSuperType))
                {
					for (const ancestorType of otherSuperType.getSuperTypes())
                    {
						if (this.sameAsSomeAncestor(superType, ancestorType))
                        {
							return true;
						}
					}
				}
			}
		}
		return false;
	}
	
	private sameAsSomeAncestor(targetType: Type, ancestorType: Type): boolean
    {
		if (isDeepStrictEqual(targetType, ancestorType))
        {
			return true;
		}
		
        for (const deeperAncestor of ancestorType.getSuperTypes())
        {
			//This looks crazy but in some cases 'getSuperTypes()' call returns itself as supertype
			//The following check is to avoid StackOverFlow Exception.
			if (ancestorType == deeperAncestor)
			{
                return false;
            }

			if (this.sameAsSomeAncestor(targetType, deeperAncestor))
            {
				return true;
			}
		}
		
        return false;
	}
	
	public detectRebeliousHierarchy(): Array<DesignCodeSmell>
    {
		if (this.hasRebeliousHierarchy())
        {
			this.addToSmells(this.initializeCodeSmell(this.REBELIOUS_HIERARCHY));
		}
		
        return this.getSmells();
	}
	
	private hasRebeliousHierarchy(): boolean
    {
		for (const method of this.getTypeMetrics().getType().getMethodList())
        {
			const methodMetrics = this.getTypeMetrics().getType().getMetricsFromMethod(method);
			if (this.hasSuperType())
            {
				if (this.hasEmptyBody(methodMetrics) || this.hasOnlyAThrowStatement(methodMetrics, method))
                {
					for (const superType of this.getTypeMetrics().getType().getSuperTypes())
                    {
						if (this.methodIsOverridenSuper(method, superType))
                        {
							return true;
						}
					}
				}
			}
		}
		return false;
	}
	
	private hasSuperType(): boolean
    {
		return this.getTypeMetrics().getType().getSuperTypes().length > 0;
	}
	
	private hasEmptyBody(methodMetrics: MethodMetrics): boolean
    {
		return methodMetrics.getNumOfLines() == this.EMPTY_BODY;
	}
	
	private hasOnlyAThrowStatement(methodMetrics: MethodMetrics, method: Method): boolean
    {
		return methodMetrics.getNumOfLines() == this.ONLY_ONE_STATEMENT;
				//&& method.throwsException();
	}
	
	private methodIsOverridenSuper(method: Method, type: Type): boolean
    {
		if (this.existMethodWithSameSignature(method, type))
        {
			return true;
		}
		
        let flag = false;
		// FIXME : switch to iterative process to avoid stack overflows
		for (const superType of type.getSuperTypes())
        {
			try
            {
				flag = this.methodIsOverridenSuper(method, superType);
			} 
            catch (er)
            {
				console.log("Method is overriden analysis skipped due to memory overflow");
			}
		}
		
        return flag;
	}
	
	private existMethodWithSameSignature(method: Method, type: Type)
    {
		for (const otherMethod of type.getMethodList())
        {
			if (this.haveSameSignature(method, otherMethod))
            {
				return true;
			}
		}
		
        return false;
	}
	
	private haveSameSignature(method: Method, otherMethod: Method): boolean
    {
		return method.getName() === otherMethod.getName()
        && this.haveSameArguments(method, otherMethod);
	}
	
	private haveSameArguments(method: Method, otherMethod: Method): boolean
    {
		if (method.astProvider.parameterList.length != otherMethod.astProvider.parameterList.length)
        {
			return false;
		}
		
        for (let i = 0; i < method.astProvider.parameterList.length; i++)
        {
			if (!(this.getParameterTypeFromIndex(method, i) === (this.getParameterTypeFromIndex(otherMethod, i))))
            {
				return false;
			}
		}
		
        return true;
	}
	
	private getParameterTypeFromIndex(method: Method, index: number): string
    {
		return method.astProvider.parameterList[index].type.getFullText();
	}
	
	public detectWideHierarchy(): Array<DesignCodeSmell>
    {
		if (this.hasWideHierarchy()) {
			this.addToSmells(this.initializeCodeSmell(this.WIDE_HIERARCHY));
		}
	
        return this.getSmells();
	}
	
	private hasWideHierarchy(): boolean
    {
		return this.getTypeMetrics().getNumOfChildren() > this.getThresholdsDTO().getWideHierarchy();
	}
}