/*
calculation is represented by expression object
operand2 is either a number or another object
*/
let expression = {
  operand1 : 0,
  operand2 : null,
  operator: null
}
document.querySelector('.grid').addEventListener('click',(e)=>{
  document.querySelector('#display span').textContent += e.target.dataset.val;
  handleInput(e);
});
document.querySelector(`button[data-val="="]`).addEventListener('click',evaluate);

function add(exp){
  return typeof exp.operand2 === "object" ? exp.operand1 + evaluate(exp.operand2) : exp.operand1 + exp.operand2;
}
function evaluate(){
  if(expression.operator === "+")console.log(add(expression));
}
function handleInput(e){
  if(e.target.dataset.type ==="op") expression.operator = e.target.dataset.val;
  else expression.operand2 = +e.target.dataset.val;
}