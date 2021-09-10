import * as d3 from 'd3';
import { useRef, useEffect } from 'react';
import styles from './lineChart.module.css';

const LineChart = ({
	data,
	min = 0,
	max = 100,
}: {
	data: number[];
	min: number;
	max: number;
}) => {
	const ref = useRef<HTMLDivElement>(null);

	function init() {
		if (!ref.current) return;

		const margin = { top: 10, right: 20, bottom: 25, left: 25 };

		const fullHeight = ref.current.clientHeight,
			fullWidth = ref.current.clientWidth;

		const height = fullHeight - margin.top - margin.bottom,
			width = ref.current.clientWidth - margin.left - margin.right;
		console.log(height, width);

		ref.current.innerHTML = '';

		const svg = d3
			.select(ref.current)
			.append('svg')
			.attr('preserveAspectRatio', 'none')
			.attr('viewBox', `0 0 ${fullWidth} ${fullHeight}`);
		// .attr('width', 'auto')
		// .attr('height', fullHeight);

		const axisPadding = 5;
		// const min = d3.min(data) as number;
		// const max = d3.max(data) as number;

		const x = d3.scaleLinear().domain([1, data.length]).range([0, width]);

		const y = d3
			.scaleLinear()
			.domain([min - axisPadding, max + axisPadding])
			.range([height, 0]);

		const xAxis = d3.axisBottom(x).ticks(data.length);
		const yAxis = d3.axisLeft(y).ticks(5);

		const frame = svg
			.append('g')
			.attr('transform', `translate(${margin.left}, ${margin.top})`);

		const yA = frame.append('g').attr('class', 'y axis').call(yAxis);
		const xA = frame
			.append('g')
			.attr('class', 'x axis')
			.attr('transform', `translate(0, ${height})`)
			.call(xAxis);
	}

	useEffect(() => {
		init();
		window.addEventListener('resize', init);
	}, []);

	return (
		<>
			<div className={`${styles.linechart}`} ref={ref}></div>
		</>
	);
};

export default LineChart;
