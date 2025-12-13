# Step soemthing


### Description
This step represents my first attempt to start coding to generate 3D shapes/structures. 

I used the python library Open3D, which is an interesting and powerful library, but it lacked some higher level helper functions for 3D transformations. It also lacked any kind of parent-child hierarchy for 3D transformations. 

I did make progress and slowly added some features but ended up switching to ThreeJS. 

### Features
- Randomly places blocks next to a previous block on a random axis. 
- Can branch and has parameters to control the amount of branches.
- All blocks rotated a small amount away from the origin. This with the randomness causes interesting looks and knots to be made. 

![image info](./read_me_images/1.png)
![image info](./read_me_images/2.png)

### View meshes in browser

[Example 1](https://3dviewer.net/#model=https://github.com/jj-gagnon/generative_sculpture/blob/Step-0.5/python%20generated%20meshes/out.gltf)

[Example 2](https://3dviewer.net/#model=https://github.com/jj-gagnon/generative_sculpture/blob/Step-0.5/python%20generated%20meshes/out_2.gltf)
