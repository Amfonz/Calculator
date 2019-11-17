class DivByZeroError extends Error{
  constructor(message){
    super(message);
    this.name="DivByZeroError"
  }
}
//program state var, indicates if start of new operation
let newOp = true;
let precedence = {
  "+" : 1,
  "-" : 1,
  "*" : 2,
  "/" : 2,
  "%" : 2,
};
let operatorStack = [];
let operandStack = [];

function add(o1,o2){
  return o1 + o2;
}
function subtract(o1,o2){
  return o1 - o2;
}
function multiply(o1,o2){
  return o1 * o2;
}
function divide(o1,o2){
  if(o2 === 0){
    throw new DivByZeroError("Cannot divide by 0");
  }
  return o1 / o2
}
function modulo(o1,o2){
  return o1 % o2;
}
function evaluate(torStack,andStack){
  try{
    let tor1 = torStack.pop();
    let tor2 = torStack.pop();
    let and2 = andStack.pop();
    let and1 = andStack.pop();
    if(!and1){//no second operand
      return and2;
    }
    if(!tor2){//bottom
      return chooseOperation(tor1,and1,and2);
    }
    else if(precedence[tor1] > precedence[tor2]){
      //case where you evaluate then move down (ie 1+2*1)
      let ans = chooseOperation(tor1,and1,and2);
      andStack.push(ans)
      torStack.push(tor2)
      return evaluate(torStack,andStack);
    }
    else{
      //evaluate rest of stack and use it with the operation on top
      torStack.push(tor2);
      andStack.push(and1);
      return chooseOperation(tor1,evaluate(torStack,andStack),and2);
    }
  }catch(err){
    return err.message;
  }
}
function chooseOperation(operator,op1,op2){
  let result;
  switch (operator){
    case "+" :
      result = add(op1,op2);
      break; 
    case "-" :
      result = subtract(op1,op2);
      break;
    case "*" :
      result = multiply(op1,op2);
      break;
    case "/" :
      result = divide(op1,op2);
      break;
    case "%" :
      result = modulo(op1,op2);
      break;
    default: 
      result =  op1;
  }
  return result;
  }

function parseExpression(exp){
  //fails if no operators (desired behaviour so error is left alone (type error))
  exp.match(/[0-9]*\.?[0-9]+/g).forEach(element => operandStack.push(+element));;
  exp.match(/[+/\-%*]/g).forEach(element => operatorStack.push(element));

}
function decideDecimalStatus(){
  //check if the last operand has a decimal in it or not
  //used in delete key and after evaluating an expression
  let expression = document.querySelector("#disp-bottom").textContent;
  let operands = expression.match(/[0-9]*\.?[0-9]+/g);
  operands[operands.length-1].indexOf(".") === -1 ? enableDecimal() : disableDecimal();
}
function disableDecimal(){
  document.querySelector("button[data-val='.'").disabled=true;
}
function enableDecimal(){
  document.querySelector("button[data-val='.'").disabled=false;
}
function handleInput(val,type = "num"){
  let exp = document.querySelector("#disp-bottom").textContent;
  if(val === "ac" || val === "ArrowRight"){
    clear();
    newOp = true; return;
  }
  if(val === "=" || val === "Enter"){
    parseExpression(exp);
    let ans = evaluate(operatorStack,operandStack);
    //updtae displays
    displayEvaluation(ans);
    newOp = true;
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
      if(precedence[exp[exp.length-1]] ){//operator after oeprator
        updateDisplay("replace",val);
      }else {
        updateDisplay("append",val);
        enableDecimal();
      }
    }
    else if(newOp && type!=="op"){//new operation (ie screen has 0)
      updateDisplay("overwrite",val);
    }else{updateDisplay("append",val);}

  }
  return;
}
function backSpace(){
  let expression = document.querySelector("#disp-bottom");
  let length = expression.textContent.length;
  if(expression.textContent === "0") return;
  if(length === 1){expression.textContent = "0"; newOp = true; return;}//deleting non-zero single char => set screen to 0
  let newExpression = expression.textContent.slice(0,length-1);
  decideDecimalStatus();
  expression.textContent = newExpression;
}

function displayEvaluation(ans){
  let top = document.querySelector("#disp-top");
  let bottom = document.querySelector("#disp-bottom");
  top.textContent = bottom.textContent;
  bottom.textContent = ans;
}
function updateDisplay(mode,val){
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
  newOp = false;
}
function clear(){
  document.querySelector("#disp-top").textContent="";
  document.querySelector("#disp-bottom").textContent="0";
  operatorStack = [];
  operandStack = [];
  enableDecimal();
}
/* event listeners */

document.querySelector(".grid").addEventListener("click",(e)=>{
  handleInput(e.target.dataset.val,e.target.dataset.type);
});
window.addEventListener("keydown",(e)=>{
  if(!e.key.match(/[0-9+=\-/\.*%]|Enter|ArrowLeft|ArrowRight/)) return;
  !precedence[e.key] ? handleInput(e.key) : handleInput(e.key,"op");
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


