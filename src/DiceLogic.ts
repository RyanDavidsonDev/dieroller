import {GenerateNumbers} from "./TrueRandom";

export enum SortTypes {
    None = "None",
    Ascending = "Ascending",
    Descending = "Descending"
}

export class RollResults {

    resultsMap: Map<number, number[]> = new Map<number, number[]>();
    total: number = -1;
    highest: number = -1;
    lowest: number = -1;
    average: number = -1;
    //median would require either sorting the array, or implementing a separate algorithm.
    // It doesn't look too complicated, but it probably still wouldn't be a worthwhile rabbit hole
    //maybe this can be revisited when everything else is done. (MAYBE)

    constructor(_allResults: Map<number, number[]>, _total: number, _highest: number, _lowest: number, _average: number) {
        this.resultsMap = _allResults;
        this.total = _total;
        this.highest = _highest;
        this.lowest = _lowest;
        this.average = _average;

    }

    toString() {
        return "RollResults: [ [AllResults: " + JSON.stringify(this.resultsMap)
            + "] [total " + JSON.stringify(this.total)
            + "] [highest " + JSON.stringify(this.highest)
            + "] [lowest " + JSON.stringify(this.lowest)
            + "] [average " + JSON.stringify(this.average)
            + "] ]";
    }
}

export function StringifyPool(pool: number[], sortBy: SortTypes = SortTypes.None) {
    if (sortBy !== SortTypes.None) {
        throw new Error("sort types other than none for StringifyPool() are not yet implemented. (Not even sure why anyone other than Ryan would be seeing this error message");
    }
    let finString: string = "["
    for (let i = 0; i < pool.length; i++) {
        finString += pool[i].toString() + (i === pool.length - 1 ? "]" : ",");
    }
    return finString
}

//todo change this to just call rollDice(1, sides)? or maybe remove altogether?

//takes an array of numbers and processes it into a clean RollResults object
export function ProcessRolls(rolls: number[]) : RollResults{

}

//todo refactor this for the new hashmap, also add version that can do multiple die types
export function rollDice(count: number, sides: number): RollResults {
    // let result: number[] = Array(9).fill(0);
    let RetMap: Map<number, number[]> = new Map<number, number[]>([[sides, []]]);

    //if I want to sort, this stackoverflow post seems a good way to efficiently insert the roll result
    //https://stackoverflow.com/a/21822316
    // probably more marginally efficient to do it while iterating the array the first time?
    //to be fair, it also probably it doesn't matter either way given the scale this app
    // will likely be working at. But in case vvd is reading this
    // I still want to show off that I can handle those performance tradeoffs.
    // However, between those multiple layers of likelihood, one thing I know for CERTAIN is that none of this
    // is worth worrying about until I get the rest of the app working. so I'm gonna come back to this

    let min: number = 101;// I may add a d100, but otherwise no dice should ever roll higher than that
    let max: number = -1;
    let total: number = 0;
    console.log("rolling " + count + " dice with " + sides + " sides");
    _executeRolls(count, sides)
    //
    // for (let i: number = 0; i < count; i++) {
    //     let rollResult: number = _executeRoll(sides);
    //     max = Math.max(max, rollResult);
    //     min = Math.min(min, rollResult);
    //     total += rollResult;
    //     RetMap.get(sides)?.push(rollResult)
    // }

    const avg: number = total / count; //may need to +1?
    let result: RollResults = new RollResults(RetMap, total, max, min, avg);
    if (result === undefined) {
        throw Error("result at the end of rollDice() was undefined")
    }
    return result;
}

async function _executeRolls(count: number, sides: number): Promise<RollResults> {
    const res = GenerateNumbers(1, sides, count);
    console.log("execRolls res " + res);
    if (res !== undefined) {
        return res;
    }
    throw Error("result at the end of rollDice() was undefined")

}

function _executeRoll(sides: number): number {

    const myNum = 2
    GenerateNumbers(1, 5, 1).then(results => {
        console.log("generated numbers successful?" + results)
        return results
    }
    )
    // let myNum =
    const result: number = 1 + Math.floor(Math.random() * sides)
    console.log("you rolled a " + sides + " sided die and the result is: " + result);
    return result; //has to return outside the then(){func}
}

//#endregion
