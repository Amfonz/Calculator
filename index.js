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
  return o1 / o2
}
function modulo(o1,o2){
  return o1 % o2;
}
function evaluate(torStack,andStack){
  let tor1 = torStack.pop();
  let tor2 = torStack.pop();
  let and2 = andStack.pop();
  let and1 = andStack.pop();
  if(!tor2){//bottom
    return chooseOperation(tor1,and1,and2);
  }
  else if(precedence[tor1] > precedence[tor2]){
    let ans = chooseOperation(tor1,and1,and2);
    andStack.push(ans)
    torStack.push(tor2)
    return evaluate(torStack,andStack);
  }
  else{
    torStack.push(tor2);
    andStack.push(and1);
    return chooseOperation(tor1,evaluate(torStack,andStack),and2);
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
  //take the textContent of disp-bottom
  //parse it and return it for evalutaion
  exp.match(/[0-9]+/g).forEach(element => operandStack.push(+element));;
  exp.match(/[+/\-%*]/g).forEach(element => operatorStack.push(element));

}


function handleInput(e){
  eData = e.target.dataset;
  if(eData.val === 'ac'){clear();}
  else if(eData.val === '='){
    //parse expression
    let exp = document.querySelector('#disp-bottom').textContent;
    parseExpression(exp);
    //evaluate
    let ans = evaluate(operatorStack,operandStack);
    //updtae displays
    displayEvaluation(ans);
  }
  else if(eData.val === 'del'){
    backSpace();
  }
  else{updateDisplay(eData);}


  return;
}
function backSpace(){
  let expression = document.querySelector('#disp-bottom');
    let length = expression.textContent.length;
    if(expression.textContent === '0')return;
    if(length === 1){expression.textContent = '0';return;}//deleting non-zero single char set screen to 0
    expression.textContent = expression.textContent.slice(0,length-1);
    
}

function displayEvaluation(ans){
  let top = document.querySelector('#disp-top');
  let bottom = document.querySelector('#disp-bottom');
  top.textContent = bottom.textContent;
  bottom.textContent = ans;
}
function updateDisplay(eData){
  display = document.querySelector('#disp-bottom')
  if(display.textContent === "0" && eData.type!=="op"){
    display.textContent = eData.val;
  }else{
    document.querySelector('#disp-bottom').textContent += eData.val;
  }
}
function clear(){
  document.querySelector('#disp-top').textContent="";
  document.querySelector('#disp-bottom').textContent="0";
  operatorStack = [];
  operandStack = [];
}
/* event listeners */
document.querySelector('.grid').addEventListener('click',(e)=>{
  handleInput(e);
});


