import oHoverable from 'o-hoverable';
import attachFastClick from 'fastclick';
import d3 from 'd3';
import {drawChart} from './areaChart';

document.addEventListener('DOMContentLoaded', () => {
	// make hover effects work on touch devices
		oHoverable.init();

	// remove the 300ms tap delay on mobile browsers
		attachFastClick(document.body);

	//Variables that hold the slider values for math calculations	
	var savePerYear=0;
	var timeToRetire=0;
	var charges=0;
	var returns=0;
	var newcharges=0;
	var inRetirement=0;
	var firstrun=true;

	var slideValues=[
	{"divID":"save","className":"slideholderTop","HTML":"Save each year (£k)","labName":"savelab","pos":savePerYear,"sliderID":"slsave","min":0,"max":15,"step":0.1},
	{"divID":"toRetire","className":"slideholder","HTML":"Time to retirement (years)","labName":"retirelab","pos":timeToRetire,"sliderID":"slretire","min":0,"max":50,"step":1},
	{"divID":"charges","className":"slideholder","HTML":"Charges (per cent)","labName":"chargeslab","pos":charges,"sliderID":"slcharges","min":0,"max":3,"step":0.1},
	{"divID":"returns","className":"slideholder","HTML":"Returns (per cent)","labName":"returnslab","pos":returns,"sliderID":"slreturns","min":0,"max":20,"step":0.1},
	{"divID":"newCharges","className":"dim","HTML":"Charges (per cent)","labName":"newchargeslab","pos":newcharges,"sliderID":"slnewcharge","min":0,"max":1,"step":0.1},
	{"divID":"inRetirement","className":"dim","HTML":"Years in retirement","labName":"inRetirelab","pos":inRetirement,"sliderID":"slinreture","min":0,"max":50,"step":1}]

	//Add sliders
	var htmlString="";
	var testString=""
	for (var i = 0; i < 6; i++) {
		var slideHolder=d3.select("#controls");
		htmlString=htmlString+slidertemplate (slideValues[i]);
		slideHolder.html(htmlString);
	}

	//Add labels to slider then move to correct postion.
	//If I call addLabel() and moveLabel() in loop above it doesn't work?
	for (var i = 0; i < 4; i++) {
		var div=slideValues[i].divID;
		var labName=slideValues[i].labName;
		addLabel(div,labName);
		var labelValue=Number(slideValues[i].pos);
		var slideID=slideValues[i].sliderID;
		var newX=calcLabelPos(labelValue,slideID);
		moveLabel(labName,labelValue,newX);
	}

	//Add event listeners to slsave slider
	var saveevent=d3.select("#slsave");
	saveevent.on("input", function(d){
		savePerYear=this.value;
		var newX=calcLabelPos(savePerYear,"slsave")
		moveLabel("savelab",savePerYear,newX);
		//Make the newChanges slider opaque
		var div=d3.select("#newCharges");
		div.attr("class","slideholder");
		//Add label to the newChanges slider
		if (firstrun) {
			addLabel("newCharges","newchargeslab");
			}
		//Add an oninput event to the newChanges slider, not onchange as this is only triggered when mouse is released
		div=d3.select("#slnewcharge");
		div.node().max=savePerYear;
		div.on("input",function(d){
			var newcharges=this.value;
			var newX=calcLabelPos(newcharges,'slnewcharge')
			moveLabel("newchargeslab",newcharges,newX);
		})
		//Refresh the ranges of the newChanges slider
		var rangediv=d3.select("#newCharges");
		rangediv.selectAll('.rangeright')
		.html(savePerYear)
		//Refresh the label on the newChanges slider when slsave slider changes
		newcharges=div.node().value;
		var newX=calcLabelPos(newcharges,'slnewcharge')
		moveLabel("newchargeslab",newcharges,newX);
		if (timeToRetire>0 && savePerYear>0 && returns>0) {
			calcChart();
			var htmlString=chartText()
			var div=d3.select("#chartText");
			div.html(htmlString);
		}
		//Make the inRetirement slider opaque
		div=d3.select("#inRetirement");
		div.attr("class","slideholder");
		//Add label to the inRetirement slider
		if (firstrun) {
			addLabel("inRetirement","inRetirelab");
			firstrun=false;
			}
		//Refresh label position for slinreture
		var newX=calcLabelPos(inRetirement,'slinreture')
		moveLabel("inRetirelab",inRetirement,newX);
		//Add an oninput event to the inRetirement slider, not onchange as this is only triggered when mouse is released
		div=d3.select("#slinreture");
		div.on("input",function(d){
			var inRetirement=this.value;
			var newX=calcLabelPos(inRetirement,'slinreture')
			moveLabel("inRetirelab",inRetirement,newX);
		})


	})

	//Add event listeners to slretire slider
	var retireevent=d3.select("#slretire");
	retireevent.on("input", function(d){
		timeToRetire=this.value;
		var newX=calcLabelPos(timeToRetire,"slretire")
		moveLabel("retirelab",timeToRetire,newX);
		if (timeToRetire>0 && savePerYear>0 && returns>0) {
			calcChart();
			var htmlString=chartText()
			var div=d3.select("#chartText");
			div.html(htmlString);
		}
	});

	//Add event listeners to slcharges slider
	var chargesevent=d3.select("#slcharges");
	chargesevent.on("input", function(d){
		charges=this.value;
		var newX=calcLabelPos(charges,"slcharges")
		moveLabel("chargeslab",charges,newX);
		if (timeToRetire>0 && savePerYear>0 && returns>0) {
			calcChart();
			var htmlString=chartText()
			var div=d3.select("#chartText");
			div.html(htmlString);
		}
	});

	//Add event listeners to slreturns slider
	var returnsevent=d3.select("#slreturns");
	returnsevent.on("input", function(d){
		returns=this.value;
		var newX=calcLabelPos(returns,"slreturns")
		moveLabel("returnslab",returns,newX);
		if (timeToRetire>0 && savePerYear>0 && returns>0) {
			calcChart();
			var htmlString=chartText()
			var div=d3.select("#chartText");
			div.html(htmlString);
		}
	});

	//Data for chart
	function calcChart () {
		var dataset=[];
		var xdomain=[0,Number(timeToRetire)];
		for (var i = 0; i < Number(timeToRetire)+1; i++) {
			if(i>0) {
				var cost=(((savePerYear*1000)/100)*charges)+dataset[i-1].cost;
			}
			else {var cost=((savePerYear*1000)/100)*charges};
			var ele={"year":i,"cost":cost};
			dataset.push(ele)
		}
		drawChart (xdomain, dataset);

	}

	//Adds a div into the div that holds the slider to use as a label
	function addLabel(divID,labelID) {
		var label=d3.select('#'+String(divID)).append("div");
		label
		.attr('id', labelID)
		.attr('class', 'slideLabel');
	}

	//Calculates the postion x position of the label so its under the slider thumb
	function calcLabelPos (pos, SliderID) {
		var slider=d3.select('#'+String(SliderID));
		var increments=slider.node().max-slider.node().min;
		var percentage=(100/(slider.node().max-slider.node().min)*(pos));
		var posX=slider.node().getBoundingClientRect().width;
		var offset=((32/increments)*pos)+3;
		posX=((posX/100)*percentage)-offset;
		return posX;
	}

	//Moves the label under the new thumb position
	function moveLabel (divId, labelText, pos) {
		var label=d3.select('#'+String(divId))
		.html(labelText)
		.style('left', pos+'px')
		.style('top', '26px');
	}

	function slidertemplate (annotations) {
		return `
			<div id=${annotations.divID} class=${annotations.className}>
				<div>${annotations.HTML}</div>
				<input class='slider' id=${annotations.sliderID} type='range' value=${annotations.pos} max=${annotations.max} min=${annotations.min} step=${annotations.step}>
				<div class='rangeleft'>${annotations.min}</div>
				<div class='rangeright'>${annotations.max}</div>
			</div>
			`;
	}

	function chartText() {
		return `
			<div class="chartOutput">${"If you invest "}</div>
			<div class="chartHighlights">${"£"+d3.format(",")(savePerYear*1000)}</div>
			<div class="chartOutput">${" a year for your retirement "}</div>
			<div class="chartHighlights">${timeToRetire}</div>
			<div class="chartOutput">${" years away, and the fund’s total costs are "}</div>
			<div class="chartHighlights">${charges+"%"}</div>
			<div class="chartOutput">${" of the money invested, and the fund manager achieves average return of "}</div>
			<div class="chartHighlights">${returns+"%"}</div>
			<div class="chartOutput">${" a year before fees, yours savings pot will grow to "}</div>
			`;


	}

});
