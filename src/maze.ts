import { MazeAlgorithms } from "./interfaces/MazeAlgorithms";
import { Cell } from "./models/Cell";

export class Maze {

    private width: number;
    private height: number;
    private cellSize: number = 30;

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private genSelect: HTMLSelectElement;

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
        this.genSelect = document.querySelector('#generationSelect') as HTMLSelectElement;
        this.populateGenerationSelect();
        this.registerEventHandlers();
    }

    private populateGenerationSelect(): void {
        for (const [key, value] of Object.entries(this.algorithms)) {
            const option: HTMLOptionElement = document.createElement('option');
            option.value = key;
            option.textContent = key;
            this.genSelect.appendChild(option);
        }
    }

    private registerEventHandlers(): void {
        this.genSelect.addEventListener('change', (e: Event) => {
            const selected = this.genSelect.value;
            console.log(selected);
            this.runAlgorithm(selected);
        });
    }

    private initMaze(): void {
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                this.maze.push(new Cell(i, j));
            }
        }
    }

    private draw(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.maze.forEach((cell: Cell) => {
            const x = cell.x * this.cellSize;
            const y = cell.y * this.cellSize;
            
            this.ctx.fillStyle = 'blue';
            if (cell.visited) this.ctx.fillRect(x, y, this.cellSize, this.cellSize);

            if (cell.left) this.line(x, y, x, y + this.cellSize);
            if (cell.top) this.line(x, y, x + this.cellSize, y);
            if (cell.right) this.line(x + this.cellSize, y, x + this.cellSize, y + this.cellSize);
            if (cell.bottom) this.line(x, y + this.cellSize, x + this.cellSize, y + this.cellSize);            
        });
    }

    private line(x1: number, y1: number, x2: number, y2: number) {
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
    }

    private getCell(x: number, y: number): Cell | undefined {
        if (x < 0 || y < 0 || x > this.width - 1 || y > this.height - 1) return undefined;
        return this.maze[(x * this.height) + y];
    }

    private unvisitedNeightbour(cell: Cell): Cell {
        const unvisited: Cell[] = [];
        const x = cell.x;
        const y = cell.y;

        const left = this.getCell(x - 1, y);
        const top = this.getCell(x, y - 1);
        const right = this.getCell(x + 1, y);
        const bottom = this.getCell(x, y + 1);

        if (left && !left.visited) unvisited.push(left);
        if (top && !top.visited) unvisited.push(top);
        if (right && !right.visited) unvisited.push(right);
        if (bottom && !bottom.visited) unvisited.push(bottom);

        return unvisited[Math.floor(Math.random() * unvisited.length)];
    }

    private removeWalls(a: Cell, b: Cell) {
        const x = a.x - b.x;
        if (x === 1) {
            a.left = false;
            b.right = false;
        } else if (x === -1) {
            a.right = false;
            b.left = false;
        }
        const y = a.y - b.y;
        if (y === 1) {
            a.top = false;
            b.bottom = false;
        } else if (y === -1) {
            a.bottom = false;
            b.top = false;
        }
    }

    private readonly algorithms: MazeAlgorithms = {
        'depthFirst': this.depthFirst
    };

    public getAlgorithms(): MazeAlgorithms {
        return this.algorithms;
    }

    public runAlgorithm(algorithm: string): void {
        const selectedAlgorithm = this.algorithms[algorithm];
        if(selectedAlgorithm !== undefined){
            selectedAlgorithm(this.maze[0]);
        } else {
            console.error(`Algorithm '${algorithm}' not found.`);
        }
    }

    private async depthFirst (start: Cell): Promise<void> {
        this.draw();
        let current = start;
        current.visited = true;
        let next = this.unvisitedNeightbour(current);
        while (next) {
            next.visited = true;
            this.removeWalls(current, next);
            current = next;
            await new Promise(resolve => setTimeout(resolve, 10));
            this.draw();    
            await this.depthFirst(current);
            next = this.unvisitedNeightbour(current);
        }
    }
}