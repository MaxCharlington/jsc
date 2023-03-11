// // basic function
// function f1()
// {

// }

// // function with parameter
// function f2(a)
// {

// }

// function with nonmodifying capture
let a = 1;
function f3()
{
    const b = 1;
    return a + b;
}
console.log(f3());
