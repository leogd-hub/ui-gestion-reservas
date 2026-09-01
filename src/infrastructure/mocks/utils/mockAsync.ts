import {DomainError} from '@/shared/errors/DomainError';

const randomBetween = (minMs: number, maxMs: number): number =>
  Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;

export const sleep = (ms: number): Promise<void> =>
  new Promise(resolve => {
    setTimeout(resolve, ms);
  });

export interface MockOptions {
  minMs?: number;
  maxMs?: number;
  failRate?: number;
}

export class MockAsyncRunner {
  private readonly minMs: number;
  private readonly maxMs: number;
  private readonly failRate: number;

  constructor(options: MockOptions = {}) {
    this.minMs = options.minMs ?? 200;
    this.maxMs = options.maxMs ?? 700;
    this.failRate = options.failRate ?? 0;
  }

  async run<T>(callback: () => T, errorMessage?: string): Promise<T> {
    await sleep(randomBetween(this.minMs, this.maxMs));

    if (Math.random() < this.failRate) {
      throw new DomainError(errorMessage ?? 'Mock async failure', 'MOCK_ASYNC_ERROR');
    }

    return callback();
  }
}
