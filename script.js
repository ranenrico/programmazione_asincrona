function testFunction(num){
    return num**2;
}

function principalFunction(num, secondFunction){
    let result = secondFunction(num);
    return result;
}

function handleClick(id, listener){
    let button = querySelector(id);
    button.addEventListener("click", listener);
}

function myListener(evt){
    console.log(evt);
}

function veryLongFunction(){
    console.log("Ci metto un casino a terminare");
}

let callback = function(name){
    console.log("Hello " + name);
}

let x = principalFunction(10, secondFunction(10));

console.log(x);

//Callback example

callback("ciccio");

setTimeout(callback, 1000);

handleClick("#mybutton", myListener);

veryLongFunction();

veryLongFunction();