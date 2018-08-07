/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 1 - Star Break Coffee
*/

//************* Canvas Set Up *************//

let flag = true

let t = d3.transition().duration(750);

let margin = { left:100, right:10, top:10, bottom:150 };

let width = 600 - margin.left - margin.right;
let height = 400 - margin.top - margin.bottom;

let svg = d3.select('#chart-area').append('svg')
	.attr('width', width + margin.left + margin.right)
	.attr('height', height + margin.top + margin.bottom);

let g = svg.append('g')
	.attr('transform', 'translate(' + margin.left + ', ' +
		margin.top + ')');


//**************** Scales & Labels *****************//

// X scale
let x = d3.scaleBand()
	.range([0, width])
	.paddingInner(0.2)
	.paddingOuter(0.2);

// Y scale
let y = d3.scaleLinear()
	.range([height, 0]);

let xAxisGroup = g.append('g')
	.attr('class', 'x-axis')
	.attr('transform', 'translate(0, ' + height + ')');

let yAxisGroup = g.append('g')
	.attr('class', 'y-axis');


// X label
g.append('text')
	.attr('class', 'x-axis-label')
	.attr('x', width/2)
	.attr('y', height + 50)
	.attr('font-size', '13px')
	.attr('text-anchor', 'middle')
	.text('Month');

// Y label
let yLabel = g.append('text')
	.attr('class', 'y-axis-label')
	.attr('x', - (height / 2))
	.attr('y', -60)
	.attr('font-size', '13px')
	.attr('text-anchor', 'middle')
	.attr('transform', 'rotate(-90)')
	.text('Revenue');


//**************** Data *****************//


d3.json('data/revenues.json').then(data => {
	
	// convert revenue values to integers
	data.forEach(d => {
		d.revenue = +d.revenue;
		d.profit = +d.profit;
	});

	d3.interval(() => {
		update(data);
		flag = !flag;
	}, 1000);

	// run the vis for the first time
	update(data);

}).catch(error => console.log(error));


function update(data) {
	let value = flag ? 'revenue' : 'profit';

	x.domain(data.map(d => d.month));
	y.domain([0, d3.max(data, d => d[value])]);


	// X axis
	let xAxisCall = d3.axisBottom(x);
	xAxisGroup.transition(t).call(xAxisCall);

	// Y axis
	let yAxisCall = d3.axisLeft(y)
		.tickFormat(d => '$' + d);
	yAxisGroup.transition(t).call(yAxisCall);
	
	// JOIN new data with old elements
	let bars = g.selectAll('rect')
		// create key that matches revenue and profit arrays based on month (not index)
		.data(data, d => d.month);

	// EXIT old elements not present in new data
	bars.exit()
		.attr('fill', 'red')
	.transition(t)
		.attr('y', y(0))
		.attr('height', 0)
		.remove();

	// ENTER new elements present in new data
	bars.enter()
		.append('rect')
			.attr('x', d => x(d.month))
			.attr('width', x.bandwidth)
			.attr('fill', 'green')
			.attr('y', y(0))
			.attr('height', 0)
		// AND UPDATE old elements present in new data
		.merge(bars)
		.transition(t)
			.attr('x', d => x(d.month))
			.attr('width', x.bandwidth)
			.attr('y', d => y(d[value]))
			.attr('height', d => height - y(d[value]));


	let label = flag ? 'Revenue' : 'Profit';
	yLabel.text(label); 

}
