# Welcome to 3D Plotter

### Index
* [Abstract](https://github.com/MicBrain/3D-Plotter/blob/master/README.md#abstract)
* [Description](https://github.com/MicBrain/3D-Plotter/blob/master/README.md#description)
* [Examples](https://github.com/MicBrain/3D-Plotter/blob/master/README.md#examples)
* [General Approach](https://github.com/MicBrain/3D-Plotter/blob/master/README.md#general-approach)
* [Personal Information](https://github.com/MicBrain/3D-Plotter/blob/master/README.md#personal-information)
* [TODO](https://github.com/MicBrain/3D-Plotter/blob/master/README.md#todo)

#### Abstract
   3 dimensional plotters allow to better visualize the graphical representations of functions using three dimensional directions. They are widely used in mathematics, physics, economics and in various other fields. Different software systems such as Wolfram Alfa and MathWorks already have special tools, that represent graphical visualizations. However, the development of modern technologices constantly allow us to develop previously written tools. In this repository, I represent a new implementation for plotting functions, which uses the benefits provided by newly developed technologies. 

#### Description
   "3D Plotter" is a widely functional web platform that represents the plots of graphs of functions in a three dimensional space. It is very efficient and doesn't consume a lot of internal resources. It uses a very limited amount of features from three.js library(JavaScript 3D library) for rendering and accessing to GPU and Silent Mat library(JavaScript Expression Evaluator) in order to parse inputed functions. It also utilizes Bootstrap (front-end framework) to create a user-friendly interface.
   
#### Examples
![alt tag](https://cloud.githubusercontent.com/assets/5885065/10864869/96cb8256-7fb8-11e5-9cbd-fbbfb11d7d43.png)
![alt tag](https://cloud.githubusercontent.com/assets/5885065/10864967/07827fa2-7fbb-11e5-80c8-631769c5a1b7.png)
![alt tag](https://cloud.githubusercontent.com/assets/5885065/10865025/30f3ff2c-7fbc-11e5-88ee-1364ff9c1ff2.png)
![alt tag](https://cloud.githubusercontent.com/assets/5885065/10865050/bcdc9468-7fbc-11e5-9b74-7eb3cb74d682.png)
![alt tag](https://cloud.githubusercontent.com/assets/5885065/10865069/4dcdb16e-7fbd-11e5-8a4f-9a02c472244b.png)

#### General Approach
   For coloring I calculate the max and the min of the inputed functionused in additions to using two extreme colors - green color for the min-z, and red color for the max-z. For every z choose a color using this formula:
   ```
   color.setHSL((1 - (z - zMin) / zSpan) / 4, 1, 0.5);
   where zSpan = zMax - zMin
   ```
   
   3D graph in our project is a mesh(a mesh along with a geometry defines a 3D object). For instance, for any  2-variable function defined in [a,b] x [c,d] region(f:[a,b]x[c,d] -> [e,k]), we calculate the values of the function in 6400 points(80x80) and and define those (x,y, f(x,y)) points in 3D space as the vertices of out mesh. Then  we use triangulation. Basically we have 80x80 'squares'(quadrilateral to be precise) and each quadrilateral is a union of 2 triangles so by rendering those triangles we get the final image !
   

#### Personal Information
My name is Rafayel Mkrtchyan and I am currently a third year international student at the University of California at Berkeley. I am a hackathon guy and a big fan of open-source software development. I expect to graduate from UC Berkeley in May, 2017. Currently I live in Berkeley, CA, USA. I can be reached at rafamian@berkeley.edu and 1- (310) - 347 - 5442.

#### TODO
* Make a better resolution for function graphs that contain a higher order derivatives.
* There are some problems with not-continuous functions (for example 1/x).
