(function() {
  const calcDisplay = document.getElementById("calc-display-content");
  // TODO: freeze?
  const state = {
    ERROR: "error", // input is invalid
    NUMBER: "number", // input is a number
    OPERATION: "operation", // input is part of an operation (eg: input '3','+')
  }
  const operators = {
    ADD: "add",
    DIVIDE: "divide",
    EQUALS: "equals",
    MULTIPLY: "multiply",
    SUBTRACT: "subtract",
  }

  let calculatorState = {
    currentState: state.NUMBER, // current state: ERROR, NUMBER, OPERATION
    displayState: "0", // easier to append digits as a string
    hasDecimal: false, // is there a decimal point currently in use?
    operand: "0", // defaults to '0'
    operatorPressed: null,
  }

  /*
    set the calculator state to ERROR
  */
  function setToErrorState() {
    calculatorState.currentState = state.ERROR;
  }

  /*
    set the calculator state to NUMBER
  */
  function setToNumberState() {
    calculatorState.currentState = state.NUMBER;
  }

  /*
    set the calculator state to OPERATION
  */
  function setToOperationState() {
    calculatorState.currentState = state.OPERATION;
  }

  /*
    Was the EQUALS operator pressed? (Was an operation performed?)
  */
  function wasEqualsPressed() {
    return calculatorState.operatorPressed === operators.EQUALS;
  }

  /*
    Updates the calculator display to the value of the calculator state
  */
  function updateDisplay() {
    calcDisplay.innerHTML = calculatorState.displayState;
  }

  /*
    Sets the calculator state to ERROR and updates display to Err
  */
  function displayError() {
    reset();
    setToErrorState();
    calculatorState.displayState = "Err";
    updateDisplay();
  }

  /*
    Resets the calculator state, and updates the calculator display
  */
  function reset() {
    setToNumberState();
    calculatorState.displayState = "0";
    calculatorState.hasDecimal = false;
    calculatorState.operand = "0";
    calculatorState.operatorPressed = null;
    updateDisplay();
  }

  /*
    Appends the given value to the calculator display state, and updates display
  */
  function appendToDisplay(value) {
    switch (calculatorState.currentState) {
      case state.NUMBER:
        if (calculatorState.displayState == "0" || wasEqualsPressed()) {
          // leading zeros will never be displayed (eg: 001 is displayed as 1)
          calculatorState.displayState = value;
        } else {
          calculatorState.displayState += value;
        }
        break;
      case state.ERROR:
      case state.OPERATION:
        calculatorState.displayState = value;
        setToNumberState();
        break;
      default:
        // should never reach here!
        console.error("bad state");
    }
    updateDisplay();
  }

  /*
    Performs the equals function with the stored operand and operator, and uses
    the current display as the other operand. Updates the display
  */
  function performEquals() {
    // error if no second operand is entered
    if (calculatorState.currentState !== state.NUMBER) {
      displayError();
      return;
    }

    let operand1 = Number(calculatorState.operand);
    let operand2 = Number(calculatorState.displayState);

    // this is hacky...but it catches the case for if '.' is used as an operand
    // it will default to 0
    if (isNaN(operand1)) {
      operand1 = 0;
    }
    if (isNaN(operand2)) {
      operand2 = 0;
    }

    switch (calculatorState.operatorPressed) {
      case operators.ADD:
        calculatorState.displayState = operand1 + operand2;
        break;
      case operators.DIVIDE:
        calculatorState.displayState = operand1 / operand2;
        break;
      case operators.MULTIPLY:
        calculatorState.displayState = operand1 * operand2;
        break;
      case operators.SUBTRACT:
        calculatorState.displayState = operand1 - operand2;
        break;
      default:
        // should never reach here!
        console.error("operation not supported");
        return;
    }

    // reset operatorPressed and set state to NUMEBR
    calculatorState.operatorPressed = null;
    setToNumberState();
    calculatorState.hasDecimal = false;

    updateDisplay();
  }

  /*
    Returns 'true' if operator is pressed in an invalid state (if not in
    a number state)
  */
  function invalidOperatorCheck() {
    if (calculatorState.currentState !== state.NUMBER) {
      displayError();
      return true;
    }
    return false;
  }

  /*
    Updates the operand to the current displayState
  */
  function updateOperand() {
    if (calculatorState.operatorPressed !== null && !wasEqualsPressed()) {
      performEquals();
    }
    calculatorState.operand = calculatorState.displayState;
  }

  /*
    function for handling a number button click event - the number is appended
    to the current display
  */
  function numberButtonPress(value) {
    appendToDisplay(value);

    // reset operatorPressed if number is pressed after operation is done
    if (wasEqualsPressed()) {
      calculatorState.operatorPressed = null;
    }
  }

  /*
    function for handling a decimal button click event - a decimal is appended
    to the current display, but does nothing if there is already a decimal
    present in the current number
  */
  function decimalButtonPress() {
    if (calculatorState.hasDecimal) {
      // do nothing if there is already a decimal present in the current number
      return;
    }

    calculatorState.hasDecimal = true;
    appendToDisplay(".");

    // reset operatorPressed if number is pressed after operation is done
    if (wasEqualsPressed()) {
      calculatorState.operatorPressed = null;
    }
  }

  /*
    function for handling a multiply button click event - the calculator state
    is updated to reflect that MULTIPLY has been pressed
  */
  function multiplyPress() {
    if (!invalidOperatorCheck()) {
      updateOperand();
      setToOperationState();
      calculatorState.operatorPressed = operators.MULTIPLY;
      calculatorState.hasDecimal = false;
    }
  }

  /*
    function for handling a divide button click event - the calculator state
    is updated to reflect that DIVIDE has been pressed
  */
  function dividePress() {
    if (!invalidOperatorCheck()) {
      updateOperand();
      setToOperationState();
      calculatorState.operatorPressed = operators.DIVIDE;
      calculatorState.hasDecimal = false;
    }
  }

  /*
    function for handling a subtract button click event - the calculator state
    is updated to reflect that SUBTRACT has been pressed
  */
  function subtractPress() {
    if (!invalidOperatorCheck()) {
      updateOperand(); // remove this?
      setToOperationState();
      calculatorState.operatorPressed = operators.SUBTRACT;
      calculatorState.hasDecimal = false;
    }
  }

  /*
    function for handling a add/equals button click event - the calculator state
    is updated to reflect that ADD/EQUALS has been pressed
  */
  function addEqualsPress() {
    // invalidOperatorCheck();
    if (calculatorState.operatorPressed === null || wasEqualsPressed()) {
      updateOperand();
      setToOperationState();
      calculatorState.operatorPressed = operators.ADD;
      calculatorState.hasDecimal = false;
    } else {
      // performs 'equals' operation
      performEquals()
      calculatorState.operatorPressed = operators.EQUALS;
    }
  }


  // bind button click events
  function bindButtonClickEvents() {
    // clear
    document.getElementById("button-clear").addEventListener("click", reset);

    // decimal
    document.getElementById("button-decimal").addEventListener("click", decimalButtonPress);

    // number buttons
    let numberButtons = document.getElementsByClassName("number-button");
    for (let i = 0; i < numberButtons.length; i++) {
      let numberButtonElem = numberButtons[i];
      let elemValue = numberButtonElem.dataset.value;
      numberButtonElem.addEventListener("click", function() {
        numberButtonPress(elemValue);
      })
    }

    // operator buttons
    document.getElementById("button-add-equals").addEventListener("click", addEqualsPress);
    document.getElementById("button-divide").addEventListener("click", dividePress);
    document.getElementById("button-multiply").addEventListener("click", multiplyPress);
    document.getElementById("button-subtract").addEventListener("click", subtractPress);
  }

  document.addEventListener("DOMContentLoaded", bindButtonClickEvents);
})();
