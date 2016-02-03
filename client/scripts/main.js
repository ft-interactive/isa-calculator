import oHoverable from 'o-hoverable';
import attachFastClick from 'fastclick';
import d3 from 'd3';


document.addEventListener('DOMContentLoaded', () => {
	// make hover effects work on touch devices
	oHoverable.init();

	// remove the 300ms tap delay on mobile browsers
	attachFastClick(document.body);

	//Add labels to sliders
	addLabel("#save","savelab");
	addLabel("#toRetire","retirelab");
	addLabel("#charges","chargeslab");
	addLabel("#returns","returnslab");



	//Add event listeners to sliders
	var saveevent=d3.select("#slsave");
	saveevent.on("change", function(d){
		var interval=this.value;
		console.log(interval);
		var newX=calcLabelPos(interval,"#slsave")
		moveLabel("#savelab",interval,newX);
	})

	var retireevent=d3.select("#slretire");
	retireevent.on("change", function(d){
		var interval=this.value;
		console.log(interval);
		var newX=calcLabelPos(interval,"#slretire")
		moveLabel("#retirelab",interval,newX);
	})

	var chargesevent=d3.select("#slcharges");
	chargesevent.on("change", function(d){
		var interval=this.value;
		console.log(interval);
		var newX=calcLabelPos(interval,"#slcharges")
		moveLabel("#chargeslab",interval,newX);
	})

	var returnsevent=d3.select("#slreturns");
	returnsevent.on("change", function(d){
		var interval=this.value;
		console.log(interval);
		var newX=calcLabelPos(interval,"#slreturns")
		moveLabel("#returnslab",interval,newX);
	})



	function addLabel(divID,labelID) {
		var label=d3.select(String(divID)).append("div")
		.attr("id", labelID)
		.attr("class", "slideLabel");
	}

	function moveLabel(divId,labelVal,pos){
		var label=d3.select(String(divId))
		.html(labelVal)
		.style("left", pos+"px")
		.style("top", "54px");
	}

	function calcLabelPos (pos, label){
		var slider=d3.select(String(label))
		var percentage=(100/(slider.node().max-slider.node().min)*(pos));
		var posX=slider.node().getBoundingClientRect().width;
		posX=(posX/100)*percentage;
		return posX
	}

});
