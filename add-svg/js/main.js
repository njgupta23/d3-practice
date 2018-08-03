
const svg = d3.select('#chart-area').append('svg')
	.attr('width', 500)
	.attr('height', 400);

const circle = svg.append('circle')
	.attr('cx', 100)
	.attr('cy', 250)
	.attr('r', 80)
	.attr('fill', 'purple');

const line = svg.append('line')
	.attr('x1', 100)
	.attr('y1', 100)
	.attr('x2', 300)
	.attr('y2', 300)
	.attr('stroke', 'orange')
	.attr('stroke-width', 5);

const ellipse = svg.append('ellipse')
	.attr('cx', 350)
	.attr('cy', 150)
	.attr('rx', 80)
	.attr('ry', 40)
	.attr('fill', 'green');

const rectangle = svg.append('rect')
	.attr('x', 350)
	.attr('y', 200)
	.attr('width', 100)
	.attr('height', 45)
	.attr('fill', 'pink');



