import {generateNumbers} from "./TrueRandom";

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

// takes a map of numbers and processes it into a clean RollResults object
export function processRolls(map: Map<number, number[]>) : RollResults{

    let min: number = 101;// no dice should ever roll higher than a d100
    let max: number = -1;
    let total: number = 0;
    let average: number = -1;

    map.forEach((pool, key) => {
        if( pool === undefined){
            throw Error(`pool for key ${key} was undefined`)
        } else if ( pool.length === 0){
            throw Error(`pool for key ${key} has no members`)
        }

        //defined outside the first loop cause why not, but need to be reset for each key
        //actually maybe not? depends on whether we want these stats to be for the whole array
        // or for each group of dice. the answer is probably both but either way that's a
        // question to be revisited when I implement the ability to roll multiple types of dice
        // which is to say - not right now.
        // min = 101;
        // max = -1;
        // total = 0;
        for (let i: number = 0; i < pool.length; i++) {

            max = Math.max(max, pool[i]);
            min = Math.min(min, pool[i]);
            total += pool[i];
        }

        average = total / pool.length;
    });

    return new RollResults(map, total, max, min, average);
}

//todo refactor this for the new hashmap, also add version that can do multiple die types
export async function rollDice(count: number, sides: number): Promise<RollResults> {
    const ResultsMap: Map<number, number[]> = new Map<number, number[]>();

    //if I want to sort, this stackoverflow post seems a good way to efficiently insert the roll result
    //https://stackoverflow.com/a/21822316
    // probably more marginally efficient to do it while iterating the array the first time?
    //to be fair, it also probably it doesn't matter either way given the scale this app
    // will likely be working at. But in case vvd is reading this
    // I still want to show off that I can handle those performance tradeoffs.
    // However, between those multiple layers of likelihood, one thing I know for CERTAIN is that none of this
    // is worth worrying about until I get the rest of the app working. so I'm gonna come back to this

    // console.log("rolling " + count + " dice with " + sides + " sides");
    const resArr : number[] |undefined = await generateNumbers(1, sides, count)
    if( resArr !== undefined ) {
        ResultsMap.set(sides, resArr);
        //could also maybe set and make ResMap a const again? todo experiment w that after async is working
        // Push( sides, resArr);
    } else {
        console.error("resArr is not defined");
    }

    let results: RollResults = processRolls(ResultsMap);
    if (results === undefined) {
        throw Error("result at the end of rollDice() was undefined")
    }
    return results;
}

//#endregion
