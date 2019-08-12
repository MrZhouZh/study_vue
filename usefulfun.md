// 数据分组, 常用于本地加载更多数据
```js
function pagination(page, pageSize, data) {
  let offset = (page -  1) * pageSize
  return (offset + pageSize >= data.length)
    ? data.slice(offset, data.length)
    : data.slice(offset, offset + pageSize)
}

let page = 1
  , pageSize = 3
  , data = [1,2,3,4,5,6,7,8,9]
let result = pagination(page, pageSize, data) // result: [1,2,3]
```

管道机制 pipeline

```js
const pipeline = (...funcs) =>
  (val => funcs.reduce((a, b) => b(a), val);)

// or
const pipeline = function(...funcs){
    return function(val){
        return funcs.reduce(function(a,b){
            return b(a);
        },val);
    }
}

// example
// 将一个字符串转化成大写然后逆序
let str = 'jspool'

function stringToUpper(str) {
    return str.toUpperCase()
}

function stringReverse(str) {
    return str.split('').reverse().join('')
}

let toUpperAndResverse = pipeline(stringReverse, stringToUpper)
toUpperAndResverse(str) // => 'LOOPSJ'
```
