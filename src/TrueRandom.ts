
async function submitRequest(url:string):Promise<number[]> {



    // console.log("fetching url, url is " + url);
    let response :Response  = new Response();
    response = await fetch(url);

    if(!response.ok){
        throw new Error("response had an error: " + response.statusText);
    }
    //result is either a number or an arr of nums?
    const result = await response.text();
    // console.log("results "+ result);
    const numsAsStrings: string[] = result.split("\n").filter(s => (s!==""));

    return numsAsStrings.map(s => Number.parseInt(s.toString()));
}

// #cleanup do SubmitRequest and Generate numbers really need to be separate functions?
//I think I originally split them because that was how it was done in one of the examples of async
// programming that I was trying to follow. Might be easier to keep it split in case I need to
// refactor my API calls in the future? not sure.

function procedurallyGenerateRandomNumbers(min:number, max:number, count:number): number[]{
    console.warn("warning, the true random number generation failed, using more procedurally random numbers as a fallback")
    const numbers : number[] = [];
    for(let i=0; i<count; i++){
        const rand =Math.floor(Math.random()*max)
        // console.log("procgened num is " + rand)
        numbers.push(rand);
    }
    return numbers;
}

export async function generateNumbers(min:number, max:number, count:number) {
    const url =
        "https://www.random.org/integers/?num=" + count + "&min=" + min + "&max=" + max + "&col=1&base=10&format=plain&rnd=new"
    try{
        // console.log("gen nums called, url is " + url);
        const numbers: number[] = await submitRequest(url)
        // console.log("fetched numbers" + numbers.toString())

        return numbers

    } catch(err){
        if (err instanceof Error){
            console.error("failed to submit request: " + err.message);
        } else {
            console.error("an unkown error ocurred: " + err)
        }
        return procedurallyGenerateRandomNumbers(min, max, count);
    }

}
