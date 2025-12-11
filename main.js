"use strict";
import * as THREE from 'three';
console.log('-----------------------------------------------------')
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

import { FontLoader } from 'three/addons/loaders/FontLoader.js';

import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.21/+esm';

import SpriteText from "https://esm.sh/three-spritetext?external=three";



function main() {

    function hide_labels_fun() {
        if (material.opacity == 1) {
            material.opacity = 0.5
        } else {
            material.opacity = 1
        }
        first_cube.traverse(function (c) {


            if (c instanceof SpriteText) {
                c.visible = !c.visible


            }


        })
    }

    function params_to_string() {
        // saved_data = gui.save()
        // gui_obj.text_out = JSON.stringify(saved_data)
        // gui_obj.text_out = saved_data
        let d = JSON.parse(JSON.stringify(gui_obj))
        d.text_out = ""
        d = JSON.stringify(d)
        d = "let saved_data = JSON.parse('" + d + "')"
        gui_obj.text_out = d
    }





    const gui = new GUI({ width: 700 });
    gui.add(document, 'title');


    let gui_obj = {


        y_multiply: 2.0,
        y_multiply_fine: 0,
        y_exponent: 1.0,
        y_exponent_fine: 0,
        y_add: 0,

        z_multiply_left: 1.0,
        z_exponent_left: 1.0,
        z_add_left: 0,

        z_multiply_right: 1.0,
        z_exponent_right: 1.0,
        z_add_right: 0,

        hide_labels: hide_labels_fun,

        // get_cam_pos: function () {
        //     gui_obj.camera_pos = "camera.position.set(" + Math.round(camera.position.x) + ", " + Math.round(camera.position.y) + ", " + Math.round(camera.position.z) + ")"
        //         + "; camera.rotation.set(" + camera.rotation.x + ", " + camera.rotation.y + ", " + camera.rotation.z + ")"

        // },

        y_start: 0,
        y_start_fine: 0,
        y_end: 1,
        y_end_fine: 0,
        z_right_start: 3,
        z_right_end: 0,
        z_left_start: 3,
        z_left_end: 0,


        text_out: "unkonwn",
        save_params: params_to_string
    }




    // {"controllers":{"title":"My first three.js app","text_out":"unkonwn"},"folders":{"Y Axis Rotation":{"controllers":{"y_multiply":2,"y_exponent":1,"y_add":0},"folders":{}},"Right Z Axis Rotation":{"controllers":{"z_multiply_right":1,"z_exponent_right":1,"z_add_right":0},"folders":{}},"Left Z Axis Rotation":{"controllers":{"z_multiply_left":1,"z_exponent_left":1,"z_add_left":0},"folders":{}}}}

    const pi = Math.PI
    const y_folder = gui.addFolder('Y Axis Rotation');
    y_folder.add(gui_obj, 'y_multiply', -10, 10).listen()
    y_folder.add(gui_obj, 'y_multiply_fine', -0.5, 0.5).listen()
    y_folder.add(gui_obj, 'y_exponent', -5, 5).listen()
    y_folder.add(gui_obj, 'y_exponent_fine', -0.5, 0.5).listen()
    y_folder.add(gui_obj, 'y_add', -2 * pi, pi * 2).listen()

    const z_right = gui.addFolder('Right Z Axis Rotation');
    z_right.add(gui_obj, 'z_multiply_right', -10, 10).listen()
    z_right.add(gui_obj, 'z_exponent_right', -5, 5).listen()
    z_right.add(gui_obj, 'z_add_right', -2 * pi, pi * 2).listen()

    const z_left = gui.addFolder('Left Z Axis Rotation');
    z_left.add(gui_obj, 'z_multiply_left', -10, 10).listen()
    z_left.add(gui_obj, 'z_exponent_left', -5, 5).listen()
    z_left.add(gui_obj, 'z_add_left', -2 * pi, pi * 2).listen()

    const starts_ends = gui.addFolder('start and ends');
    starts_ends.add(gui_obj, 'y_start', 0, pi).listen()
    starts_ends.add(gui_obj, 'y_start_fine', -0.2, 0.2).listen()

    starts_ends.add(gui_obj, 'y_end', -3.2, 6.5).listen()
    starts_ends.add(gui_obj, 'y_end_fine', -0.2, 0.2).listen()

    starts_ends.add(gui_obj, 'z_right_start', 0, pi).listen()
    starts_ends.add(gui_obj, 'z_right_end', 0, pi).listen()
    starts_ends.add(gui_obj, 'z_left_start', 0, pi).listen()
    starts_ends.add(gui_obj, 'z_left_end', 0, pi).listen()


    gui.add(gui_obj, 'hide_labels').name("Toggle Labels")
    gui.add(gui_obj, 'save_params')
    gui.add(gui_obj, 'text_out').listen()

    // let saved_data = JSON.parse('{"y_multiply":1,"y_exponent":1,"y_exponent_fine":0,"y_add":0,"z_multiply_left":1,"z_exponent_left":0.99,"z_add_left":0,"z_multiply_right":1,"z_exponent_right":1,"z_add_right":0,"y_start":1.31946891450771,"y_start_fine":0,"y_end":0,"y_end_fine":0,"z_right_start":0,"z_right_end":0,"z_left_start":0,"z_left_end":0,"text_out":""}')

    // let saved_data = JSON.parse('{"y_multiply":1,"y_exponent":1,"y_add":0,"z_multiply_left":1,"z_exponent_left":0.99,"z_add_left":0,"z_multiply_right":1,"z_exponent_right":1,"z_add_right":0,"y_start":1.34146006308284,"y_end":0,"z_right_start":0.788539756051038,"z_right_end":0,"z_left_start":1.07128309487412,"z_left_end":0,"text_out":""}')

    // let saved_data = JSON.parse('{"y_multiply":2,"y_exponent":0.100000000000001,"y_add":0.213628300444106,"z_multiply_left":1,"z_exponent_left":1,"z_add_left":0,"z_multiply_right":0.52,"z_exponent_right":1,"z_add_right":0,"y_start":0,"y_end":1,"z_right_start":1.35088484104361,"z_right_end":0,"z_left_start":1.20322998632489,"z_left_end":0,"text_out":""}')
    // let saved_data = JSON.parse('{"y_multiply":0.800000000000001,"y_exponent":-2.55,"y_add":-0.640884901332317,"z_multiply_left":1.52,"z_exponent_left":1,"z_add_left":0.0628318530717964,"z_multiply_right":0.720000000000001,"z_exponent_right":0.74,"z_add_right":0.0376991118430778,"y_start":0.980176907920016,"y_end":0,"z_right_start":0.958185759344887,"z_right_end":0.512079602535136,"z_left_start":0.983318500573605,"z_left_end":0,"text_out":""}')


    // let saved_data = JSON.parse('{"y_multiply":1.36,"y_exponent":0.12,"y_add":0.175929188601029,"z_multiply_left":0.84,"z_exponent_left":1,"z_add_left":0,"z_multiply_right":0.58,"z_exponent_right":1,"z_add_right":0,"y_start":0,"y_end":3.141592653589793,"z_right_start":1.23778750551438,"z_right_end":0.245044226980004,"z_left_start":1.25349546878233,"z_left_end":0,"text_out":""}')
    // let saved_data = JSON.parse('{"y_multiply":1.32,"y_exponent":0.14,"y_add":0.213628300444106,"z_multiply_left":0.98,"z_exponent_left":1,"z_add_left":0,"z_multiply_right":0.48,"z_exponent_right":1,"z_add_right":0,"y_start":0,"y_end":3.141592653589793,"z_right_start":1.42314147207618,"z_right_end":0.245044226980004,"z_left_start":1.59278747537003,"z_left_end":0,"text_out":""}')

    // let saved_data = JSON.parse('{"y_multiply":1.28,"y_exponent":1,"y_add":-0.967610537305656,"z_multiply_left":1,"z_exponent_left":0.99,"z_add_left":0,"z_multiply_right":1,"z_exponent_right":1,"z_add_right":0,"y_start":1.0775662801813,"y_end":0,"z_right_start":0.618893752757189,"z_right_end":0,"z_left_start":1.19694680101771,"z_left_end":0,"text_out":""}')

    // let saved_data = JSON.parse('{"y_multiply":1.12,"y_exponent":5,"y_add":0,"z_multiply_left":1,"z_exponent_left":0.99,"z_add_left":0,"z_multiply_right":1,"z_exponent_right":1,"z_add_right":0,"y_start":1.53309721495182,"y_end":0,"z_right_start":0.863937979737193,"z_right_end":0,"z_left_start":1.57,"z_left_end":0,"text_out":""}')

    // let saved_data = JSON.parse('{"y_multiply":1.12,"y_exponent":5,"y_add":0,"z_multiply_left":1,"z_exponent_left":0.99,"z_add_left":0,"z_multiply_right":1,"z_exponent_right":1,"z_add_right":0,"y_start":1.53309721495182,"y_end":0,"z_right_start":0.863937979737193,"z_right_end":0,"z_left_start":1.57,"z_left_end":0,"text_out":""}')
    // let saved_data = JSON.parse('{"y_multiply":1,"y_exponent":4.97,"y_add":0,"z_multiply_left":1,"z_exponent_left":0.99,"z_add_left":0,"z_multiply_right":1,"z_exponent_right":1,"z_add_right":0,"y_start":1.57079632679,"y_end":2.6103,"z_right_start":0.876504350351552,"z_right_end":0,"z_left_start":1.57079632679,"z_left_end":0,"text_out":""}')



    // let saved_data = JSON.parse('{"y_multiply":1,"y_exponent":4.97,"y_add":0.175929188601029,"z_multiply_left":1,"z_exponent_left":0.99,"z_add_left":0,"z_multiply_right":1,"z_exponent_right":1,"z_add_right":0,"y_start":1.57079632679,"y_end":2.58,"z_right_start":1.03358398303104,"z_right_end":0,"z_left_start":1.57079632679,"z_left_end":1.03358398303104,"text_out":""}')

    // let saved_data = JSON.parse('{"y_multiply":1,"y_exponent":2.51,"y_add":0.087964594300515,"z_multiply_left":1,"z_exponent_left":1,"z_add_left":0,"z_multiply_right":1,"z_exponent_right":1,"z_add_right":0,"y_start":1.57079632679,"y_end":2.58,"z_right_start":1.57079632679,"z_right_end":0,"z_left_start":1.57079632679,"z_left_end":1.57079632679,"text_out":""}')

    // let saved_data = JSON.parse('{"y_multiply":1,"y_exponent":2.51,"y_add":0.087964594300515,"z_multiply_left":1,"z_exponent_left":1,"z_add_left":0,"z_multiply_right":1,"z_exponent_right":1,"z_add_right":0,"y_start":1.57079632679,"y_end":3.0371,"z_right_start":1.57079632679,"z_right_end":0,"z_left_start":1.57079632679,"z_left_end":1.57079632679,"text_out":""}')

    // zigzag
    // let saved_data = JSON.parse('{"y_multiply":1,"y_exponent":4.97,"y_add":0,"z_multiply_left":1,"z_exponent_left":0.99,"z_add_left":0,"z_multiply_right":1,"z_exponent_right":1,"z_add_right":0,"y_start":1.57079632679,"y_end":2.58,"z_right_start":0.876504350351552,"z_right_end":0,"z_left_start":1.57079632679,"z_left_end":0,"text_out":""}')

    // 3d zig zag
    // let saved_data = JSON.parse('{"y_multiply":1.28,"y_exponent":1,"y_add":-0.967610537305656,"z_multiply_left":1,"z_exponent_left":0.99,"z_add_left":0,"z_multiply_right":1,"z_exponent_right":1,"z_add_right":0,"y_start":1.99805292768311,"y_end":0,"z_right_start":0.502654824574367,"z_right_end":0,"z_left_start":1.54252199291259,"z_left_end":0,"text_out":""}')

    // square spiral with siz zag
    // let saved_data = JSON.parse('{"y_multiply":1,"y_exponent":4.97,"y_exponent_fine":0.011,"y_add":0,"z_multiply_left":1,"z_exponent_left":0.99,"z_add_left":0,"z_multiply_right":1.26,"z_exponent_right":1,"z_add_right":0,"y_start":1.57079632679,"y_start_fine":0,"y_end":2.58,"y_end_fine":0,"z_right_start":0.876504350351552,"z_right_end":0,"z_left_start":1.57079632679,"z_left_end":1.57079632679,"text_out":""}')

    // let saved_data = JSON.parse('{"y_multiply":1,"y_exponent":4.97,"y_exponent_fine":0.011,"y_add":0,"z_multiply_left":1,"z_exponent_left":0.99,"z_add_left":0,"z_multiply_right":1.26,"z_exponent_right":1,"z_add_right":0,"y_start":1.57079632679,"y_start_fine":-0.004,"y_end":2.58,"y_end_fine":0.251,"z_right_start":0.876504350351552,"z_right_end":0,"z_left_start":1.57079632679,"z_left_end":1.57079632679,"text_out":""}')
    // let saved_data = JSON.parse('{"y_multiply":1,"y_multiply_fine":0,"y_exponent":4.97,"y_exponent_fine":0,"y_add":0,"z_multiply_left":1,"z_exponent_left":0.99,"z_add_left":0,"z_multiply_right":1.26,"z_exponent_right":1,"z_add_right":0,"y_start":1.57079632679,"y_start_fine":-0.00359999999999999,"y_end":2.58,"y_end_fine":0.00839999999999999,"z_right_start":0.876504350351552,"z_right_end":0,"z_left_start":1.57079632679,"z_left_end":1.57079632679,"text_out":""}')
    // let saved_data = JSON.parse('{"y_multiply":1,"y_multiply_fine":0,"y_exponent":4.97,"y_exponent_fine":0.011,"y_add":0,"z_multiply_left":1,"z_exponent_left":0.99,"z_add_left":0,"z_multiply_right":1.26,"z_exponent_right":1,"z_add_right":0,"y_start":1.57079632679,"y_start_fine":-0.004,"y_end":2.6103,"y_end_fine":-0.028,"z_right_start":0.876504350351552,"z_right_end":0,"z_left_start":1.57079632679,"z_left_end":1.57079632679,"text_out":""}')
// let saved_data = JSON.parse('{"y_multiply":1,"y_multiply_fine":0,"y_exponent":4.97,"y_exponent_fine":0.011,"y_add":0,"z_multiply_left":1,"z_exponent_left":1,"z_add_left":0,"z_multiply_right":1,"z_exponent_right":1,"z_add_right":0,"y_start":1.57079632679,"y_start_fine":0,"y_end":1.9216,"y_end_fine":0.1268,"z_right_start":0.876504350351552,"z_right_end":0,"z_left_start":1.57079632679,"z_left_end":1.57079632679,"text_out":""}')
// let saved_data = JSON.parse('{"y_multiply":1,"y_multiply_fine":0,"y_exponent":4.97,"y_exponent_fine":0.011,"y_add":0,"z_multiply_left":1,"z_exponent_left":1,"z_add_left":0,"z_multiply_right":1,"z_exponent_right":1,"z_add_right":0,"y_start":1.57079632679,"y_start_fine":0,"y_end":2.5618,"y_end_fine":0.02,"z_right_start":0.876504350351552,"z_right_end":0,"z_left_start":1.57079632679,"z_left_end":1.57079632679,"text_out":""}')
// let saved_data = JSON.parse('{"y_multiply":1,"y_multiply_fine":0,"y_exponent":4.97,"y_exponent_fine":-0.003,"y_add":0,"z_multiply_left":1,"z_exponent_left":1,"z_add_left":0,"z_multiply_right":1.08,"z_exponent_right":1,"z_add_right":0,"y_start":1.57079632679,"y_start_fine":0,"y_end":2.5618,"y_end_fine":0.0272,"z_right_start":0.876504350351552,"z_right_end":0,"z_left_start":1.57079632679,"z_left_end":1.57079632679,"text_out":""}')
// let saved_data = JSON.parse('{"y_multiply":1,"y_multiply_fine":0,"y_exponent":4.97,"y_exponent_fine":0,"y_add":0,"z_multiply_left":1,"z_exponent_left":1,"z_add_left":0,"z_multiply_right":1.08,"z_exponent_right":1,"z_add_right":0,"y_start":1.57079632679,"y_start_fine":0,"y_end":2.5618,"y_end_fine":0.0244,"z_right_start":0.876504350351552,"z_right_end":0,"z_left_start":1.57079632679,"z_left_end":1.57079632679,"text_out":""}')

// let saved_data = JSON.parse('{"y_multiply":1,"y_multiply_fine":0,"y_exponent":4.97,"y_exponent_fine":-0.003,"y_add":0,"z_multiply_left":1,"z_exponent_left":1,"z_add_left":0,"z_multiply_right":1.22,"z_exponent_right":0.87,"z_add_right":0,"y_start":1.57079632679,"y_start_fine":0,"y_end":4.0362,"y_end_fine":0.0976,"z_right_start":0.813672497279756,"z_right_end":0,"z_left_start":1.57079632679,"z_left_end":1.57079632679,"text_out":""}')
    // let saved_data = JSON.parse('{"y_multiply":1,"y_multiply_fine":0,"y_exponent":4.97,"y_exponent_fine":0,"y_add":0,"z_multiply_left":1,"z_exponent_left":1,"z_add_left":0,"z_multiply_right":1,"z_exponent_right":1,"z_add_right":0,"y_start":1.57707951210208,"y_start_fine":-0.00700000000000001,"y_end":2.58,"y_end_fine":0.251,"z_right_start":0.876504350351552,"z_right_end":0,"z_left_start":1.57079632679,"z_left_end":1.57079632679,"text_out":""}')


    let saved_data = JSON.parse('{"y_multiply":1,"y_multiply_fine":0,"y_exponent":4.97,"y_exponent_fine":0,"y_add":0,"z_multiply_left":1,"z_exponent_left":1,"z_add_left":0,"z_multiply_right":1.08,"z_exponent_right":1,"z_add_right":0,"y_start":1.57079632679,"y_start_fine":0,"y_end":2.5618,"y_end_fine":0.02459,"z_right_start":1,"z_right_end":0,"z_left_start":1.57079632679,"z_left_end":1.57079632679,"text_out":""}')


    for (let key of Object.keys(saved_data)) {
        gui_obj[key] = saved_data[key]
    }




    function on_change_function() {


        first_cube.traverse(function (a) {
            if (a instanceof THREE.Group) {

                // let s = THREE.MathUtils.mapLinear(a.userData.i, 0, a.userData.layer_length, Math.PI / 3, 0)
                // let s = THREE.MathUtils.mapLinear(a.userData.i, 0, a.userData.layer_length, gui_obj.y_start, Math.PI / gui_obj.y_end)
                let s = THREE.MathUtils.mapLinear(
                    a.userData.i,
                    0,
                    a.userData.layer_length,
                    gui_obj.y_start + gui_obj.y_start_fine,
                    gui_obj.y_end + gui_obj.y_end_fine
                )

                a.rotation.y = (s ** (gui_obj.y_exponent + gui_obj.y_exponent_fine)) * (gui_obj.y_multiply + gui_obj.y_multiply_fine) + gui_obj.y_add

            }
            if (a.userData.is_cube) {
                if (a.userData.is_right_cube) {
                    // let s = THREE.MathUtils.mapLinear(a.userData.i, 0, a.userData.layer_length, Math.PI / 3, 0)
                    // let s = THREE.MathUtils.mapLinear(a.userData.i, 0, a.userData.layer_length, 0, Math.PI / 3)
                    let s = THREE.MathUtils.mapLinear(a.userData.i, 0, a.userData.layer_length, gui_obj.z_right_start, gui_obj.z_right_end)


                    a.rotation.z = (s ** gui_obj.z_exponent_right) * gui_obj.z_multiply_right + gui_obj.z_add_right
                } else {

                    // let s = THREE.MathUtils.mapLinear(a.userData.i, 0, a.userData.layer_length, Math.PI / 3, 0)                    
                    // let s = THREE.MathUtils.mapLinear(a.userData.i, 0, a.userData.layer_length, 0, Math.PI / 3)
                    let s = THREE.MathUtils.mapLinear(a.userData.i, 0, a.userData.layer_length, gui_obj.z_left_start, gui_obj.z_left_end)
                    a.rotation.z = (s ** gui_obj.z_exponent_left) * gui_obj.z_multiply_left + gui_obj.z_add_left
                }


            }
        })

    }
    gui.onChange(on_change_function)


    function calc_labels() {
        first_cube.traverse(function (c) {
            if (c instanceof SpriteText) {

                if (c.is_z_rot_label_right) {
                    let r = THREE.MathUtils.radToDeg(c.parent.children[0].rotation.z)
                    r = Math.round(r)
                    c.text = r.toString()
                }
                if (c.is_z_rot_label_left) {
                    let r = THREE.MathUtils.radToDeg(c.parent.children[1].rotation.z)
                    r = Math.round(r)
                    c.text = r.toString()
                }
                if (c.is_y_rot_label) {
                    let r = THREE.MathUtils.radToDeg(c.parent.rotation.y)
                    r = Math.round(r)
                    c.text = r.toString()
                }

                if (c.text === "3"){
                    // console.log("hdhdhf")
                    c.textHeight = 5
                }


            }
        })
    }

    gui.onFinishChange(calc_labels)



    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer(
        {
            canvas: document.querySelector("canvas"),
            antialias: true,

        });


    renderer.setClearColor(new THREE.Color(1, 1, 1))


    let w = 1080 + 650
    let h = 1920 - 100
    // let scale = 0.5
    // renderer.setSize(w * scale, h * scale, true)

    const fov = 50;
    const aspect = w / h; // the canvas default
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

    let cam_s = 2
    // camera.position.z = 30 * cam_s
    // camera.position.y = 20* cam_s
    // camera.position.x = -50 * cam_s

    camera.position.z = 80
    camera.position.y = 40
    camera.position.x = 30




    const controls = new OrbitControls(camera, renderer.domElement);
    // controls.target = new THREE.Vector3(camera.position.x / -2, camera.position.y / 2, 0)
    controls.target = new THREE.Vector3(camera.position.x, camera.position.y / 2, 0)

    const scene = new THREE.Scene();

    {
        let color = 0xFFFFFF;
        let intensity = 3;
        let light = new THREE.DirectionalLight(color, intensity);
        light.position.set(- 1, 2, 4);
        scene.add(light);

        color = 0xFFFFFF;
        intensity = 0.2;
        let a_light = new THREE.AmbientLight(color, intensity)

        scene.add(a_light);
    }

    const axesHelper = new THREE.AxesHelper(15);
    scene.add(axesHelper)

    let box_size_x = 1.6
    let box_size_y = 6;
    let box_size_z = 1.6

    const geometry = new THREE.BoxGeometry(box_size_x, box_size_y, box_size_z);
    const material = new THREE.MeshStandardMaterial(); // greenish blue
    material.color.set(0.5, 0.5, 1)
    material.transparent = true
    material.opacity = 0.5


    let first_cube = new THREE.Mesh(geometry, material);

    first_cube.geometry.translate(box_size_x / 2, box_size_y / 2, 0)


    const total_num_cubes = 2 ** 6

    let top_cubes = [first_cube]
    let cube_counter = 0


    // let layer_counter = 0
    // first_cube.userData.layer = layer_counter
    // layer_counter++

    scene.userData.tube_length = 10

    first_cube.userData.cube_counter_i = 0
    
    cube_counter++

    let prev_box_size_y = 6

    let tube_lengths = [
        8,
        7,
        6,
        5,
        4,
        3,
    ]

    //  tube_lengths = [
    //     6,
    //     6,
    //     6,
    //     6,
    //     6,
    //     6,
    // ]

    // tube_lengths = [
    //     5,
    //     5,
    //     5,
    //     5,
    //     5,
    //     5,
    // ]
    let layer_counter = 0

    let tube_weight_per_cm = 2.17

    // 24 grams for branch piece. (26 for 90 degrees, 20 for 0)
    // lets say 6 grams at 90 degress, 0g at 0 degrees

    let branch_weight_min = 20
    let branch_weight_angle_max = 6

    while (cube_counter < total_num_cubes) {

        let temp_top_cubes = top_cubes
        top_cubes = []

        for (let i = 0; i < temp_top_cubes.length; i++) {

            let top_cube = temp_top_cubes[i]


            let g = new THREE.Group()

            // let branch_piece_g = new THREE.BoxGeometry(4,box_size_x * 2,box_size_z)
            // let branch_piece = new THREE.Mesh(branch_piece_g, material)
            // branch_piece.position.y = box_size_y + 0.8
            // g.add(branch_piece)

            // let s
            // s = THREE.MathUtils.mapLinear(i, 0, temp_top_cubes.length, Math.PI / 2.8, 0)
            // s = THREE.MathUtils.mapLinear(i, 0, temp_top_cubes.length, Math.PI / 3, 0)

            if (cube_counter == 3) {
                // box_size_y = 3
                // console.log('here')
            }

            box_size_y = tube_lengths[layer_counter]

            for (let b = 0; b < 2; b++) {
                let geo = new THREE.BoxGeometry(box_size_x, box_size_y, box_size_z)

                let cube_new = new THREE.Mesh(geo, material)
                cube_new.userData.i = i
                cube_new.userData.layer_length = temp_top_cubes.length
                cube_new.userData.tube_length = box_size_y
                cube_new.userData.is_cube = true
                cube_new.userData.weight = tube_weight_per_cm * box_size_y


                if (b == 1) {
                    cube_new.userData.is_right_cube = true
                }

                cube_new.userData.cube_counter_i = cube_counter

                cube_new.position.y = prev_box_size_y + box_size_x /// 2

                // cube_new.geometry.translate(box_size_x / 2 - 0.8, box_size_y / 2, 0)
                // cube_new.geometry.translate((box_size_x / 1), box_size_y / 2, 0)
                cube_new.geometry.translate(box_size_x/2, box_size_y / 2, 0)
                // cube_new.geometry.translate(box_size_x, box_size_y / 2, 0)

                if (b == 0) {
                    cube_new.position.x = box_size_x * -1
                } else {
                    cube_new.position.x = box_size_x
                    cube_new.rotation.y = pi
                }

                let branch_piece_g = new THREE.BoxGeometry(4, box_size_x * 2, box_size_z)
                let branch_piece = new THREE.Mesh(branch_piece_g, material)
                branch_piece.position.y = box_size_y + 2.5

                g.add(branch_piece)

                // cube_new.rotation.z = s
                // cube_new.userData.z_rot = cube_new.rotation.z


                let coord = new THREE.AxesHelper(15);
                // cube_new.add(coord)

                top_cubes.push(cube_new)

                g.add(cube_new)

                cube_counter++
            }

            // let c = new THREE.AxesHelper(15)
            // c.position.y = box_size_y
            // g.add(c)

            g.position.x = box_size_x / 2
            // g.rotation.y = (pi / 3 - s) + pi / 10


            g.userData.y_rot = g.rotation.y

            g.userData.i = i
            g.userData.layer_length = temp_top_cubes.length

            g.userData.weight = branch_weight_min + ((g.children[0].rotation.z / 90) * branch_weight_angle_max)

            top_cube.add(g)
        }

        layer_counter++
        prev_box_size_y = box_size_y
    }

    scene.add(first_cube)


    let trunk_length = 8
    let geo = new THREE.BoxGeometry(box_size_x, box_size_y, box_size_z)
    let trunk_cube = new THREE.Mesh(geo, material)
    for (let i = 0; i < trunk_length; i++) {
        let geo = new THREE.BoxGeometry(box_size_x, box_size_y, box_size_z)
        geo.translate(0, box_size_y * -1 * i, 0)
        let cube_new = new THREE.Mesh(geo, material)

        trunk_cube.add(cube_new)
    }
    trunk_cube.position.y = 30
    trunk_cube.position.x = box_size_x / 2
    // scene.add(trunk_cube)


    let ruler_z_length = 13
    let ruler_x_length = 11

    box_size_y = 6
    let ruler_x_geo = new THREE.BoxGeometry(box_size_x, box_size_y * ruler_z_length, box_size_z)
    let ruler_x = new THREE.Mesh(ruler_x_geo, material)


    ruler_x.position.y = 20
    ruler_x.rotation.z = pi / 2
    ruler_x.rotation.y = pi / 2


    let ruler_y_geo = new THREE.BoxGeometry(box_size_x, box_size_y * ruler_x_length, box_size_z)
    let ruler_y = new THREE.Mesh(ruler_y_geo, material)

    ruler_y.position.y = 20
    ruler_y.rotation.z = pi / 2
    // ruler_x.rotation.y = pi/2

    // scene.add(ruler_x)
    // scene.add(ruler_y)




    // first_cube.traverse(function (a) {
    //     if (a instanceof THREE.Group) {
    //         // a.userData.left = a.children[0].userData.layer
    //         // a.userData.right = a.children[1].userData.layer
    //         // a.userData.center = a.parent.userData.layer

    //         a.userData.left = a.children[0].userData.cube_counter_i
    //         a.userData.right = a.children[1].userData.cube_counter_i
    //         a.userData.center = a.parent.userData.cube_counter_i
    //     }
    // })

    // let instructions = []

    // first_cube.traverse(function (a) {
    //     if (a instanceof THREE.Group) {
    //         instructions.push({
    //             left_label: a.children[0].userData.cube_counter_i,
    //             right_label: a.children[1].userData.cube_counter_i,
    //             center_label: a.parent.userData.cube_counter_i,
    //             right_angle: a.children[0].rotation.z,
    //             left_angle: a.children[1].rotation.z,
    //             // top_length:
    //             // bottom_length:

    //         })
    //     }
    // })
    // console.log(instructions)


    first_cube.traverse(function (a) {
        if (a instanceof THREE.Group) {

            let offest = 2
            let text_height = 0.5

            let t_left = new SpriteText(a.children[0].userData.cube_counter_i, 10);

            t_left.color = "black"
            t_left.textHeight = text_height
            t_left.position.set(offest * -1, box_size_y + offest, 0)
            t_left.renderOrder = -1
            t_left.depthTest = false
            a.add(t_left)

            // let t_right = new SpriteText(a.userData.right, 10);
            let t_right = new SpriteText(a.children[1].userData.cube_counter_i, 10);
            
            t_right.color = "black"
            t_right.textHeight = text_height
            t_right.position.set(offest, box_size_y + offest, 0)
            t_right.renderOrder = -1
            t_right.depthTest = false
            a.add(t_right)

            // let t_center = new SpriteText(a.userData.center, 10);
            let t_center = new SpriteText(a.parent.userData.cube_counter_i, 10);
            t_center.color = "black"
            t_center.textHeight = text_height
            t_center.renderOrder = -1
            t_center.depthTest = false
            t_center.position.set(0, box_size_y - offest, 0)
            a.add(t_center)

            // let y_rot_degrees = THREE.MathUtils.radToDeg(a.userData.y_rot)
            let y_rot_degrees = THREE.MathUtils.radToDeg(a.rotation.y)

            y_rot_degrees = Math.round(y_rot_degrees * 10) / 10
            let t_y_rot = new SpriteText(y_rot_degrees, 10);
            t_y_rot.is_y_rot_label = true
            t_y_rot.color = "black"
            t_y_rot.textHeight = text_height
            t_y_rot.renderOrder = -1
            t_y_rot.depthTest = false
            t_y_rot.position.set(0, box_size_y - 0.5, 0)
            a.add(t_y_rot)


            // let z_rot_degrees = THREE.MathUtils.radToDeg(a.children[0].rotation.z)
            // z_rot_degrees = Math.round(z_rot_degrees * 10) / 10
            // let t_z_rot = new SpriteText(z_rot_degrees, 10);
            // t_z_rot.is_z_rot_label = true
            // t_z_rot.color = "black"
            // t_z_rot.textHeight = text_height
            // t_z_rot.renderOrder = -1
            // t_z_rot.depthTest = false
            // t_z_rot.position.set(offest/2, box_size_y + 0.5,0)
            // a.add(t_z_rot)

            let z_rot_degrees_right = THREE.MathUtils.radToDeg(a.children[0].rotation.z)
            z_rot_degrees_right = Math.round(z_rot_degrees_right * 10) / 10
            let t_z_rot_right = new SpriteText(z_rot_degrees_right, 10);
            t_z_rot_right.is_z_rot_label_right = true
            t_z_rot_right.color = "black"
            t_z_rot_right.textHeight = text_height
            t_z_rot_right.renderOrder = -1
            t_z_rot_right.depthTest = false
            t_z_rot_right.position.set(offest / -2, box_size_y + 0.5, 0)
            a.add(t_z_rot_right)

            let z_rot_degrees_left = THREE.MathUtils.radToDeg(a.children[0].rotation.z)
            z_rot_degrees_left = Math.round(z_rot_degrees_left * 10) / 10
            let t_z_rot_left = new SpriteText(z_rot_degrees_left, 10);
            t_z_rot_left.is_z_rot_label_left = true
            t_z_rot_left.color = "black"
            t_z_rot_left.textHeight = text_height
            t_z_rot_left.renderOrder = -1
            t_z_rot_left.depthTest = false
            t_z_rot_left.position.set(offest / 2, box_size_y + 0.5, 0)
            a.add(t_z_rot_left)



            // instructions.push({
            //     left_label: a.userData.left,
            //     right_label: a.userData.right,
            //     center_label: a.userData.center,
            //     right_angle: a.children[0].userData.z_rot,
            //     left_angle: a.children[1].userData.z_rot,
            //     // top_length:
            //     // bottom_length:

            // })
        }
    })

    // a.userData.left = a.children[0].userData.cube_counter_i
    //         a.userData.right = a.children[1].userData.cube_counter_i
    //         a.userData.center = a.parent.userData.cube_counter_i

    




    resizeCanvasToDisplaySize();

    on_change_function()
    calc_labels()
    hide_labels_fun()



     let instructions = []

    first_cube.traverse(function (a) {
        if (a instanceof THREE.Group) {
            let temp_top_length = 0 
            if (a.children[0].userData.tube_length == 3){
                temp_top_length = 4
            }else{
                temp_top_length = a.children[0].userData.tube_length
            }

            instructions.push({
                left_label: a.children[1].userData.cube_counter_i,
                right_label: a.children[0].userData.cube_counter_i,
                center_label: a.parent.userData.cube_counter_i,
                right_angle: a.children[0].rotation.z,
                left_angle: a.children[1].rotation.z,
                top_length: temp_top_length,
                bottom_length:a.parent.userData.tube_length,

            })
        }
    })
    console.log(instructions)
    // console.log(first_cube.parent.userData.tube_length)




    function getCenterPoint(mesh) {
        var geometry = mesh.geometry;
        geometry.computeBoundingBox();
        var center = new THREE.Vector3();
        geometry.boundingBox.getCenter(center);
        mesh.localToWorld(center);
        return center;
    }


    let center_sphere_g = new THREE.SphereGeometry(2)
    let center_sphere = new THREE.Mesh(center_sphere_g, material)
    scene.add(center_sphere)



    // gui_obj.z_multiply = 0.5
    // gui_obj.y_add = 0.716283125018474

    let red_material = new THREE.MeshStandardMaterial();
    red_material.color.set(1, 0, 0)



    // 13 grams for 6 cm tube
    // 2.1666666667 per cm tube

    // 24 grams for branch piece. (26 for 90 degrees, 20 for 0)
    // lets say 6 grams at 90 degress, 0g at 0 degrees

    // let small_cube_size = 3
    // let g_small_cube = new THREE.BoxGeometry(small_cube_size, small_cube_size, small_cube_size)
    // let small_cube = new THREE.Mesh(g_small_cube, material)

    // small_cube.position.x = 0

    // // scene.add(small_cube)

    // let big_cube_size = 4

    // let g_big_cube = new THREE.BoxGeometry(big_cube_size, big_cube_size, big_cube_size)
    // let big_cube = new THREE.Mesh(g_big_cube, material)

    // big_cube.position.x = 10

    // // scene.add(big_cube)

    // let cog_x = (
    //     small_cube.position.x 
    //     * small_cube_size**3 
    //     +
    //     big_cube.position.x 
    //     * big_cube_size**3) / (small_cube_size**3 + big_cube_size**3)

    // let cog_y = (
    //     small_cube.position.y 
    //     * small_cube_size**3 
    //     +
    //     big_cube.position.y 
    //     * big_cube_size**3) / (small_cube_size**3 + big_cube_size**3)

    // let cog_z = (
    //     small_cube.position.z 
    //     * small_cube_size**3 
    //     +
    //     big_cube.position.z 
    //     * big_cube_size**3) / (small_cube_size**3 + big_cube_size**3)


    let total_weight = 0
    let x_pos_mass = 0
    let y_pos_mass = 0
    let z_pos_mass = 0

    first_cube.traverse(function (c) {
        // if (c instanceof THREE.Group){
        // var t = new THREE.Vector3()
        // c.getWorldPosition(t)
        // console.log(t)
        // }
        if (c.userData.is_cube) {
            total_weight += c.userData.weight

            x_pos_mass += c.userData.weight * getCenterPoint(c).x
            y_pos_mass += c.userData.weight * getCenterPoint(c).y
            z_pos_mass += c.userData.weight * getCenterPoint(c).z


        } else if (c instanceof THREE.Group) {
            total_weight += c.userData.weight
            var t = new THREE.Vector3()
            c.getWorldPosition(t)
            x_pos_mass += c.userData.weight * t.x
            y_pos_mass += c.userData.weight * t.y
            z_pos_mass += c.userData.weight * t.z
            // console.log(c.weight)

        }
    })

    x_pos_mass = x_pos_mass / total_weight
    y_pos_mass = y_pos_mass / total_weight
    z_pos_mass = z_pos_mass / total_weight







    let cog_sphere_g = new THREE.SphereGeometry(2)
    let cog_sphere = new THREE.Mesh(cog_sphere_g, red_material)
    // cog_sphere.position.set(cog_x, cog_y, cog_z)
    cog_sphere.position.set(x_pos_mass, y_pos_mass, z_pos_mass)
    scene.add(cog_sphere)
    // gui_obj.camera_pos = JSON.stringify(cog_sphere.position)

    // console.log(camera.quaternion)




    function render(time) {

        time *= 0.001; // convert time to seconds


        controls.update(time);

        var target = new THREE.Vector3();

        let centers = []
        first_cube.traverse(function (a) {

            if (a.userData.is_cube) {
                if (a.rotation.z < 0 || a.rotation.z > pi / 2) {
                    a.material = red_material
                } else {
                    a.material = material
                }


                a.getWorldPosition(target)
                centers.push(getCenterPoint(a))
            }
        })

        var total = new THREE.Vector3(0, 0, 0);
        // console.log(total.x)
        for (let i = 0; i < centers.length; i++) {
            total.x += centers[i].x
            total.y += centers[i].y
            total.z += centers[i].z

        }
        total.x = total.x / centers.length
        total.y = total.y / centers.length
        total.z = total.z / centers.length
        // console.log(total)

        center_sphere.position.copy(total)




        let total_weight = 0
        let x_pos_mass = 0
        let y_pos_mass = 0
        let z_pos_mass = 0

        first_cube.traverse(function (c) {
            // if (c instanceof THREE.Group){
            // var t = new THREE.Vector3()
            // c.getWorldPosition(t)
            // console.log(t)
            // }
            if (c.userData.is_cube) {
                total_weight += c.userData.weight

                x_pos_mass += c.userData.weight * getCenterPoint(c).x
                y_pos_mass += c.userData.weight * getCenterPoint(c).y
                z_pos_mass += c.userData.weight * getCenterPoint(c).z


            } else if (c instanceof THREE.Group) {
                total_weight += c.userData.weight
                var t = new THREE.Vector3()
                c.getWorldPosition(t)
                x_pos_mass += c.userData.weight * t.x
                y_pos_mass += c.userData.weight * t.y
                z_pos_mass += c.userData.weight * t.z
                // console.log(c.weight)

            }
        })

        x_pos_mass = x_pos_mass / total_weight
        y_pos_mass = y_pos_mass / total_weight
        z_pos_mass = z_pos_mass / total_weight

        cog_sphere.position.set(x_pos_mass, y_pos_mass, z_pos_mass)


        renderer.render(scene, camera);
        requestAnimationFrame(render);

    }

    requestAnimationFrame(render);




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
