14:56 PM Sunday, September 28, 2025-09-28
made branches end if they would intersect the strcture. 
but messed up the branch counter and branching probablities. 

in the last few days i did a lot of thinking of potential total shapes. 

like the idea of realisti tree structure with decreasing scale. 
also the leaves will be in a sphere or cube shape. 




for tree structure idea. 
to use metal, wood, and 3d print in that order from the base to the leaves. 
so the base and first branches are metal, middle branches are wood, and end branches are 3d print.
metal is stronger so it synergies with the base. 
wood is wood. lol
and 3d print is weakest but also the most detailed. which synergies with ends of the branches. 
also the detail could be super fine at the leaves. 
becasue i can generate a chunk of base shapes at the end, which are really small and detailed, and print that as one piece. 
which is crazy. 






## Thinking Out Loud



#### Other base shapes 
Cylinder 
Board / plate 
Pyramid 
Triangular prism 
Cubes and  cylinders would be very flexible .
Because cylinders could come out at any angle. 
Also scale of base should could change. 

#### Only cubes connected with thinner cylinders
Also cube place cubes in points in space. Not touching each other. 
Then just put cylinders from center to to center of the cubes. 
That's kind of crazy. 

#### Final shapes
##### Spiral
Hmm I've been picturing a sort of dense spiral for a while and didn't have any idea of how to do it. 
Hmm nvm I still don't. 
Was thinking of finding a very specific shape that when stacked it spirals perfectly. And the angle of the sides has to be exact to make that happen. 
But it would make a circle easier. 
A spiral has to have it's angle changed as it goes. 

#### Natural tree
Could make a more regular looking tree. 
And the truck would be scale down shapes at each branch. To more details.
The trunk would just be one really thick branch. 
Could change the material as it gets closer to leaves. 
Wood cubes. 3d printed arbitrary angled pieces. 
And after some branches metal dowels. 
Fuckiest matériel for leaves like styrofoam of something 
Glass 



#### End size
 - Roughly how many pieces. 
 - What size of piece what size of total. Physically. 


#### What materials could I use?
- Wood
- Metal
- 3d print 
- Sand glue
- Resin cast 

#### Terminology
- base shape / atom

#### Ways to attach base shapes
- metal or wooden dowels with glue

#### Structural integrity
- Could theoretically use lighter / less stronger materials on the outside. Or in the less weight bearing parts. 
- Indoor sculpture vs outdoor. Weather resistant. 
- Also if it's a bigger sculpture make a way for it to disassemble 

#### Homogenous vs heterogenous style
- This whole time I was picturing a sort of homogenous structure or pattern. But the algorithm could change. Like it's straight lines brutal at the start and becomes organic 

#### Arms/branches or something else. 
 - its strange that this whole time i've been picturing very much with something like arms like an octopus. 
and that is not at all necessary. 
i guess because of the tree structure i made first. 
but also a lot of fractal patterns and botanical structure has things like "arms" or branches. 
ooh also because of how i was imagining attactching the base shapes together one at a time sort of has an ease of implication towards branches and arms. 
I could still have pins in fixed locations. but maybe each base shape doesnt need to only attach to one other. it could be attached to multiple in different axis. 
i pin through the central axis would be intersting. 
would be an easy way to get arbitrary degree of rotation.

#### Increasing the utility of one shape
- a special shape. 
a triangular prism of sorts. 
such that there is a wide range of anlge of the faces, depending on which face is on the bottom. 
or
even more versitile
would be one shape that when taking two of that shape and stacking them, the top face can have a wide range of angles, relative to the bottom face (top face of the top shape, bottom face of the bottom shape)

- i guess tessellation/tiling is a whole thing. 
https://en.wikipedia.org/wiki/Tessellation
3d tessellation:
https://en.wikipedia.org/wiki/Honeycomb_%28geometry%29

#### Shape to approximate a curve
- there could be a possibility in creating an algorithm that will place the shapes in a way that minimizes distance from an arbitrary curve. 
so that you could come up with the formula for, say, and interesting path in 3d. 
and you put that formular into the algorithm and it spits out shapes stuck together in predefined ways, in a total shape that is close to the curve. 
or for that matter it could be a full 3d mesh isntead of a curve. 
like in blender i have seen a thing where it makes your object out of lego. that is a very similar idea. except that the lego could connet with itself maybe in more complicated wasy idk. 
that is probbaly out of my scope. 

#### Perception of level of detail
- there will definitely be a sort of issue / balance when it comes to the level of detail of the whole sculpture. 

- like if it is an octopus tree shape made out of cubes, then random/arbitrary curves and arms, and branches wont be very "high resolution", because the height of the cubes will be idk, from 2% to 10% of the height of the whole sculpture. this is the case becasue you are using a base shape in a sort of blurry way. 
the alternative is to sort of use the specific details of the base shapes to add to the total sculpture. i can easily imagine this with a repetitive shape. where a lot of angles of groups of shapes are aligned, or at least smoothly changing over a group of base shapes. 
i think the latter is much more interesting. 
and the implication here is that any amount of randomness involed in the structure should NOT be at the smallest scale, ie, the orientation/pos of the base shapes. for example instead the randomness could be in the END location of an arm. and the arm itself is made of base shapes that change very regularly in order to get to that end point. 
so that the arm would looked sorted scaled, because of the repetition. 







## The Plan
- map out the sort of current possible projection of the entire process. 




## To Do

- give python one last try and learn / implement the math needed for general 3d rotations. 
if i can nail down rotations and building off of a rotated shape than python would be great going forward. 
i think it would be beneficial to get a better grasp on the math / the principles of 3d transformations. 

- explore
natural patterns
generative shapes/patterns
(and like the actual name for those things)
try implmenting the interesting ones. 


- go to ctc shops and get lists of machines and either what they do or google at home what they do. 
get some basic prices for amterials. 

- ask the ctc techs what are possible shapes that are complex but easy/cheap to make. 
at least to get some possible ideas/inspiriation








## The process so far. 

- used python's open3d to make two generative tree models. 
	- basic model: manually set:
number of atoms
probability of a branch being started. 
probability of a branch dying. 
	- the second model has two different parameters. 
	avg number of active branches
	avg length of a branch. 
	which dynamically calculates different characteristics of the tree structure and changes branch start / end probablity. 
	- both of these models are stochastic. 

11:57 AM Monday, September 22, 2025-09-22
Got simple stacking on rotated cubes in python. 

next step add constant amount of rotation to all base shapes in the second tree model. 
this will require making a custom base shape object to store its current rotation (and center for more complex base shapes)
















