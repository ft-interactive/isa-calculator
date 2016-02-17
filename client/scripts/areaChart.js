import d3 from 'd3';

export function drawChart (xDomain, dataset) {
		//Obviously data will change
		//console.log (dataset)
		dataset.sort(function(a, b) {
					return d3.descending(+a.year, +b.year);
				});
		var padding = [ 10, 0, 30, 45 ];
		var width = document.getElementById('areaChart').getBoundingClientRect().width-(padding[1])-(padding[3]);
	    var height = document.getElementById('areaChart').getBoundingClientRect().height-(padding[0])-(padding[2])
	    d3.select("#areaChart")
	    .html("")
	    //Set up scales
		var x = d3.scale.linear()
			.domain(xDomain)
			.range([0, width - padding[1] - padding[3] ]);

		var y = d3.scale.linear()
			.domain([d3.max(dataset, function(d) { return d.cost; }),0])
			.range([ padding[2], height - padding[2] ]);

		var xAxis = d3.svg.axis()
		    .scale(x)
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
			.attr("transform", "translate(0,"+ (padding[0])+")")
			.call(yAxis)





	}