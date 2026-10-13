import React, {JSX, RefObject, useRef, useState} from 'react';
import './App.css';
import {rollDice, RollResults, StringifyPool} from "./DiceLogic";

//#region visuals

//##region App
function App() {
    const [results, setResults] = useState<RollResults>();

    return (<>
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
                        <DiceRow sides={4} onRoll={setResults}></DiceRow>
                        <DiceRow sides={6} onRoll={setResults}></DiceRow>
                        <DiceRow sides={8} onRoll={setResults}></DiceRow>
                        <DiceRow sides={10} onRoll={setResults}></DiceRow>
                        <DiceRow sides={12} onRoll={setResults}></DiceRow>
                        <DiceRow sides={20} onRoll={setResults}></DiceRow>
                        <DiceRow sides={100} onRoll={setResults}></DiceRow>
                    </div>
                </div>
                <div className="Results">
                    <DisplayResults results={results}></DisplayResults>
                </div>
                <div className="footer">
          <span>
             <a
                 className="App-link"
                 href={`${process.env.PUBLIC_URL}/credits.md`}
                 target="_blank"
                 rel="noopener noreferrer"
             >Credits
            </a>
          </span>
                    <span>
            <a
                className="App-link"
                href="https://github.com/ryandavidsondev/dieroller"
                rel="noopener noreferrer"
                target="_blank"
            >Github</a>

          </span>
                </div>
            </div>
        </>
    );
//##endregion
//## region DisplayResults
    function DisplayResults({results}: { results: RollResults | undefined }) {
        if (results === undefined || results?.resultsMap == null) {
            return <></>
        }
        let ret: React.JSX.Element = <></>;
        if (results.resultsMap.size === 0) {
            throw new Error("somehow the length of AllResults is Zero despite the roll results being valid" +
                "\n not sure how this happened but something is definitely wrong.");
        }

        //we only rolled one type of die
        if (results.resultsMap.size === 1) {

            let currentSideType: number = results.resultsMap.keys().next().value;
            let rollPoolOfCurrentSideType = results.resultsMap.get(currentSideType);

            if (rollPoolOfCurrentSideType === undefined) {
                throw new Error("roll pool of current side types is invalid");
            }
            if (rollPoolOfCurrentSideType.length === 0) {
                throw new Error("roll pool of current side type is valid, but empty");

                //###region OneDie
            } else if (rollPoolOfCurrentSideType.length === 1) {
                //we only rolled one singular die, so this will be the absolute simplest possible display

                ret =
                    <div className="Results-Container">

                        <header className="Results-header__subtitle">you rolled a
                            d{results.resultsMap.keys().next().value} and got:
                        </header>
                        <header
                            className="Results-header__title">        {/*^ equivalent to resultsMap.keys()[0]. has to be done this way because keys() is an iterator  */}
                            {results.resultsMap.values().next().value}
                        </header>
                    </div>
                //###endregion

                //###region MultipleOfSingleType
            } else {
                //we only rolled one type of die, but multiple of them
                ret =
                    <div className="Results-Container">
                        <header className="Results-header__subtitle">you
                            rolled {results.resultsMap.get(currentSideType)?.length}d{results.resultsMap.keys().next().value} and
                            got:
                        </header>
                        <header className="Results-header__subtitle">{StringifyPool(rollPoolOfCurrentSideType)}</header>
                        <header className="Results-header__subtitle">For a total of:</header>
                        <header className="Results-header__title">{results.total}</header>
                        <header className="Results-moreResults">The highest roll was {results.highest}</header>
                        <header className="Results-moreResults">The lowest roll was {results.lowest}</header>
                        <header className="Results-moreResults">The average was {results.average}</header>
                        <header className="Results-moreResults"></header>
                    </div>
                //###endregion
            }

        } else {
            //###region MultipleTypes
            //####region comments
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
            //####endregion comments

            //commented code below is an old copy/paste of the above roll processing. I'm keeping it for
            // now just in case it serves as a helpful starting point, but it's probably obsolete.

            //multiple dice - probably start by checking if they're all the same # of sides?
            // ret =
            // <div className="Results-Container">
            //   <header className="Results-header__title">you rolled</header>
            //     <header className="Results-header__subtitle">
            //       {(results?.resultsMap?.size ===1 ? "a ":results?.resultsMap?.size.toString())
            //           + "d" + ((results.resultsMap.get(results?.resultsMap?.keys().next().value))?.values()) + " and got at total of " + results?.total}
            //     </header>
            // </div>
            //
        }
        return ret
    }

    //##endregion
}

function DiceRow({sides, onRoll}: { sides: number; onRoll: (results: RollResults) => void }): JSX.Element {

    const countRef: (RefObject<HTMLInputElement | null> | null) = useRef<HTMLInputElement>(null);

    function handleRollMultiple(sides: number) {
        let count: number = 0;
        if (countRef?.current?.value !== undefined) {
            count = parseInt(countRef.current.value);
            if (isNaN(count)) {
                count = 1;
                //future dev I'll want to properly fork this logic. probably return early
                // if count is NaN. That'll allow me to step over each field and skip the ones
                // that are empty. for now just turning an empty field should be fine
            }
            count = Math.max(1, count)
            count = Math.min(70, count)
        }
        if (count !== 0) {

            onRoll(rollDice(count, sides));
        }
    }

    return (
        <div className="diceTable__row">
        <span className="diceTable__label">
          Roll a D{sides}
        </span>
            <button
                className="diceTable__button"
                onClick={() => onRoll(rollDice(1, sides))}>
                D{sides} </button>
            <span className="diceTable__label">
           or roll multiple
         </span>
            <input ref={countRef} type={"number"} min={1} max={70} step={1}/>
            <button
                className="diceTable__button"
                //todo why is the counter resetting on button press?
                onClick={() => handleRollMultiple(sides)}>
                roll multiple
            </button>
        </div>
    )
}

//#endregion Visuals

export default App;
