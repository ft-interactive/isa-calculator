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
	{"divID":"#save","labName":"savelab","pos":1,"sliderID":"#slsave","min":1,"max":15},
	{"divID":"#toRetire","labName":"retirelab","pos":1,"sliderID":"#slretire","min":1,"max":15},
	{"divID":"#charges","labName":"chargeslab","pos":0,"sliderID":"#slcharges","min":1,"max":15},
	{"divID":"#returns","labName":"returnslab","pos":0,"sliderID":"#slreturns","min":1,"max":15}]

	//Add labels to the sliders then make them visible
	for (var i = 0; i < slideValues.length; i++) {
		var slideHolder=d3.select("#controls")
		var div=slideValues[i].divID;
		var labName=slideValues[i].labName;
		var labelValue=Number(slideValues[i].pos);
		var slideID=slideValues[i].sliderID;
		addLabel(div,labName);
		var newX=calcLabelPos(labelValue,slideID);
		moveLabel(labName,labelValue,newX);
	}

	//Add event listeners to sliders
	var saveevent=d3.select("#slsave");
	saveevent.on("change", function(d){
		var interval=this.value;
		console.log(interval);
		var newX=calcLabelPos(interval,"#slsave")
		moveLabel("savelab",interval,newX);
	})

	var retireevent=d3.select("#slretire");
	retireevent.on("change", function(d){
		var interval=this.value;
		console.log(interval);
		var newX=calcLabelPos(interval,"#slretire")
		moveLabel("retirelab",interval,newX);
	})

	var chargesevent=d3.select("#slcharges");
	chargesevent.on("change", function(d){
		var interval=this.value;
		console.log(interval);
		var newX=calcLabelPos(interval,"#slcharges")
		moveLabel("chargeslab",interval,newX);
	})

	var returnsevent=d3.select("#slreturns");
	returnsevent.on("change", function(d){
		var interval=this.value;
		var newX=calcLabelPos(interval,"#slreturns")
		moveLabel("returnslab",interval,newX);
	})



	function addLabel(divID,labelID) {
		var label=d3.select(String(divID)).append("div")
		.attr("id", labelID)
		.attr("class", "slideLabel");
	}

	function moveLabel(divId,labelText,pos){
		var label=d3.select("#"+String(divId))
		.html(labelText)
		.style("left", pos+"px")
		.style("top", "54px");
	}

	function calcLabelPos (pos, SliderID){
		var slider=d3.select(String(SliderID));
		var percentage=(100/(slider.node().max-slider.node().min)*(pos));
		var posX=slider.node().getBoundingClientRect().width;
		posX=(posX/100)*percentage;
		return posX
	}

});
