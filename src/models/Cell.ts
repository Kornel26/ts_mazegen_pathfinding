export class Cell {

    public x: number;
    public y: number;

    public left: boolean = true;
    public top: boolean = true;
    public right: boolean = true;
    public bottom: boolean = true;

    public visited: boolean = false;

    constructor(x: number, y: number){
        this.x = x;
        this.y = y;
    }

}