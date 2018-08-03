
let margin = { left:100, right:10, top:10, bottom:150 };

let width = 600 - margin.left - margin.right;
let height = 400 - margin.top - margin.bottom;

const svg = d3.select('#chart-area').append('svg')
	.attr('width', width + margin.left + margin.right)
	.attr('height', height + margin.top + margin.bottom);

let g = svg.append('g')
	.attr('transform', 'translate(' + margin.left + ', '
		+ margin.top + ')')

// x label
g.append('text')
	.attr('class', 'x-axis-label')
	.attr('x', width / 2)
	.attr('y', height + 140)
	.attr('font-size', '13px')
	.attr('text-anchor', 'middle')
	.text("The world's tallest buildings");

// y label
g.append('text')
	.attr('class', 'y-axis-label')
	.attr('x', - (height / 2)) // x and y get reversed due to rotation
	.attr('y', -60)
	.attr('font-size', '13px')
	.attr('text-anchor', 'middle')
	.attr('transform', 'rotate(-90)')
	.text("Height (m)");


d3.json('data/buildings.json').then((data) => {
	
	data.forEach((d) => {
		d.height = +d.height;
	});

	
	// scale for x axis
	let x = d3.scaleBand()
		// list of building names generated using map function
		.domain(data.map(d => d.name))
		.range([0, width])
		.paddingInner(0.3)
		.paddingOuter(0.3);

	// scale for y axis
	let y = d3.scaleLinear()
		// max value of domain is set using the max height in data set
		.domain([0, d3.max(data, d => d.height)])
		// this is reverse so that 0 maps to bottom of canvas instead of top
		.range([height, 0]);

	// axis generators
	let xAxisCall = d3.axisBottom(x);
	g.append('g')
		.attr('class', 'x-axis')
		.attr('transform', 'translate(0, ' + height + ')')
		.call(xAxisCall)
		// rotate x axis tick values
		.selectAll('text')
			.attr('y', '10')
			.attr('x', '-5')
			.attr('text-anchor', 'end')
			.attr('transform', 'rotate(-40)');

	let yAxisCall = d3.axisLeft(y)
		.ticks(3)
		.tickFormat( d => d + 'm');
	g.append('g')
		.attr('class', 'y-axis')
		.call(yAxisCall);


	let rectangles = g.selectAll('rect')
		.data(data)
		.enter()
		.append('rect')
			.attr('x', d => x(d.name))
			// shift bars to bottom of canvas
			.attr('y', d => y(d.height))
			.attr('width', 30)
			.attr('height', d => height - y(d.height))
			.attr('fill', 'gray');
}).catch(error => {console.log(error)})


