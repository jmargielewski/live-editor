[{"content":"# Unary","type":"text","id":"01i3y"},{"content":"// Problem\n['1', '2', '3'].map(parseInt) // [1, NaN, NaN]\n\n// Solution \nfunction unary(fn) {\n  return function onlyArg(arg) {\n    return fn(arg)\n  }\n}\n\nshow(['1', '2', '3'].map(unary(parseInt)));","type":"code","id":"xge34"},{"content":"# Identity\n\nAccepts only one argument and does nothing just returning its value.\n\nCan be used with methods such as filter, map, or reduce. Apart from that can also be used as a default fallback.\n\n\n","type":"text","id":"0r3vx"},{"content":"// Implementation\nfunction identity(v) {\n  return v;\n}\n\n\n// Example 1\nconst result = ['', 'Now', 'is', 'a', 'good', 'time'].filter(identity)\n\nshow(result);\n","type":"code","id":"ylqmr"},{"content":"// Example 2\nfunction output(msg, formatFn = identity) {\n  msg = formatFn(msg);\n  show(msg)\n}\n\nfunction upper(txt) {\n  return txt.toUpperCase();\n}\n\noutput('Hello World') // Hello World\noutput('Hello World', upper) // HELLO WORLD\n\n","type":"code","id":"mfj32"},{"content":"# Constant\n","type":"text","id":"3alz2"},{"content":"// PROBELM\nfunction bar(val) { return val}\nfunction foo(val) { return val}\nconst p2 = 'P2'\n\n// not work\nPromise.resolve(2).then(bar).then(p2).then(foo); // 2\n// instead\nPromise.resolve(2).then(bar).then(() => p2).then(foo); // \"P2\"\n\n// IMPLEMENTATION\nfunction constant(v) {\n  return function value() {\n    return v;\n  }\n}\n\n// SOLUTION\nPromise.resolve(2).then(bar).then(constant(p2)).then(foo); // Promise<\"P2\">","type":"code","id":"81762"},{"content":"## SpreadArgs (aka Apply) & GatherArgs (aka unapply)\n\nApplies function `spreadFn` to the argument list args.\n","type":"text","id":"cuxa5"},{"content":"// PROBLEM\nfunction foo(x, y) {\n  show(x + y);\n}\n\nfunction bar(fn) {\n  fn([1, 2]);\n}\n\nbar(foo); // 1,2undefined\n\n// IMPLEMENTATION\nfunction spreadArgs(fn) {\n  return function  spreadFn(argsArray) {\n    return fn(...argsArray)\n  }\n}\n// SOLUTION\nbar(spreadArgs(foo)); // 3\n\n// Another example of usage\nspreadArgs(Math.max)([1, 20, 3]) // 20\n\n","type":"code","id":"kzhmp"},{"content":"// IMPLEMENTATION\nfunction gatherArgs(fn) {\n  return function gatherFn(...argsArr) {\n    return fn(argsArr);\n  }\n}\n\n// Example of usage\nfunction compineFirstTwo([v1, v2]) {\n  return v1 + v2\n}\n\nshow([1, 2, 3, 4, 5].reduce(gatherArgs(compineFirstTwo))) // 15\n","type":"code","id":"n0ndj"},{"content":"# Partial","type":"text","id":"rmdea"},{"content":"// IMPLEMENTATION\nfunction partial(fn, ...presetArgs) {\n  return function partiallyApplied(...laterArgs) {\n    return fn(...presetArgs, ...laterArgs)\n\n  }\n}\n\n// Example of usage\nfunction ajax(url, data, cb) {\n  cb({ user: data.id })\n}\nconst getPerson = partial(ajax, 'https://some.api/person');\nconst getCurrentUser = partial(getPerson, { id: 100 })\n\ngetCurrentUser(show) // { user: 100 }","type":"code","id":"zcoou"},{"content":"// Another example\n\nfunction add (x, y) {\n  return x + y;\n}\n\n// without partial\n// [1, 2, 3, 4, 5].map((val) => add(3, val)) // [4, 5, 6, 7, 8]\n\n// with partial\nshow([1, 2, 3, 4, 5].map(partial(add, 3))) // [4, 5, 6, 7, 8]","type":"code","id":"rm7bn"},{"content":"# ReverseArgs","type":"text","id":"njyme"},{"content":"// IMPLEMENTATION\nfunction reverseArgs(fn) {\n  return function argsReversed(...args) {\n    return fn(...args.reverse());\n  }\n}\n\n// it can be used to reverse ajax arguments and pass cb first:\nconst ajaxWithCb = reverseArgs(partial(reverseArgs(ajax), function onResult() {}));\n\najaxWithCb('https://some.api/person', { id: 100 });","type":"code","id":"xr3w4"},{"content":"# PartialRight","type":"text","id":"tcpyj"},{"content":"function partialRight(fn, ...presentArgs) {\n  return function partiallyApplied(...laterArgs) {\n    return fn(...laterArgs, ...presentArgs);\n  }\n}\n\nconst ajaxWithAppliedCallback = partialRight(ajax, show);\najaxWithAppliedCallback('https://some.api/person', { id: 101 })\n\n","type":"code","id":"057gp"},{"content":"# Curry\n","type":"text","id":"fbmpr"},{"content":"// IMPLEMENTATION\nfunction curry(fn, arity = fn.length) {\n  return (function nextCurried(prevArgs) {\n    return function curried(nextArg) {\n      const args = [...prevArgs, nextArg];\n\n      if (args.length >= arity) {\n        return fn(...args);\n      } else {\n        return nextCurried(args);\n      }\n    }\n  })([])\n}\n\n// Example 1\ncurry(ajax)('https://some.api/person')({ id: 200 })(show)\n","type":"code","id":"ycpk0"},{"content":"// Example 2\nshow([1, 2, 3, 4, 5].map(curry(add)(3)))","type":"code","id":"55qvu"},{"content":"# Loose Curry","type":"text","id":"b7slr"},{"content":"// IMPLEMENTATION\nfunction loseCurry(fn, arity = fn.length) {\n  return (function nextCurried(prevArgs) {\n    return function curried(...nextArg) {\n      const args = [...prevArgs, ...nextArg];\n\n      if (args.length >= arity) {\n        return fn(...args);\n      } else {\n        return nextCurried(args);\n      }\n    }\n  })([])\n}\n\nfunction sum(...nums) {\n  let total = 0;\n  for (let num of nums) {\n    total += num\n  }\n  return total;\n}\n\nshow(loseCurry(sum, 5)(1)(2, 3)(4, 5))","type":"code","id":"2yznw"},{"content":"# Uncurry","type":"text","id":"qj6wt"},{"content":"// IMPLEMENTATION\nfunction uncurry(fn) {\n  return function uncurried(...args) {\n    let ret = fn;\n\n    for (let arg of args) {\n      ret = ret(arg);\n    }\n    return ret;\n  }\n}\n\n// Example 1\nconst curriedSum = curry(sum, 5);\nconst uncurriedSum = uncurry(curriedSum);\n\ncurriedSum(1)(2)(3)(4)(5); // 15\n\nuncurriedSum(1,2,3,4,5); // 15\nuncurriedSum(1,2,3)(4)(5); // 15","type":"code","id":"k6omf"},{"content":"# PartialProps & CurryProps\n\n// TODO: add\n","type":"text","id":"ckj8k"}]