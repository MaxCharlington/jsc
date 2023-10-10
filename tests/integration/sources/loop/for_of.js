let arr = [1, "a", 5.6];
for (const value of arr) {
    console.log(value)
}

let str = "asdasd"
for (let ch of str) {
    console.log(ch)
}


try
{
    for (let i of 1) {}
}
catch (e)
{

}


try
{
    for (let i of null) {}
}
catch (e)
{

}