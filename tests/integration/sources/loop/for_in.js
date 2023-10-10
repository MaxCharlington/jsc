let arr = [1, "a", 5.6];
for (const index in arr) {
    console.log(index, " ", arr[index])
}

let obj = {name: "John", age: 45};
for (const key in obj) {
    console.log(key, " ", obj[key])
}
