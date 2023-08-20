import { MazeAlgorithms } from "./interfaces/MazeAlgorithms";
import { Maze } from "./maze";

export class UI {

    private genSelect: HTMLSelectElement;

    private algorithms: MazeAlgorithms;

    constructor(algorithms: MazeAlgorithms) {
        this.algorithms = algorithms;
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
            console.log(this.genSelect.value);
        });
    }

}