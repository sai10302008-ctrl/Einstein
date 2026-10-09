
const display = document.getElementById("display");
let expression = "";
let finished = false;

function updateDisplay() {
  display.value = expression || "0";
}

function addValue(value) {
  if (finished) {
    if ("0123456789.".includes(value)) {
      expression = "";
    }
    finished = false;
  }

  if ("+-*/%".includes(value) &&
      "+-*/%".includes(expression.slice(-1))) {
    expression = expression.slice(0, -1);
  }

  if (value === ".") {
    const current = expression.split(/[+\-*/%]/).pop();
    if (current.includes(".")) return;
  }

  expression += value;
  updateDisplay();
}

function clearDisplay() {
  expression = "";
  finished = false;
  updateDisplay();
}

function deleteLast() {
  expression = expression.slice(0, -1);
  finished = false;
  updateDisplay();
}

function calculate() {
  if (!expression) return;

  try {
    // Accept only calculator characters.
    if (!/^[0-9+\-*/%.() ]+$/.test(expression)) {
      throw new Error("Invalid input");
    }

    // Convert percentages into decimal values.
    const safeExpression = expression.replace(
      /(\d+(?:\.\d+)?)%/g,
      "($1/100)"
    );

    // Evaluate the validated mathematical expression.
    const result = Function(
      '"use strict"; return (' + safeExpression + ')'
    )();

    if (!Number.isFinite(result)) {
      display.value = "Cannot divide by zero";
      expression = "";
      finished = true;
      return;
    }

    expression = String(
      Number(result.toPrecision(12))
    );

    updateDisplay();
    finished = true;
  } catch {
    display.value = "Invalid expression";
    expression = "";
    finished = true;
  }
}
