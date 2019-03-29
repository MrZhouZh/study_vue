# 检测类型

```js
  var _toString = Object.prototype.toString;
  function toRawType(value) {
    return _toString.call(value).slice(8, -1)
  }
  // example
  var a = [];
  console.log(toRawType(a)) // "Array"
 ```
