import Heading from './heading';

const Component = ({
	name,
	description,
}: {
	name: string;
	description: string;
}) => {
	return (
		<div className='flex rounded-lg overflow-hidden flex-col'>
			<div>
				<Heading level={3}>{name}</Heading>
			</div>
			<div className='px-6 mb-2'>
				<p>{description}</p>
			</div>
		</div>
	);
};

export default Component;
