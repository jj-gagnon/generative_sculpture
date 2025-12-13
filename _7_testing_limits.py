import copy
import numpy as np
import open3d as o3d
import random
import colorsys

vis = o3d.visualization.Visualizer()
vis.create_window()

only_meshes = list()

cube = o3d.geometry.TriangleMesh.create_box(width=1.0, height=1.0, depth=1.0)

print('pre loop')
num_cubes = 30000
all_cubes  = o3d.geometry.TriangleMesh.create_box(width=1.0, height=1.0, depth=1.0)

scale = 0.01
for i in range(num_cubes):
    print(i)
    new_cube = copy.deepcopy(cube)
    new_cube.translate([random.randint(0,num_cubes*scale),
                        random.randint(0, num_cubes*scale),
                        random.randint(0, num_cubes*scale)
                        ])
    all_cubes += new_cube


all_cubes.paint_uniform_color([1,0,0])

print('pre run')
vis.add_geometry(all_cubes)
vis.run()
vis.destroy_window()
# o3d.visualization.draw(geometry=only_meshes, show_ui=True)

