//equivalent to fetch users
import {stringify} from "node:querystring";

async function SubmitRequest(url:string):Promise<number[]> {

    console.log("start of subReq")


    console.log("fetching url, url is " + url);
    let response :Response  = new Response();
    response = await fetch(url);
    if(!response.ok){
        throw new Error("response had an error: " + response.statusText);
    }
    //result is either a number or an arr of nums?
    const result = await response.text();
    console.log("results "+ result);
    const numsAsStrings: string[] = result.split("\n").filter(s => (s!==""));

    return numsAsStrings.map(s => Number.parseInt(s.toString()));
}


export async function GenerateNumbers(min:number, max:number, count:number) {
    const url =
        "https://www.random.org/integers/?num=" + count + "&min=" + min + "&max=" + max + "&col=1&base=10&format=plain&rnd=new"
    try{
        console.log("gen nums called, url is " + url);
        const numbers: number[] = await SubmitRequest(url)

        console.log("fetched numbers" + numbers.toString())


        return numbers

    } catch(err){
        if (err instanceof Error){
            console.error("failed to submit request: " + err.message);
        } else {
            console.error("an unkown error ocurred: " + err)
        }
    }

    // return await response.json();
    // fetch(url)
    //     .then(res => res.json())
    //     .then( data => {return data.json()});
    //
    // console.log("finished fetching url")
    // xhr.open("POST", url, true);
    //
    // console.log("url is " + url);
    // xhr.send();
    // xhr.onreadystatechange = function () {
    //     console.log("Response from rollDice()");
    // }
    // xhr.setRequestHeader("Accept", "application/json");
    // console.log("xhry response is: ");
    // console.log(xhr.responseText);

    // xhr.setRequestHeader("Accept", "application/json");

}
