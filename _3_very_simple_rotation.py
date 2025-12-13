import copy
import numpy as np
import open3d as o3d
import random
import colorsys

from dataclasses import dataclass

# A class for holding an employees content
import open3d.geometry




x_default = 0
y_default = 0.5
z_default = 0

# num_cubes =1000
num_cubes =1000
desired_num_branches =4


branch_len = 50


# Create a cube (box)
# You can specify the size using width, height, and depth parameters.
# By default, it creates a unit cube (1x1x1) centered at the origin.
cubes = list()
all_cubes = list()
top_cubes = list()
temp_top_cubes = list()


pi = np.pi
theta = pi/20
local_translate = [0, 1, 0]



cube_1 = o3d.geometry.TriangleMesh.create_box(width=1.0, height=1.0, depth=1.0)
cube_1.paint_uniform_color(colorsys.hsv_to_rgb(0.75, 0.25, 0.5))

cube_1_rotation = cube_1.get_rotation_matrix_from_xyz((theta, theta, theta))

cube_1.rotate(cube_1_rotation)
all_cubes.append(cube_1)


cube_2 = copy.deepcopy(cube_1)

cube_2_translate = local_translate @ np.linalg.inv(cube_1_rotation)
cube_2.translate(cube_2_translate)

cube_2.rotate(cube_1_rotation)

all_cubes.append(cube_2)


cube_3 = copy.deepcopy(cube_2)
cube_3_translate = local_translate @ np.linalg.inv(cube_1_rotation) @ np.linalg.inv(cube_1_rotation)
cube_3.translate(cube_3_translate)
cube_3.rotate(cube_1_rotation)
all_cubes.append(cube_3)





for i in range(len(all_cubes)):
    all_cubes[i].compute_vertex_normals()

o3d.visualization.draw(geometry=all_cubes, show_ui=True, )
exit()







# c = o3d.geometry.TriangleMesh.create_box(width=1.0, height=1.0, depth=1.0)
# for i in range(10):
#
#     top_cubes.append(copy.deepcopy(c).translate((i*0.5, i*0.5, i*0.5)))
actual_num_branches = 1
branch_counter = 0
cube_limit = num_cubes
last_num_cubes = 0
while len(all_cubes) < cube_limit:

    if len(all_cubes) == last_num_cubes:
        break
    last_num_cubes = len(all_cubes)

    temp_top_cubes = copy.deepcopy(top_cubes)
    top_cubes = list()



    for top_cube_i in range(len(temp_top_cubes)):




        desired_num_branches = desired_num_branches
        branch_len = branch_len


        modif = 10
        modif = 1/ modif

        modif = desired_num_branches * (1 / branch_len)


        # end_branch_prob = np.interp(actual_num_branches - num_branches, [num_branches, num_branches*modif ], [0,1])
        end_branch_prob = np.interp(actual_num_branches, [desired_num_branches - modif, desired_num_branches * 2], [0, 1])
        # print("end_pro", end_branch_prob)

        # branch_prob = np.interp(num_branches - actual_num_branches, [num_branches/modif, num_branches], [0,1])
        branch_prob = np.interp(actual_num_branches, [1, desired_num_branches + modif], [1, 0])
        print("actual", actual_num_branches)
        print("desired", desired_num_branches)
        print("start_prob", branch_prob)
        print("end prob",end_branch_prob)
        print()

        # end_branch_prob = 0.02
        # branch_prob= 0.02



        top_cube = temp_top_cubes.pop()

        if random.random()< end_branch_prob:
            actual_num_branches -= 1
            continue



        new_cube = copy.deepcopy(top_cube)
        # print('jj')
        # print(new_cube.vertex_colors[0])
        h,s,v = colorsys.rgb_to_hsv( *new_cube.vertex_colors[0])
        hue_increment = 0.4 / branch_len
        new_cube.paint_uniform_color(colorsys.hsv_to_rgb((h + hue_increment) % 1,s,v))
        x = x_default
        # y = 0.5
        # y = random.random()*0.5
        y = y_default
        z = z_default






        # only_x_axis = random.choice([True, False])
        only_x_axis = True
        if only_x_axis:
            x = [1, -1]
            random.shuffle(x)

            new_cube.translate((x[0], y, z))
            all_cubes.append(new_cube)
            top_cubes.append(new_cube)

            # Branch True



            if random.random() < branch_prob:
                actual_num_branches += 1
                branch_counter += 1

                branch_cube = copy.deepcopy(top_cube)
                branch_cube.paint_uniform_color([1,0,0])
                branch_cube.translate((x[1], y, 1))
                all_cubes.append(branch_cube)
                top_cubes.append(branch_cube)


        else:
            z = [1, -1]
            random.shuffle(z)

            new_cube.translate((x, y, z[0]))
            all_cubes.append(new_cube)
            top_cubes.append(new_cube)

            # Branch True

            if random.random() < branch_prob:
                actual_num_branches += 1
                branch_counter += 1

                branch_cube = copy.deepcopy(top_cube)
                branch_cube.paint_uniform_color([1, 0, 0])
                branch_cube.translate((x, y, z[1]))
                all_cubes.append(branch_cube)
                top_cubes.append(branch_cube)




# Optional: Color the cube (e.g., red)
print()
print("total num cubes", len(all_cubes))
for i in range(len(all_cubes)):
    # all_cubes[i].paint_uniform_color([1.0, 0.0, 0.0])
    # continue
    all_cubes[i].compute_vertex_normals()




# Optional: Translate the cube
# cube.translate([0.5, 0.5, 0.5]) # Moves the cube by the specified vector
print('he')
# Visualize the cube
# o3d.visualization.draw_geometries(cubes,show_ui=True)
# for i in range(len(all_cubes)):
#     first_cube += all_cubes[i]

# first_cube.compute_vertex_normals()
# first_cube = first_cube.filter_smooth_simple(number_of_iterations=1)
# first_cube = first_cube.simplify_quadric_decimation(target_number_of_triangles=100)
# print(first_cube)
# voxel_size = max(first_cube.get_max_bound() - first_cube.get_min_bound()) / 32
# print(f'voxel_size = {voxel_size:e}')
# first_cube = first_cube.simplify_vertex_clustering(
#     voxel_size=voxel_size,
#     contraction=o3d.geometry.SimplificationContraction.Average)
# print(first_cube)
o3d.visualization.draw(geometry=all_cubes, show_ui=True)

