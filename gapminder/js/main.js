/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 2 - Gapminder Clone
*/

let index = 0;
let interval;
let cleanData;

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


//**************** Legend *****************//

let continents = ['europe', 'asia', 'americas', 'africa'];

let legend = g.append('g')
	.attr('transform', 'translate(' + (width - 10) + ',' + (height - 125) + ')');

continents.forEach((continent, i) => {
	let legendRow = legend.append('g')
		.attr('transform', 'translate(0, ' + (i * 20) + ')');

	// add color square to each item in legend
	legendRow.append('rect')
		.attr('width', 10)
		.attr('height', 10)
		.attr('fill', color(continent));

	// add text for each item in legend
	legendRow.append('text')
		.attr('x', -10)
		.attr('y', 10)
		.attr('text-anchor', 'end')
		.style('text-transform', 'capitalize')
		.text(continent);
});


//**************** Tooltip *****************//

let tip = d3.tip().attr('class', 'd3-tip')
	.html(d => {
		let text = "<strong>Country:</strong> <span style='color:red'>" + d.country + "</span><br>";
		text += "<strong>Continent:</strong> <span style='color:red;text-transform:capitalize'>" + d.continent + "</span><br>";
		text += "<strong>Life Expectancy:</strong> <span style='color:red'>" + d3.format(".2f")(d.life_exp) + "</span><br>";
		text += "<strong>GDP Per Capita:</strong> <span style='color:red'>" + d3.format("$,.0f")(d.income) + "</span><br>";
		text += "<strong>Population:</strong> <span style='color:red'>" + d3.format(",.0f")(d.population) + "</span><br>";
		return text;
	});

g.call(tip);


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
	cleanData = data.map(year => {
		return year.countries.filter(country => {
			let dataExists = country.income && country.life_exp;
			return dataExists;
		})
	});

	// first run of vis
	update(cleanData[0])

}).catch(error => console.log(error));

$("#play-button")
	.on("click", function() {
		let button = $(this);
		if (button.text() == "Play"){
			$(button).text("Pause");
			interval = setInterval(step, 100);
		}
		else {
			button.text("Play");
			clearInterval(interval);
		}
		
	})

$("#reset-button")
	.on("click", function(){
		time = 0;
		update(cleanData[0]);
	})	

$("#continent-select")
	.on("change", () => {
		update(cleanData[index]);
	})

$("#date-slider").slider({
	max: 2104,
	min: 1800,
	step: 1,
	slide: (event, ui) => {
		time = ui.value - 1800;
		update(cleanData[time]);
	}
})


function step() {
		// after reaching end of data, loop back to beginning
	index = (index < 214) ? index+1 : 0;
	update (cleanData[index]);
}


function update(data) {

	let t = d3.transition().duration(100);

	let continent = $("#continent-select").val();

	var data = data.filter(d => {
		if (continent == "all") { return true; }
		else {
			return d.continent == continent;
		}
	})

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
			.on('mouseover', tip.show)
			.on('mouseout', tip.hide)
		//UPDATE
		.merge(circles)
		.transition(t)
			.attr('cx', d => x(d.income))
			.attr('cy', d => y(d.life_exp))
			.attr('r', d => r(d.population));

	// update time label
	yearLabel.text(index + 1800);
	$("#year")[0].innerHTML = +(index + 1800)

	$("#date-slider").slider("value", +(index + 1800))

}




