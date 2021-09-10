const setupProperty = (obj: object, prop: string, initial: any) => {
	if (!obj[prop]) obj[prop] = initial;
};

export default setupProperty;
