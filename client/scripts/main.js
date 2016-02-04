import oHoverable from 'o-hoverable';
import attachFastClick from 'fastclick';
import d3 from 'd3';


document.addEventListener('DOMContentLoaded', () => {
	// make hover effects work on touch devices
	oHoverable.init();

	// remove the 300ms tap delay on mobile browsers
	attachFastClick(document.body);

	var savePerYear=1
	var timeToRetire=1
	var charges=0
	var returns=0

	var slideValues=[
	{"divID":"save","labName":"savelab","pos":savePerYear,"sliderID":"slsave","min":1,"max":15},
	{"divID":"toRetire","labName":"retirelab","pos":timeToRetire,"sliderID":"slretire","min":1,"max":50},
	{"divID":"charges","labName":"chargeslab","pos":charges,"sliderID":"slcharges","min":1,"max":3},
	{"divID":"returns","labName":"returnslab","pos":returns,"sliderID":"slreturns","min":1,"max":20}]

	//Add sliders
	var htmlString=""
	for (var i = 0; i < 4; i++) {
		var div=slideValues[i].divID;
		var slideID=slideValues[i].sliderID;
		var labelValue=Number(slideValues[i].pos);
		var slideHolder=d3.select("#controls")
		htmlString=htmlString+"<div id='"+div+"' class='slideholder'>Some texct<input class='slider' id='"+slideID+"'type='range'value='"+labelValue+"'max='"+slideValues[i].max+"'min='"+slideValues[i].min+"'></div>";
		slideHolder.html(htmlString);
	}
	//Add labels to slider then move to correct postion. If I put this all in one lop above it doesn't work
	for (var i = 0; i < 4; i++) {
		var div=slideValues[i].divID;
		var labName=slideValues[i].labName;
		addLabel(div,labName);
		var labelValue=Number(slideValues[i].pos);
		var slideID=slideValues[i].sliderID;
		var newX=calcLabelPos(labelValue,slideID);
		moveLabel(labName,labelValue,newX);
	}

	//Add event listeners to sliders
	var saveevent=d3.select("#slsave");
	saveevent.on("change", function(d){
		var interval=this.value;
		var newX=calcLabelPos(interval,"slsave")
		moveLabel("savelab",interval,newX);
	})

	var retireevent=d3.select("#slretire");
	retireevent.on("change", function(d){
		var interval=this.value;
		var newX=calcLabelPos(interval,"slretire")
		moveLabel("retirelab",interval,newX);
	})

	var chargesevent=d3.select("#slcharges");
	chargesevent.on("change", function(d){
		var interval=this.value;
		var newX=calcLabelPos(interval,"slcharges")
		moveLabel("chargeslab",interval,newX);
	})

	var returnsevent=d3.select("#slreturns");
	returnsevent.on("change", function(d){
		var interval=this.value;
		var newX=calcLabelPos(interval,"slreturns")
		moveLabel("returnslab",interval,newX);
	})



	function addLabel(divID,labelID) {
		//console.log("func: addLabel");
		var label=d3.select("#"+String(divID)).append("div")
		label
		.attr("id", labelID)
		.attr("class", "slideLabel");
	}

	function calcLabelPos (pos, SliderID){
		//console.log("func: calcLabelPos");
		var slider=d3.select("#"+String(SliderID));
		var percentage=(100/(slider.node().max-slider.node().min)*(pos));
		var posX=slider.node().getBoundingClientRect().width;
		posX=(posX/100)*percentage;
		return posX
	}

	function moveLabel(divId,labelText,pos){
		//console.log("func: moveLabel")
		var label=d3.select("#"+String(divId))
		.html(labelText)
		.style("left", pos+"px")
		.style("top", "54px");
	}
});
