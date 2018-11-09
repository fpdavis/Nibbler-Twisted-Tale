
// https://rosettacode.org/wiki/Maze_generation#JavaScript

// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain

// Videos
// https://youtu.be/HyK_Q5rrcr4
// https://youtu.be/D8UgRyRnvXU
// https://youtu.be/8Ju_uxJ9v44
// https://youtu.be/_p5IH0L63wo

// Depth-first search
// Recursive backtracker
// https://en.wikipedia.org/wiki/Maze_generation_algorithm

var cols, rows;
var grid = [];
var current;
var stack = [];
var foo;

function Cell(i, j) {
    this.i = i;
    this.j = j;
    this.walls = [true, true, true, true];
    this.visited = false;

    this.checkNeighbors = function () {
        let neighbors = [];

        let top = grid[index(this.i, this.j - 1)];
        let right = grid[index(this.i + 1, this.j)];
        let bottom = grid[index(this.i, this.j + 1)];
        let left = grid[index(this.i - 1, this.j)];

        if (top && !top.visited) {
            neighbors.push(top);
        }
        if (right && !right.visited) {
            neighbors.push(right);
        }
        if (bottom && !bottom.visited) {
            neighbors.push(bottom);
        }
        if (left && !left.visited) {
            neighbors.push(left);
        }

        if (neighbors.length > 0) {
            let r = Math.floor(Math.random() * neighbors.length);
            return neighbors[r];
        } else {
            return undefined;
        }
    };
}

function GenerateMaze(ColsIn, RowsIn) {

    cols = ColsIn;
    rows = RowsIn;
    console.log(`${cols}, ${rows}`);

    for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
            let cell = new Cell(i, j);
            let length = grid.push(cell);
            //console.log(`${i} + ${j} * ${length}`);
            //console.log(index(i,j));
        }
    }

    current = grid[0];
    //for (let i = 0; i < grid.length; i++) {
    //    grid[i].show();
    //}

    //while (true) {

    foo = setInterval(function () { CalculateMaze(); }, 15);

        //current.visited = true;
        ////current.highlight();

        //// STEP 1
        //let next = current.checkNeighbors();
        //if (next) {
        //    next.visited = true;

        //    // STEP 2
        //    stack.push(current);

        //    // STEP 3
        //    removeWalls(current, next);

        //    // STEP 4
        //    current = next;
        //} else if (stack.length > 0) {
        //    current = stack.pop();
        //}
        //else {
        //    break;
        //}

        //console.log(current.i);
        //DrawMaze(grid);
    //}

    return grid;
}

function CalculateMaze() {

    current.visited = true;

    // STEP 1
    let next = current.checkNeighbors();
    if (next) {
        next.visited = true;

        // STEP 2
        stack.push(current);

        // STEP 3
        removeWalls(current, next);

        // STEP 4
        current = next;
    } else if (stack.length > 0) {
        current = stack.pop();
    }
    else {
        clearInterval(foo);
        grid.forEach(function (item) { item.visited = false; });
        current = grid[0];
        foo = setInterval(function () { CalculateMaze(); }, 200);
        }

    //console.log(`${current.i} + ${current.j} * ${cols}`);

    ctxArena.fillStyle = "black";
    ctxArena.fillRect(0, 0, window.innerWidth, giGridHeight);
    DrawMaze(grid);
    //current.highlight();
    ctxArena.fillStyle = "red";
    ctxArena.fillRect(current.i * giGridSize + 3,
        current.j * giGridSize + 3,
        giGridSize - 6,
        giGridSize - 6);
}

function RemoveDeadEnds() {

    current.visited = true;

    // STEP 1
    let next = current.checkNeighbors();
    if (next) {
        next.visited = true;

        // STEP 2
        stack.push(current);

        // STEP 3
        removeDead(current);

        // STEP 4
        current = next;
    } else if (stack.length > 0) {
        current = stack.pop();
    }
    else {
        clearInterval(foo);
    }

    //console.log(`${current.i} + ${current.j} * ${cols}`);

    ctxArena.fillStyle = "black";
    ctxArena.fillRect(0, 0, window.innerWidth, giGridHeight);
    DrawMaze(grid);
    //current.highlight();
    ctxArena.fillStyle = "red";
    ctxArena.fillRect(current.i * giGridSize + 3,
        current.j * giGridSize + 3,
        giGridSize - 6,
        giGridSize - 6);
}

function index(i, j) {
    if (i < 0 || j < 0 || i > cols - 1 || j > rows - 1) {
        return -1;
    }

    return i + j * cols;
}

function removeDead(a) {

    let iNumberOfWalls = 0;

    if (a.walls[0]) iNumberOfWalls++;
    if (a.walls[1]) iNumberOfWalls++;
    if (a.walls[2]) iNumberOfWalls++;
    if (a.walls[3]) iNumberOfWalls++;

    if (iNumberOfWalls > 2) {
        if (a.walls[0]) a.walls[0] = false;
        if (a.walls[1]) a.walls[1] = false;
        if (a.walls[2]) a.walls[2] = false;
        if (a.walls[3]) a.walls[3] = false;
    }
}

function removeWalls(a, b) {

    let x = a.j - b.j;
    if (x === 1) {
        a.walls[3] = false;
        b.walls[1] = false;
    } else if (x === -1) {
        a.walls[1] = false;
        b.walls[3] = false;
    }

    let y = a.i - b.i;
    if (y === 1) {
        a.walls[0] = false;
        b.walls[2] = false;
    } else if (y === -1) {
        a.walls[2] = false;
        b.walls[0] = false;
    }
}
