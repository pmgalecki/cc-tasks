function Rune(name, power, anti) {
  this.name = name;
  this.power = power;
  this.anti = anti;
}

let runicTable = new Array();

runicTable.push(
  new Rune('El', 28, 'Ort'),
  new Rune('Eld', 33, 'Sur'),
  new Rune('Tir', 9, 'Eth'),
  new Rune('Nef', 7, 'Ist'),
  new Rune('Eth', 31, 'Tir'),
  new Rune('Ith', 22, 'Pul'),
  new Rune('Tal', 8, 'Io'),
  new Rune('Ral', 25, 'Um'),
  new Rune('Ort', 18, 'El'),
  new Rune('Thul', 13, 'Sol'),
  new Rune('Amn', 6, 'Fal'),
  new Rune('Sol', 10, 'Thul'),
  new Rune('Shael', 17, 'Lem'),
  new Rune('Dol', 11, 'Hel'),
  new Rune('Hel', 12, 'Dol'),
  new Rune('Io', 20, 'Tal'),
  new Rune('Lum', 32, 'Gul'),
  new Rune('Ko', 27, 'Mal'),
  new Rune('Fal', 14, 'Amn'),
  new Rune('Lem', 26, 'Shall'),
  new Rune('Pul', 15, 'Ith'),
  new Rune('Um', 16, 'Ral'),
  new Rune('Mal', 21, 'Ko'),
  new Rune('Ist', 4, 'Nef'),
  new Rune('Gul', 23, 'Lum'),
  new Rune('Vex', 24, 'Ohm'),
  new Rune('Ohm', 1, 'Vex'),
  new Rune('Lo', 2, 'Cham'),
  new Rune('Sur', 30, 'Eld'),
  new Rune('Ber', 3, undefined),
  new Rune('Jah', 5, 'Zod'),
  new Rune('Cham', 29, 'Lo'),
  new Rune('Zod', 19, 'Jah')
);

function makeWord(length) {
  let sortedTable = runicTable.sort((a, b) => b.power - a.power);
  let magicWord = new Array();
  let count = 0;
  let currentRune = 0;

  if (length === 1) {
    magicWord.push(sortedTable[currentRune]);
    sortedTable.shift();
    return {
      word: magicWord[currentRune].name,
      power: magicWord[currentRune].power - 1
    };
  }

  while (count < length) {
    let noRuneConflict =
      magicWord.map(rune => rune.name).indexOf(sortedTable[currentRune].anti) <
      0;

    if (count === 0) {
      magicWord.push(sortedTable[currentRune]);
      sortedTable.shift();
      count += 1;
    }

    if (count > 0) {
      if (noRuneConflict) {
        magicWord.push(sortedTable[currentRune]);
        sortedTable.splice(currentRune, 1);
        count += 1;
      } else {
        currentRune += 1;
        if (noRuneConflict) {
          magicWord.push(sortedTable[currentRune]);
          sortedTable.splice(currentRune, 1);
          count += 1;
        }
      }
    }
  }

  return {
    word: magicWord.map(rune => rune.name).join('-'),
    power:
      magicWord.map(rune => rune.power).reduce((a, b) => a + b) -
      magicWord.map(rune => rune).length
  };
}

const generateRunicWords = length => {
  let runicWords = new Array();
  let numberOfWords = Math.floor(runicTable.length / length);

  if (!length) {
    return 'Input can not be empty';
  } else if (typeof length !== 'number') {
    return `${length} is not a number`;
  } else {
    for (let i = 0; i < numberOfWords && i < 10; i++) {
      runicWords.push(makeWord(length));
    }
  }

  return runicWords;
};

// function that checks if elements in array double
const isValuePresentMoreThanOnce = array => {
  for (let i = 0; i < array.length; i++) {
    if (array.filter(el => el === array[i]).length > 1) {
      return true;
    }
  }
};
// function that checks if array is sorted from strongest to weakest
const isArraySorted = array => {
  return array.every((item, index, items) => {
    if (index === 0 || item <= items[index - 1]) {
      return true;
    }
  });
};

const checkRunicWord = word => {
  let sortedTable = runicTable.sort((a, b) => b.power - a.power);
  let wordArray = word.split('-');
  let runesNames = sortedTable.map(rune => rune.name);
  let runesIndex = wordArray.map(word =>
    runesNames.findIndex(name => name === word)
  );

  if (!word) {
    return 'Input can not be empty';
  } else if (typeof word !== 'string') {
    return `${word} is not a magic word.`;
  }

  if (wordArray.every(word => runesNames.indexOf(word) !== -1)) {
    let runicWordObject = new Array();

    for (let i = 0; i < wordArray.length; i++) {
      runicWordObject.push(sortedTable[runesIndex[i]]);
    }

    let names = runicWordObject.map(word => word.name);
    let antiNames = runicWordObject.map(word => word.anti);
    let power = runicWordObject.map(word => word.power);

    if (names.every(item => antiNames.indexOf(item) === -1)) {
      if (isValuePresentMoreThanOnce(names)) {
        return 'Each rune can be used only once';
      }
      if (isArraySorted(power)) {
        return {
          Power: power.reduce((a, b) => a + b) - wordArray.length
        };
      } else {
        return 'The runes are not in correct order';
      }
    } else {
      return 'These runes can not me mixed';
    }
  } else {
    return 'This magic word does not exist';
  }
};

module.exports = { generateRunicWords, checkRunicWord };
