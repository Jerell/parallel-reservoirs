import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';

interface IButtonProps {
	fn?: (e) => void;
	expanded?: boolean;
}

const ExpansionButton = ({ fn, expanded = true }: IButtonProps) => {
	function handleClick(e) {
		e.persist();
		e.preventDefault();
		if (fn) {
			fn(e);
		}
	}
	return (
		<button
			className='relative flex flex-row text-pace-grey bg-white hover:bg-gray-100 w-20 justify-center items-center focus:ring-green-500'
			onClick={handleClick}
		>
			<FontAwesomeIcon
				icon={expanded ? faChevronUp : faChevronDown}
				className='w-3 flex'
			/>
		</button>
	);
};

export default ExpansionButton;
