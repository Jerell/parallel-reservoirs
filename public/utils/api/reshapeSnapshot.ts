const reshapeSnapshot = (snapshot) => {
	if (!snapshot.keyPoints) return [];

	const reshaped = Object.keys(snapshot.keyPoints).map((key) => {
		const point = snapshot.keyPoints[key];
		return {
			name: key,
			pressure: point.pressure ? point.pressure._pascal : 0,
			temperature: point.temperature ? point.temperature._kelvin : 0,
			flowrate: point.flowrate ? point.flowrate._kgps : 0,
		};
	});

	return reshaped;
};

export default reshapeSnapshot;
