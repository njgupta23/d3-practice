/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 2 - Gapminder Clone
*/

let index = 0;


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


//**************** Scales & Axes *****************//

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


// Color
let color = d3.scaleOrdinal(d3.schemeDark2);


//**************** Labels *****************//

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

let yearLabel = g.append('text')
	.attr('class', 'year-label')
	.attr('x', width - 50)
	.attr('y', height - 10)
	.attr('font-size', '25px')
	.attr('text-anchor', 'middle')
	.text('1800');

//**************** Data *****************//


d3.json("data/data.json").then(data => {
	
	// exclude null values in data
	let cleanData = data.map(year => {
		return year.countries.filter(country => {
			let dataExists = country.income && country.life_exp;
			return dataExists;
		})
	});

	console.log(cleanData);

	d3.interval(() => {
		// after reaching end of data, loop back to beginning
		index = (index < 214) ? index+1 : 0;
		update (cleanData[index]);
	}, 100);

	// first run of vis
	update(cleanData[0])

}).catch(error => console.log(error));


function update(data) {

	let t = d3.transition().duration(100);

	// Population scale
	let r = d3.scaleLinear()
		.domain([0, d3.max(data, d => d.population)])
		.range([5,25]); 


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
			.attr('fill', d => color(d.continent))
		//UPDATE
		.merge(circles)
		.transition(t)
			.attr('cx', d => x(d.income))
			.attr('cy', d => y(d.life_exp))
			.attr('r', d => r(d.population));

	yearLabel.text(index + 1800);

}




