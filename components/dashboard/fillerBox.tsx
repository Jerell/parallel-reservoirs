const FillerBox = ({ children, index = 0, height = 96, opacity = 10 }) => {
	return (
		<div
			className={`${
				index % 2 ? 'bg-gray-400' : 'bg-gray-300'
			} bg-opacity-${opacity} flex-grow h-${height} text-transparent`}
		>
			{children}
		</div>
	)
}

export default FillerBox
