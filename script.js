var cells, info, range, table; // X & O  DOM Elements

// [0][1][2]
// [3][4][5] უჯრედების წარმოდგენა ერთგანზომილიბიან მასივში
// [6][7][8]

// მომგებიანი პოზიციები:
const states = [
  [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8]
  ],
  [
    [4, 3, 5],
    [4, 1, 7],
    [4, 2, 6]
  ],
  [
    [8, 5, 2],
    [8, 7, 6]
  ]
];

function check(state) {
  for (var i = 0; i < states.length; i++) {
    var cell = state[states[i][0][0]];
    if (cell != '') // ვარიანტების შემოწმება
      for (var j = 0; j < states[i].length; j++)
        if(state[states[i][j][0]] == state[states[i][j][1]] &&
          state[states[i][j][0]] == state[states[i][j][2]])
          return cell;
  }
  for (var i = 0; i < state.length; i++)
  if (state[i] == '') // თავისუფალი უჯრის შემოწმება
    return ''; // პარტია არ დასრულებულა
  return '='; // draw - ფრე
}

function reset() {
  if (range.value == 5)
    info.innerHTML = 'ალფაბეტა (სიღრმე): ' + range.value;
  else if (range.value > 0)
    info.innerHTML = 'შემოკლებული მინიმაქსი (სიღრმე): ' + range.value;
  else
    info.innerHTML = 'მინიმაქსი';
  for (var i = 0; i < cells.length; i++)
    cells[i].innerHTML = ''; // დაფის განახლება
}

function init() {
  info = document.querySelector('#info'); // საინფორმაციო ზოლი
  range = document.querySelector("#range"); // სიღრმის არჩევა
  table = document.querySelector('table'); // დაფა
  cells = document.querySelectorAll('td'); // უჯრედების ინტერფეისი
  cells.forEach((cell) => cell.addEventListener('click', function() {
    if (this.innerHTML == '' && table.disabled != '1') {
      if (check(read()) == '')
        this.innerHTML = 'X'; // ვთამაშობთ X-ით
      table.disabled = 1; // დაფის დაბლოკვა ალგორითმის გაშვებისას
      setTimeout(run, 100); // ბიჯის შესრულება
    }
  }));
  range.onchange = reset;
  reset();
}

function read() {
  var state = []; // უჯრედების მასივი
  for (var i = 0; i < cells.length; i++)
    state[i] = cells[i].innerHTML; // პოზიციის წაკითხვა
  return state;
}

function draw(state) {
    for (var i = 0; i < state.length; i++) {
      if (state[i] == 'X' || state[i] == 'O')
        cells[i].setAttribute('data-value', state[i]);
      else
        cells[i].removeAttribute('data-value');
      cells[i].innerHTML = state[i]; // ახალი პოზიციის ჩვენება
    }
}

function run() {
  var res = check(read()); // პარტიის შემოწმება
  var state;
  if (res != '')
    state = (res == '=' ? 'ფ   რ   ე' : (res == 'X' ? 'მო გXე ბა' : 'წა გOე ბა'));
  else {
    var depth = range.value; // ჩვეულებრივი მინიმაქსის დროს სიღრმე: 0
    if (depth < 5)
      state = MinMax(read(), depth); // მოწინაამდეგის სვლა მინიმაქსის საშუალებით
    else
      state = AlphaBeta(read(), depth); // მოწინაამდეგის სვლა ალფაბეტის საშუალებით
  }
  draw(state);
  table.disabled = 0; // დაფის განბლოკვა
}

// ------------------------------------------------------------

const inf = 10; // რადგან ევრისტიკული "წონა" 8-ს არ აღემატემა: inf, -inf, 0(ფრე)

function successors(state, player) {
  var children = []; // შესაძლო სვლების გენერირება
  for (var i = 0, j = 0; i < state.length; i++)
    if (state[i] == '') { // თავისუფალ ადგილის პოვნა
      var child = state.slice();
      child[i] = player; // მოთამაშის ნიშნის ჩასმა
      children[j++] = child; // პოზიციის შენახვა
    }
  return children;
}

function utility(state) { // ევრისტიკა
  var n_ai = 0,
    n_player = 0; // მოთამაშეების ღია გზები
  // log(state);
    for (var i = 0; i < states.length; i++)
      for (var j = 0; j < states[i].length; j++) {
        var X = 0,
          O = 0; // მომგებიანი პოზიციების შემოწმება
        for (var k = 0; k < states[i].length; k++) {
          if (state[states[i][j]] == 'X') X++; // თითო მოთამაშისთვის
          else if (state[states[i][j]] == 'O') O++;
        } // ღია გზების დათვლა
        if (X == 0) n_ai++; // ხელოვნური ინტელექტის
        if (O == 0) n_player++; // ადამიანის
      }
  return n_ai - n_player; // სვლის "ფასი"
}

