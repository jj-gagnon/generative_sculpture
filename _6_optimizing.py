import copy
import numpy as np
import open3d as o3d
import random
import colorsys




from dataclasses import dataclass

@dataclass
class Shape:
    mesh: o3d.cpu.pybind.geometry.TriangleMesh
    rotation: np.ndarray

# a = np.zeros((3,3,3))
# print(type(a))
# exit()

x_default = 0
y_default = 0.5
z_default = 0

num_cubes =100
# num_cubes = 1000
desired_num_branches = 20
tree_height = num_cubes / desired_num_branches

theta = np.pi / tree_height * 3

branch_len = 1000


# Create a cube (box)
# You can specify the size using width, height, and depth parameters.
# By default, it creates a unit cube (1x1x1) centered at the origin.
cubes = list()
all_cubes = list()
top_cubes = list()
temp_top_cubes = list()

def basic_rotate_away_from_origin():

        cubes = list()
        first_cube = o3d.geometry.TriangleMesh.create_box(width=1.0, height=1.0, depth=1.0)
        first_cube.paint_uniform_color(colorsys.hsv_to_rgb(0,1,1))
        first_cube.compute_vertex_normals()

        cf = first_cube.create_coordinate_frame()
        cubes.append(cf)

        # first_cube.translate([1,0,-0.5])
        # first_cube.translate([1,0,1])
        # first_cube.translate([1,0,0])
        first_cube.translate([-0.5,-0.5,-0.5])

        print(first_cube.get_center())
        center = first_cube.get_center()
        direction = [center[0], 0, center[2]]
        print(direction)
        direction_norm = direction / np.linalg.norm(direction)
        print(direction_norm)

        dir_perp = direction_norm @ np.linalg.inv(first_cube.get_rotation_matrix_from_xyz([0, np.pi / 2, 0]))
        # dir_perp = direction_norm @ first_cube.get_rotation_matrix_from_xyz([0, np.pi / 4, 0])

        print()
        print(dir_perp)
        print(np.linalg.norm(dir_perp))
        theta = np.pi / 16
        # theta = np.pi

        rot = first_cube.get_rotation_matrix_from_axis_angle(dir_perp * theta)

        # v = np.array([1,1,1])
        # v = v / np.linalg.norm(v)
        # amp = 1
        # rot = first_cube.get_rotation_matrix_from_axis_angle([0,0,-0.2])
        first_cube.rotate(rot)

        cubes.append(first_cube)
        o3d.visualization.draw(geometry=cubes, show_ui=True)

        return

# basic_rotate_away_from_origin()
# exit()


first_cube = o3d.geometry.TriangleMesh.create_box(width=1.0, height=1.0, depth=1.0)
first_cube.translate([-0.5,-0.5,-0.5])
first_cube.paint_uniform_color(colorsys.hsv_to_rgb(0,1,1))
first_cube.compute_vertex_normals()


all_cubes.append(Shape(first_cube, first_cube.get_rotation_matrix_from_xyz([0,0,0])))
top_cubes.append(Shape(first_cube, first_cube.get_rotation_matrix_from_xyz([0,0,0])))

# c = o3d.geometry.TriangleMesh.create_box(width=1.0, height=1.0, depth=1.0)
# for i in range(10):
#
#     top_cubes.append(copy.deepcopy(c).translate((i*0.5, i*0.5, i*0.5)))

# theta = np.pi / num_cubes
# global_rotation = first_cube.get_rotation_matrix_from_xyz([0, 0, theta])

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
        print(len(all_cubes))



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
        # print("actual", actual_num_branches)
        # print("desired", desired_num_branches)
        # print("start_prob", branch_prob)
        # print("end prob",end_branch_prob)
        # print()

        # end_branch_prob = 0.02
        # branch_prob= 0.02



        top_cube = temp_top_cubes.pop()

        if random.random()< end_branch_prob:
            actual_num_branches -= 1
            continue





        new_cube = copy.deepcopy(top_cube)

        center = new_cube.mesh.get_center()
        direction = [center[0], 0, center[2]]
        direction_norm = direction / np.linalg.norm(direction)
        dir_perp = direction_norm @ np.linalg.inv(first_cube.get_rotation_matrix_from_xyz([0, np.pi / 2, 0]))
        rot = first_cube.get_rotation_matrix_from_axis_angle(dir_perp * theta)




        new_cube.mesh.rotate(rot)
        new_cube.rotation = new_cube.rotation @ rot


        h,s,v = colorsys.rgb_to_hsv( *new_cube.mesh.vertex_colors[0])
        hue_increment = 0.4 / branch_len
        new_cube.mesh.paint_uniform_color(colorsys.hsv_to_rgb((h + hue_increment) % 1,s,v))
        x = x_default
        y = y_default
        z = z_default






        only_x_axis = random.choice([True, False])
        # only_x_axis = True
        if only_x_axis:
            x = [1, -1]
            random.shuffle(x)

            translate_v = [x[0], y, z] @ np.linalg.inv(new_cube.rotation)
            new_cube.mesh.translate(translate_v)

            all_cubes.append(new_cube)
            top_cubes.append(new_cube)

            if random.random() < branch_prob:
                # continue
                actual_num_branches += 1
                branch_counter += 1

                branch_cube = copy.deepcopy(new_cube)
                branch_cube.mesh.paint_uniform_color([1,0,0])

                branch_cube_translate = [x[1], y, z] @ np.linalg.inv(branch_cube.rotation)
                branch_cube.mesh.translate(branch_cube_translate)

                all_cubes.append(branch_cube)
                top_cubes.append(branch_cube)


        else:
            z = [1, -1]
            random.shuffle(z)

            translate_v = [x, y, z[0]] @ np.linalg.inv(new_cube.rotation)
            new_cube.mesh.translate(translate_v)

            all_cubes.append(new_cube)
            top_cubes.append(new_cube)

            if random.random() < branch_prob:
                actual_num_branches += 1
                branch_counter += 1

                branch_cube = copy.deepcopy(new_cube)
                branch_cube.mesh.paint_uniform_color([1, 0, 0])

                branch_cube_translate = [x, y, z[1]] @ np.linalg.inv(branch_cube.rotation)
                branch_cube.mesh.translate(branch_cube_translate)
                all_cubes.append(branch_cube)
                top_cubes.append(branch_cube)




# Optional: Color the cube (e.g., red)
print()
print("total num cubes", len(all_cubes))
for i in range(len(all_cubes)):
    # all_cubes[i].paint_uniform_color([1.0, 0.0, 0.0])
    # continue
    pass
    all_cubes[i].mesh.compute_vertex_normals()

vis = o3d.visualization.Visualizer()
vis.create_window()

only_meshes = list()

print('pre loop')
for i in range(len(all_cubes)):
    print(i)
    first_cube += all_cubes[i].mesh



print('pre run')
vis.add_geometry(first_cube)
vis.run()
vis.destroy_window()
# o3d.visualization.draw(geometry=only_meshes, show_ui=True)

