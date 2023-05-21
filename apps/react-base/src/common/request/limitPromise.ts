type Request<T = any> = () => Promise<T>;

export class LimitPromise {
  _max: number;
  _count: number;
  _taskQueue: Request[];

  constructor(max?: number) {
    this._max = max || 5;
    this._count = 0;
    this._taskQueue = [];
  }

  call<T>(request: Request) {
    return new Promise((resolve, reject) => {
      const task = this._createTask(request, resolve, reject);
      if (this._count >= this._max) {
        this._taskQueue.push(task);
      } else {
        task();
      }
    }) as unknown as Promise<T>;
  }

  _createTask(
    request: Request,
    resolve: (value: unknown) => void,
    reject: (value: unknown) => void,
  ) {
    return async () => {
      try {
        this._count++;
        const rsp = await request();
        resolve(rsp);
      } catch (err) {
        reject(err);
      } finally {
        this._count--;
        if (this._taskQueue.length) {
          let task = this._taskQueue.shift();
          task();
        }
      }
    };
  }
}
