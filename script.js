const RANDOM_QUOTE_API_URL = 'http://api.quotable.io/random'

const typingDiv = document.getElementById("typing");
const statsDiv = document.getElementById("stats");
const redoBtn = document.getElementById("next");

//clear divs and render a new quote
const next = () => {    
    typingDiv.innerHTML = "";
    statsDiv.innerHTML = "";    
    renderNewQuote();
}

function getRandomQuote(){
    return fetch(RANDOM_QUOTE_API_URL)
    .then(response => response.json())
    .then(data => data.content)
}

async function renderNewQuote() {
    const quote = await getRandomQuote()

    const characters = quote.split("").map(char => {
        const span = document.createElement("span");
        span.innerText = char;
        typingDiv.appendChild(span);
        return span;
    });

    let cursorIndex = 0;
    let cursorCharacter = characters[cursorIndex];
    cursorCharacter.classList.add('cursor');

    let startTime = null;
    let endTime = null;

    const keydown = ({key}) => {
        if(!startTime){
            startTime = new Date();
        }
    
        if(key === cursorCharacter.innerText){
            //typed the correct character
            cursorCharacter.classList.remove("cursor");
            cursorCharacter.classList.add("done");
            cursorCharacter = characters[++cursorIndex];
        }
        
        if(cursorIndex >= characters.length){
            //typing ends here
            endTime = new Date();
            const delta = endTime - startTime;
            const seconds = delta / 1000;
            const minutes = seconds / 60;
            const numberOfWords = quote.split(" ").length;
            const wps = numberOfWords / seconds;
            const wpm = wps * 60.0;
            document.getElementById("stats").innerText = (parseInt(wpm) + " wpm.");
            document.removeEventListener("keydown", keydown);
            return;
        }

        cursorCharacter.classList.add("cursor");
    };

    document.addEventListener("keydown", keydown);
}

renderNewQuote()