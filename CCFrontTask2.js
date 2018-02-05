class Rune {
  constructor(name, power, anti) {
    this.name = name;
    this.power = power;
    this.anti = anti;
  }
}

const runicTable = [
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
];

const makeWord = length => {
  let sortedTable = runicTable.sort((a, b) => b.power - a.power);
  let magicWord = new Array();
  let currentRune = 0;

  if (length === 1) {
    magicWord.push(sortedTable[currentRune]);
    sortedTable.shift();
    return {
      word: magicWord[currentRune].name,
      power: magicWord[currentRune].power - 1
    };
  }

  while (magicWord.length < length) {
    let noRuneConflict = !sortedTable[currentRune] || magicWord.map(rune => rune.name)
                                  .indexOf(sortedTable[currentRune].anti) < 0;

    if (magicWord.length === 0) {
      magicWord.push(sortedTable[currentRune]);
      sortedTable.shift();
    }

    if (magicWord.length > 0) {
      if (noRuneConflict) {
        magicWord.push(sortedTable[currentRune]);
        sortedTable.splice(currentRune, 1);
      } else {
        currentRune += 1;
        if (noRuneConflict) {
          magicWord.push(sortedTable[currentRune]);
          sortedTable.splice(currentRune, 1);
        }
      }
    }
  }

  return magicWord;
}

const generateRunicWords = length => {
  let runicWords = new Array();
  let numberOfWords = Math.floor(runicTable.length / length);

  if (!length) {
    return 'Input cannot be empty';
  } else if (typeof length !== 'number') {
    return `${length} is not a number`;
  } else {
    for (let i = 0; i < numberOfWords && i < 10; i++) {
      let magicWord = makeWord(length); 
      if (magicWord.indexOf(undefined) < 0) {
        runicWords.push(
          {
            word: magicWord.map(rune => rune.name).join('-'),
            power:
              magicWord.map(rune => rune.power)
                       .reduce((a, b) => a + b) - magicWord.map(rune => rune).length
          }
        );
      }
    }
  }

  if (runicWords.length === 0) {
    return 'Not enough mana! And too many runes.';
  }

  return runicWords;
};

const isValuePresentMoreThanOnce = array => {
  for (let i = 0; i < array.length; i++) {
    if (array.filter(el => el === array[i]).length > 1) {
      return true;
    }
  }
};

const isArraySorted = array => {
  return array.every((item, index, items) => {
    if (index === 0 || item <= items[index - 1]) {
      return true;
    }
  });
};

const checkRunicWord = word => {
  if (!word) {
    return 'Input cannot be empty';
  } else if (typeof word !== 'string') {
    return `${word} is not a magic word.`;
  }

  let sortedTable = runicTable.sort((a, b) => b.power - a.power);
  let wordArray = word.split('-');
  let runesNames = sortedTable.map(rune => rune.name);
  let runesIndex = wordArray.map(word =>
    runesNames.findIndex(name => name === word)
  );
  let runeExists = wordArray.every(word => runesNames.indexOf(word) !== -1);

  if (!runeExists) {
    return 'This magic word does not exist';
  } else {
    let runesContainer = new Array();

    for (let i = 0; i < wordArray.length; i++) {
      runesContainer.push(sortedTable[runesIndex[i]]);
    }

    let names = runesContainer.map(word => word.name);
    let antiNames = runesContainer.map(word => word.anti);
    let power = runesContainer.map(word => word.power);
    let noRuneConflict = names.every(name => antiNames.indexOf(name) === -1);

    if (!noRuneConflict) {
      return 'These runes cannot me mixed';
    } else {
      if (isValuePresentMoreThanOnce(names)) {
        return 'Each rune can be used only once';
      }
      if (!isArraySorted(power)) {
        return 'These runes are not in correct order';
      } else {
        return power.reduce((a, b) => a + b) - wordArray.length;      
      }
    }
  }
};

module.exports = { generateRunicWords, checkRunicWord };
