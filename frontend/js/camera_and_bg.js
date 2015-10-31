	function init() {

		camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 5000 );
		initCamera(60,60,300);

		scene = new THREE.Scene();

		renderer = new THREE.WebGLRenderer({precision: "mediump", antialias:antialias});
		renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.autoClear = false;
		
		//this.scene.fog = new THREE.Fog( 0x3D4143, 100, 800 );
		scene.add( new THREE.AmbientLight( 0x3D4143 ) );
		light = new THREE.DirectionalLight( 0xffffff , 1.3);
		light.position.set( 300, 1000, 500 );
		light.target.position.set( 0, 0, 0 );
		light.castShadow = true;
		light.shadowCameraNear = 500;
		light.shadowCameraFar = 1600;
		light.shadowCameraFov = 70;
		light.shadowBias = 0.0001;
		light.shadowDarkness = 0.7;
		//light.shadowCameraVisible = true;
		light.shadowMapWidth = light.shadowMapHeight = 1024;
		scene.add( light );

		renderer.shadowMapEnabled = true;
		renderer.shadowMapType = THREE.PCFShadowMap;

		// background
		var buffgeoBack = new THREE.BufferGeometry();
		buffgeoBack.fromGeometry( new THREE.IcosahedronGeometry(3000,1) );
		var back = new THREE.Mesh( buffgeoBack, new THREE.MeshBasicMaterial( { map:gradTexture([[0.75,0.6,0.4,0.25], ['#1B1D1E','#3D4143','#72797D', '#b0babf']]), side:THREE.BackSide, depthWrite: false, fog:false }  ));
		back.geometry.applyMatrix(new THREE.Matrix4().makeRotationZ(15*ToRad));
		scene.add( back );

		// geometrys
		geos['sphere'] = new THREE.BufferGeometry();
		geos['sphere'].fromGeometry( new THREE.SphereGeometry(4,16,16));
		geos['box'] = new THREE.BufferGeometry();
		geos['box'].fromGeometry( new THREE.BoxGeometry(1,1,1));
		geos['line'] = new THREE.Geometry();


		// materials
		mats['sph'] = new THREE.MeshPhongMaterial( { map: basicTexture(0), name:'sph' } );
		mats['box'] = new THREE.MeshPhongMaterial( { map: basicTexture(2), name:'box' } );
		mats['ssph'] = new THREE.MeshLambertMaterial( { map: basicTexture(1), name:'ssph' } );
		mats['sbox'] = new THREE.MeshLambertMaterial( { map: basicTexture(3), name:'sbox' } );
		mats['ground'] = new THREE.MeshLambertMaterial( { color: 0x3D4143 } );
		mats['line'] = new THREE.LineBasicMaterial({ color: 0x000000, linewidth : 1 });

		container = document.getElementById("container");
		container.appendChild( renderer.domElement );
		stats = new Stats();
		stats.setMode(0); // 0: fps, 1: ms

		// align top-left
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.right = '0px';
		stats.domElement.style.top = '0px';

		document.body.appendChild( stats.domElement );
		initEvents();
	}

	function loop() {
		requestAnimationFrame( loop );
		renderer.render( scene, camera );
		stats.begin();
		stats.end();
	}

////------------------------- Textures 

	function gradTexture(color) {
		var c = document.createElement("canvas");
		var ct = c.getContext("2d");
		c.width = 16; c.height = 128;
		var gradient = ct.createLinearGradient(0,0,0,128);
		var i = color[0].length;
		while(i--){ gradient.addColorStop(color[0][i],color[1][i]); }
		ct.fillStyle = gradient;
		ct.fillRect(0,0,16,128);
		var texture = new THREE.Texture(c);
		texture.needsUpdate = true;
		return texture;
	}

	function basicTexture(n){
		var canvas = document.createElement( 'canvas' );
		canvas.width = canvas.height = 64;
		var ctx = canvas.getContext( '2d' );
		var color;
		if(n===0) color = "#3884AA";// sphere58AA80
		if(n===1) color = "#61686B";// sphere sleep
		if(n===2) color = "#AA6538";// box
		if(n===3) color = "#61686B";// box sleep
		ctx.fillStyle = color;
		ctx.fillRect(0, 0, 64, 64);
		ctx.fillStyle = "rgba(0,0,0,0.2);";//colors[1];
		ctx.fillRect(0, 0, 32, 32);
		ctx.fillRect(32, 32, 32, 32);
		var tx = new THREE.Texture(canvas);
		tx.needsUpdate = true;
		return tx;
	}		