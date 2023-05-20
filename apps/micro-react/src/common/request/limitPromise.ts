export class LimitPromise {
  _max: number;
  _count: number;
  _taskQueue: any[];

  constructor(max: number) {
    // 异步任务“并发”上限
    this._max = max || 6;
    // 当前正在执行的任务数量
    this._count = 0;
    // 等待执行的任务队列
    this._taskQueue = [];
  }

  call(request: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const task = this._createTask(request, resolve, reject);
      if (this._count >= this._max) {
        this._taskQueue.push(task);
      } else {
        task();
      }
    });
  }

  _createTask(request: any, resolve: any, reject: any) {
    return async () => {
      try {
        await request();
      } catch (err) {
        resolve(err);
      } finally {
        this._count--;
        if (this._taskQueue.length) {
          let task = this._taskQueue.shift();
          task();
        } else {
          console.log('task count = ', this._count);
        }
      }
      this._count++;
      // console.log('task run , task count = ', this._count)
    };
  }
}
