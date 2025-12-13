import copy
import math

import numpy as np
import open3d as o3d
import random
import colorsys




from dataclasses import dataclass

@dataclass
class Shape:
    mesh: o3d.cpu.pybind.geometry.TriangleMesh
    rotation: np.ndarray
    branch_length: int



# Use these if intersection is true
# x_default = 1.01
# y_default = 1.01
# z_default = 1.01


x_default = 1
y_default = 0.5
z_default = 1
#
# x_default = 0
# y_default = 1
# z_default = 0

# num_cubes = 5
total_num_cubes = 1000
# total_num_cubes = 600

desired_num_branches = 4

tree_height = total_num_cubes / desired_num_branches

theta = (np.pi * 2) / 500
# theta = np.pi / tree_height * 0.2
# theta = 0
# theta = np.pi / 4


# check_intersecting = True
check_intersecting = False

desired_branch_len = total_num_cubes / desired_num_branches

hue_increment = 0.1 / desired_branch_len



top_cubes = list()
temp_top_cubes = list()



first_cube = o3d.geometry.TriangleMesh.create_box(width=1.0, height=1.0, depth=1.0)

first_cube.translate([-0.5,-0.5,-0.5])
first_cube.paint_uniform_color(colorsys.hsv_to_rgb(0,1,1))


out_cube = copy.deepcopy(first_cube)

first_shape = Shape(first_cube,
                    first_cube.get_rotation_matrix_from_xyz([0,0,0]),
                    1)

out_cube += first_shape.mesh
top_cubes.append(first_shape)


actual_num_branches = 1

cube_limit = total_num_cubes
last_num_cubes = 0
cube_counter = 1

while cube_counter < cube_limit:
    print(cube_counter)

    # if all bracnhes die i guess
    if cube_counter == last_num_cubes:
        print("all brancehs died")
        break
    last_num_cubes = cube_counter

    temp_top_cubes = copy.deepcopy(top_cubes)
    top_cubes = list()

    for top_cube_i in range(len(temp_top_cubes)):

        top_cube = temp_top_cubes.pop()

        # end branch condition
        if top_cube.branch_length >= desired_branch_len:
            actual_num_branches -= 1
            continue

        new_cube = copy.deepcopy(top_cube)

        center = new_cube.mesh.get_center()
        direction = [center[0], 0, center[2]]
        direction_norm = direction / np.linalg.norm(direction)
        dir_perp = direction_norm @ np.linalg.inv(first_cube.get_rotation_matrix_from_xyz((0, np.pi / 2, 0)))
        rot = first_cube.get_rotation_matrix_from_axis_angle(dir_perp * theta)

        new_cube.mesh.rotate(rot)
        new_cube.rotation = new_cube.rotation @ rot


        h,s,v = colorsys.rgb_to_hsv( *new_cube.mesh.vertex_colors[0])
        new_cube.mesh.paint_uniform_color(colorsys.hsv_to_rgb((h + hue_increment) % 1,s,v))


        x = x_default
        y = y_default
        z = z_default



        place_on_x_axis = random.choice([True, False])
        if place_on_x_axis:
            x = [x_default, x_default * -1]
            random.shuffle(x)
            z = [0,0]

        else: # place on z axis
            x = [0,0]
            z = [z_default, z_default * -1]
            random.shuffle(z)


        translate_v = [x[0], y, z[0]] @ np.linalg.inv(new_cube.rotation)
        new_cube.mesh.translate(translate_v)

        if check_intersecting and new_cube.mesh.is_intersecting(out_cube) :

            actual_num_branches -= 1
            print('intersection')
            continue

        new_cube.branch_length += 1
        cube_counter += 1
        out_cube += new_cube.mesh
        top_cubes.append(new_cube)

        # branch condition
        if actual_num_branches < desired_num_branches:

            branch_cube = copy.deepcopy(top_cube)

            branch_cube_translate = [x[1], y, z[1]] @ np.linalg.inv(branch_cube.rotation)
            branch_cube.mesh.translate(branch_cube_translate)

            if check_intersecting and branch_cube.mesh.is_intersecting(out_cube) :
                actual_num_branches -= 1

                print('branch intersection')
                continue

            branch_cube.mesh.paint_uniform_color([random.random(), random.random(), random.random()])

            branch_cube.branch_length = 1

            actual_num_branches += 1
            cube_counter += 1
            out_cube += branch_cube.mesh
            top_cubes.append(branch_cube)



























print()

# print("total num cubes", len(all_cubes))
# for i in range(len(all_cubes)):
    # all_cubes[i].paint_uniform_color([1.0, 0.0, 0.0])
    # continue
    # all_cubes[i].mesh.compute_vertex_normals()

out_cube.compute_vertex_normals()

# only_meshes = list()
# for i in range(len(all_cubes)):
#     only_meshes.append(all_cubes[i].mesh)


# o3d.visualization.draw(geometry=only_meshes, show_ui=True)


# out_cube = o3d.geometry.TriangleMesh.create_box(width=1.0, height=1.0, depth=1.0)
# out_cube.paint_uniform_color([1,1,1])
# for i in range(len(all_cubes)):
#     out_cube += all_cubes[i].mesh

from pathlib import Path
# o3d.io.write_triangle_mesh(Path("out_2.gltf"), out_cube)
# o3d.io.write_triangle_mesh(Path("out."), out_cube)

o3d.visualization.draw(geometry=out_cube, show_ui=True)