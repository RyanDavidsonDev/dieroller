import React, {InputHTMLAttributes, useRef, useState} from 'react';
import './App.css';

//#region visuals

function App() {
  const [results, setResults] = useState<RollResults>();

  return (
    <div className="App">
      <header className="App-header">
        <header className="App-header__title">
          Welcome
        </header>
        <header className="App-header__subtitle">
          Please click a button below to roll a die
        </header>

      </header>
      <div className="DiceTable">
        <div className="DiceTable">
          <DiceRow sides={6}></DiceRow>
        </div>
      </div>
      <div className="Results">
        <header className="Results-header__title">you rolled</header>
        <header className="Results-header__subtitle">
          {(results?.allResults?.length ===1 ? "a ":results?.allResults?.length.toString())
              + "d" + (results?.allResults?.[0])?.sides + " and got at total of " + results?.total}
        </header>
      </div>
    </div>
  );

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
  allResults?: {
    value:number;
    sides:number;
  }[];
  total?: number = -1;
  highest?: number= -1;
  lowest?: number= -1;
  average?: number= -1;

  constructor(allResults:{value:number, sides:number}[], total?:number, highest?:number, lowest?:number, average?:number) {
    this.allResults = allResults;
    this.total = total;
    this.highest = highest;
    this.lowest = lowest;
    this.average = average;
  }
  toString(){
    return "RollResults: [ [AllResults: " + JSON.stringify(this.allResults)
        + "] [total " + JSON.stringify(this.total)
        + "] [highest " + JSON.stringify(this.highest)
        + "] [lowest " + JSON.stringify(this.lowest)
        + "] [average " + JSON.stringify(this.average)
        + "] ]";
  }
}

//TODO NEXT STEP is to do nice looking output (rather than terminal output)

function _rollDie(sides: number):number {
  const result: number = 1+ Math.floor(Math.random()*sides)
  console.log("you rolled a " +sides+ " sided die and the result is: " + result);
  return result;
}

function rollDie(sides: number): RollResults{
  const result : number = _rollDie(sides);

  let resArr: {value:number, sides:number}[]; //todo finish initializing
  resArr = [{value:result, sides:sides}]
  // cons
  // t results :RollResults =
  const results =new RollResults(resArr, result, result, result, result);
  console.log("you also called the \"public\" rollDie function. the results are as follows:" + results.toString());
  return results
}

//todo write version of this that can do multiple types of dice
function rollDice(count:number, sides:number):number[]{
  let result: number[] = Array(9).fill(0);
  console.log("rolling " + count + " dice with " + sides + " sides");
  for (let i = 0; i < count; i++) {
    result[i-1] = _rollDie(sides);
  }
  return result;
}
//#endregion

export default App;
