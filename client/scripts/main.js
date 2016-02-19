import oHoverable from 'o-hoverable';
import attachFastClick from 'fastclick';
import d3 from 'd3';
import {drawChart} from './areaChart';

document.addEventListener('DOMContentLoaded', () => {
	// make hover effects work on touch devices
		oHoverable.init();

	// remove the 300ms tap delay on mobile browsers
		attachFastClick(document.body);


	window.addEventListener('resize', resize);

	//Variables that hold the slider.values
	var savePerYear=2;
	var timeToRetire=40;
	var nomReturn=6.0;
	var charges=2.1
	var returns=2
	var newCharges=0.5;
	var newReturns=0;
	var totalValue=0;
	var revisedValue=0;
	var difference=0
	var feesDiff=0
	var percentDif=0
	var firstrun=true;

	//Intial set up perameters for the sliders
	var slideValues=[
	{"divID":"save","className":"slideholderTop","HTML":"Save each year (£k)","labName":"savelab","pos":savePerYear,"sliderID":"slsave","min":0,"max":15,"step":0.1},
	{"divID":"toRetire","className":"slideholder","HTML":"Time to retirement (years)","labName":"retirelab","pos":timeToRetire,"sliderID":"slretire","min":0,"max":50,"step":1},
	{"divID":"nomReturn","className":"slideholder","HTML":"Nominal return (per cent)","labName":"nomReturnlab","pos":nomReturn,"sliderID":"slnomReturn","min":0,"max":10,"step":0.1},
	{"divID":"charges","className":"slideholder","HTML":"Charges (per cent)","labName":"chargeslab","pos":charges,"sliderID":"slcharges","min":0,"max":10,"step":0.1},
	{"divID":"newCharges","className":"slideholder","HTML":"Revised charges (per cent)","labName":"newChargeslab","pos":newCharges,"sliderID":"slnewCharges","min":0,"max":10,"step":0.1}]

	//Add sliders first four siders into #inputs
	var htmlString="";
	var testString=""
	for (var i = 0; i < 4; i++) {
		var slideHolder=d3.select("#controls");
		htmlString=htmlString+slidertemplate (slideValues[i]);
		slideHolder.html(htmlString);
	}
	//Then add adition slider further down into #inputs2
	htmlString="";
	testString="";
	for (var j = 4; j < 5; j++) {
		var slideHolder=d3.select("#controls2");
		htmlString=htmlString+slidertemplate (slideValues[j]);
		slideHolder.html(htmlString);
	}

	//Add labels to slider then move them to correct postion.
	//If I call addLabel() and moveLabel() in loop above it doesn't work?
	//Labels for the last two sliders are dependeant on values entered by the first florr so added later
	for (var i = 0; i < slideValues.length; i++) {
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
		updateText()
	})

	//Add event listeners to slretire slider
	var retireevent=d3.select("#slretire");
	retireevent.on("input", function(d){
		timeToRetire=Number(this.value);
		if (Number(this.value)<1){
			this.value=1;
			timeToRetire=1
		}
		var newX=calcLabelPos(timeToRetire,"slretire")
		moveLabel("retirelab",timeToRetire,newX);
		updateText()
	});

	//Add event listeners to slnomReturn slider
	var nomReturnevent=d3.select("#slnomReturn");
	nomReturnevent.on("input", function(d){
		nomReturn=Number(this.value);
		var newX=calcLabelPos(nomReturn,"slnomReturn")
		moveLabel("nomReturnlab",nomReturn,newX);
		updateText()
	});

	//Add event listeners to slcharges slider
	var chargesevent=d3.select("#slcharges");
	chargesevent.on("input", function(d){
		charges=Number(this.value);
		if (Number(this.value)<newCharges){
			this.value=newCharges;
			charges=newCharges
		}
		var newX=calcLabelPos(charges,"slcharges")
		moveLabel("chargeslab",charges,newX);
		//Adjust the maximum  value of newcharges slider based on vurrent charges value
		updateRange()
		updateText()
	});

	//Add event listeners to slnewCharges slider
	var newchargesevent=d3.select("#slnewCharges");
	newchargesevent.on("input", function(d){
		newCharges=Number(this.value);
		var newX=calcLabelPos(newCharges,"slnewCharges")
		moveLabel("newChargeslab",newCharges,newX);
		updateText()
	});
	
	returns=calcReturns(nomReturn,charges);
	newReturns=calcReturns(nomReturn,newCharges);
	calcChart()
	var htmlString=chartText1()
	var div=d3.select("#chartText1");
	div.html(htmlString);
	htmlString=chartText2()
	var div=d3.select("#chartText2");
	div.html(htmlString);
	updateRange();
	updateText();

	function updateRange (){
		var div=d3.select("#slnewCharges");
		div.node().max=charges;
		div=d3.select("#newCharges");
		div.selectAll('.rangeright')
		.html(charges);
		//adjust the slider label of the newCharges slider
		newX=calcLabelPos(newCharges,"slnewCharges");
		moveLabel("newChargeslab",newCharges,newX);
	}

	function calcReturns(returns, charge) {
		return (returns)
	}

	//Data for chart, most of this is made up as I don't yet have the maths
	function calcChart() {
		var changeRate=1-(charges/100);
		var newchangeRate=1-(newCharges/100);
		var compRate=1+(Number(returns)/100);
		// console.log("returns ",returns)
		// console.log("compounding rate ",compRate)
		// console.log("change rate ",changeRate);
		var newCompRate=1+(Number(newReturns)/100);
		var xdomain=[0,Number(timeToRetire)];
		var dataset=Array(Number(timeToRetire+1)).fill(savePerYear*1000).reduce((array, element, index) => {
			array.push({year: index, cost: !array.length ? element : (array[array.length-1].cost * compRate + (savePerYear*1000))*changeRate,cost2: !array.length ? element : (array[array.length-1].cost2 * newCompRate + (savePerYear*1000))*newchangeRate});
			return array;
			}, []);
		var index=dataset.length-1
		totalValue=dataset[index].cost;
		revisedValue=dataset[index].cost2;
		//console.log(totalValue, revisedValue)
		difference=revisedValue-totalValue;
		percentDif=100-((totalValue/revisedValue)*100)
		feesDiff=charges-newCharges;
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
		var offset=((30/increments)*pos);
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

	function updateText(){
		if (timeToRetire>0 && savePerYear>0 && nomReturn>0 && charges>0) {
			returns=calcReturns(nomReturn,charges);
			newReturns=calcReturns(nomReturn,newCharges);
			calcChart();
			htmlString=chartText1()
			var div=d3.select("#chartText1");
			div.html(htmlString);
			htmlString=chartText2()
			var div=d3.select("#chartText2");
			div.html(htmlString);
		}
	}

	function chartText1() {
		return `
			<div class="dynamicText">${"If you invest "}</div>
			<div class="dynamichighlights">${"£"+d3.format(",.f")(savePerYear*1000)}</div>
			<div class="dynamicText">${" a year for your retirement "}</div>
			<div class="dynamichighlights">${timeToRetire}</div>
			<div class="dynamicText">${" years away, and the fund’s total costs are "}</div>
			<div class="dynamichighlights">${charges+"%"}</div>
			<div class="dynamicText">${" of the money invested, and the fund manager achieves average return of "}</div>
			<div class="dynamichighlights">${nomReturn+"%"}</div>
			<div class="dynamicText">${" a year before fees, yours savings pot will grow to "}</div>
			<div class="dynamichighlights">${"£"+d3.format(",f")(totalValue)}</div>
			`;
	}

	function chartText2() {
		return `
			<div class="dynamicText">${"But, if the management fees were lower, at "}</div>
			<div class="dynamichighlights">${d3.format(".1f")(newCharges)+"% "}</div>
			<div class="dynamicText">${", you would have made "}</div>
			<div class="dynamichighlights">${"£"+d3.format(",f")(revisedValue)}</div>
			<div class="dynamicText">${"— a  "}</div>
			<div class="dynamichighlights">${"£"+d3.format(",f")(difference)}</div>
			<div class="dynamicText">${"difference shown on the chart. As a result of the "}</div>
			<div class="dynamichighlights">${d3.format(".1f")(feesDiff)}</div>
			<div class="dynamicText">${"percentage-point higher annual charge,  "}</div>
			<div class="dynamichighlights">${d3.format(".1f")(percentDif)+"% "}</div>
			<div class="dynamicText">${"of your savings has disappeared in extra costs."}</div>
			`;
	}

	function resize(){
		console.log("resize")
		calcChart();
		for (var i = 0; i < 6; i++) {

		}
	}

});
