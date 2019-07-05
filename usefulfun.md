```js
// 数据分组, 常用于本地加载更多数据
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
