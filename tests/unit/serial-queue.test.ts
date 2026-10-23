import { describe, expect, it } from 'vitest';
import { QueueOverflowError, createSerialQueue } from '@/lib/queue/serial-queue';

describe('serial queue', () => {
  it('выполняет задачи последовательно', async () => {
    const queue = createSerialQueue();
    const order: number[] = [];

    const first = queue.enqueue(async () => {
      await Promise.resolve();
      order.push(1);
      return 1;
    });
    const second = queue.enqueue(async () => {
      order.push(2);
      return 2;
    });

    await expect(Promise.all([first, second])).resolves.toEqual([1, 2]);
    expect(order).toEqual([1, 2]);
  });

  it('продолжает работу после ошибки задачи', async () => {
    const queue = createSerialQueue();

    const failed = queue.enqueue(async () => {
      throw new Error('boom');
    });
    const next = queue.enqueue(async () => 'ok');

    await expect(failed).rejects.toThrow('boom');
    await expect(next).resolves.toBe('ok');
  });

  it('отклоняет задачи при переполнении очереди', async () => {
    const queue = createSerialQueue({ maxPending: 1 });

    let release!: () => void;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });

    const running = queue.enqueue(async () => {
      await gate;
      return 'done';
    });

    await expect(queue.enqueue(async () => 'overflow')).rejects.toBeInstanceOf(QueueOverflowError);

    release();
    await expect(running).resolves.toBe('done');
  });
});
