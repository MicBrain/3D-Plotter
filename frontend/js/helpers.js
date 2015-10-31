/**
 * helper to draw axes
 */

function drawAxes(axesLength, markCount, showCoords)
{
	var i, mat, geo, line, color, j, k;
	var dist = axesLength || 500;
	markCount = markCount || 2;
	var points = [[dist, 0, 0], [0, dist, 0], [0, 0, dist]]
	var axes = ["x", "z", "y"];
	for(i = 0; i < 3; ++i)
	{
		color = 0xff << (2*4*i);
		mat = new THREE.LineBasicMaterial({
			color: color
		});
		geo = new THREE.Geometry();	
		geo.vertices.push(
			new THREE.Vector3( points[i][0], points[i][1], points[i][2] ),
			new THREE.Vector3( -points[i][0], -points[i][1], -points[i][2])
		);
		line = new THREE.Line(geo, mat);
		if(showCoords)
		{
			addText(axes[i], points[i][0], points[i][1], points[i][2], color, dist/10);
			addText("-" + axes[i], -points[i][0], -points[i][1], -points[i][2], color, dist/10);
		}
		for(j = -dist; j <= dist; j += Math.floor(dist/markCount))
		{
			addText(j, j * !!points[i][0], j*!!points[i][1], j*!!points[i][2], color, 2);
		}
		line.matrixAutoUpdate = false;
		line.updateMatrix();
		scene.add( line );
	}
}

function addText(text, x, y, z, color, size)
{
	size = size || 40;
	var materialFront = new THREE.MeshBasicMaterial({
		color: color
	});
	var materialSide = new THREE.MeshBasicMaterial({
		color: color >> 8
	});
	var materialArray = [materialFront, materialSide];
	var textGeom = new THREE.TextGeometry(text, {
		size: size,
		height: 1,
		curveSegments: 3,
		font: "helvetiker",
		// bevelThickness: 1,
		// bevelSize: 2,
		// bevelEnabled: true,
		// material: 0,
		// extrudeMaterial: 1
	});
	// font: helvetiker, gentilis, droid sans, droid serif, optimer
	// weight: normal, bold

	var textMaterial = new THREE.MeshBasicMaterial(materialFront);
	var textMesh = new THREE.Mesh(textGeom, textMaterial);

	textMesh.position.set(x, y, z);
	textMesh.matrixAutoUpdate = false;
	textMesh.updateMatrix();
	scene.add(textMesh);
}


function showError(err)
{
	$("#errPopup").stop().fadeOut(0).html("Error: " + err).fadeIn(300, function(){
		$(this).fadeOut(5000);
	})
}

/*	shows a success message	*/
function showMsg(msg)
{
	var self = this;
	$("#successPopup").stop().fadeOut(0).html(msg).fadeIn(300, function(){
		$(this).fadeOut(5000);
	})	
}


function animate(o, plotter, cleaner){
	var options = o || {
		interval : 1000,
		xMinFrom : -1,
		xMinTo : -20,
		xMaxFrom : 1,
		xMaxTo : 20,
		zMinFrom : -1,
		zMinTo : -20,
		zMaxFrom : 1,
		zMaxTo : 20,
		duration : 3000
	}
	var plotOptions = 	{
			xMin : -options.xMinFrom,
			xMax : options.xMaxFrom,
			zMin : options.zMinFrom,
			zMax : options.zMaxFrom,
			xCellCount : 100,
			yCellCount : 100,
			/* y = f(x,z), y is the axes towards updateProjectionMatrix*/
			f : function(x, y){	return (x + y) / (2 + Math.cos(x/2) * Math.sin(y/2)) }	// saddle
		};

	var interval = 30;
	var iterationCount = options.duration / interval;
	var xMinDelta = (options.xMinTo - options.xMinFrom ) / iterationCount;
	var xMaxDelta = (options.xMaxTo - options.xMaxFrom ) / iterationCount;
	var zMinDelta = (options.zMinTo - options.zMinFrom ) / iterationCount;
	var zMaxDelta = (options.zMaxTo - options.zMaxFrom ) / iterationCount;

	animIntervalHandler = setInterval(function(){
		if(plotOptions.xMax > options.xMaxTo || plotOptions.zMax > options.zMaxTo || plotOptions.xMin < options.xMinTo || plotOptions.zMin < options.zMinTo){
			clearInterval(animIntervalHandler);
		}
		plotOptions.xMin += xMinDelta;
		plotOptions.xMax += xMaxDelta;
		plotOptions.zMin += zMinDelta;
		plotOptions.zMax += zMaxDelta;
		cleaner();
		plotter(plotOptions);
	}, interval)

	
}