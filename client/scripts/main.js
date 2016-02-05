import oHoverable from 'o-hoverable';
import attachFastClick from 'fastclick';
import d3 from 'd3';

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
	{"divID":"save","className":"slideholder","HTML":"Save each year (£k)","labName":"savelab","pos":savePerYear,"sliderID":"slsave","min":0,"max":15,"step":0.1},
	{"divID":"toRetire","className":"slideholder","HTML":"Time to retirement (years)","labName":"retirelab","pos":timeToRetire,"sliderID":"slretire","min":0,"max":50,"step":1},
	{"divID":"charges","className":"slideholder","HTML":"Charges (per cent)","labName":"chargeslab","pos":charges,"sliderID":"slcharges","min":0,"max":3,"step":0.1},
	{"divID":"returns","className":"slideholder","HTML":"Returns (per cent)","labName":"returnslab","pos":returns,"sliderID":"slreturns","min":0,"max":20,"step":0.1},
	{"divID":"newCharges","className":"dim","HTML":"Charges (per cent)","labName":"newchargeslab","pos":newcharges,"sliderID":"slnewcharge","min":0,"max":1,"step":0.1},
	{"divID":"inRetirement","className":"dim","HTML":"Years in retirement","labName":"inRetirelab","pos":inRetirement,"sliderID":"slnewcharge","min":0,"max":1,"step":1}]

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
	saveevent.on("change", function(d){
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
		//Add an onchange event to the newChanges slider
		div=d3.select("#slnewcharge");
		div.node().max=savePerYear;
		div.on("change",function(d){
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

		


	})

	//Add event listeners to slretire slider
	var retireevent=d3.select("#slretire");
	retireevent.on("change", function(d){
		timeToRetire=this.value;
		var newX=calcLabelPos(timeToRetire,"slretire")
		moveLabel("retirelab",timeToRetire,newX);
	});

	//Add event listeners to slcharges slider
	var chargesevent=d3.select("#slcharges");
	chargesevent.on("change", function(d){
		charges=this.value;
		var newX=calcLabelPos(charges,"slcharges")
		moveLabel("chargeslab",charges,newX);
	});

	//Add event listeners to slreturns slider
	var returnsevent=d3.select("#slreturns");
	returnsevent.on("change", function(d){
		returns=this.value;
		var newX=calcLabelPos(returns,"slreturns")
		moveLabel("returnslab",returns,newX);
	});

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
		var offset=((32/increments)*pos)-5;
		posX=((posX/100)*percentage)-offset;
		return posX;
	}

	//Moves the label under the new thumb position
	function moveLabel (divId, labelText, pos) {
		var label=d3.select('#'+String(divId))
		.html(labelText)
		.style('left', pos+'px')
		.style('top', '84px');
	}

	function slidertemplate (annotations) {
		return `
			<div id=${annotations.divID} class=${annotations.className}>
				<div>${annotations.HTML}</div>
				<div class='rangeleft'>${annotations.min}</div>
				<div class='rangeright'>${annotations.max}</div>
				<input class='slider' id=${annotations.sliderID} type='range' value=${annotations.pos} max=${annotations.max} min=${annotations.min} step=${annotations.step}>
			</div>
			`;
	}
});
