	import d3 from 'd3';
export function drawChart (xDomain, dataset) {
		//Obviously data will change
		//console.log (dataset)
		var padding = [ 20, 0, 0, 0 ];
		var width = document.getElementById('areaChart').getBoundingClientRect().width-(padding[1])-(padding[3]);
	    var height = document.getElementById('areaChart').getBoundingClientRect().height-(padding[0])-(padding[2])
	    
	    //Set up scales
		var x = d3.scale.linear()
			.domain(xDomain)
			.range([ padding[3], width - padding[1] - padding[3] ]);

		var y = d3.scale.linear()
			.domain([0, d3.max(dataset, function(d) { return d.cost; })])
			.range([ padding[0], height - padding[2] ]);

		var xAxis = d3.svg.axis()
		    .scale([xDomain])
		    .orient("bottom");

		var yAxis = d3.svg.axis()
		    .scale(y)
		    .orient("left");

		var area = d3.svg.area()
		    .x(function(d) { return x(d.year); })
		    .y0(height)
		    .y1(function(d) { return y(d.cost); });

		var svg = d3.select("#areaChart").append("svg")
		    .attr("width", width + padding[3] + padding[1])
		    .attr("height", height + padding[0] + padding[2])
		  .append("g")
		    .attr("transform", "translate(" + padding[3] + "," + padding[0] + ")");

		svg.append("path")
			.datum(dataset)
			.attr("class", "area")
			.attr("d", area);

		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis);

		svg.append("g")
			.attr("class", "y axis")
			.call(yAxis)





	}