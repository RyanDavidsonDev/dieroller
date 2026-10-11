import React, {JSX, RefObject, useRef, useState} from 'react';
import './App.css';

//#region visuals

//##region App
function App() {
  const [results, setResults] = useState<RollResults>();

  return (
    <div className="App">
      <header className="App-header">
        <header className="App-header__title">
          Hello
        </header>
        <header className="App-header__subtitle">
          Please click a button below to roll a die
        </header>

      </header>
      <div className="DiceTable">
        <div className="DiceTable">
          <DiceRow sides={6} onRoll={setResults}></DiceRow>
          <DiceRow sides={8} onRoll={setResults}></DiceRow>
          <DiceRow sides={10} onRoll={setResults}></DiceRow>
          <DiceRow sides={12} onRoll={setResults}></DiceRow>
          <DiceRow sides={20} onRoll={setResults}></DiceRow>
        </div>
      </div>
      <div className="Results">
        {/*if (results?.allresults){*/}
        <DisplayResults results={results} ></DisplayResults>


      </div>
    </div>
  );
//##endregion
//## region DisplayResults
  function DisplayResults({results}: {results: RollResults | undefined}){
    if(results === undefined || results?.resultsMap == null) {
      return <></>
    }
    let ret: React.JSX.Element = <></>;
    if(results.resultsMap.size === 0){
      throw new Error("somehow the length of AllResults is Zero despite the roll results being valid" +
          "\n not sure how this happened but something is definitely wrong.");
    }


    if(results.resultsMap.size ===1){
      //we only rolled one type of die
      let currentSideType :number = results.resultsMap.keys().next().value;
      let rollPoolOfCurrentSideType = results.resultsMap.get(currentSideType);
      if( rollPoolOfCurrentSideType ===undefined) {
        throw new Error("roll pool of current side types is invalid");
      }


      if(rollPoolOfCurrentSideType.length ===0){
        throw new Error("roll pool of current side type is valid, but empty");

      //###region OneDie
      } else if(rollPoolOfCurrentSideType.length === 1) {
        //we only rolled one singular die, so this will be the absolute simplest possible display

        ret =
            <div className="Results-Container">
                                                                 {/*equivalent to allResults.keys()[0]. has to be done this way because keys() is an iterator  */}
              <header className="Results-header__subtitle">you  rolled a d{results.resultsMap.keys().next().value} and got:</header>
              <header className="Results-header__title">
                {results.resultsMap.values().next().value}
              </header>
            </div>
      //###endregion

      //###region MultipleOfSingleType
      } else {
        //we only rolled one type of die, but multiple of them

        //I guess the best way to show this would be to sort the results in ascending order
        //i.e. you rolled 3d8 and got: /n 3+5+6+8+8=30
        ret =
            <div className="Results-Container">
              <header className="Results-header__subtitle">you  rolled {results.resultsMap.size}d{results.resultsMap.keys().next().value} and got:</header>
              <header className="Results-header__subtitle">{StringifyPool(rollPoolOfCurrentSideType)}</header>
              <header className="Results-header__subtitle">For a total of:</header>
              <header className="Results-header__title">{results.total}</header>
              <header className="Results-header__subtitle">The highest roll was {results.highest}</header>
              <header className="Results-header__subtitle">The lowest roll was {results.lowest}</header>
              <header className="Results-header__subtitle">The average was {results.average}</header>
              <header className="Results-header__subtitle"></header>

            </div>


      //###endregion
      }

    } else {
    //###region MultipleTypes
      //future development will allow the user to roll multiple types of dice at once
      //ie 3d6 and 4d8
      //However for the time being this doesn't actually feel as crucial as I first thought.
      // So in the interest of being able to apply to vvd as soon as possible I'm tabling it for now.
      // Vvd if you're reading this then maybe check back later to see if I've updated that.
      //
      // The backend should actually be relatively well set up to calculate everything.
      // I just would have to figure out a good way of displaying it.
      // I guess one really simple method would be to just chain the current presentation method? But
      // I'm not even fully satisfied with that, and ideally I'd like to set up a table of some sort.
      // having different rows for each die type and so on. Idk, there's a lot of options there.
      // but I'm trying to avoid rabbit holes cause I want to submit to VVD as soon as possible
      // since I don't know how long the application will be up.
      // All that to say, VVD if you're reading this, here's some proof I also know how to manage
      // production timelines and limit scope creep.
      //####region Sa
      //multiple dice - probably start by checking if they're all the same # of sides?
      ret =
      <div className="Results-Container">
        <header className="Results-header__title">you rolled</header>
          <header className="Results-header__subtitle">
            {(results?.resultsMap?.size ===1 ? "a ":results?.resultsMap?.size.toString())
                + "d" + (results?.resultsMap?.keys().next().value) + " and got at total of " + results?.total}
          </header>
      </div>
    //###endregion
    }
    return ret
  }

  //##endregion

}


