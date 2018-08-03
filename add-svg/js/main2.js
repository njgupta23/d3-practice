
let data = [25, 20, 10, 12, 15];

// create canvas
const svg = d3.select('#chart-area').append('svg')
	.attr('width', 400)
	.attr('height', 400);

// create empty set of circle elements
const circles = svg.selectAll('circle')
	// add data array
	.data(data)
	// combine data with empty set
	.enter()
		// add circle element for each item in data
		.append('circle')
			// set center of circle 
			.attr('cx', (d,i) => {
				return (i * 50) + 25;
			})
			.attr('cy', 25)
			// set radius of circle to be the value of each item in data
			.attr('r', (d) => {
				return d;
			})
			.attr('fill', 'red');