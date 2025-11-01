"use strict";
import * as THREE from 'three';
console.log('-----------------------------------------------------')
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';



    
function shuffle(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
}


function main() {
    

	const canvas = document.querySelector( '#c' );
    const  renderer = new THREE.WebGLRenderer(
        {
            canvas: document.querySelector("canvas"),
            antialias: true
            
        });

    const pi = Math.PI
    // let w = Math.floor(1920 / 2.15)
    // let h = 1080 - 170
    let w = 1080+ 650
    let h = 1920 - 100
    let scale = 0.5
    renderer.setSize(w*scale,h*scale, true)
    renderer.setClearColor(new THREE.Color(1,1,1))


	const fov = 75;
	const aspect = w/h; // the canvas default
	const near = 0.1;
	const far = 1000;
	const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
	camera.position.z = 50
    camera.position.x = camera.position.z / 2
    camera.position.y = camera.position.z / 2
    
    // camera.position.y = 0
 

    const controls = new OrbitControls( camera, renderer.domElement );
    controls.target = new THREE.Vector3(0,30,0)



	const scene = new THREE.Scene();

	{

		let color = 0xFFFFFF;
		let intensity = 3;
		let light = new THREE.DirectionalLight( color, intensity );
        // const light = new THREE.AmbientLight(color, intensity)
        light.position.set( - 1, 2, 4 );
        scene.add( light );

         color = 0xFFFFFF;
		 intensity = 0.2;
		//  light = new THREE.DirectionalLight( color, intensity );
         let a_light = new THREE.AmbientLight(color, intensity)

		// light.position.set( - 1, 2, 4 );
		scene.add( a_light );

	}

    const axesHelper = new THREE.AxesHelper( 15 );
    scene.add(axesHelper)

	const box_size = 1;
	
	const geometry = new THREE.BoxGeometry( box_size, box_size, box_size );
    // geometry.computeVertexNormals()
	const material = new THREE.MeshPhongMaterial( { color: 0x44aa88 } ); // greenish blue
    
	let first_cube = new THREE.Mesh( geometry, material );
    
    first_cube.userData.branch_length = 1

    let cube_2 = first_cube.clone(false)
    cube_2.translateX(7)
    cube_2.translateY(7)
    // first_cube.add(cube_2)

    let cube_3 = first_cube.clone()
    cube_3.translateX(-7)
    
    // first_cube.add(cube_3)

    
    const total_num_cubes = 900
    let desired_num_branches = 8
    let desired_branch_length = total_num_cubes/desired_num_branches/2

    

    let top_cubes = [first_cube]
    
    let cube_new;
    
    
    let cube_counter = 1;
    let last_num_cubes = 0;
    
    let actual_num_branches = 1


   while (cube_counter <= total_num_cubes){
        
        

        if (cube_counter === last_num_cubes){
            console.log("all branches died")
            break
        }
        
        last_num_cubes = cube_counter

        
        let temp_top_cubes = top_cubes
        top_cubes = []
        
        
        for (let i = 0; i < temp_top_cubes.length; i++){
            let top_cube = temp_top_cubes[i]

            
            if (top_cube.userData.branch_length > desired_branch_length){
                actual_num_branches -= 1
                continue
            }
            

            

            cube_new = top_cube.clone(false)

            
            
            cube_new.userData.branch_length += 1

            let x_vals = [1, -1]
            let z_vals = [1, -1]
            shuffle(x_vals)
            shuffle(z_vals)

            if (Math.random() < 0.5){
                x_vals = [0,0]
            }else{
                z_vals = [0,0]
            }
            
            
            cube_new.position.y = 0.5
            cube_new.position.x = x_vals[0]
            cube_new.position.z = z_vals[0]

            let rot_scale = 1
            // cube_new.rotation.z = Math.random() * rot_scale - rot_scale/2
            

            // cube_new.rotation.z = 0.1
            // console.log(cube_new)
            top_cube.add(cube_new)
            // prev_cube = cube_new

            

            top_cubes.push(cube_new)
            cube_counter = cube_counter + 1
            
            if (actual_num_branches < desired_num_branches){
                console.log('branched')
                actual_num_branches += 1
                
                let branch_cube = top_cube.clone(false)
                branch_cube.material =  new THREE.MeshPhongMaterial(); // greenish blue
                branch_cube.material.color.set(
                    Math.random(),
                    Math.random(),
                    Math.random())
                // branch_cube.material.color.set(0.5, 0,0.555555)
                branch_cube.userData.branch_length = 1
                branch_cube.position.y = 0.6
                branch_cube.position.x = x_vals[1]
                branch_cube.position.z = z_vals[0]
                
                top_cube.add(branch_cube)
            
                

                top_cubes.push(branch_cube)
                cube_counter = cube_counter + 1
            }
            // prev_cube = cube_new
            
        }


    }
    console.log("done")
    console.log(cube_counter)
    
    
    scene.add(first_cube)


    



    resizeCanvasToDisplaySize();

	function render( time ) {

		time *= 0.001; // convert time to seconds
		
        
        controls.update(time);
        controls.update();
        renderer.render( scene, camera );


		requestAnimationFrame( render );
        


	}
    
	requestAnimationFrame( render );











    function resizeCanvasToDisplaySize() {
        const canvas = renderer.domElement;
        // look up the size the canvas is being displayed
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
      
        // adjust displayBuffer size to match
        if (canvas.width !== width || canvas.height !== height) {
          // you must pass false here or three.js sadly fights the browser
          renderer.setSize(width, height, false);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
      
          // update any render target sizes here
        }
      }

}

main();