// ------------------------------------------------------------

function MinMax(state, depth = 0) { // Minimax-Decision
  var children = successors(state, 'O'); // შესაძლო სვლები
  var n = -inf,
    child = 0; // საუკეთესო სვლის გაგება
  for (var i = 0; i < children.length; i++) {
    var m = max(children[i], depth);
    // log(children[i], 'm: ' + m);
    if (m > n) {
      n = m;
      child = i; // საუკეთესო სვლის ინდექსის შენახვა
    }
  } // log(children[child], "Final n: " + n);
  return children[child]; // საუკეთესო მოქმედება
}

function max(state, depth = 0) {
  var res = check(state); // თამაშის შემოწმება
  if (res != '')
    return res == '=' ? 0 : (res == 'X' ? -inf : inf);
  if (depth == 1) // შემოკლებული მინიმაქსის დროს
    return utility; // ევრისტიკის გამოძახება
  var n = inf;
  var children = successors(state, 'X'); // შესაძლო სვლები
  for (var i = 0; i < children.length; i++) {
    var m = min(children[i], depth > 0 ? depth - 1 : 0);
    if (m < n) n = m;
  } // log(state, 'Max Value: ' + n);
  return n;
}

function min(state, depth = 0) {
  var res = check(state); // თამაშის შემოწმება
  if (res != '')
    return res == '=' ? 0 : (res == 'X' ? -inf : inf);
  if (depth == 1) // შემოკლებული მინიმაქსის დროს
    return utility; // ევრისტიკის გამოძახება
  var n = -inf;
  var children = successors(state, 'O'); // შესაძლო სვლები
  for (var i = 0; i < children.length; i++) {
    var m = max(children[i], depth > 0 ? depth - 1 : 0);
    if (m > n) n = m;
  } // log(state, 'Min Value: ' + n);
  return n;
}

// ------------------------------------------------------------

function AlphaBeta(state, depth) { // AlphaBeta-Decision
  var children = successors(state, 'O'); // შესაძლო სვლები
  var n = -inf,
    child = 0; // საუკეთესო სვლის გაგება
  for (var i = 0; i < children.length; i++) {
    var m = minAB(children[i], inf, -inf, depth);
    // log(children[i], 'm: ' + m);
    if (m > n) {
      n = m;
      child = i; // საუკეთესო სვლის ინდექსის შენახვა
    }
  } // log(children[child], "Final n: " + n);
  return children[child]; // საუკეთესო მოქმედება
}

function maxAB(state, alpha, beta, depth) {
  var res = check(state); // თამაშის შემოწმება
  if (res != '')
    return res == '=' ? 0 : (res == 'X' ? -inf : inf);
  if (depth == 1)
    return utility; // ევრისტიკის გამოძახება
  var n = alpha;
  var children = successors(state, 'X'); // შესაძლო სვლები
  for (var i = 0; i < children.length; i++) {
    var m = minAB(children[i], n, beta, depth - 1);
    if (m > n) n = m;
    if (m >= beta) return n;
  } // log(state, 'Max Alpha: ' + n);
  return n;
}

function minAB(state, alpha, beta, depth) {
  var res = check(state); // თამაშის შემოწმება
  if (res != '')
    return res == '=' ? 0 : (res == 'X' ? -inf : inf);
  if (depth == 1)
    return utility; // ევრისტიკის გამოძახება
  var n = beta;
  var children = successors(state, 'O'); // შესაძლო სვლები
  for (var i = 0; i < children.length; i++) {
    var m = maxAB(children[i], alpha, n, depth - 1);
    if (m < n) n = m;
    if (m <= alpha) return n;
  } // log(state, 'Min Beta: ' + n);
  return n;
}

// ------------------------------------------------------------

function log(state, s = '') {
  console.log(s + '\n' + str(state));
}

function str(state) { // პოზიციის აღწერა
  function s(i) {
    return state[i] == '' ? ' ' : state[i];
  }
  return ('State: ' + state) + '\n' +
    (s(0) + '|' + s(1) + '|' + s(2)) + '\n' +
    (s(3) + '|' + s(4) + '|' + s(5)) + '\n' +
    (s(6) + '|' + s(7) + '|' + s(8)) + '\n';
}

window.onload = init; // ლოგიკის ჩატვირთვა
