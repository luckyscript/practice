const TaskQ = require('../index');

var myQueue = new TaskQ({
    limit: 2
});

myQueue.push(() => new Promise(resolve => {
    setTimeout(_ => {
        resolve(4000);
    }, 4000);
})).then(data => {
    console.log(data);
})
myQueue.push(() => new Promise(resolve => {
    setTimeout(_ => {
        resolve(2000);
    }, 2000);
})).then(data => {
    console.log(data);
})
myQueue.push(() => new Promise(resolve => {
    setTimeout(_ => {
        resolve(3000);
    }, 3000);
})).then(data => {
    console.log(data);
})
myQueue.push(() => new Promise(resolve => {
    setTimeout(_ => {
        resolve(200);
    }, 200);
})).then(data => {
    console.log(data);
})