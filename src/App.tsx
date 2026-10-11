import React, {InputHTMLAttributes, useRef, useState} from 'react';
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
          <DiceRow sides={6}></DiceRow>
          <DiceRow sides={8}></DiceRow>
          <DiceRow sides={10}></DiceRow>
          <DiceRow sides={12}></DiceRow>
          <DiceRow sides={20}></DiceRow>
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
    if(results == undefined || results?.resultsMap == null) {
      return <></>
    }
    let ret: React.JSX.Element = <></>;
    if(results.resultsMap.size === 0){
      throw new Error("somehow the length of AllResults is Zero despite the roll results being valid" +
          "\n not sure how this happened but something is definitely wrong.");
    }

//todo need to update allresults.size with a check of allres.size AND allres.keys[1].size

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
        //we only rolled one singular die, so this will be absolute simplest possible display

        ret =
            <div className="Results-Container">
                                                                 {/*equivalent to allResults.keys()[0]. has to be done this way because keys() is an iterator  */}
              <header className="Results-header__subtitle">you  rolled a d{results.resultsMap.keys().next().value} and got:</header>
              <header className="Results-header__title">
                {results.resultsMap.values().next().value}
              </header>
            </div>
      //###endregion

      } else {
      //###region MultipleOfSingleType
        //we only rolled one type of die, but multiple of them
      //###endregion
      }

    } else {
    //###region MultipleTypes
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


  function DiceRow({sides}:{sides:number}){

    const countRef = useRef<HTMLInputElement>(null);
    function getCountRefVal():number {
      let val:number = 0;
      if(countRef.current?.value !== undefined){
        val = parseInt(countRef.current.value);
      }
      return val;
    }

    return(
        <div className="diceTable__row">
          <span className="diceTable__label">
            Roll a D{sides}
          </span>
          <button
              className="diceTable__button"
              // onClick={() =>rollDie(6)}>
              onClick={() =>setResults(rollDie(sides))}>
            D{sides} </button>
           <span className="diceTable__label" >
             or roll multiple
           </span>
          <input ref={countRef} type={"number"} defaultValue={1} min={1} step={1} />
          <button
              className="diceTable__button"
              onClick={() => rollDice( getCountRefVal(),sides)}>
            roll multiple</button>
        </div>
    )
  }
}
//#endregion Visuals


//#region Internals

class RollResults{
  //
  // allResults?: {
  //   value:number;
  //   sides:number;
  // }[];
  resultsMap : Map<number, number[]> = new Map<number, number[]>();
  total: number = -1;
  highest: number= -1;
  lowest: number= -1;
  average: number= -1;

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
function rollDice(count:number, sides:number):number[]{
  let result: number[] = Array(9).fill(0);
  console.log("rolling " + count + " dice with " + sides + " sides");
  for (let i = 0; i < count; i++) {
    result[i-1] = _executeRoll(sides);
  }
  return result;
}
//#endregion

export default App;
