// Interfaces
interface CubeInstance {
    new (cell: Cell[],facing: string,startingPos: {x: number,y: number}[]): Cube;
}
interface Cube {
    cells: Cell[];
    facing: string;
    vertices: {x:number,y:number}[];
    speed: number;

    show(): void;
    divide(): void;
    moveVertices(): void;
}

interface GridInstance {
    new (position: {x: number,y: number},cubeFacing: string,startingPos: {x: number,y: number}[]): Grid;
}
interface Grid {
    cells: Cell[];
    cube: Cube;
    show(): void;
}

interface CellInstance {
    new (position: {x: number,y: number}): Cell;
}
interface Cell {
    position: {
        x: number,
        y: number
    };
    center: {
        x: number,
        y: number
    }
}

// Classes
class Cube implements Cube {
    constructor(cell: Cell[],facing: string,startingPos: {x: number,y: number}[]) {
        this.cells = [];
        this.facing = facing;
        this.vertices = [];

        if(startingPos.length == 4){
            this.vertices = startingPos;
        }else{
            for(let i = 0;i<4;i++){
                this.vertices[i] = {x: undefined,y: undefined};
                this.vertices[i].x = startingPos[0].x;
                this.vertices[i].y = startingPos[0].y;
            }
        }
        
        switch(facing){
            case "up":
                this.cells[0] = cell[2],this.cells[1] = cell[0],this.cells[2] = cell[1],this.cells[3] = cell[3];
            break;
            case "right":
                this.cells[0] = cell[2],this.cells[1] = cell[3],this.cells[2] = cell[1],this.cells[3] = cell[0];
            break;
            case "down":
                this.cells[0] = cell[1],this.cells[1] = cell[3],this.cells[2] = cell[2],this.cells[3] = cell[0];
            break;
            case "left":
                this.cells[0] = cell[1],this.cells[1] = cell[0],this.cells[2] = cell[2],this.cells[3] = cell[3];
            break;
        }

        this.speed = dist(this.vertices[0].x,this.vertices[0].y,this.cells[0].center.x,this.cells[0].center.y)*(1/100);
    }
    
    show(){
        for(let i = 0;i<this.cells.length-1;i++){
            stroke(255,0,0);
            strokeWeight(3);
            line(this.vertices[i].x,this.vertices[i].y,this.vertices[i+1].x,this.vertices[i+1].y);
        }
    }
    moveVertices(){
        for(let i = 0;i<this.vertices.length;i++){
            if(this.vertices[i].x != this.cells[i].center.x){
                if(this.vertices[i].x > this.cells[i].center.x){
                    if(this.vertices[i].x - this.cells[i].center.x >= this.speed){
                        this.vertices[i].x -= this.speed;
                    }else{
                        this.vertices[i].x = this.cells[i].center.x;
                    }
                }else{
                    if(this.cells[i].center.x - this.vertices[i].x >= this.speed){
                        this.vertices[i].x += this.speed;
                    }else{
                        this.vertices[i].x = this.cells[i].center.x;
                    }
                }
            }
            if(this.vertices[i].y != this.cells[i].center.y){
                if(this.vertices[i].y > this.cells[i].center.y){
                    if(this.vertices[i].y - this.cells[i].center.y >= this.speed){
                        this.vertices[i].y -= this.speed;
                    }else{
                        this.vertices[i].y = this.cells[i].center.y;
                    }
                }else{
                    if(this.cells[i].center.y - this.vertices[i].y >= this.speed){
                        this.vertices[i].y += this.speed;
                    }else{
                        this.vertices[i].y = this.cells[i].center.y;
                    }
                }
            }
        }
    }
    divide(){
        let grid = [];
        let face;
        switch(this.facing){
            case "up":
                face = ["right","up","up","left"];
                for(let i = 0;i<4;i++){
                    grid.push(new Grid(this.cells[i].position,face[i],[{x: this.cells[i].center.x,y: this.cells[i].center.y}]));
                }
            break;
            case "right":
                face = ["up","right","right","down"];
                for(let i = 0;i<4;i++){
                    grid.push(new Grid(this.cells[i].position,face[i],[{x: this.cells[i].center.x,y: this.cells[i].center.y}]));
                }
            break;
            case "down":
                face = ["left","down","down","right"];
                for(let i = 0;i<4;i++){
                    grid.push(new Grid(this.cells[i].position,face[i],[{x: this.cells[i].center.x,y: this.cells[i].center.y}]));
                }
            break;
            case "left":
                face = ["down","left","left","up"];
                for(let i = 0;i<4;i++){
                    grid.push(new Grid(this.cells[i].position,face[i],[{x: this.cells[i].center.x,y: this.cells[i].center.y}]));
                }
            break;
        }
        for(let i = 0;i<4;i++){
            grids.push(grid[i]);
        }
    }
}
class Grid implements Grid {
    public cells: Cell[];
    public cube: Cube;
    public position: {
        x: number,
        y: number
    };
    
    constructor(position: {x: number,y: number},cubeFacing: string,startingPos: {x: number,y: number}[]) {
        this.cells = [];
        this.position = position;

        let x,y;
        x = this.position.x, y = this.position.y;
        for(let i = 0;i < 2;i++){
            for(let j = 0;j < 2;j++){
                let cell = new Cell({x: x,y: y});
                this.cells.push(cell);
                x+=scl;
            }
            y+=scl;
            x = this.position.x;
        }

        this.makeCube(cubeFacing,startingPos);
    }
    
    show(){
        for(let i = 0;i<this.cells.length;i++){
            let cell = this.cells[i];
            noFill();
            stroke(0);
            strokeWeight(1);
            rect(cell.position.x,cell.position.y,scl,scl);
        }
    }

    private makeCube(facing: string,startingPos: {x: number,y: number}[]){
        let cube = new Cube(this.cells,facing,startingPos);
        this.cube = cube;
        cubes.push(cube);
    }
}
class Cell implements Cell {
    public position: {
        x: number,
        y: number
    }
    public center: {
        x: number,
        y: number
    }
    constructor(position: {x: number,y: number}) {
        this.position = position;
        this.center = {x: this.position.x+scl/2,y: this.position.y+scl/2}
    }
}


// Defined vars
const WIDTH = 640,HEIGHT = 640;
var scl = WIDTH/2;
var grids: Grid[];
var cubes: Cube[] = [];


// Setup fun
function setup() {
    createCanvas(WIDTH,HEIGHT);
    //noLoop();
    grids = [new Grid({x:0,y:0},"up",[{x: 0,y: HEIGHT/2},{x: WIDTH*(1/3),y: HEIGHT/2},{x: WIDTH*(2/3),y: HEIGHT/2},{x: WIDTH,y: HEIGHT/2}])];
}

// Draw Loop
function draw() {
    background(51);
    for(let i = 0;i < grids.length;i++){
        //grids[i].show();
        cubes[i].show();
        cubes[i].moveVertices();
        if(cubes[i+1]){
            line(cubes[i].vertices[3].x,cubes[i].vertices[3].y,cubes[i+1].vertices[0].x,cubes[i+1].vertices[0].y);
        }
    }
}

function divide(){
    scl /= 2;
    grids = [];
    let oldCubes = cubes;
    cubes = [];
    for(let i = 0;i < oldCubes.length;i++){
        oldCubes[i].divide();
    }
}

function mouseClicked(){
    divide();
}