function DiceRow({sides, onRoll} :{sides:number ; onRoll:(results:RollResults ) => void }): JSX.Element {
// function DiceRow({sides, onRoll} :{sides:number ; onRoll:(results:RollResults ) => }) {}
    // {sides}:{sides:number}, onRoll:(results:RollResults)=>{}){
// function DiceRow({sides}:{sides:number}){

  const countRef: (RefObject<HTMLInputElement | null> |null )   = useRef<HTMLInputElement>(null);


  function handleRollMultiple(sides:number){
    let count:number = 0;
    if(countRef?.current?.value !== undefined){
      count = parseInt(countRef.current.value);
    }
    if(count !== 0){



      onRoll(rollDice(count, sides));
    }
  }

  return(
      <div className="diceTable__row">
        <span className="diceTable__label">
          Roll a D{sides}
        </span>
        <button
            className="diceTable__button"
            // onClick={() =>rollDie(6)}>
            onClick={() =>onRoll(rollDie(sides))}>
          D{sides} </button>
         <span className="diceTable__label" >
           or roll multiple
         </span>
        <input ref={countRef} type={"number"} min={1} step={1} />
        <button
            className="diceTable__button"
            //todo why is the counter resetting on button press?
            onClick={() => handleRollMultiple(sides)}>
          roll multiple</button>
      </div>
  )
}
//#endregion Visuals


//#region Internals

enum SortTypes{
  None="None",
  Ascending="Ascending",
  Descending="Descending"
}
class RollResults{

  resultsMap : Map<number, number[]> = new Map<number, number[]>();
  total: number = -1;
  highest: number= -1;
  lowest: number= -1;
  average: number= -1;
  //median would require either sorting the array, or implementing a separate algorithm.
  // It doesn't look too complicated, but it probably still wouldn't be a worthwhile rabbit hole
  //maybe this can be revisited when everything else is done. (MAYBE)

  constructor(_allResults:Map<number, number[]>, _total:number, _highest:number, _lowest:number, _average:number) {
    this.resultsMap = _allResults;
    this.total = _total;
    this.highest = _highest;
    this.lowest = _lowest;
    this.average = _average;

  }
  toString(){
    return "RollResults: [ [AllResults: " + JSON.stringify(this.resultsMap)
        + "] [total " + JSON.stringify(this.total)
        + "] [highest " + JSON.stringify(this.highest)
        + "] [lowest " + JSON.stringify(this.lowest)
        + "] [average " + JSON.stringify(this.average)
        + "] ]";
  }
}

function StringifyPool(pool: number[], sortBy: SortTypes = SortTypes.None){
  if(sortBy !== SortTypes.None){
    throw new Error("sort types other than none for StringifyPool() are not yet implemented. (Not even sure why anyone other than Ryan would be seeing this error message");
  }
  let finString : string = "["
  for (let i = 0; i < pool.length; i++) {

    finString+= pool[i].toString() + (i===pool.length-1? "]":",");
  }
  return finString
}

//TODO NEXT STEP is to do nice looking output (rather than terminal output)

function _executeRoll(sides: number):number {
  const result: number = 1+ Math.floor(Math.random()*sides)
  console.log("you rolled a " +sides+ " sided die and the result is: " + result);
  return result;
}

function rollDie(sides: number): RollResults{
  const result : number = _executeRoll(sides);

  let resArr: Map<number, number[]> = new Map<number, number[]>([[sides, [result]]]);
  // resArr = [{value:result, sides:sides}]
  // cons
  // t results :RollResults =
  const results =new RollResults(resArr, result, result, result, result);
  console.log("you also called the \"public\" rollDie function. the results are as follows:" + results.toString());
  return results
}

//todo refactor this for the new hashmap, also add version that can do multiple die types
function rollDice(count:number, sides:number):RollResults{
  // let result: number[] = Array(9).fill(0);
  let RetMap : Map<number, number[]> = new Map<number, number[]>([[sides, []]]);

  //if I want to sort, this stackoverflow post seems a good way to efficiently insert the roll result
  //https://stackoverflow.com/a/21822316
  // probably more marginally efficient to do it while iterating the array the first time?
  //to be fair, it also probably it doesn't matter either way given the scale this app
  // will likely be working at. But in case vvd is reading this
  // I still want to show off that I can handle those performance tradeoffs.
  // However, between those multiple layers of likelihood, one thing I know for CERTAIN is that none of this
  // is worth worrying about until I get the rest of the app working. so I'm gonna come back to this

  let min:number = -1;
  let max:number = 101;// I may add a d100, but otherwise no dice should ever roll higher than that
  let total:number =0;
  console.log("rolling " + count + " dice with " + sides + " sides");
  for (let i:number = 0; i < count; i++) {
    let rollResult: number = _executeRoll(sides);
    min = Math.max(max, rollResult);
    max = Math.min(max, rollResult);
    total += rollResult;
    RetMap.get(sides)?.push(rollResult)
    // result[i-1] = _executeRoll(sides);
  }

  //, _total:number, _highest:number, _lowest:number, _average:number) {
  const avg :number = total/count; //may need to +1?
  let result : RollResults = new RollResults(RetMap, total, max, min, avg);
  if(result === undefined){
    throw Error("result at the end of rollDice() was undefined")
  }
  return result;
}
//#endregion

export default App;
