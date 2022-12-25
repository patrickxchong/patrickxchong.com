const chordsInput = document.getElementById("chords");
const originalKeyInput = document.getElementById("originalKey");
const transposedKeyInput = document.getElementById("transposedKey");
const transposeAmountInput = document.getElementById("transposeAmount");
const transposeButton = document.getElementById("transposeButton");
const transposedChordsOutput = document.getElementById("transposedChords");

function calculateSemitones() {
  const originalKey = originalKeyInput.value;
  const transposedKey = transposedKeyInput.value;
  const originalIndex = chordIndices[originalKey];
  const transposedIndex = chordIndices[transposedKey];
  const semitones = transposedIndex - originalIndex;
  return semitones;
}

originalKeyInput.addEventListener("input", () => {
  const semitones = calculateSemitones();
  transposeAmountInput.value = semitones;
  runTransposeChords();
});

transposedKeyInput.addEventListener("input", () => {
  const semitones = calculateSemitones();
  transposeAmountInput.value = semitones;
  runTransposeChords();
});

transposeAmountInput.addEventListener("input", () => {
  runTransposeChords();
});

transposeButton.addEventListener("click", () => {
  runTransposeChords();
});

function runTransposeChords() {
  const transposedKey = transposedKeyInput.value
  const transposeAmount = Number(transposeAmountInput.value);
  const chords = chordsInput.value;
  const lines = chords.split("\n");
  const transposedLines = [];
  for (const line of lines) {
    if (isChords(line)) {
      const transposedLine = transposeChords(line, transposeAmount, transposedKey);
      transposedLines.push(transposedLine);
    } else {
      transposedLines.push(line);
    }
  }
  transposedChordsOutput.textContent = transposedLines.join("\n");
}

function isChords(text) {
  text = text.trim();
  // Regex to match chord symbols
  const chordRegex = /\b[A-G](?:[#|b]*)?(?:maj|min|sus|add|dim|Maj|Min|m|M)?(?:\d*)?\b/g;

  // Regex to match common chord progressions
  const progressionRegex = /(?:I|IV|V|vi|viio)\b/g;

  // Regex to match common chord symbols with extensions
  const extensionRegex = /\b[A-G](?:[#|b]*)?(?:maj|min|sus|add|dim)?(?:\d*)?\b/g;

  // Count the number of words in the text
  const wordCount = text.split(/\s+/).length;

  // Count the number of chord symbols in the text
  const chordCount = (text.match(chordRegex) || []).length;

  // Count the number of chord progressions in the text
  const progressionCount = (text.match(progressionRegex) || []).length;

  // Check if the text contains a large number of chord symbols and chord progressions relative to the number of words
  if (chordCount / wordCount > 0.5 || progressionCount / wordCount > 0.5) {
    return true;
  }

  // Check if the text contains any chord symbols with extensions
  if (text.match(extensionRegex)) {
    return true;
  }

  // If none of the above conditions are met, the text is likely not chords
  return false;
}

function transposeChords(chords, transposeAmount, transposedKey) {
  if (transposeAmount > 12 || transposeAmount < -12) {
    transposeAmount = transposeAmount % 12
  }
  const chordRegex = /\b([A-G])([#|b]*)?(maj|min|sus|add|dim|Maj|Min|m|M)?(\d*)?(\w*)?/g;
  return chords.replace(chordRegex, (match, note, accidental, mode, addOn, residual) => {
    console.table({ match, note, accidental, mode, addOn, residual });
    if (residual !== undefined) {
      return match;
    }

    const noteIndex = "CcDdEFfGgAaB".indexOf(note);
    if (noteIndex === -1) {
      console.error("Chord not found:", note);
      return note;
    }

    let accidentalOffset = 0;
    if (accidental === "#") {
      accidentalOffset = 1;
    }
    if (accidental === "##") {
      accidentalOffset = 2;
    }
    if (accidental === "b") {
      accidentalOffset = -1;
    }
    if (accidental === "bb") {
      accidentalOffset = -2;
    }

    const newIndex = (noteIndex + accidentalOffset + transposeAmount + 12) % 12;
    const newNote = "CcDdEFfGgAaB"[newIndex];
    const isSharp = newNote === newNote.toLowerCase();
    let newNoteCalibrated = isSharp ? newNote.toUpperCase() + "#" : newNote;

    switch (newNoteCalibrated) {
      case 'E#': newNoteCalibrated = "F"; break;
      case 'B#': newNoteCalibrated = "C"; break;
    }

    let preferFlat = false;
    if (['F', 'Db', 'Eb', 'Gb', 'Ab', 'Bb'].includes(transposedKey)) {
      preferFlat = true;
    }

    if (preferFlat) {
      switch (newNoteCalibrated) {
        case 'C#': newNoteCalibrated = "Db"; break;
        case 'D#': newNoteCalibrated = "Eb"; break;
        case 'F#': newNoteCalibrated = "Gb"; break;
        case 'G#': newNoteCalibrated = "Ab"; break;
        case 'A#': newNoteCalibrated = "Bb"; break;
      }
    }

    return newNoteCalibrated + (mode || "") + (addOn || "");
  });
}

const chordIndices = {
  "C": 0,
  "C#": 1,
  "Db": 1,
  "D": 2,
  "D#": 3,
  "Eb": 3,
  "E": 4,
  "F": 5,
  "F#": 6,
  "Gb": 6,
  "G": 7,
  "G#": 8,
  "Ab": 8,
  "A": 9,
  "A#": 10,
  "Bb": 10,
  "B": 11
};

const keyChords = {
  "C": ["C", "Dm", "Em", "F", "G", "Am", "Bdim"],
  "G": ["G", "Am", "Bm", "C", "D", "Em", "F#dim"],
  "D": ["D", "Em", "F#m", "G", "A", "Bm", "C#dim"],
  "A": ["A", "Bm", "C#m", "D", "E", "F#m", "G#dim"],
  "E": ["E", "F#m", "G#m", "A", "B", "C#m", "D#dim"],
  "B": ["B", "C#m", "D#m", "E", "F#", "G#m", "A#dim"],
  "F#": ["F#", "G#m", "A#m", "B", "C#", "D#m", "E#dim"],
  "C#": ["C#", "D#m", "E#m", "F#", "G#", "A#m", "B#dim"],
  "F": ["F", "Gm", "Am", "Bb", "C", "Dm", "Edim"],
  "Bb": ["Bb", "Cm", "Dm", "Eb", "F", "Gm", "Adim"],
  "Eb": ["Eb", "Fm", "Gm", "Ab", "Bb", "Cm", "Ddim"],
  "Ab": ["Ab", "Bbm", "Cm", "Db", "Eb", "Fm", "Gdim"],
  "Db": ["Db", "Ebm", "Fm", "Gb", "Ab", "Bbm", "Cdim"],
  "Gb": ["Gb", "Abm", "Bbm", "Cb", "Db", "Ebm", "Fdim"],
  "Cb": ["Cb", "Dbm", "Ebm", "Fb", "Gb", "Abm", "Bdim"]
};