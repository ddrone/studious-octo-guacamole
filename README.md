## About the project

A simple optimization game. On a rectangular grid, there is a start and an end. You can click on some of the cells to make them impossible to go through. Your goal is to make the shortest path from beginning to end as long as possible, without blocking it completely.

You can play it [online](http://awesomesauce.name/maze-game), thought it might not be the latest build.

## Screenshot

![Screenshot of a game](./screenshot.png)

## Tasks

* [x] Refactor Point to be a class, not a plain object
* [x] Implement shortest path search and display the current path length in the UI
* [x] Highlight the cells that are a part of the shortest path
* [x] Draw the UI in a prettier way on a canvas
  * [x] Make the cells clickable
  * [x] Render the path as a straight line
* [x] Figure out the performance issue on a larger grid
  * The issue was with traversal code: you have to check for whether you have visited already on extraction from the queue, not insertion (in the latter, you can insert an element several times)
* [x] Add a display for the current path length
* [ ] Deploy the game online
* [ ] Add a screenshot on Github
* [ ] Implement support for partial grids
* [ ] Implement support for hexagonal grids
* [ ] On rectangular grids, implement support for fences of variable length between the cells
* [ ] Make the path rendering prettier by rendering it as a curved line
