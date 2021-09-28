import reshapeSnapshot from './reshapeSnapshot';
import setupProperty from '../setupProperty';

const variables = ['pressure', 'temperature', 'flowrate'];

const reshapeLifeOfField = (lof) => {
	const reshaped = lof.reduce((acc, snapshot) => {
		const snap = reshapeSnapshot(snapshot);

		snap.forEach((point) => {
			setupProperty(acc, point.name, {});
			variables.forEach((v) => {
				setupProperty(acc[point.name], v, []);
				acc[point.name][v].push(point[v]);
			});
		});

		return acc;
	}, {});

	return reshaped;
};

export const transformToPTQRows = (lof, timestep) => {
	const reshaped = reshapeLifeOfField(lof);

	const rows = Object.keys(reshaped).reduce(
		(acc, point) => {
			variables.forEach((v) => {
				acc[v].push(reshaped[point][v]);
			});
			return acc;
		},
		{ pressure: [], temperature: [], flowrate: [] }
	);

	return [rows, timestep];
};

export default reshapeLifeOfField;
