import Heading from './heading';
import Button from './buttons/button';
import { signIn } from 'next-auth/client';

const SignedOutBanner = () => {
	return (
		<div className='text-center py-4 flex flex-col'>
			<Heading level={6}>You are not signed in</Heading>
			<div className='flex flex-row justify-center  '>
				<Button text='Sign In' fn={signIn} />
			</div>
		</div>
	);
};

export default SignedOutBanner;
