/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 2 - Gapminder Clone
*/

//**************** Canvas *****************//


let margin = { left:100, right:10, top:10, bottom:150 };

let width = 800 - margin.left - margin.right,
	height = 500 - margin.top - margin.bottom;

let svg = d3.select('#chart-area').append('svg')
	.attr('width', width + margin.left + margin.right)
	.attr('height', height + margin.top + margin.bottom);

let g = svg.append('g')
	.attr('transform', 'translate(' + margin.left + ', ' +
		margin.top + ')');


//**************** Scales & Labels *****************//

// X axis
let x = d3.scaleLog()
	.domain([300, 150000])
	.range([0, width])

let xAxisCall = d3.axisBottom(x)
	.tickValues([400, 4000, 40000])
	.tickFormat(d3.format('$'));

let xAxisGroup = g.append('g')
	.attr('class', 'x-axis')
	.attr('transform', 'translate(0, ' + height + ')')
	.call(xAxisCall);


// Y axis
let y = d3.scaleLinear()
	.domain([0, 90])
	.range([height, 0]);

let yAxisGroup = g.append('g')
	.attr('class', 'y-axis');

let yAxisCall = d3.axisLeft(y);
yAxisGroup.call(yAxisCall);


// Labels
let xLabel = g.append('text')
	.attr('class', 'x-axis-label')
	.attr('x', width/2)
	.attr('y', height + 50)
	.attr('font-size', '13px')
	.attr('text-anchor', 'middle')
	.text('GDP-per-capita');

let yLabel = g.append('text')
	.attr('class', 'y-axis-label')
	.attr('x', - (height / 2))
	.attr('y', -60)
	.attr('font-size', '13px')
	.attr('text-anchor', 'middle')
	.attr('transform', 'rotate(-90)')
	.text('Life expectancy');




d3.json("data/data.json").then(data => {
	
	// exclude null values
	let cleanData = data.map(year => {
		return year.countries.filter(country => {
			let dataExists = country.income && country.life_exp;
			return dataExists;
		})
	});

	console.log(cleanData);

	d3.interval(() => {
		for (let i = 0; i < data.length; i ++){
			update(cleanData[i]);
		};
	}, 100);

	// first run of vis
	update(cleanData[0])

}).catch(error => console.log(error));


function update(data) {

	let t = d3.transition().duration(100);

	//JOIN
	let circles = g.selectAll('circle')
		.data(data, d => d.country);

	//EXIT
	circles.exit()
		.attr('class', 'exit')
		.remove();

	//ENTER
	circles.enter()
		.append('circle')
			.attr('class', 'enter')
			.attr('fill', 'orange')
		//UPDATE
		.merge(circles)
		.transition(t)
			.attr('cx', d => x(d.income))
			.attr('cy', d => y(d.life_exp))
			.attr('r', 2);
}




