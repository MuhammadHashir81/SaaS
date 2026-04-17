console.log('this is practice')



const  arr = [
    {
     name:'hashir',
     age:20
    },
    {
     name:'maavia',
     age:21

    },
    {
        name:'nahal',
        age:18

    },
    {
        name:'mubashir',
        age:40

    },
    
]
// arr.total = arr.reduce((sum, item) => {
//     return sum + item.age;
// }, 0);

// console.log(arr.total); 


arr.forEach((element)=>{
    console.log(element.age * 2)

})