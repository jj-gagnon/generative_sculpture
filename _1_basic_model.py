import copy
import numpy as np
import open3d as o3d
import random

num_cubes = 1000
branch_prob = 1
end_branch_prob = 0.5

x_default = 0
y_default = 0.5
z_default = 0



# Create a cube (box)
# You can specify the size using width, height, and depth parameters.
# By default, it creates a unit cube (1x1x1) centered at the origin.
cubes = list()
all_cubes = list()
top_cubes = list()
temp_top_cubes = list()



first_cube = o3d.geometry.TriangleMesh.create_box(width=1.0, height=1.0, depth=1.0)
all_cubes.append(first_cube)
top_cubes.append(first_cube)

# c = o3d.geometry.TriangleMesh.create_box(width=1.0, height=1.0, depth=1.0)
# for i in range(10):
#
#     top_cubes.append(copy.deepcopy(c).translate((i*0.5, i*0.5, i*0.5)))

cube_limit = num_cubes
last_num_cubes = 0
while len(all_cubes) < cube_limit:

    if len(all_cubes) == last_num_cubes:
        break
    last_num_cubes = len(all_cubes)


    temp_top_cubes = copy.deepcopy(top_cubes)
    top_cubes = list()

    for top_cube_i in range(len(temp_top_cubes)):

        top_cube = temp_top_cubes.pop()


        if random.randint(1, 100) <= end_branch_prob:
            continue



        new_cube = copy.deepcopy(top_cube)

        x = x_default
        # y = 0.5
        # y = random.random()*0.5
        y = y_default
        z = z_default






        only_x_axis = random.choice([True, False])
        if only_x_axis:
            x = [1, -1]
            random.shuffle(x)

            new_cube.translate((x[0], y, z))
            all_cubes.append(new_cube)
            top_cubes.append(new_cube)

            # Branch True



            if random.randint(1,100) <= branch_prob:
                branch_cube = copy.deepcopy(top_cube)
                branch_cube.translate((x[1], y, z))
                all_cubes.append(branch_cube)
                top_cubes.append(branch_cube)


        else:
            z = [1, -1]
            random.shuffle(z)

            new_cube.translate((x, y, z[0]))
            all_cubes.append(new_cube)
            top_cubes.append(new_cube)

            # Branch True
            if random.randint(1,100) <= branch_prob:
                branch_cube = copy.deepcopy(top_cube)
                branch_cube.translate((x, y, z[1]))
                all_cubes.append(branch_cube)
                top_cubes.append(branch_cube)










    # cube.paint_uniform_color((1.0, 0.0, 0.0))

    # cubes.append(cube)
    # x,y,z = cube.get_center()

    # cube_2 = o3d.geometry.TriangleMesh.create_box(width=1.0, height=1.0, depth=1.0)
    # cube_2.paint_uniform_color((1.0, 1.0, 0.0))

    # cube_2.translate((1,0.5,0))

    # cubes.append(cube_2)

    # cubes.append(copy.deepcopy(cube).translate((0,0,z)))




# Optional: Color the cube (e.g., red)
print(len(all_cubes))
for i in range(len(all_cubes)):
    all_cubes[i].paint_uniform_color([1.0, 0.0, 0.0])
    all_cubes[i].compute_vertex_normals()




# Optional: Translate the cube
# cube.translate([0.5, 0.5, 0.5]) # Moves the cube by the specified vector
print('he')
# Visualize the cube
# o3d.visualization.draw_geometries(cubes,show_ui=True)

o3d.visualization.draw(geometry=all_cubes, show_ui=True)

