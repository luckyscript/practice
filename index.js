const EventEmitter = require("events");
const debug = require("debug")('taskQueue');
class taskQ extends EventEmitter {
  constructor({ limit = 1 } = { limit: 1 }) {
    super();
    this.limit = limit;
    this.queue = [];
  }
  static getId() {
    taskQ.len++;
    return taskQ.len;
  }
  push( run ) {
    let canNext = this._canNext();
    let id = taskQ.getId()
    this.queue.push({
      run: () => Promise.resolve().then(run),
      id
    })
    if(canNext)
      this._next();
    return new Promise((resolve, reject) => {
      this.once(`task${id}`, ({result, error}) => {
        debug(`task${id} finish`)
        if(error !== void 0) {
          reject(error);
        }
        resolve(result);
      })
    })
  }
  _canNext() {
    return this.queue.length < this.limit;
  }
  _next() {
    if(taskQ.currentId >= taskQ.len)
      return;
    debug(`task${taskQ.currentId+1} start run`)
    let { run, id } = this.queue[taskQ.currentId];
    taskQ.currentId++;
    run()
    .then(result => {
      this.emit(`task${id}`, {result})
      this._next();
    })
    .catch(error => {
      this.emit(`task${id}`, {error})
      this._next();
    })
  }
};
taskQ.len = 0;
taskQ.currentId = 0;

module.exports = taskQ;
