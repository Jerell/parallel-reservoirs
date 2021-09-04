import IPhaseEnvelopeFileReader from '../phaseEnvelopeFileReader';
import { PhaseData } from '../fluidProperties';

export class FakePhaseEnvelopeFileReader implements IPhaseEnvelopeFileReader {
	data: PhaseData;

	constructor(phaseData: PhaseData) {
		this.data = phaseData;
	}

	async readPhaseEnvelope(): Promise<PhaseData> {
		return this.data;
	}
}
