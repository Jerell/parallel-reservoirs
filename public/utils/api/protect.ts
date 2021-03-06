import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';

export default async function protect(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const session = await getSession({ req });
	if (session) return;
	res.status(401).json({ response: 'not authorized' });
}
