/*
calculation is represented by expression object
operand2 is either a number or another object

where to cast operands1
handle precedence 
handle no operator case ie 1 = 
handle missing operator (copy the other ie 1+=)
handle assignment of expression result to operand1
return the values and display them properly


*/
let hasNewOp = false;
let precedence = {
  "+" : 1,
  "-" : 1,
  "*" : 2,
  "/" : 2,
  "%" : 2,
};
let expression = {
  operand1 : "",
  operand2 : "",
  operator : ""
};

function add(exp){
  return typeof exp.operand2 === "object" ? exp.operand1 + evaluate(exp.operand2) : exp.operand1 + exp.operand2;
}
function subtract(exp){
  return typeof exp.operand2 === "object" ? exp.operand1 - evaluate(exp.operand2) : exp.operand1 - exp.operand2;
}
function multiply(exp){
  return typeof exp.operand2 === "object" ? exp.operand1 * evaluate(exp.operand2) : exp.operand1 * exp.operand2;
}
function divide(exp){
  return typeof exp.operand2 === "object" ? exp.operand1 / evaluate(exp.operand2) : exp.operand1 / exp.operand2;
}
function evaluate(event = null,exp = expression){
  let result;
  exp.operand1 = +exp.operand1;
  if(typeof exp.operand2 !== "object") exp.operand2 = +exp.operand2;
  switch (exp.operator){
    case "+" :
      result = add(exp);
      break; 
    case "-" :
      result = subtract(exp);
      break;
    case "*" :
      result = multiply(exp);
      break;
    case "/" :
      result = divide(exp);
      break;
    default: 
      result =  expression.operand1;
  }
  return result;
}
function handleInput(e){
  eData = e.target.dataset;
  if(eData.val == 'ac'){clear();return;}
  if(eData.val==="="){
    let result = evaluate();
    displayEvaluation(result);
    expression.operand1 = result;
    hasNewOp = false;
  }
  else if(eData.type == "op"){
    expression.operator = eData.val;
    hasNewOp = true;
  }else{
    if(!hasNewOp){
      //add to operand 1
      expression.operand1+=eData.val;
    }else{
      expression.operand2+=eData.val;
    }
  }
}

function displayEvaluation(ans){
  let top = document.querySelector('#disp-top');
  let bottom = document.querySelector('#disp-bottom');
  top.textContent = bottom.textContent;
  bottom.textContent = ans;
}
function updateDisplay(e){
  let data = e.target.dataset;
  if(data.val!=='='){
    display = document.querySelector('#disp-bottom')
    if(display.textContent === "0"){
      display.textContent = e.target.dataset.val;
    }else{
      document.querySelector('#disp-bottom').textContent += e.target.dataset.val;
    }
  }
}
function clear(){
  expression.operand1="";
  expression.operand2="";
  expression.operator="";
  document.querySelector('#disp-top').textContent="";
  document.querySelector('#disp-bottom').textContent="0";
}
/* event listeners */
document.querySelector('.grid').addEventListener('click',(e)=>{
  updateDisplay(e);
  handleInput(e);
});


