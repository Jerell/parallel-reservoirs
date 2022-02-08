import * as d3 from 'd3';
import { useRef, useEffect } from 'react';
import styles from './LineGraph.module.css';
import LineGraphUser from '../utils/LineGraphUser';

export interface ILines {
	x?: number[] | Date[];
	y?: number[];
}

interface IFillOptions {
	direction?: 'left' | 'top' | 'right' | 'bottom';
	fillOpacity?: number;
}

export interface ILineOptions {
	animated?: boolean;
	className?: string;
	color?: string;
	fill?: boolean;
	fillOptions?: IFillOptions;
}

interface IPTGraphProps {
	stepped?: boolean;
	fixedLines?: ILines;
	userBoundaries?: ILines;
	lines?: [number | Date, number][][];
	hover?: {
		x?: boolean;
		y?: boolean;
	};
	click?: boolean;
	range?: {
		x?: {
			min?: number;
			max?: number;
		};
		y?: {
			min?: number;
			max?: number;
		};
	};
	xAxisLabel?: string;
	yAxisLabel?: string;
	gasPhaseBoundary?: [number, number][];
	densePhaseBoundary?: [number, number][];
	lineOptions?: ILineOptions[];
	userBoundaryOptions?: { x?: ILineOptions[]; y?: ILineOptions[] };
}

