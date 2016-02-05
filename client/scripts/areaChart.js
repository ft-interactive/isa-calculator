import d3 from 'd3';
export function drawChart () {
		//Obviously data will change
		var data = [
		    { x: 0, y: 10, },
		    { x: 1, y: 15, },
		    { x: 2, y: 35, },
		    { x: 3, y: 20, },
		];
		var padding = [ 20, 10, 50, 100 ];
		var width = document.getElementById('chartHolder').getBoundingClientRect().width-(padding[1])-(padding[3]);
	    var height = document.getElementById('chartHolder').getBoundingClientRect().height-(padding[0])-(padding[2])
	    
	    //Set up scales
		var xScale = d3.time.scale()
			.range([ padding[3], width - padding[1] - padding[3] ]);

		var yScale = d3.scale.linear()
			.range([ padding[0], height - padding[2] ]);

		//Configure axis generators
		var xAxis = d3.svg.axis()
			.scale(xScale)
			.orient("bottom")
			.ticks(15)
			.tickFormat(function(d) {
				return dateFormat(d);
			});
		var yAxis = d3.svg.axis()
			.scale(yScale)
			.orient("left");

		//Configure area generator
		var area = d3.svg.area()
			.x(function(d) {
				return xScale(dateFormat.parse(d.year));
			})
			.y0(height - padding[2])
			.y1(function(d) {
				return yScale(+d.amount);
			});

		//Create the empty SVG image
		var svg = d3.select("#chartHolder")
			.append("svg")
			.attr("width", width)
			.attr("height", height);




	}