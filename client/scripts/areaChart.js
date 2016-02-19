import d3 from 'd3';

export function drawChart (xDomain, dataset) {
		//Obviously data will change
		//console.log (dataset)
		// dataset.sort(function(a, b) {
		// 			return d3.descending(+a.year, +b.year);
		// 		});
		var margin = {top: 20, right: 10, bottom: 20, left: 100};
		var width = (document.getElementById('areaChart').getBoundingClientRect().width)-margin.left - margin.right;
	    var height = (document.getElementById('areaChart').getBoundingClientRect().height)-margin.top - margin.bottom;
	    d3.select("#areaChart")
	    .html("")
	    //Set up scales
		var x = d3.scale.linear()
			.domain(xDomain)
			.range([margin.left, width+margin.left-margin.right]);

		var y = d3.scale.linear()
			//.domain([0,1000000])
			.domain([0,d3.max(dataset, function(d) { return d.cost2; })])
			.range([height, margin.top]);

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

		var area2 = d3.svg.area()
		    .x(function(d) { return x(d.year); })
		    .y0(height)
		    .y1(function(d) { return y(d.cost2); });

		var svg = d3.select("#areaChart").append("svg")
		    .attr("width", width + margin.left + margin.right)
		    .attr("height", height + margin.top + margin.bottom)
		  
		svg.append("path")
			.datum(dataset)
			.attr("class", "area2")
			.attr("d", area2);
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
			.attr("transform", "translate("+margin.left+",0)")
			.call(yAxis)
			.call(adjustTextLabels);

function adjustTextLabels(selection) {
    selection.selectAll('.axis text')
        .attr("transform", "translate(0,-8)");
}





	}