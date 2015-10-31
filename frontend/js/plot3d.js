function Plotter3D(){

	var self = this;
	self.options = {
			xMin : -10,
			xMax : 10,
			zMin : -10,
			zMax : 10,
			xCellCount : 80,
			yCellCount : 80,
			/* y = f(x,z), y is the axes towards updateProjectionMatrix*/
			f : function(x, z){	return (5000 - x*x/2 - z*z/3) > 0 ? Math.sqrt(5000 - x*x/2 - z*z/3) : 0 ; }	// saddle
		};

	self.plot = function(options){
		self.clean();
		$.extend(self.options, options);
		var scale = 10;
		var o = self.options;
		var info = self.getFunctionInfo();
		var yMax = info.yMax;
		var yMin = info.yMin;
		var ySpan = yMax - yMin;
		var xStep = (o.xMax - o.xMin) / o.xCellCount;
		var zStep = (o.zMax - o.zMin) / o.yCellCount;

		var planeCount = o.xCellCount * o.yCellCount;
		var positions = new Float32Array(planeCount * 6 * 3);
		var normals = new Float32Array(planeCount * 6 * 3);
		var colors = new Float32Array(planeCount * 6 * 3);
		var ix, iz, j, j3, k;
		var vertices = [];
		for(j = 0; j < 6; ++j) vertices[j] = new THREE.Vector3();

		var pB = new THREE.Vector3();
		var pC = new THREE.Vector3();

		var cb = new THREE.Vector3();
		var ab = new THREE.Vector3();
		var dx = [0, 0, 1, 1, 1, 0];
		var dz = [0, 1, 0, 1, 0, 1];
		var x,y,z;
		var n;

		var color = new THREE.Color();

		for(ix = 0; ix < o.xCellCount; ++ix)
			for(iz = 0; iz < o.yCellCount; ++iz)
			{
				n = ix * o.yCellCount + iz;
				n *= 6*3;

				for(j = 0; j < 6; ++j)
				{
					j3 = j*3;
					x = o.xMin + (ix + dx[j]) * xStep;
					z = o.zMin + (iz + dz[j]) * zStep;
					y = o.f(x,z);
					positions[n + j3] = x;
					positions[n + j3 + 1] = y;
					positions[n + j3 + 2] = z;
					vertices[j].set(x, y, z);
					color.setHSL((1 - (y - yMin) / ySpan) / 4, 1, 0.5);
					colors[n + j3] = color.r;
					colors[n + j3 + 1] = color.g;
					colors[n + j3 + 2] = color.b;
				}
				for(k = 0; k < 2; k++)
				{
					ab.subVectors(vertices[0 + 3*k], vertices[1 + 3*k]);
					cb.subVectors(vertices[2 + 3*k], vertices[1 + 3*k]);
					cb.cross(ab);				
					cb.normalize();
					// if(k == 1) cb.multiplyScalar(-1);				
					for(j = 0; j < 3; ++j)
					{
						j3 = j * 3;
						normals[n + k*9 + j3] = cb.x;
						normals[n + k*9 + j3 + 1] = cb.y;
						normals[n + k*9 + j3 + 2] = cb.z;
					}
				}
			}

		var planeGeo = new THREE.BufferGeometry();
		var planeMatFront = new THREE.MeshBasicMaterial( {
					// shininess: 250,
					side: THREE.FrontSide, 
					vertexColors: THREE.VertexColors,
				} );
		var planeMatBack = new THREE.MeshBasicMaterial( {
					color: 0x666666,
					side: THREE.BackSide, 
					vertexColors: THREE.VertexColors,
				} );	
		var planeMatWireFrame = new THREE.MeshBasicMaterial({
					side : THREE.FrontSide,
					color: 0x000000, 
					wireframe : true,
					transparent : true,
					opacity : 0.2
			});
		planeGeo.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
		planeGeo.addAttribute( 'normal', new THREE.BufferAttribute( normals, 3 ) );
		planeGeo.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );

		var plane = THREE.SceneUtils.createMultiMaterialObject( planeGeo, [planeMatFront, planeMatBack, planeMatWireFrame]);
		plane.scale.set(scale,scale,scale)
		plane.name = "plane";
		scene.add(plane);
	}

	self.clean = function()
	{
		var obj = scene.getObjectByName("plane");
		while(obj)
		{
			scene.remove(obj);
			obj = scene.getObjectByName("plane");
		}
	}



	self.getFunctionInfo = function()
	{
		var o = self.options;
		var ret = {
			yMin : 1e+6,
			yMax : -1e+6
		}
		var ix, iz, y;
		var xStep = (o.xMax - o.xMin) / o.xCellCount;
		var zStep = (o.zMax - o.zMin) / o.yCellCount;
		for(ix = 0; ix < o.xCellCount; ++ix)
			for(iz = 0; iz < o.yCellCount; ++iz)
			{
				y = o.f(o.xMin + ix*xStep, o.zMin + iz*zStep);
				if(y < ret.yMin) ret.yMin = y;
				if(y > ret.yMax) ret.yMax = y;
			}
		return ret;
	}
}