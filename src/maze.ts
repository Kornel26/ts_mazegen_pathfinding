import { Cell } from "./models/Cell";

export class Maze {

    private width: number;
    private height: number;
    private cellSize: number = 30;

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    private maze: Cell[] = [];
    private length: number;

    constructor(width: number, height: number, cellSize?: number) {
        this.width = width;
        this.height = height;
        this.length = this.width * this.height;
        this.canvas = document.querySelector('#canvas') as HTMLCanvasElement;
        this.canvas.width = this.width * this.cellSize;
        this.canvas.height = this.height * this.cellSize;
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        this.initMaze();
        this.draw();
    }

    private initMaze() {
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                this.maze.push(new Cell(j, i));
            }
        }
    }

    public draw() {
        this.maze.forEach((cell: Cell) => {
            //this.ctx.strokeRect(cell.x * this.cellSize, cell.y * this.cellSize, this.cellSize, this.cellSize);
            const x = cell.x * this.cellSize;
            const y = cell.y * this.cellSize;
            if(cell.left) this.line(x, y, x, y + this.cellSize);
            if(cell.top) this.line(0, 0, 0, 0);
            if(cell.right) this.line(0, 0, 0, 0);
            if(cell.bottom) this.line(0, 0, 0, 0);
        });
    }

    private line(x1: number, y1: number, x2: number, y2: number) {
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
    }

}