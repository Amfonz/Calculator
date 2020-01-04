class DivByZeroError extends Error{
  constructor(message){
    super(message);
    this.name="DivByZeroError"
  }
}

const Calculator = (() => {
  let newOp = true
  let precedence = {
    "+" : 1,
    "-" : 1,
    "*" : 2,
    "/" : 2,
    "%" : 2,
  };
  let operatorStack = [];
  let operandStack = [];

  let add = (o1,o2) => {
    return o1 + o2;
  }

  let subtract = (o1,o2) => {
    return o1 - o2;
  }
  let multiply = (o1,o2) => {
    return o1 * o2;
  }
  let divide = (o1,o2) => {
    if(o2 === 0){
      throw new DivByZeroError("Cannot divide by 0");
    }
    return o1 / o2
  }
  let modulo = (o1,o2) => {
    return o1 % o2;
  }

  let evaluate = () => { 
    try{
      let operator1 = operatorStack.pop();
      let operator2 = operatorStack.pop();
      let operand2 = operandStack.pop();
      let operand1 = operandStack.pop();
      if(operand1 == undefined){//no second operand
        return operand2;
      }
      if(!operator2){//bottom
        return chooseOperation(operator1,operand1,operand2);
      }
      else if(precedence[operator1] > precedence[operator2]){
        //case where you evaluate then move down (ie 1+2*1)
        let ans = chooseOperation(operator1,operand1,operand2);
        operandStack.push(ans)
        operatorStack.push(operator2)
        return evaluate(operatorStack,operandStack);
      }
      else{
        //evaluate rest of stack and use it with the operation on top
        operatorStack.push(operator2);
        operandStack.push(operand1);
        return chooseOperation(operator1,evaluate(operatorStack,operandStack),operand2);
      }
    }catch(err){
      return err.message;
    }
  }
  let chooseOperation = (operator,operand1,operand2) =>{
    let result;
    switch (operator){
      case "+" :
        result = add(operand1,operand2);
        break; 
      case "-" :
        result = subtract(operand1,operand2);
        break;
      case "*" :
        result = multiply(operand1,operand2);
        break;
      case "/" :
        result = divide(operand1,operand2);
        break;
      case "%" :
        result = modulo(operand1,operand2);
        break;
      default: 
        result =  operand1;
    }
    return result;
    }

    let parseExpression = exp => {
      //fails if no operators (desired behaviour so error is left alone (type error))
      exp.match(/[0-9]*\.?[0-9]+/g).forEach(element => operandStack.push(+element));;
      exp.match(/[+/\-%*]/g).forEach(element => operatorStack.push(element));
    }

    let setnewOp = (setting) => {
      newOp = setting;
    }

    let getnewOp = () => {
      return newOp;
    }

    return {setnewOp, evaluate, parseExpression, getnewOp, precedence, operandStack, operatorStack};
})();


const displayController = (() => {
  let decideDecimalStatus = () => {
    //check if the last operand has a decimal in it or not
    //used in delete key and after evaluating an expression
    let expression = document.querySelector("#disp-bottom").textContent;
    let operands = expression.match(/[0-9]*\.?[0-9]+/g);
    operands[operands.length-1].indexOf(".") === -1 ? enableDecimal() : disableDecimal();
  }
  let disableDecimal = () => {
    document.querySelector("button[data-val='.'").disabled=true;
  }
  let enableDecimal = () => {
    document.querySelector("button[data-val='.'").disabled=false;
  }
  let handleInput = (val,type = "num") => {
    let exp = document.querySelector("#disp-bottom").textContent;
    if(val === "ac" || val === "ArrowRight"){
      clear();
      Calculator.setnewOp(true); return;
    }
    if(val === "=" || val === "Enter"){
      Calculator.parseExpression(exp);
      let ans = Calculator.evaluate(Calculator.operatorStack,Calculator.operandStack);
      //updtae displays
      displayEvaluation(ans);
      Calculator.setnewOp(true);
      decideDecimalStatus();
      return;
    }
    if(val === "del" || val === "ArrowLeft"){
      backSpace();
      return;
    }
    if(val === "."){
      let decButton = document.querySelector("button[data-val='.']");
      if(decButton.disabled){
        return;
      }else{
        updateDisplay("append",val);
        disableDecimal();
      }
    }
    else{
      if(type==="op"){
        if(Calculator.precedence[exp[exp.length-1]] ){//operator after oeprator
          updateDisplay("replace",val);
        }else {
          updateDisplay("append",val);
          enableDecimal();
        }
      }
      else if(Calculator.getnewOp() && type!=="op"){//new operation (ie screen has 0)
        updateDisplay("overwrite",val);
      }else{updateDisplay("append",val);}
  
    }
    return;
  }
  let backSpace = () => {
    let expression = document.querySelector("#disp-bottom");
    let length = expression.textContent.length;
    if(expression.textContent === "0") return;
    if(length === 1){
      expression.textContent = "0"; 
      Calculator.setnewOp(true); 
      return;
    }//deleting non-zero single char => set screen to 0
    let newExpression = expression.textContent.slice(0,length-1);
    decideDecimalStatus();
    expression.textContent = newExpression;
  }
  
  let displayEvaluation = ans => {
    let top = document.querySelector("#disp-top");
    let bottom = document.querySelector("#disp-bottom");
    top.textContent = bottom.textContent;
    bottom.textContent = ans;
  }
  let updateDisplay = (mode,val) => {
    let display = document.querySelector("#disp-bottom");
    //check if we got a operator than another
    if(mode==="overwrite"){
      display.textContent = val;
    }else if(mode ==="replace"){
      display.textContent = display.textContent.slice(0,display.textContent.length-1) + val;
    }
    else{
      document.querySelector("#disp-bottom").textContent += val;
    }
    Calculator.setnewOp(false);
  }
  let clear = () => {
    document.querySelector("#disp-top").textContent="";
    document.querySelector("#disp-bottom").textContent="0";
    Calculator.operatorStack = [];
    Calculator.operandStack = [];
    enableDecimal();
  }

  document.querySelector(".grid").addEventListener("click",(e)=>{
    handleInput(e.target.dataset.val,e.target.dataset.type);
  });
  window.addEventListener("keydown",(e)=>{
    if(!e.key.match(/[0-9+=\-/\.*%]|Enter|ArrowLeft|ArrowRight/)) return;
    !Calculator.precedence[e.key] ? handleInput(e.key) : handleInput(e.key,"op");
  });
  window.addEventListener("keydown",(e)=>{
    //add click effect on button display if using keyboard
    if(e.key==="ArrowLeft"){
      document.querySelector(`button[data-val='del']`).classList.toggle("press");
    }else if(e.key==="ArrowRight"){
      document.querySelector(`button[data-val='ac']`).classList.toggle("press");
    }else{
      document.querySelector(`button[data-val='${e.key}']`).classList.toggle("press");
    }  
  });
  window.addEventListener("keyup",(e)=>{
    if(e.key==="ArrowLeft"){
      document.querySelector(`button[data-val='del']`).classList.toggle("press");
    }else if(e.key==="ArrowRight"){
      document.querySelector(`button[data-val='ac']`).classList.toggle("press");
    }else{
      document.querySelector(`button[data-val='${e.key}']`).classList.toggle("press");
    }
  });
})();



