/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*/

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA)
let currentGamesList = [...GAMES_JSON]; 

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
*/

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {

    // loop over each item in the data 
    for (let i = 0; i < games.length; i++) { 
        // create a new div element, which will become the game card
        let createdDiv = document.createElement("div"); 
        // add the class game-card to the list
        createdDiv.classList.add("game-card"); 
        // set the inner HTML using a template literal to display some info 
        createdDiv.innerHTML = `
            <img src="${games[i].img}" class="game-img" />
            <h3>${games[i].name}</h3>
            <p>${games[i].description}</p>
            <p>Backed by: ${games[i].backers}</p>
            <br>
            <progress id="file" value="${(games[i].pledged)}" max="${games[i].goal}"></progress>
            <p><u> ${games[i].pledged >= games[i].goal ? "Goal Met!" : "In Progress"} </u> </p>
            <p>Pledged: $${(games[i].pledged).toLocaleString(('en-US'))}</p>
            <p>Goal: $${(games[i].goal).toLocaleString(('en-US'))}</p>
           
        `; 
        // append the game to the games-container
        gamesContainer.appendChild(createdDiv);
    }
}

// call the function we just defined using the correct variable
// later, we'll call this function using a different list of games
addGamesToPage(currentGamesList);

/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers
let backersNum = GAMES_JSON.reduce(
    (acc, curr) => 
    { 
        acc += curr.backers; 
        return acc;
    }, 0
)

console.log(backersNum);


// set the inner HTML using a template literal and toLocaleString to get a number with commas
contributionsCard.innerHTML= `${backersNum.toLocaleString(('en-US'))}`;

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");
let raisedAmt = GAMES_JSON.reduce(
    (amt, curr) => {
        amt += curr.pledged;
        return amt; 
    }, 0
);

// set inner HTML using template literal
raisedCard.innerHTML = "$" + raisedAmt.toLocaleString(('en-US')); 


// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");
gamesCard.innerHTML = GAMES_JSON.length; 

/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
*/

// show only games that do not yet have enough funding

function filterUnfundedOnly() {
    deleteChildElements(gamesContainer);
    
    // use filter() to get a list of games that have not yet met their goal
    let unfundedGames = GAMES_JSON.filter( (game) => { 
        return game.pledged < game.goal; 
    })
    console.log(unfundedGames);
    // use the function we previously created to add the unfunded games to the DOM
    currentGamesList = unfundedGames;
    addGamesToPage(currentGamesList);
}


// show only games that are fully funded
function filterFundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have met or exceeded their goal
    let fundedGames = GAMES_JSON.filter( (game) => { 
        return game.pledged >= game.goal; 
    })
    console.log(fundedGames);
    // use the function we previously created to add unfunded games to the DOM
    currentGamesList = fundedGames;
    addGamesToPage(currentGamesList);
}


// show all games
function showAllGames() {
    deleteChildElements(gamesContainer);

    // add all games from the JSON data to the DOM
    currentGamesList = [...GAMES_JSON]; 
    addGamesToPage(currentGamesList);
}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// add event listeners with the correct functions to each button
unfundedBtn.addEventListener("click", filterUnfundedOnly);
fundedBtn.addEventListener("click", filterFundedOnly);
allBtn.addEventListener("click", showAllGames);

/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games
let unfundedGames = GAMES_JSON.filter((game)=>game.pledged < game.goal);
let numOfUnfundedGames = unfundedGames.length;

console.log(numOfUnfundedGames);


let fundedGames = GAMES_JSON.filter((game)=>game.pledged >= game.goal);
// create a string that explains the number of unfunded games using the ternary operator
const displayStr = `A total of $${raisedAmt.toLocaleString(('en-US'))} has been raised for ${GAMES_JSON.length} games. ${numOfUnfundedGames === 0 
        ? 'All games are funded.' 
        : `Currently, ${numOfUnfundedGames == 1 ? 'game remains unfunded.' : `${numOfUnfundedGames} games remain unfunded.`} We need your help to fund these amazing games!`}`
console.log(displayStr);
// create a new DOM element containing the template string and append it to the description container
let paragraphElement = document.createElement('p');
paragraphElement.innerHTML = displayStr; 
descriptionContainer.appendChild(paragraphElement);



/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames =  GAMES_JSON.sort( (item1, item2) => {
    return item2.pledged - item1.pledged; //b-a (desc)
});

// use destructuring and the spread operator to grab the first and second games
let [first,second, ...others] = sortedGames;

// create a new element to hold the name of the top pledge game, then append it to the correct element
let topPledgeHeading = document.createElement('h3');
topPledgeHeading.innerHTML = first.name + "- $" + first.pledged.toLocaleString(('en-US'));
firstGameContainer.appendChild(topPledgeHeading);

// do the same for the runner up item
let secondPledgeHeading = document.createElement('h3');
secondPledgeHeading.innerHTML = second.name + "- $" + second.pledged.toLocaleString(('en-US'));
secondGameContainer.append(secondPledgeHeading);

//adding custom sorting features

function sortAZ(currentGamesList) { 
    currentGamesList.sort(
        function (a,b){
            return a.name.localeCompare(b.name);
        }
    )
    addGamesToPage(currentGamesList);
}

function sortZA(currentGamesList) { 
    currentGamesList.sort(
        function (a,b){
            return b.name.localeCompare(a.name);
        }
    )
    addGamesToPage(currentGamesList);
}

function sortBacker(currentGamesList) { 
    currentGamesList.sort(
        function (a,b){
            return a.backers - b.backers;
        }
    )
    addGamesToPage(currentGamesList);
}

const sortByAZ = document.getElementById("sort-az");
const sortByZA = document.getElementById("sort-za");
const sortByBacker = document.getElementById("sort-backers");

sortByAZ.addEventListener("click", () => {
    deleteChildElements(gamesContainer);
    sortAZ(currentGamesList);
});

sortByZA.addEventListener("click", () => {
    deleteChildElements(gamesContainer);
    sortZA(currentGamesList);
});

sortByBacker.addEventListener("click", () => {
    deleteChildElements(gamesContainer);
    sortBacker(currentGamesList);
});

