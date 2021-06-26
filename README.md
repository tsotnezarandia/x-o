# [X & O](https://tsotnezarandia.github.io/x-o)

![tic-tac-toe](https://tsotnezarandia.github.io/x-o/x-o.png)

**X-O** _თამაშის სტრატეგიის პოვნა minimax/alphabeta პროცედურის საშუალებით_

## მინიმაქსი

```javascript
function MinMax(state) {
  var children = successors(state, 'O'); // შესაძლო სვლები
  var n = -inf;
  var child = 0; // საუკეთესო სვლის გაგება
  for (var i = 0; i < children.length; i++) {
    var m = max(children[i]);
    if (m > n) {
      n = m;
      child = i; // საუკეთესო სვლის ინდექსის შენახვა
    }
  }
  return children[child]; // საუკეთესო მოქმედება
}

function max(state) {
  var res = isTerminal(state); // თამაშის შემოწმება
  if (res != null)
    return res;
  var n = inf;
  var children = successors(state, 'X'); // შესაძლო სვლები
  for (var i = 0; i < children.length; i++) {
    var m = min(children[i]);
    if (m < n) n = m;
  }
  return n;
}

function min(state, depth = 0) {
  var res = isTerminal(state); // თამაშის შემოწმება
  if (res != null)
    return res;
  var n = -inf;
  var children = successors(state, 'O'); // შესაძლო სვლები
  for (var i = 0; i < children.length; i++) {
    var m = maxValue(children[i]);
    if (m > n) n = m;
  }
  return n;
}
```

## ალფაბეტა

```javascript
function AlphaBeta(state, depth = 0) {
  var children = successors(state, 'O'); // შესაძლო სვლები
  var n = -inf;
  var child = 0; // საუკეთესო სვლის გაგება
  for (var i = 0; i < children.length; i++) {
    var m = minAB(children[i], inf, -inf, depth);
    if (m > n) {
      n = m;
      child = i; // საუკეთესო სვლის ინდექსის შენახვა
    }
  }
  return children[child]; // საუკეთესო მოქმედება
}

function maxAB(state, alpha, beta, depth = 0) {
  var res = isTerminal(state); // თამაშის შემოწმება
  if (res != null)
    return res;
  if (depth == 1)
    return utility; // ევრისტიკის გამოძახება
  var n = alpha;
  var children = successors(state, 'X'); // შესაძლო სვლები
  for (var i = 0; i < children.length; i++) {
    var m = minBeta(children[i], n, beta, depth - 1);
    if (m > n) n = m;
    if (m >= beta) return n;
  }
  return n;
}

function minAB(state, alpha, beta, depth = 0) {
  var res = isTerminal(state); // თამაშის შემოწმება
  if (res != null)
    return res;
  if (depth == 1)
    return utility; // ევრისტიკის გამოძახება
  var n = beta;
  var children = successors(state, 'O'); // შესაძლო სვლები
  for (var i = 0; i < children.length; i++) {
    var m = maxAlpha(children[i], alpha, n, depth - 1);
    if (m < n) n = m;
    if (m <= alpha) return n;
  }
  return n;
}
```

## ევრისტიკა

```javascript
function utility(state) { // ევრისტიკა
  var n_ai = 0,
    n_player = 0; // მოთამაშეების ღია გზები
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
```

### ლიცენზია

**© 2021 [Tsotne Zarandia](https://github.com/tsotnezarandia)**

[//]: # "LINKS"