export const LineGraph = ({
	stepped = false,
	hover = { x: true, y: false },
	fixedLines = { x: [], y: [] },
	click = false,
	range,
	lines = [],
	xAxisLabel = '',
	yAxisLabel = '',
	gasPhaseBoundary,
	densePhaseBoundary,
	lineOptions = [],
	userBoundaries = { x: [], y: [] },
	userBoundaryOptions = { x: [], y: [] },
}: IPTGraphProps) => {
	const ref = useRef<HTMLDivElement>(null);

	const user = new LineGraphUser();

	if (!fixedLines.x) fixedLines.x = [];
	if (!fixedLines.y) fixedLines.y = [];

	function sortByX(a, b) {
		if (typeof a[0] === 'number' && typeof b[0] === 'number') {
			// return a[0] - b[0];
			return 0;
		} else {
			if (a && b) {
				const d1 = a[0] as Date;
				const d2 = b[0] as Date;
				const n1 = d1 ? d1.getTime() : 0;
				const n2 = d2 ? d2.getTime() : 0;
				return n1 - n2;
			}
			return 0;
		}
	}

	lines = lines.filter((line) => line.length).map((line) => line.sort(sortByX));

	function getXYMinMax() {
		const x0s = lines.map((line) => line[0][0]);
		const y0s = lines.map((line) => line[0][1]);
		const xEnds = lines.map((line) => line[line.length - 1][0]);
		const yEnds = lines.map((line) => line[line.length - 1][1]);

		const getMinMax = (arr, min?, max?) => ({
			min: min
				? min
				: !arr.length
				? 0
				: arr.reduce((a, b) => (a < b ? a : b), new Date().getTime()),
			max: max ? max : arr.reduce((a, b) => (a > b ? a : b), 0),
		});

		function rangeValueIfDefined(rVal, backup, min = true) {
			if (typeof rVal === 'undefined')
				return min ? getMinMax(backup).min : getMinMax(backup).max;
			return rVal;
		}

		return [
			rangeValueIfDefined(range?.x?.min, x0s),
			rangeValueIfDefined(range?.x?.max, xEnds),
			rangeValueIfDefined(range?.y?.min, y0s),
			rangeValueIfDefined(range?.y?.max, yEnds),
		];
	}

	const [xMin, xMax, yMin, yMax] = getXYMinMax();

	function init() {
		if (!ref.current) return;

		const margin = { top: 4, right: 0, bottom: 48, left: 48 };
		const fullHeight = ref.current.clientHeight,
			fullWidth = ref.current.clientWidth;

		const height = fullHeight - margin.top - margin.bottom,
			width = ref.current.clientWidth - margin.left - margin.right;

		ref.current.innerHTML = '';

		const svg = d3
			.select(ref.current)
			.append('svg')
			.attr('preserveAspectRatio', 'none')
			.attr('viewBox', `0 0 ${fullWidth} ${fullHeight}`);

		const x =
			typeof xMin === 'number'
				? d3.scaleLinear().domain([xMin, xMax]).range([0, width])
				: d3.scaleTime().domain([xMin, xMax]).range([0, width]);

		const y = d3.scaleLinear().domain([yMin, yMax]).nice().range([height, 0]);

		const xAxis = d3
			.axisBottom(x)
			.ticks(10, !xMin || typeof xMin === 'number' ? null : '%d %b %Y');
		const yAxis = d3.axisLeft(y).ticks(5);

		const frame = svg
			.append('g')
			.attr('transform', `translate(${margin.left}, ${margin.top})`);

		const yA = frame.append('g').attr('class', 'y axis').call(yAxis);
		const xA = frame
			.append('g')
			.attr('class', 'x axis chromatic-ignore')
			.attr('transform', `translate(0, ${height})`)
			.call(xAxis);

		xA.append('text')
			.attr('class', 'axis-label')
			.text(xAxisLabel)
			.attr('x', margin.left + (width - margin.left - margin.right) / 2)
			.attr('y', 40)
			.attr('class', styles.axisLabel);

		yA.append('text')
			.attr('class', 'axis-label')
			.text(yAxisLabel)
			.attr('transform', 'rotate(-90)')
			.attr('x', -(margin.top + (height - margin.top - margin.bottom) / 2))
			.attr('y', -30)
			.attr('class', styles.axisLabel);

		function drawRegion(
			lineXY: [number | Date, number][],
			options: ILineOptions = {},
			g: any = frame
		) {
			const areaGenerator = {
				left: d3
					.area()
					.y((xy) => xy[1])
					.x0(0)
					.x1((xy) => xy[0]),
				top: d3
					.area()
					.x((xy) => xy[0])
					.y0(0)
					.y1((xy) => xy[1]),
				right: d3
					.area()
					.y((xy) => xy[1])
					.x0(width)
					.x1((xy) => xy[0]),
				bottom: d3
					.area()
					.x((xy) => xy[0])
					.y0(height)
					.y1((xy) => xy[1]),
			};

			let areaSide = areaGenerator.bottom;
			switch (options.fillOptions?.direction) {
				case 'left':
					areaSide = areaGenerator.left;
					break;
				case 'top':
					areaSide = areaGenerator.top;
					break;
				case 'right':
					areaSide = areaGenerator.right;
					break;
				case 'bottom':
					areaSide = areaGenerator.bottom;
					break;
			}

			const area = g
				.append('path')
				.datum(lineXY.map((xy) => [x(xy[0]), y(xy[1])]))
				.attr('stroke', 'none')
				.attr('fill', options.color)
				.attr(
					'fill-opacity',
					options.fillOptions?.fillOpacity
						? options.fillOptions.fillOpacity
						: 0.8
				)
				.attr('d', areaSide)
				.attr('class', `${options.className}`);
		}

		function drawLine(
			lineXY: [number | Date, number][],
			options: ILineOptions = {},
			g: any = frame
		) {
			const line = d3
				.line()
				.curve(stepped ? d3.curveStepAfter : d3.curveMonotoneX);

			const path = g
				.append('path')
				.datum(lineXY.map((xy) => [x(xy[0]), y(xy[1])]))
				.attr('fill', 'none')
				.attr('d', line)
				.attr(
					'class',
					`${styles.line} ${options.className} ${
						options.animated && styles.animated
					}`
				);

			if (options.color) {
				path.style('stroke', options.color);

				if (options.fill) {
					if (!options.fillOptions) options.fillOptions = {};
					switch (options.className) {
					}
					drawRegion(lineXY, options, g);
				}
			}

			return path;
		}

		lines.forEach((line, i) => drawLine(line, lineOptions[i]));

		function drawPhaseBoundaries() {
			const boundaryG = frame.append('g').attr('class', 'phase-boundaries');
			const ends: [number, number][] = [];

			const regionOptions = {
				dense: {
					color: '#0B7A75',
					fillOptions: {
						direction: 'top',
					} as IFillOptions,
				},
				gas: {
					color: '#7C77B9',
					fillOptions: {
						direction: 'bottom',
					} as IFillOptions,
				},
			};

			function drawBoundary(boundary: [number, number][], className: string) {
				const region = className.split(' ')[0];

				drawLine(
					boundary,
					{
						className,
						fill: true,
						...regionOptions[region],
					},
					boundaryG
				);
				ends.push(boundary[boundary.length - 1]);
			}

			if (gasPhaseBoundary)
				drawBoundary(gasPhaseBoundary, 'gas two-phase boundary');
			if (densePhaseBoundary) {
				drawBoundary(densePhaseBoundary, 'dense two-phase boundary');

				const lastDensePoint =
					densePhaseBoundary[densePhaseBoundary.length - 1];

				drawRegion(
					[
						[lastDensePoint[0] - 0.004, lastDensePoint[1]],
						[x.invert(width), lastDensePoint[1]],
					],
					{
						color: regionOptions.gas.color,
						fill: true,
						className: 'gas',
						fillOptions: {
							direction: 'bottom',
						},
					},
					boundaryG
				);
				drawRegion(
					[lastDensePoint, [x.invert(width), lastDensePoint[1]]],
					{
						fill: true,
						className: styles.supercritical,
						fillOptions: {
							direction: 'top',
						},
					},
					boundaryG
				);
			}
			if (ends.length !== 2) return;

			function joinEnds() {
				const midpoint = [
					0.5 * (ends[0][0] + ends[1][0]),
					0.5 * (ends[0][1] + ends[1][1]),
				];

				const offset = 0.1;
				const radiansOffset = Math.PI / 3;
				const perpendicularAngle =
					Math.atan2(ends[1][1] - ends[0][1], ends[1][0] - ends[0][0]) -
					Math.PI / 2 +
					radiansOffset;

				const control = [
					midpoint[0] + offset * Math.cos(perpendicularAngle),
					midpoint[1] + offset * Math.sin(perpendicularAngle),
				];

				const curve = `M${x(ends[0][0])} ${y(ends[0][1])} Q${x(control[0])} ${y(
					control[1]
				)} ${x(ends[1][0])} ${y(ends[1][1])}`;
				const curvePath = boundaryG
					.append('path')
					.attr('d', curve)
					.attr('class', `${styles.line} ${styles.critical} critical`);
			}

			joinEnds();
		}

		drawPhaseBoundaries();

		function drawFixedLines() {
			if (fixedLines && fixedLines.x) {
				const verticals = frame
					.selectAll('path')
					.filter(`.${styles.fixedLine}`)
					.filter('.vertical')
					.data(fixedLines.x as any)
					.join('path')
					.attr('class', `${styles.fixedLine} vertical`)
					.attr('d', (n) =>
						typeof n === 'undefined'
							? null
							: `M${x(n as any)},${height} ${x(n as any)},0`
					);
			}

			if (fixedLines && fixedLines.y) {
				const horizontals = frame
					.selectAll('path')
					.filter(`.${styles.fixedLine}`)
					.filter('.horizontal')
					.data(fixedLines.y)
					.join('path')
					.attr('class', `${styles.fixedLine} horizontal`)
					.attr('d', (n) =>
						typeof n === 'undefined' ? null : `M0,${y(n)} ${width},${y(n)}`
					);
			}

			function drawUserBoundaries() {
				const userBoundariesG = frame
					.append('g')
					.attr('class', 'user-boundaries');
				if (userBoundaries && userBoundaries.x) {
					userBoundaries.x.forEach((boundary, i) => {
						const options = userBoundaryOptions.x
							? userBoundaryOptions.x[i]
							: undefined;

						drawLine(
							[
								[boundary, yMin],
								[boundary, yMax],
							],
							options,
							userBoundariesG
						);
					});
				}

				if (userBoundaries && userBoundaries.y) {
					userBoundaries.y.forEach((boundary, i) => {
						const options = userBoundaryOptions.y
							? userBoundaryOptions.y[i]
							: undefined;

						drawLine(
							[
								[xMin, boundary],
								[xMax, boundary],
							],
							options,
							userBoundariesG
						);
					});
				}
			}

			drawUserBoundaries();

			function drawPrevClickPositions(numClickPositions = 2) {
				const xs = user.fixedLines.x.slice(-numClickPositions);
				const ys = user.fixedLines.y.slice(-numClickPositions);

				function drawFixed(direction: 'horizontal' | 'vertical') {
					const line = frame
						.selectAll('path')
						.filter(`.${styles.user}`)
						.filter(`.${direction}`);

					switch (direction) {
						case 'horizontal':
							line
								.data(ys)
								.join('path')
								.attr('class', `${styles.user} ${direction} mouse-line`)
								.attr('d', (n) =>
									typeof n === 'undefined'
										? null
										: `M0,${y(n)} ${width},${y(n)}`
								);
							break;
						case 'vertical':
							line
								.data(xs)
								.join('path')
								.attr('class', `${styles.user} ${direction} mouse-line`)
								.attr('d', (n) =>
									typeof n === 'undefined'
										? null
										: `M${x(n)},${height} ${x(n)},0`
								);
							break;
					}
				}
				drawFixed('horizontal');
				drawFixed('vertical');

				if (xs.length > 1 && ys.length > 1) {
					const userDiagonal = frame
						.selectAll(`g.${styles.user}.${styles.diagonal}`)
						.data([0])
						.join('path')
						.attr(
							'class',
							`${styles.user} ${styles.diagonal} ${styles.animated}`
						)
						.attr('d', `M${x(xs[0])},${y(ys[0])} ${x(xs[1])},${y(ys[1])}`);
				}
			}
			drawPrevClickPositions();
		}

		drawFixedLines();

		const mouseG = frame.append('g').attr('class', 'mouse-over-effects');

		const hoverVertical = mouseG
			.append('path')
			.attr('class', 'mouse-line')
			.style('stroke', 'yellow')
			.style('stroke-width', '1px')
			.style('opacity', '0');

		const hoverHorizontal = mouseG
			.append('path')
			.attr('class', 'mouse-line')
			.style('stroke', 'yellow')
			.style('stroke-width', '1px')
			.style('opacity', '0');

		mouseG
			.append('svg:rect') // append a rect to catch mouse movements on canvas
			.attr('width', width) // can't catch mouse events on a g element
			.attr('height', height)
			.attr('fill', 'none')
			.attr('pointer-events', 'all')
			.on('pointerleave', function () {
				// on mouse out hide line, circles and text
				d3.selectAll('.mouse-line').style('opacity', '0');
			})
			.on('pointerover', function () {
				// on mouse in show line, circles and text
				d3.selectAll('.mouse-line').style('opacity', '1');
			})
			.on('pointermove', (event) => {
				var coords = d3.pointer(event);

				const verticalPath = `M${coords[0]},${height} ${coords[0]},0`;
				const horizontalPath = `M0,${coords[1]} ${width},${coords[1]}`;

				if (hover.x) {
					hoverVertical.attr('d', verticalPath);
				}
				if (hover.y) {
					hoverHorizontal.attr('d', horizontalPath);
				}
			})
			.on('pointerdown', (event) => {
				if (!click) return;
				var coords = d3.pointer(event);

				user.addFixed('x', x.invert(coords[0]) as number);
				user.addFixed('y', y.invert(coords[1]));

				frame.selectAll(`.${styles.user}`).remove();
				drawFixedLines();
			});
	}

	useEffect(() => {
		init();
		window.addEventListener('resize', init);
	}, []);

	useEffect(() => {
		init();
	}, [
		JSON.stringify(lines),
		JSON.stringify(fixedLines),
		JSON.stringify(userBoundaries),
		JSON.stringify(userBoundaryOptions),
	]);

	return <div ref={ref} className='w-full h-full relative'></div>;
};
