import React, {ChangeEvent, JSX, RefObject, useRef, useState} from 'react';
import './App.css';
import {rollDice, RollResults, StringifyPool} from "./DiceLogic";
import {Interface} from "node:readline";

//#region visuals

//##region App
function App() {
    const [results, setResults] = useState<RollResults>();
    const [history, setHistory] = useState<RollResults[]>([]);
    const [showHistory, setShowHistory] = useState<boolean>(false);
    // const prevHistory = history.slice(1).map(value =>{return value})

    function updateResults(newResults: RollResults) {
        console.log("received roll, old results were " + results + " new is " +newResults);
        if(newResults !== undefined){
            setResults(newResults)
            const newElement = ResultToElement({results:newResults})
            setHistory( [newResults, ...history])

        } else {
            throw new Error("newResult was undefined");
        }
    }


    return (
        <>
            <div className="App">
                <div className="header">
                    <header className="header__title">
                        True Random Di(c)e Roller
                    </header>
                    {/*does this need to be a header?*/}
                    <header className="header__subtitle">
                        Please click a button below to roll a die
                    </header>
                    <div className="divider">
                        <a
                            className="App-link"
                            href={`${process.env.PUBLIC_URL}/credits.html`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >Credits
                        </a>
                        <a
                            className="App-link"
                            href="https://github.com/ryandavidsondev/dieroller"
                            rel="noopener noreferrer"
                            target="_blank"
                        >Github</a>
                    </div>
                </div>
                <div className="main">
                    <div className="rollButtons">
                        <div className="rollButtons__header">
                            Roll a single die of a particular type
                        </div>
                        <div className="rollButtons__colContainer">
                            <div className="rollButtons__col">
                                <RollSingle sides={4} onResultsCalculated={updateResults}></RollSingle>
                                <RollSingle sides={6} onResultsCalculated={updateResults}></RollSingle>
                                <RollSingle sides={8} onResultsCalculated={updateResults}></RollSingle>
                            </div>
                            <div className="rollButtons__col">
                                <RollSingle sides={10} onResultsCalculated={updateResults}></RollSingle>
                                <RollSingle sides={12} onResultsCalculated={updateResults}></RollSingle>
                                <RollSingle sides={20} onResultsCalculated={updateResults}></RollSingle>
                            </div>
                            <div className="rollButtons__col">
                                <RollSingle sides={2} onResultsCalculated={updateResults}
                                            message={"Flip a "} buttonText={"coin"}></RollSingle>
                                <RollSingle sides={99} onResultsCalculated={updateResults}></RollSingle>
                                <RollSingle sides={100} onResultsCalculated={updateResults}></RollSingle>
                            </div>
                        </div>



                        <div className="rollButtons__header">
                            Or, roll multiple
                        </div>
                        <RollMultiple onResultsCalculated={updateResults}></RollMultiple>
                    </div>


                        <div className="Results">
                            {/*history*/}
                            <ResultToElement results={history[0]}></ResultToElement>

                            {/*<ResultsToElement results={results}></ResultsToElement>*/}
                            <div className="divider">
                                <button className="showHistory" onClick={() =>{
                                    setShowHistory(!showHistory)}}>
                                    {showHistory? "Hide History" : "Show History"}
                                </button>
                            </div>
                            <RenderHistory></RenderHistory>
                        </div>

                </div>
            </div>
        </>
    );
//##endregion
//## region DisplayResults
    function ResultToElement({results} : {results: RollResults}): (JSX.Element){
        if (results === undefined || results?.resultsMap == null) {
            return <></>
        }
        let ret: React.JSX.Element = <></>;
        if (results.resultsMap.size === 0) {
            throw new Error("somehow the length of AllResults is Zero despite the roll results " +
                "being valid" +
                "\n not sure how this happened but something is definitely wrong.");
        }

        //we only rolled one type of die
        if (results.resultsMap.size === 1) {

            let currentSideType: number = results.resultsMap.keys().next().value;
                                   {/*^ equiv. to resultsMap.keys()[0] -
                                    has to be done this way because keys() is an iterator (not array)*/}
            console.log("cst is" + currentSideType)
            let rollPoolOfCurrentSideType = results.resultsMap.get(currentSideType);
            const resultAsNum = results.resultsMap.values().next().value
            if (rollPoolOfCurrentSideType === undefined) {
                throw new Error("roll pool of current side types is invalid");
            }
            if (rollPoolOfCurrentSideType.length === 0) {
                throw new Error("roll pool of current side type is valid, but empty");

                //###region OneDie
            } else if (rollPoolOfCurrentSideType.length === 1) {
            //we only rolled one singular die, so this will be the absolute simplest possible display
                const isCoin:boolean = currentSideType === 2

                ret =
                    <div className="Results-Container">

                        <header className="Results-header__subtitle">
                            You {(isCoin? "flipped" : "rolled")} a
                            {(isCoin? "coin" : "D" + currentSideType)} and got:

                        </header>
                        <header
                            className="Results-header__title">
                            {(isCoin?
                                (resultAsNum ==1? "Heads": "Tails")
                            :resultAsNum )}
                        </header>
                    </div>
                //###endregion

                //###region MultipleOfSingleType
            } else {
                //we only rolled one type of die, but multiple of them
                ret =
                    <div className="Results-Container">
                        <header className="Results-text">you
                            rolled {results.resultsMap.get(
                                currentSideType)?.length}d{results.resultsMap.keys().next().value}
                            and got:
                        </header>
                        <header className="Results-array">
                            {StringifyPool(rollPoolOfCurrentSideType)}</header>
                        <header className="Results-text">For a total of:</header>
                        <header className="Results-header__title">{results.total}</header>
                        <div className="Results-MoreContainer">
                            <div className="Results-moreResults">
                                <div className="Results-moreResults__header">
                                    lowest
                                </div>
                                <div className="Results-moreResults__content">
                                    {results.lowest}
                                </div>
                            </div>

                            <div className="Results-moreResults">
                                <div className="Results-moreResults__header">
                                    average
                                </div>
                                <div className="Results-moreResults__content">
                                    {Number(results.average.toPrecision(3))}
                                </div>
                            </div>
                            <div className="Results-moreResults">
                                <div className="Results-moreResults__header">
                                    highest
                                </div>
                                <div className="Results-moreResults__content">
                                    {results.highest}
                                </div>
                            </div>

                        </div>
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

    // { showHistory? ): null}
    function RenderHistory(): JSX.Element {
        if(!showHistory) {
            return <></>;
        }
        for( let i = 1; i< history.length; i++ ) {

        }

        return <div className="history-container">
            {history.slice(1).map((value: RollResults)  => {
                return <div className="history-item">
                    <ResultToElement results={value}></ResultToElement>
                    {/*onClick={() => handleClick({sides, count:1, onResultsCalculated})}>*/}

                    <button className="RollAgain-button" onClick={()=>rollAgain({results:value, onResultsCalculated:(() => updateResults(value))})
                    }>Roll this again</button>
                </div>
            })}
        </div>
    }

    //##endregion
}

interface DiceRowProps{
    sides: number;
    count?: number
    onResultsCalculated: Function;
    message?:string;
    buttonText?:string;
}


async function rollAgain({results, onResultsCalculated} : {results:RollResults, onResultsCalculated: Function}) {
    if(results.resultsMap.size === 0) {
        throw new Error("roll results is empty");
    } else {
        const sides:number =results.resultsMap.keys().next().value;
        const prevRolls =results.resultsMap.get(results.resultsMap.keys().next().value)

        if(sides === undefined){
            throw new Error("first element of rollResults (sides) is empty");
        }
        if(prevRolls=== undefined){
            throw new Error("first element of rollResults (sides) is empty");
        }
        const numRolls:number = prevRolls.length;
        if(numRolls ===0){
            throw new Error("previous roll results results is empty");
        }

        handleClick({sides, count:numRolls, onResultsCalculated})
        //
        // try{
        //     if(results.resultsMap.size === 1) {
        //
        //         await rollDice(numRolls, sides)
        //             // .then(results => {
        //             // onRoll(results)}
        //     }
        // } catch(e){
        //     console.error(e);
        //
        // }
    }
}

async function handleClick ({sides, count, onResultsCalculated} :
                            {sides:number, count:number, onResultsCalculated: Function}) {


    try {
        await rollDice(count, sides).then(results => {
            onResultsCalculated(results)
        });

    } catch (err) {

        if (err instanceof Error) {
            console.error("failed to submit request: " + err.message);
        } else {
            console.error("an unknown error occurred: " + err)
        }
    }
}



function RollSingle({
                        sides,
                        onResultsCalculated,
                        message = (sides === 2 ? "flip a " : "Roll a "),
                        buttonText = ("D" + sides),
                    }: DiceRowProps): JSX.Element {
    //set message and button text ; if we were passed non-default vals, use those, otherwise use default
    // const message = (props.message === undefined ? "Roll a " : props.message) ;
    // const buttonText = (props.buttonText === undefined ?( "D" + props.sides) : props.buttonText) ;
    //I believe these default initializations are 'no longer necessary' as instead they're being
    //handled more idomatically by destructuring the interface in handleClick()'s signature
    return (
        <div className="diceTable__row">
            {message}
            <button
                className="diceTable__button"
                onClick={() => handleClick({sides, count:1, onResultsCalculated})}>
                {buttonText} </button>

        </div>
    )
}

function RollMultiple({onResultsCalculated}: {onResultsCalculated: Function}): JSX.Element {

    const sidesRef: (RefObject<HTMLInputElement | null> | null) = useRef<HTMLInputElement>(null);
    const [sides, setSides] = useState<number>(6);
    const [count, setCount] = useState(1);

    return (
        <>

            {sides ===2 ? "Flip": "Roll"}
            <input type={"number"} min={1} max={70} step={1} onChange={(value:ChangeEvent<HTMLInputElement>)=>{
                const newVal = value.target.value

                console.log("changing count to " + value.target.value);
                let newValNum = parseInt(newVal);

                //feels like a non-idiomatic way of catching this issue #cleanup
                if (isNaN(newValNum)) {
                    newValNum = 1;
                    //future dev I'll want to properly fork this logic. probably return early
                    // if count is NaN. That'll allow me to step over each field and skip the ones
                    // that are empty. for now just turning an empty field should be fine
                }
                newValNum = Math.max(1, newValNum)
                newValNum = Math.min(70, newValNum)

                setCount(newValNum);
            }


            }/>

            <select value={sides} onChange={e=>setSides(Number(e.target.value))}>
                <option value={2}>coins</option>
                <option value={4}>d4</option>
                <option value={6}>d6</option>
                <option value={8}>d8</option>
                <option value={10}>d10</option>
                <option value={12}>d12</option>
                <option value={20}>d20</option>
                <option value={99}>d99</option>
                <option value={100}>d100</option>
            </select>

            {" "}
            <button
                className="diceTable__button"
                onClick={() => handleClick({sides,
                    count, onResultsCalculated })}>
                roll
            </button>
        </>
    )
}

//#endregion Visuals

export default App;
