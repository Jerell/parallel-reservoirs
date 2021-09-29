import { useEffect, useState } from 'react';

export default function DateSelect({
	label = 'Date',
	required = false,
	labelClasses = '',
	fn = (e) => console.log(e.target.value),
	placeholder,
}) {
	const [date, setDate] = useState(placeholder);
	const yyyymmdd = (d: Date) => {
		return d.toISOString().split('T')[0];
	};

	useEffect(() => {
		const d = new Date(date);
		fn(d);
	}, [date]);

	return (
		<>
			<label
				htmlFor={label}
				className={`text-right mr-2 ${labelClasses ? labelClasses : ''}`}
			>
				{label}
				{required && <span className='text-red-500'>*</span>}
			</label>
			<input
				type='date'
				className='min-w-min inline-flex border border-green-300 focus-within:ring-green-100 focus-within:ring focus-within:border-green-500 focus:outline-none'
				onChange={(e) => setDate(e.target.value)}
				defaultValue={yyyymmdd(placeholder)}
			/>
		</>
	);
}
