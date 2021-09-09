import massToPressure from '@/public/utils/api/massToPressure';
import binaryTargetSearch from '@/public/utils/binaryTargetSearch';

export default function pressureToMass(pressure: number, reservoirKey: string) {
	if (!Object.keys(massToPressure).includes(reservoirKey)) return null;
	return binaryTargetSearch({ min: 0, max: 10e10 }, pressure, 2, (p) =>
		massToPressure[reservoirKey](p, true)
	);
}
