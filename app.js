const tileDisplay = document.querySelector('.tile-container');
const keyboard = document.querySelector('.key-container');
const messageDisplay = document.querySelector('.message-container')
const definitionDisplay = document.querySelector('.definition-container');
let wordle;
const getWordle = () => {
	fetch('http://localhost:8000/word')
		.then(response => response.json())
		.then(json => {
			console.log(json);
			wordle = json.toUpperCase();
		})
		.catch(err => console.log(err));
}
getWordle();
const keys = ['Q', 'W', , 'E', , 'R', , 'T', , 'Y', , 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '🔙'];
const guessRow = [
	['', '', '', '', '',],
	['', '', '', '', '',],
	['', '', '', '', '',],
	['', '', '', '', '',],
	['', '', '', '', '',],
	['', '', '', '', '',]
];
let currentRow = 0;
let currentTile = 0;
let isGameOver = false;
const logKey = (event) => {
	const keyName = event.key.toUpperCase();
	console.log('key ' + keyName);
	if (keyName == 'ENTER') {
		handleClick('ENTER');
		return;
	}
	if (keyName == 'BACKSPACE') {
		handleClick('🔙');
		return;
	}
	keys.forEach((key) => {
		let result = keyName.includes(key) && keyName.length == 1;
		if (result == true) {
			console.log('key matched ' + keyName);
			handleClick(keyName);
			return;
		}
	})

};
document.addEventListener('keyup', logKey);

guessRow.forEach((guessRow, guessRowIndex) => {
	const rowElement = document.createElement('div');
	rowElement.setAttribute('id', 'guessRow-' + guessRowIndex);
	guessRow.forEach((guess, guessIndex) => {
		const tileElement = document.createElement('div');
		tileElement.setAttribute('id', 'guessRow-' + guessRowIndex + '-tile-' + guessIndex);
		tileElement.classList.add('tile');
		rowElement.append(tileElement);
	});
	tileDisplay.append(rowElement);
});

keys.forEach(key => {
	const buttonElement = document.createElement('button');
	buttonElement.textContent = (key);
	buttonElement.setAttribute('id', key);
	buttonElement.addEventListener('click', () => handleClick(key));
	keyboard.append(buttonElement);

})
const handleClick = (letter) => {
	console.log('clicked Or said or typed', letter);
	if ((letter == '🔙')) {
		deleteLetter();
		return;
	}
	if ((letter == 'ENTER')) {
		checkRow();
		return;
	}
	addLetter(letter);
};
const addLetter = (letter) => {
	if (currentTile < 5 && currentRow < 6) {
		const tile = document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile);
		tile.textContent = letter;
		guessRow[currentRow][currentTile] = letter;
		tile.setAttribute('data', letter);
		currentTile++;
		console.log('guess rows', guessRow);
	}

};
const deleteLetter = () => {
	if (currentTile > 0) {
		currentTile--;
		const tile = document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile);
		tile.textContent = '';
		guessRow[currentRow][currentTile] = '';
		tile.setAttribute('data', '');
	}
};

const checkRow = () => {
	const guess = guessRow[currentRow].join('');
	console.log('guess', guess);
	if (currentTile > 4) {
		fetch(`http://localhost:8000/check/?word=${guess}`)
			.then(response => response.json())
			.then(json => {
				if (json == false) {
					showMessage('Not a Valid Word!');
					return;
				}
				else {
					console.log('guess is ' + guess, 'wordle is ' + wordle);
					flipTile();
					console.log(json);
					var firstDefinition = 'Definition: ' + json.results[0].definition;
					showDefinition(firstDefinition);
					if (wordle == guess) {
						showMessage('Magnificent!');
						showDefinition(firstDefinition);
						isGameOver = true;
						return;
					} else {
						if (currentRow >= 5) {
							isGameOver = true;
							showMessage('Game over Word was: ' + wordle);
							showDefinition(firstDefinition);
							return;
						}
					}
					if (currentRow < 5) {
						currentRow++;
						currentTile = 0;
					}
				}
			});
	}
};
const showMessage = (message) => {
	definitionDisplay.textContent = '';
	const messageElement = document.createElement('p');
	messageElement.textContent = message;
	messageDisplay.append(messageElement);
	setTimeout(() => {
		messageDisplay.removeChild(messageElement);
	}, 2000);;
}
const showDefinition = (definition) => {
	definitionDisplay.textContent = definition;
	setTimeout(() => {
		definitionDisplay.textContent = '';
	}, 10000);;
}

const addColorToKey = (keyLetter, color) => {
	const key = document.getElementById(keyLetter);
	key.classList.add(color);
};
const flipTile = () => {
	const rowTiles = document.querySelector('#guessRow-' + currentRow).childNodes;
	let checkWordle = wordle;
	const guess = [];
	rowTiles.forEach((tile, index) => {
		guess.push({ letter: tile.getAttribute('data'), color: 'gray-overlay' });
	});
	guess.forEach((guess, index) => {
		if (guess.letter == wordle[index]) {
			guess.color = 'green-overlay';
			checkWordle = checkWordle.replace(guess.letter, '');
		}
	});
	guess.forEach(guess => {
		if (checkWordle.includes(guess.letter)) {
			guess.color = 'yellow-overlay';
			checkWordle = checkWordle.replace(guess.letter, '');
		}
	});
	rowTiles.forEach((tile, index) => {
		setTimeout(() => {
			tile.classList.add('flip');
			tile.classList.add(guess[index].color);
			addColorToKey(guess[index].letter, guess[index].color);
		}, 500 * index);
	});
}