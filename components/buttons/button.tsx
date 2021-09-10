interface IButtonProps {
	fn?: (e) => void;
	text?: string;
	additionalClasses?: string;
}

const Button = ({
	fn,
	text = 'Submit',
	additionalClasses = '',
}: IButtonProps) => {
	function handleClick(e) {
		e.persist();
		e.preventDefault();
		if (fn) {
			fn(e);
		}
	}
	return (
		<button
			className={`${additionalClasses} relative py-2 px-4 border border-transparent text-sm font-medium text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 w-24`}
			onClick={handleClick}
		>
			{text}
		</button>
	);
};

export default Button;
