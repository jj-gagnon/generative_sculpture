
import * as THREE from 'three';
console.log('-----------------------------------------------------')


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
            
        });

    const pi = Math.PI
    // let w = Math.floor(1920 / 2.15)
    // let h = 1080 - 170
    let w = 1080+ 650
    let h = 1920 - 100
    let scale = 0.5
    renderer.setSize(w*scale,h*scale, true)


	const fov = 75;
	const aspect = w/h; // the canvas default
	const near = 0.1;
	const far = 100;
	const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
	camera.position.z = 50
    camera.position.y = camera.position.z / 2
    // camera.position.y = 0


	const scene = new THREE.Scene();

	{

		const color = 0xFFFFFF;
		const intensity = 3;
		const light = new THREE.DirectionalLight( color, intensity );
		light.position.set( - 1, 2, 4 );
		scene.add( light );

	}

    const axesHelper = new THREE.AxesHelper( 15 );
    scene.add(axesHelper)

	const box_size = 1;
	
	const geometry = new THREE.BoxGeometry( box_size, box_size, box_size );
    
	const material = new THREE.MeshPhongMaterial( { color: 0x44aa88 } ); // greenish blue
    
	let first_cube = new THREE.Mesh( geometry, material );
    
    first_cube.userData.branch_length = 1

  


    
    const total_num_cubes = 100
    let desired_num_branches = 2
    let desired_branch_length =100

    

    let top_cubes = [first_cube]
    
    let cube_new;
    let prev_cube = first_cube
    
    let cube_counter = 1;
    let last_num_cubes = 0;
    
    let actual_num_branches = 1


   while (cube_counter <= total_num_cubes){
        
        console.log('while loop beginning')
        // console.log(cube_counter)
        // console.log(last_num_cubes)
        

        if (cube_counter === last_num_cubes){
            console.log("all branches died")
            break
        }
        
        last_num_cubes = cube_counter

        
        let temp_top_cubes = top_cubes
        top_cubes = []
        
        
        for (let i = 0; i < temp_top_cubes.length; i++){
            let top_cube = temp_top_cubes.pop()

            
            if (top_cube.userData.branch_length > desired_branch_length){
                actual_num_branches -= 1
                console.log('num branches - 1')
                continue
            }
            

            let x_vals = [1.1,-1.1]
            shuffle(x_vals)

            cube_new = top_cube.clone()
            
            // prev_cube = top_cube
            cube_new.userData.branch_length += 1

            cube_new.position.y = 0.6
            cube_new.position.x = x_vals[0]
            

            // cube_new.rotation.z = 0.1
            // console.log(cube_new)
            top_cube.add(cube_new)
            // prev_cube = cube_new

            top_cubes.push(cube_new)
            cube_counter = cube_counter + 1
            
            if (actual_num_branches < desired_num_branches){
                console.log('branched')
                actual_num_branches += 1
                
                let branch_cube = top_cube.clone()
                branch_cube.material =  new THREE.MeshPhongMaterial(); // greenish blue
                branch_cube.material.color.set(
                    Math.random(),
                    Math.random(),
                    Math.random())
                // branch_cube.material.color.set(0.5, 0,0.555555)
                branch_cube.userData.branch_length = 1
                branch_cube.position.y = 0.6
                branch_cube.position.x = x_vals[1]
                
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
		renderer.render( scene, camera );
    
		// requestAnimationFrame( render );

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
