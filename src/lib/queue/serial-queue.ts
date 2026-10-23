/**
 * Минимальная последовательная очередь задач.
 *
 * Нужна для интеграции с платёжными провайдерами: при пиковой нагрузке
 * запросы к внешнему API (ЮKassa/LAVA/Robokassa) выполняются строго
 * по одному, чтобы не упереться в rate limit провайдера.
 *
 * Это in-memory очередь одного процесса. При горизонтальном масштабировании
 * её нужно заменить на Redis/BullMQ, но для старта на одном VPS достаточно.
 */

export class QueueOverflowError extends Error {
  constructor(message = 'Queue is full') {
    super(message);
    this.name = 'QueueOverflowError';
  }
}

export interface SerialQueueOptions {
  /** Максимум задач, ожидающих выполнения. */
  maxPending?: number;
}

export interface SerialQueue {
  /** Добавить задачу в очередь. */
  enqueue<T>(task: () => Promise<T>): Promise<T>;
  /** Количество незавершённых задач (включая текущую). */
  readonly size: number;
}

export function createSerialQueue({ maxPending = 100 }: SerialQueueOptions = {}): SerialQueue {
  let tail: Promise<void> = Promise.resolve();
  let size = 0;

  return {
    enqueue<T>(task: () => Promise<T>): Promise<T> {
      if (size >= maxPending) {
        return Promise.reject(new QueueOverflowError());
      }

      size += 1;

      // Продолжаем очередь и после ошибки предыдущей задачи.
      const run = tail.then(task, task);

      tail = run.then(
        () => undefined,
        () => undefined,
      );
      tail.finally(() => {
        size -= 1;
      });

      return run;
    },
    get size() {
      return size;
    },
  };
}
