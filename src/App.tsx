import React, {JSX, RefObject, useRef, useState} from 'react';
import './App.css';
import {rollDice, RollResults, StringifyPool} from "./DiceLogic";
// import {Interface} from "node:readline";

//#region visuals

//##region App
function App() {
    const [results, setResults] = useState<RollResults>();
    const [history, setHistory] = useState<JSX.Element[]>([]);
    const [showHistory, setShowHistory] = useState<boolean>(false);
    // const prevHistory = history.slice(1).map(value =>{return value})

    function handleRoll(newResults: RollResults) {
        console.log("received roll, old results were " + results + " new is " +newResults);
        if(newResults !== undefined){
            setResults(newResults)
            const newElement = ResultsToElement(newResults)
            setHistory( [newElement, ...history])

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
                                <RollSingle sides={4} onRoll={handleRoll}></RollSingle>
                                <RollSingle sides={6} onRoll={handleRoll}></RollSingle>
                                <RollSingle sides={8} onRoll={handleRoll}></RollSingle>
                            </div>
                            <div className="rollButtons__col">
                                <RollSingle sides={10} onRoll={handleRoll}></RollSingle>
                                <RollSingle sides={12} onRoll={handleRoll}></RollSingle>
                                <RollSingle sides={20} onRoll={handleRoll}></RollSingle>
                            </div>
                            <div className="rollButtons__col">
                                <RollSingle sides={2} onRoll={handleRoll} message={"Flip a "} buttonText={"coin"}></RollSingle>
                                <RollSingle sides={99} onRoll={handleRoll}></RollSingle>
                                <RollSingle sides={100} onRoll={handleRoll}></RollSingle>
                            </div>
                        </div>



                        <div className="rollButtons__header">
                            Or, roll multiple
                        </div>
                        <RollMultiple onRoll={handleRoll}></RollMultiple>
                    </div>


                        <div className="Results">
                            {/*history*/}
                            {history[0]}

                            {/*<ResultsToElement results={results}></ResultsToElement>*/}
                            <div className="divider">
                                <button className="showHistory" onClick={( ) =>{setShowHistory(!showHistory)}}>
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
    function ResultsToElement(results: RollResults) {
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
                        <header className="Results-text">you
                            rolled {results.resultsMap.get(currentSideType)?.length}d{results.resultsMap.keys().next().value} and
                            got:
                        </header>
                        <header className="Results-array">{StringifyPool(rollPoolOfCurrentSideType)}</header>
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
            {history.slice(1).map((value) => {
                return <div className="history-item">
                    {value}
                    {/*<button className="RollAgain-button">Roll this again</button>*/}
                </div>
            })}
            {/*{history.slice(1).map((value) => (return value))}*/}
        </div>
    }

    //##endregion
}

interface DiceRowProps{
    sides: number;
    onRoll: Function;
    message?:string;
    buttonText?:string;
}

function RollSingle(props: DiceRowProps): JSX.Element {
    //set message and button text ; if we were passed non-default vals, use those, otherwise use default
    const message = (props.message === undefined ? "Roll a " : props.message) ;
    const buttonText = (props.buttonText === undefined ?( "D" + props.sides) : props.buttonText) ;

    if(props.message === undefined) {
        props = {sides: props.sides, onRoll: props.onRoll, message:"Roll a"};
        // props.message = "Roll A"
    }

    if(props.buttonText === undefined) {
        props = {sides: props.sides, onRoll: props.onRoll, message:"Roll a"};
        // props.message = "Roll A"
    }

    async function handleClickSingle(sides:number) {
    // async function handleClickSingle(props: handleClickProps) {
        try {
            await rollDice(1, sides).then(results => {
                props.onRoll(results)
            });

        } catch (err) {

            if (err instanceof Error) {
                console.error("failed to submit request: " + err.message);
            } else {
                console.error("an unknown error occurred: " + err)
            }
        }
    }

    return (
        <div className="diceTable__row">
            {message}
            <button
                className="diceTable__button"
                onClick={() => handleClickSingle(props.sides)}>
                {buttonText} </button>

        </div>
    )
}

function RollMultiple({onRoll} : {onRoll:Function}): JSX.Element{

    const countRef: (RefObject<HTMLInputElement | null> | null) = useRef<HTMLInputElement>(null);
    // const sidesRef: (RefObject<HTMLInputElement | null> | null) = useRef<HTMLInputElement>(null);
    // const sidesRef : (RefObject<HTMLSelectElement | null> | null) = useRef<HTMLSelectElement>(null);
    const [sides, setSides] = useState<number>(6);

    // let sides; //stored at this level so the return func can update the text when user selects coin


    async function handleClickMultiple() {
        let count: number;
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
        } else {
            throw new Error("CountRef is undefined")
        }

        if (count !== 0) {
            console.log("rolling " + count + "d" + sides );

            onRoll(await rollDice(count, sides));
        }
    }

    return (
        <>

            {sides ===2 ? "Flip": "Roll"}
            <input ref={countRef} type={"number"} min={1} max={70} step={1}/>

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

            {/*<input ref={sidesRef} type={"number"} min={1} max={100} step={1}/>*/}
            {" "}
            <button
                className="diceTable__button"
                onClick={() => handleClickMultiple()}>
                roll
            </button>
        </>
    )
}

//#endregion Visuals

export default App;
