const FillerBox = ({
	children,
	index = 0,
	height = 96,
	opacity = 10,
	additionalClasses = '',
	isHovered = false,
	setHoverColumn,
}: {
	children?: any;
	index?: number;
	height?: number | string;
	opacity?: number;
	additionalClasses?: string;
	isHovered?: boolean;
	setHoverColumn: (n: number) => void;
}) => {
	function handleMouseOver() {
		setHoverColumn(index);
	}

	return (
		<div
			className={`${
				index % 2 || isHovered ? 'bg-gray-400' : 'bg-gray-300'
			} bg-opacity-${
				isHovered ? opacity + 10 : opacity
			} flex-grow h-${height} text-transparent ${additionalClasses}`}
			onMouseOver={handleMouseOver}
		>
			{children}
		</div>
	);
};

export default FillerBox;
