/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 1 - Star Break Coffee
*/

//************* Canvas Set Up *************//

let margin = { left:100, right:10, top:10, bottom:150 };

let width = 600 - margin.left - margin.right;
let height = 400 - margin.top - margin.bottom;

let svg = d3.select('#chart-area').append('svg')
	.attr('width', width + margin.left + margin.right)
	.attr('height', height + margin.top + margin.bottom);

let g = svg.append('g')
	.attr('transform', 'translate(' + margin.left + ', ' +
		margin.top + ')');


//**************** Data *****************//

// add x label
g.append('text')
	.attr('class', 'x-axis-label')
	.attr('x', width/2)
	.attr('y', height + 50)
	.attr('font-size', '13px')
	.attr('text-anchor', 'middle')
	.text('Month');

// add y label
g.append('text')
	.attr('class', 'y-axis-label')
	.attr('x', - (height / 2))
	.attr('y', -60)
	.attr('font-size', '13px')
	.attr('text-anchor', 'middle')
	.attr('transform', 'rotate(-90)')
	.text('Revenue');


d3.json('data/revenues.json').then(data => {
	
	// convert revenue values to integers
	data.forEach(d => d.revenue = +d.revenue);
	console.log(data);

	// set x scale
	let x = d3.scaleBand()
		.domain(data.map(d => d.month))
		.range([0, width])
		.paddingInner(0.2)
		.paddingOuter(0.2);

	// set y scale
	let y = d3.scaleLinear()
		.domain([0, d3.max(data, d => d.revenue)])
		.range([height, 0]);

	// add x axis
	let xAxisCall = d3.axisBottom(x);
	g.append('g')
		.attr('class', 'x-axis')
		.attr('transform', 'translate(0, ' + height + ')')
		.call(xAxisCall);

	// add y axis
	let yAxisCall = d3.axisLeft(y)
		.tickFormat(d => '$' + d);
	g.append('g')
		.attr('class', 'y-axis')
		.call(yAxisCall);

	// add bars to chart
	let bars = g.selectAll('rect')
		.data(data)
		.enter()
		.append('rect')
			.attr('x', d => x(d.month))
			.attr('y', d => y(d.revenue))
			.attr('width', 50)
			.attr('height', d => height - y(d.revenue))
			.attr('fill', 'green')

}).catch(error => console.log(error))


