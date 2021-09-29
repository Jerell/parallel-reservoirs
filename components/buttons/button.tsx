interface IButtonProps {
	fn?: (e) => void;
	text?: string;
	additionalClasses?: string;
	disabled?: boolean;
}

const Button = ({
	fn,
	text = 'Submit',
	additionalClasses = '',
	disabled = false,
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
			disabled={disabled}
			className={`${additionalClasses} relative py-2 px-4 border border-transparent text-sm font-medium text-white bg-green-700 ${
				disabled
					? 'opacity-50 cursor-default'
					: 'hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
			} w-24`}
			onClick={handleClick}
		>
			{text}
		</button>
	);
};

export default Button;
