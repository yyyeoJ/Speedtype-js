const RANDOM_QUOTE_API_URL = "https://api.quotable.io/random";
const textDisplay = document.getElementById("textDisplay");
const textInput = document.getElementById("textInput");
const timerDisplay = document.getElementById("timer");
const accuracyDisplay = document.getElementById("accuracy");
const wpmDisplay = document.getElementById("wpm");
const startButton = document.getElementById("restart");


let timer;
let correct = 0;
let correctArray = [];
let all = 0;


async function getRandomQuote(){
    const response = await fetch(RANDOM_QUOTE_API_URL);
    let data = await response.json();
    textDisplay.innerHTML = '';
    data = data.content.split('');
    data.forEach(character => {
        const characterSpan = document.createElement("span");
        characterSpan.innerText = character;
        textDisplay.appendChild(characterSpan);
    });
    correctArray = [];
    
}
timerDisplay.innerText = `Time left: ${timer}`;

textInput.value = "";
textInput.disabled = true;

startButton.addEventListener("click",startGame)

function startGame(){
    getRandomQuote();
    timer = 60;
    timerDisplay.innerText = `Time left: ${timer}`
    let countDown = 3;
    let interval = setInterval(() => {
        textInput.placeholder = `Start typing in: ${countDown}`;
        countDown--;
        if(countDown == -1){
            textInput.placeholder = "Start!";
            textInput.disabled = false;
            textInput.focus();
            clearInterval(interval)
            textInput.addEventListener("input",checkInput);
            startTimer();
        }
    }, 1000);
}

function startTimer(){
    let interval = setInterval(() => {
        textInput.focus();
        timerDisplay.innerText = `Time left: ${timer}`
        timer--;
        if(timer == -1){
            clearInterval(interval);
            textInput.disabled = true;
            textInput.value = "";
            textInput.placeholder = "There is no time left."
            startButton.innerText = "Restart";
        }

    }, 1000);
}


function checkInput(e){
    //.inputType : "deleteContentBackward"
    const textArray = textDisplay.querySelectorAll("span");
    const inputArray = textInput.value.split("");

    if(e.inputType === "deleteContentBackward"){
        all--;
    }else{
        all++;
    }


    if(e.inputType === "deleteContentBackward" && textArray[inputArray.length].classList.contains("correct")){
        correctArray.pop();
        correct--;
        
    }

    
    textArray.forEach((characterSpan,index) => {
        const character = inputArray[index];
        if(character == null){
            characterSpan.classList.remove("correct");
            characterSpan.classList.remove("incorrect");
        }else
        if(character == characterSpan.innerText){
            characterSpan.classList.add("correct");
            characterSpan.classList.remove("incorrect");
            if(!correctArray.includes(index)){
                correct ++;
                correctArray.push(index);
            }

        }else{
            characterSpan.classList.add("incorrect");
            characterSpan.classList.remove("correct");
        }
    })
    
    if(inputArray.length == textArray.length){
        textInput.value = "";
        getRandomQuote();
    }
    
    let accuracy = Math.round(correct*100/all);
    if(Number.isNaN(accuracy)){
        accuracy = 100;
    }

    let wpm = Math.round((all/5) / ((61-timer)/60));
    accuracyDisplay.innerText = `Accuracy: ${accuracy}%`
    wpmDisplay.innerText = `Wpm: ${(wpm)}`
}

