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
	var nomReturn=0;
	var charges=0
	var returns=Number(nomReturn-charges);
	var newCharges=0;
	var newReturns=0;
	// var inRetirement=0;
	var firstrun=true;

	//Intial set up perameters for the sliders
	var slideValues=[
	{"divID":"save","className":"slideholderTop","HTML":"Save each year (£k)","labName":"savelab","pos":savePerYear,"sliderID":"slsave","min":0,"max":15,"step":0.1},
	{"divID":"toRetire","className":"slideholder","HTML":"Time to retirement (years)","labName":"retirelab","pos":timeToRetire,"sliderID":"slretire","min":0,"max":50,"step":1},
	{"divID":"nomReturn","className":"slideholder","HTML":"Nominal return (per cent)","labName":"nomReturnlab","pos":nomReturn,"sliderID":"slnomReturn","min":0,"max":0.1,"step":0.01},
	{"divID":"charges","className":"slideholder","HTML":"Charges (per cent)","labName":"chargeslab","pos":charges,"sliderID":"slcharges","min":0,"max":0.01,"step":0.001},
	{"divID":"newCharges","className":"dim","HTML":"Revised charges (per cent)","labName":"newChargeslab","pos":newCharges,"sliderID":"slnewCharges","min":0,"max":0.01,"step":0.001}]

	//{"divID":"inRetirement","className":"dim","HTML":"Years in retirement","labName":"inRetirelab","pos":inRetirement,"sliderID":"slinreture","min":0,"max":50,"step":1}

	//Add sliders
	var htmlString="";
	var testString=""
	for (var i = 0; i < slideValues.length; i++) {
		var slideHolder=d3.select("#controls");
		htmlString=htmlString+slidertemplate (slideValues[i]);
		slideHolder.html(htmlString);
	}

	//Add labels to slider then move them to correct postion.
	//If I call addLabel() and moveLabel() in loop above it doesn't work?
	//Labels for the last two sliders are dependeant on values entered by the first florr so added later
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
		savePerYear=Number(this.value);
		var newX=calcLabelPos(savePerYear,"slsave")
		moveLabel("savelab",savePerYear,newX);
	})

	//Add event listeners to slretire slider
	var retireevent=d3.select("#slretire");
	retireevent.on("input", function(d){
		timeToRetire=Number(this.value);
		var newX=calcLabelPos(timeToRetire,"slretire")
		moveLabel("retirelab",timeToRetire,newX);
		if (timeToRetire>0 && savePerYear>0 && nomReturn>0 && charges>0) {
			returns=calcReturns(nomReturn,charges);
			calcChart();
			var htmlString=chartText()
			var div=d3.select("#chartText");
			div.html(htmlString);
		}
	});

	//Add event listeners to slnomReturn slider
	var nomReturnevent=d3.select("#slnomReturn");
	nomReturnevent.on("input", function(d){
		nomReturn=Number(this.value);
		var newX=calcLabelPos(nomReturn,"slnomReturn")
		moveLabel("nomReturnlab",nomReturn,newX);
		if (timeToRetire>0 && savePerYear>0 && nomReturn>0 && charges>0) {
			returns=calcReturns(nomReturn,charges);
			calcChart();
			var htmlString=chartText()
			var div=d3.select("#chartText");
			div.html(htmlString);
		}
	});

	//Add event listeners to slcharges slider
	var chargesevent=d3.select("#slcharges");
	chargesevent.on("input", function(d){
		charges=Number(this.value);
		var newX=calcLabelPos(charges,"slcharges")
		moveLabel("chargeslab",charges,newX);
		if (timeToRetire>0 && savePerYear>0 && nomReturn>0 && charges>0) {
			returns=calcReturns(nomReturn,charges);
			calcChart();
			var htmlString=chartText()
			var div=d3.select("#chartText");
			div.html(htmlString);
		}
		//Make the newChargesanges slider opaque
		var div=d3.select("#newCharges");
		div.attr("class","slideholder");
		//Add label to the newChargesanges slider
		if (firstrun) {
			addLabel("newCharges","newChargeslab");
			firstrun=false;
			}
		//Add an oninput event to the newChargesanges slider, not onchange as this is only triggered when mouse is released
		div=d3.select("#slnewCharges");
		div.node().max=charges;
		div.on("input",function(d){
			newCharges=this.value;
			var newX=calcLabelPos(newCharges,'slnewCharges')
			moveLabel("newChargeslab",newCharges,newX);
		})
		//Refresh the ranges of the newChargesanges slider
		var rangediv=d3.select("#newCharges");
		rangediv.selectAll('.rangeright')
		.html(charges)
		//Refresh the label on the newChargesanges slider when slsave slider changes
		newCharges=div.node().value;
		var newX=calcLabelPos(newCharges,'slnewCharges')
		moveLabel("newChargeslab",newCharges,newX);
		if (timeToRetire>0 && savePerYear>0 && nomReturn>0 && charges>0) {
			calcChart();
			returns=calcReturns(nomReturn,charges);
			var htmlString=chartText()
			var div=d3.select("#chartText");
			div.html(htmlString);
		}


		// //Make the inRetirement slider opaque
		// div=d3.select("#inRetirement");
		// div.attr("class","slideholder");
		// //Add label to the inRetirement slider
		// if (firstrun) {
		// 	addLabel("inRetirement","inRetirelab");
		// 	firstrun=false;
		// 	}
		// //Refresh label position for slinreture
		// var newX=calcLabelPos(inRetirement,'slinreture')
		// moveLabel("inRetirelab",inRetirement,newX);
		// //Add an oninput event to the inRetirement slider, not onchange as this is only triggered when mouse is released
		// div=d3.select("#slinreture");
		// div.on("input",function(d){
		// 	var inRetirement=this.value;
		// 	var newX=calcLabelPos(inRetirement,'slinreture')
		// 	moveLabel("inRetirelab",inRetirement,newX);
		// })

	});

	function calcReturns(returns, charge) {
		return returns-charge
	}

	//Data for chart, most of this is made up as I don't yet have the maths
	function calcChart () {
		var compRate=Number(returns)+1
		console.log(compRate)
		var xdomain=[1,Number(timeToRetire)];
		var dataset=Array(Number(timeToRetire)).fill(savePerYear).reduce((array, element, index) => {
			array.push({year: index + 1, cost: !array.length ? element : array[array.length-1].cost * compRate + savePerYear});
			return array;
			}, []);
		console.log(dataset)
		drawChart (xdomain, dataset);

	}

	//Adds a dive to hold the slider label
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
		var offset=((32/increments)*pos)+7;
		posX=((posX/100)*percentage)-offset;
		return posX;
	}

	//Moves the label over the top of new thumb position
	function moveLabel (divId, labelText, pos) {
		if ((window.innerWidth)>640) {
			var topPos=24
		}
		else {var topPos=21};
		var label=d3.select('#'+String(divId))
		.html(labelText)
		.style('left', pos+'px')
		.style('top', topPos+'px');
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
