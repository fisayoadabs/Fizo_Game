var col;
var row;

var col_on = 0;
var row_on = 0;

var end = false;
var randNum;
var grabWord;
var grabHint;

var response;
var dictionary;
var urlLink = "https://o3bg27pv7q5kiqv62d53ff74ne0vitar.lambda-url.ca-central-1.on.aws";

let flashingInterval;
var box_on;

var board;
var post;
var show;
var div;
var rect;

var keybox;

const correctLetters = [];
const semiCorrectLetters = [];
const incorrectLetters = [];


window.onload = async () => {
	initializeDict();

	async function initializeDict() {
		//Grabs the dictionary from the url link and chooses the word
		response = await fetch(
			urlLink
		);
		dictionary = await response.json();

		if (dictionary && dictionary.length > 0) {
			randNum = dictionary[Math.floor(Math.random() * dictionary.length)];
			grabWord = randNum.word.toUpperCase();
			grabHint = randNum.hint;
			col = grabWord.length;
			row = grabWord.length;
			gridBox();
			keyboardBox();
			begin();
		}
	}

	function handleWriting(arg) {
		//Function that takes a singular argument to allow typing in the boxes and keep tracks of wordbox rows and columns
		clearInterval(flashingInterval);
		toggleHighlight(box_on, false);
		if (/^[A-Z]$/.test(arg)) {
			if (col_on < col) {
				if (box_on != null && box_on.innerText == "") {
					box_on.innerText = arg;
					col_on++;
				}
				box_on = document.getElementById(
					row_on.toString() + "-" + col_on.toString()
				);
			}
		} else if (arg == "BACKSPACE") {
			if (0 < col_on && col_on <= col) {
				col_on--;
			}
			box_on = document.getElementById(
				row_on.toString() + "-" + col_on.toString()
			);
			box_on.innerText = "";
		} else if (arg == "ENTER") {
			if (col_on != col) {
				window.alert("first complete the word");
			} else {
				checker();
				row_on++;
				col_on = 0;
				box_on = document.getElementById(
					row_on.toString() + "-" + col_on.toString()
				);
			}
		}

		if (!end && row_on == row) {
			end = true;
			document.getElementById("lost").innerHTML =
				"You missed the word " + grabWord.bold() + " and lost!";
			reveal_loss();
			loser_post();
		}

		if (box_on !== null && box_on.innerText === "") {
			flashingInterval = startFlashing(box_on);
		}
	}

	function handleClick(event) {
		//Function that deals with the keyboard based on letters clicked
		const keyLetter = event.target;
		if (keyLetter.classList.contains("keybox")) {
			const letter = keyLetter.innerText;
			if (end) return;
			handleWriting(letter);
		}
	}

	const keyboardBox = () => {
		//Creates the Keyboard
		const alpha = Array.from(Array(26)).map((e, i) => i + 65);
		const alphabet = alpha.map((x) => String.fromCharCode(x));
		alphabet.push("ENTER");
		alphabet.push("BACKSPACE");
		let index = 0;
		for (let k = 0; k < 3; k++) {
			for (let n = 0; n < 10; n++) {
				if (index >= alphabet.length) {
					break;
				}
				keybox = document.createElement("span");
				keybox.id = k.toString() + "-" + n.toString();
				keybox.classList.add("keybox");
				keybox.innerText = alphabet[index];
				keybox.addEventListener("click", handleClick);
				document.getElementById("keyboard").appendChild(keybox);
				index++;
			}
		}
	};

	const gridBox = () => {
		//creates the wordle grid
    document.getElementById("table").style.gridTemplateColumns = `repeat(${col}, 1fr)`;
    document.getElementById("table").style.gridTemplateRows = `repeat(${row}, 1fr)`;

		for (let i = 0; i < row; i++) {
			for (let j = 0; j < col; j++) {
				let wordbox = document.createElement("span");
				wordbox.id = i.toString() + "-" + j.toString();
				wordbox.classList.add("wordbox");
				wordbox.innerText = "";
				document.getElementById("table").appendChild(wordbox);
			}
		}
	};

	function handleKeydown(e) {
		//Function that deals with the typing on a computer/laptop(physical keyboard)
		if (end) return;

		handleWriting(e.key.toUpperCase());
	}

	const begin = () => {
		// Function that sets the first boxs and deals with the keydown function

		box_on = document.getElementById(
			row_on.toString() + "-" + col_on.toString()
		);

		document.addEventListener("keydown", handleKeydown);
	};

	const startFlashing = (el) => {
		// Function that handles the active box on the grid
		let flashing = false;

		return setInterval(() => {
			flashing = !flashing;
			toggleHighlight(el, flashing);
		}, 500);
	};

	const checker = () => {
		// Function that checks if the word entered is correct
		let correct = 0;
		let counter = {};
		for (let i = 0; i < grabWord.length; i++) {
			let value = grabWord[i];
			if (counter[value]) {
				counter[value] += 1;
			} else {
				counter[value] = 1;
			}
		}

		for (let i = 0; i < col; i++) {
			box_on = document.getElementById(
				row_on.toString() + "-" + i.toString()
			);
			let value = box_on.innerText;

			if (grabWord[i] == value) {
				box_on.classList.add("correct");
				correct += 1;
				counter[value] -= 1;
				if (!correctLetters.includes(value)) {
					correctLetters.push(value);
				}
			}

			if (correct == col) {
				end = true;
				document.getElementById("won").innerHTML =
					"You guessed the word " + grabWord.bold() + " correctly!";
				reveal_won();
				winner_post();
			}
		}

		for (let i = 0; i < col; i++) {
			box_on = document.getElementById(
				row_on.toString() + "-" + i.toString()
			);
			let value = box_on.innerText;

			if (!box_on.classList.contains("correct")) {
				if (grabWord.includes(value) && counter[value] > 0) {
					box_on.classList.add("involved");
					counter[value] -= 1;
					if (!semiCorrectLetters.includes(value)) {
						semiCorrectLetters.push(value);
					}
				} else {
					box_on.classList.add("wrong");
					if (!incorrectLetters.includes(value)) {
						incorrectLetters.push(value);
					}
				}
			}
		}
		keyBoardChecker();
	};

	function keyBoardChecker() {
		// Function that updated the virtual keyboard based on the checker function
		const keyboardLetters = document.querySelectorAll(".keybox");

		keyboardLetters.forEach((letterBox) => {
			const letter = letterBox.innerText;

			if (correctLetters.includes(letter)) {
				letterBox.classList.remove("wrong");
				letterBox.classList.remove("involved");
				letterBox.classList.add("correct");
			} else if (incorrectLetters.includes(letter)) {
				letterBox.classList.add("wrong");
			} else if (semiCorrectLetters.includes(letter)) {
				letterBox.classList.add("involved");
			}
		});
	}

	const toggleHighlight = (el, show) => {
		//Function that adds the highlight colour to the active box and also removes it
		if (el != null) {
			if (show) {
				el.classList.add("highlight");
				el.classList.remove("delight");
			} else {
				el.classList.add("delight");
				el.classList.remove("highlight");
			}
		}
	};

	function mode() {
		//Switches between dark and light mode
		var element = document.body;
		element.classList.toggle("dark-mode");
	}

	function hint() {
		//Displays the hint
		var hint_word = "Hint";
		document.getElementById("hint").innerHTML =
			hint_word.italics() + ": " + grabHint;
		var div = document.getElementById("hint");

		if (div.style.display == "block") {
			div.style.display = "none";
		} else {
			div.style.display = "block";
		}
	}

	function hide() {
		//Hide instructions to the game
		var click = document.getElementById("right");

		if (click.style.display == "block") {
			click.style.display = "none";
		} else {
			click.style.display = "block";
		}
	}

	function reveal_won() {
		//Hides the hint and reveals won sentence
		show = document.getElementById("won");
		div = document.getElementById("hint");

		if (show.style.display == "block") {
			show.style.display = "none";
			div.style.display = "none";
		} else {
			show.style.display = "block";
			div.style.display = "none";
		}
	}

	function reveal_loss() {
		//Hides the hint and reveals lost sentence
		show = document.getElementById("lost");
		div = document.getElementById("hint");

		if (show.style.display == "block") {
			show.style.display = "none";
			div.style.display = "none";
		} else {
			show.style.display = "block";
			div.style.display = "none";
		}
	}
	function winner_post() {
		//Displays the winners image
		post = document.getElementById("winner");
		board = document.getElementById("table");

		if (post.style.display == "block") {
			post.style.display = "none";
			board.style.display = "none";
		} else {
			post.style.display = "block";
			board.style.display = "none";
		}
	}
	function loser_post() {
		//Displays the loser image
		post = document.getElementById("loser");
		board = document.getElementById("table");

		if (post.style.display == "block") {
			post.style.display = "none";
			board.style.display = "none";
		} else {
			post.style.display = "block";
			board.style.display = "none";
		}
	}

	function option_list() {
		// Function that shows the option-list 
		rect = document.getElementById("shuffle-options");

		if (rect.style.display == "block") {
			rect.style.display = "none";
		} else {
			rect.style.display = "block";
		}
	}
	function removal(){
		// Function that resets all the variables 
		col_on = 0;
		row_on = 0;
		end = false;

		if (board) {
			board.style.display = "grid";
		}
		if (post) {
			post.style.display = "none";
		}
		if (show) {
			show.style.display = "none";
		}
		if (rect) {
			rect.style.display = "none";
		}
		correctLetters.length = 0;
		semiCorrectLetters.length = 0;
		incorrectLetters.length = 0;

		document.getElementById("hint").style.display = "none";
		document.getElementById("table").innerHTML = "";
		document.getElementById("keyboard").innerHTML = "";

		document.removeEventListener("keydown", handleKeydown);
		document
			.getElementById("keyboard")
			.removeEventListener("click", handleClick);
	}
	async function restartGame() {
		// Function that restarts the game
		let selectedLink = urlLink;
		removal();
		urlLink = selectedLink;
    	await initializeDict();
	}

	const menu = document.getElementById("shuffle-container");
	const dark = document.getElementById("dark");
	const help = document.getElementById("question");
	const instruct = document.getElementById("exclaim");
	const reStart = document.getElementById("start");
	const menu_choice = document.getElementById('shuffle-options');

	menu.addEventListener("click", () => {
		option_list();
	});
	dark.addEventListener("click", () => {
		mode();
	});
	help.addEventListener("click", () => {
		hint();
	});
	instruct.addEventListener("click", () => {
		hide();
	});

	reStart.addEventListener("click", () => {
		restartGame();
	});

	menu_choice.addEventListener('click', (event) => {
		if (event.target.tagName === 'LABEL') {
			const option = event.target.id;
			document.getElementById("four").classLiist.remove("highlight");
			document.getElementById("five").classLiist.remove("highlight");
			document.getElementById("six").classLiist.remove("highlight");
			document.getElementById("random").classLiist.remove("highlight");
			switch (option) {
				case 'four':
					urlLink = "https://o3bg27pv7q5kiqv62d53ff74ne0vitar.lambda-url.ca-central-1.on.aws";
					document.getElementById("four").classLiist.add("highlight");
					break;
				case 'five':
					urlLink = "https://ms4wwf4ic4qbgwijmtbmhp34ia0ygcwa.lambda-url.ca-central-1.on.aws";
					document.getElementById("five").classLiist.add("highlight");
					break;
				case 'six':
					urlLink = "https://6allmdrxlzswqtwyrsxf7zgtqe0eyksx.lambda-url.ca-central-1.on.aws";
					document.getElementById("six").classLiist.add("highlight");
					break;
				case 'random':
					urlLink = "https://5wqnoydq7xgni3fx2t7ir732qm0tigdh.lambda-url.ca-central-1.on.aws";
					document.getElementById("random").classLiist.add("highlight");
					break;
			}
			removal();
			initializeDict();
		}
	});
};
