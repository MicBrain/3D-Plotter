var camera, scene, light, renderer, container;
var meshs = [];
var grounds = [];
var isMobile = false;
var antialias = true;
var graph;
var stats;

var geos = {};
var mats = {};

//oimo var
var world = null;
var bodys = [];

var fps = [0,0,0,0];
var ToRad = Math.PI / 180;
var type=1;
var infos;
var sliders = {};
var plotter = new Plotter3D();


addListeners();
manageUI();
init();
loop();
drawAxes(150, 5, true);
$("input.default-fn").click();

function manageUI()
{
	sliders["x"] = $("#x-range" ).slider({
		range: true,
		values: [ -10, 10 ],
		max: 20,
		min : -20,
		slide : onRangeSlide
	});
	sliders["z"] = $("#z-range" ).slider({
		range: true,
		values: [ -10, 10 ],
		max: 20,
		min : -20,
		slide : onRangeSlide
	});
	positionRangeMarks([-10, 10], $("#x-range"));
	positionRangeMarks([-10, 10], $("#z-range"));	

	function onRangeSlide(event, ui){
		var props = {
			x : ["xMin", "xMax"],
			z : ["zMin", "zMax"]			
		};
		$this = $(this);
		var axis = $this.data("axis");
		var options = {};
		options[props[axis][0]] = ui.values[0];
		options[props[axis][1]] = ui.values[1];
		plotter.plot(options);
		positionRangeMarks(ui.values, $(this));
	}

	function positionRangeMarks(vals, $slider)
	{
		$wrapper = $slider.parent();
		$lm = $wrapper.find(".range-mark.left");
		$lr = $wrapper.find(".range-mark.right");
		var minValue = -20, maxValue = 20;
		var wrapperWidth = parseInt($wrapper.css("width"));
		var selfWidth = parseInt($lm.css("width"));
		$lm.css("left", wrapperWidth*(vals[0] - minValue) / (maxValue - minValue) - selfWidth / 2 + "px").html(vals[0]);
		$lr.css("left", wrapperWidth*(vals[1] - minValue) / (maxValue - minValue) - selfWidth / 2 + "px").html(vals[1]);
	}
}


function addListeners()
{
	var sampleFs = {
		sinCos : {	
			f: function (x,z){	return (x+z) / (2+Math.cos(x/2)*Math.sin(z/2));	},	//	sinc and cos 2
			expression: "(x + y) / (2 + cos(x/2) * sin(y/2))"
		},
		bell : {	
			f: function(x, z){	return (Math.exp(4-x*x/50-z*z/50))/4 ; },	// Bell Curve
			expression: "exp((4 - x*x/50 - y*y/50)/4)"
		},
		paraboloid : {	
			f: function(x, z){	return 10-(x*x/20 + z*z/20) ; }, 	// paraboloid
			expression: "10 - (x*x/20 + y*y/20)"
		},
		saddle : {	
			f: function(x, z){	return (x*x/10 - z*z/10) ; },	// saddle
			expression: "(x*x/10 - y*y/10)"
		},
		custom : {
		}
	};
	$("#customFunction").on("keypress", function(e) {
		if(e.which == 13) {
			$("#custom-plot").click();
		}
	});
	$("#controls .function-button").on("click", function(){	
		var fName = $(this).data("fname");
		
		if(fName == "custom"){
			try{
				var expression = $("#customFunction").val().toLowerCase();			
				sampleFs[fName].expression = expression;
				sampleFs[fName].f = Parser.parse(expression).toJSFunction("x,y");
				sampleFs[fName].f(1,1);
			}
			catch(err){
				showError(err.message);
				return;
			}
		};

		var options = {
			f : sampleFs[fName].f
		};
		plotter.plot(options);
		showInfo(sampleFs[fName]);
	})

	function showInfo(sampleF)
	{
		var $description = $("#controls #function-info  #function-desciption");
		$description.empty();
		var info = plotter.getFunctionInfo();
		$description.append("z = " + sampleF.expression + "<br>");
		// $content.append("xMin = " + options.xMin + "<br>");
		// $content.append("xMax = " + options.xMax + "<br>");
		// $content.append("yMin = " + options.zMin + "<br>");
		// $content.append("yMax = " + options.zMax + "<br>");
		// $content.append("zMin = " + Math.floor(info.yMin) + "<br>");
		// $content.append("zMax = " + Math.floor(info.yMax) + "<br>");
		$("#controls #function-info").removeClass("hide");
	}
}