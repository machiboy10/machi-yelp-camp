module.exports = function(func){
    return (res, req, next) => {
        func(res,req, next).catch(next);  
    }

}  

//other way

// module.exports = func => {
//     return (res, req, next) => {
//         func(res,req, next).catch(next);  
//     }

// }