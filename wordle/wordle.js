
var col = 4;
var row = 4;

var col_on = 0;
var row_on = 0;

var end = false;
var the_hint;

window.onload = async ()=> {
    const res = await fetch("https://api.masoudkf.com/v1/wordle", {
    headers: {
    "x-api-key": "sw0Tr2othT1AyTQtNDUE06LqMckbTiKWaVYhuirv",
    },
});
let dict = await res.json();
let { dictionary } = dict;
randNum = dictionary[Number.parseInt(Math.random() * dictionary.length)];
grabWord = randNum.word.toUpperCase();
grabHint = randNum.hint;

var the_word = grabWord;
the_hint = grabHint;

console.log(the_word);
console.log(the_hint);
const begin = () => {
    for(let i =0; i<row;i++){
        for(let j = 0; j<col;j++){
            let wordbox = document.createElement("span")
            wordbox.id = i.toString() + "-" + j.toString();
            wordbox.classList.add("wordbox");
            wordbox.innerText = "";
            document.getElementById("table").appendChild(wordbox);
        }
    }

    document.addEventListener("keyup", (e) =>{
        if(end) return;

       if("KeyA" <= e.code && e.code <= "KeyZ"){
            if(col_on < col){
                let box_on = document.getElementById(row_on.toString()+ '-' + col_on.toString());
                if(box_on.innerText == ""){
                    box_on.innerText = e.code[3];
                    col_on +=1;
                }
            }
       }
       else if (e.code == "Backspace"){
            if(0 < col_on && col_on <= col){
                col_on-=1;
            }
            let box_on = document.getElementById(row_on.toString()+ '-' + col_on.toString());
            box_on.innerText = "";
            box_on.style.border = "2px solid";
        }
        else if (e.code == "Enter"){
            if(col_on != col){
                window.alert("first complete the word")
            }
            else{
                checker();
                row_on+= 1;
                col_on = 0;
            }
        }

        if(!end && row_on == row){
            end = true;
            document.getElementById("lost").innerHTML = "You missed the word "+the_word.bold()+" and lost!";
            reveal_loss();
        }
    });
}

const checker = () => {
    let correct = 0;
    let counter = {};
    for(let i = 0; i< the_word.length; i++){
        let value = the_word[i];
        if(counter[value]){
            counter[value] += 1;
        }
        else{
            counter[value] = 1;
        }
    }

    for (let i = 0; i < col; i++){
        let box_on = document.getElementById(row_on.toString()+ '-' + i.toString());
        let value = box_on.innerText;

        if(the_word[i] == value){
            box_on.classList.add("correct");
            correct += 1;
            counter[value] -=1;
        }

        if(correct == col){
            end = true;
            document.getElementById("won").innerHTML = "You guessed the word "+the_word.bold()+" correctly!";
            reveal_won();
            winner_post();
        }
    }

    for (let i = 0; i < col; i++){
        let box_on = document.getElementById(row_on.toString()+ '-' + i.toString());
        let value = box_on.innerText;

        if(!box_on.classList.contains("correct")){
            if (the_word.includes(value) && counter[value] > 0){
                box_on.classList.add("involved");
                counter[value] -= 1;
            }
            else{
                box_on.classList.add("wrong");
            }
        }
    }
    
}
begin();
};

function mode(){
    var element = document.body;
    element.classList.toggle("dark-mode");
    dark.classList.toggle("dark-mode");
    question.classList.toggle("dark-mode");
    exclaim.classList.toggle("dark-mode");
}

function hint(){
    var hint_word= "Hint";
    document.getElementById("hint").innerHTML = hint_word.italics()+": "+the_hint;
    var div = document.getElementById("hint");
    
    if(div.style.display == "block"){
        div.style.display = "none";
    }
    else{
        div.style.display = "block";
    }
}

function hide(){
    var click =document.getElementById("right");

    if(click.style.display == "block"){
        click.style.display = "none";
    }
    else{
        click.style.display = "block";
    }
}

function reveal_won(){
    var show = document.getElementById("won");
    var div = document.getElementById("hint");

    if(show.style.display == "block"){
        show.style.display = "none";
        div.style.display = "none";
    }
    else{
        show.style.display = "block";
        div.style.display = "none";
    }
}

function reveal_loss(){
    var show = document.getElementById("lost");
    var div = document.getElementById("hint");

    if(show.style.display == "block"){
        show.style.display = "none";
        div.style.display = "none";
    }
    else{
        show.style.display = "block";
        div.style.display = "none";
    }
}
function winner_post(){
    var post = document.getElementById("winner");
    var board = document.getElementById("table");

    if(post.style.display == "block"){
        post.style.display = "none";
        board.style.display = "none";
    }
    else{
        post.style.display = "block";
        board.style.display = "none";
    }
}
