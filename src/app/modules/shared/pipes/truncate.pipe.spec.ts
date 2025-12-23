import { TruncatePipe } from './truncate.pipe';

describe('TruncatePipe', () => {
  it('create an instance', () => {
    const pipe = new TruncatePipe();
    expect(pipe).toBeTruthy();
  });

  it('should not truncate empty string', () => {
    const pipe = new TruncatePipe();
    expect(pipe.transform('', 5)).toBe('');
  });

  it('should not truncate null value', () => {
    const pipe = new TruncatePipe();
    expect(pipe.transform(null, 5)).toBe('');
  });

  it('should not truncate undefined value', () => {
    const pipe = new TruncatePipe();
    expect(pipe.transform(undefined, 5)).toBe('');
  });

  it('should not truncate string shorter than max length', () => {
    const pipe = new TruncatePipe();
    expect(pipe.transform('Hello', 10)).toBe('Hello');
  });

  it('should truncate string longer than max length', () => {
    const pipe = new TruncatePipe();
    expect(pipe.transform('Hello, World!', 5)).toBe('Hello...');
  });

  it('should trim whitespace before truncating', () => {
    const pipe = new TruncatePipe();
    expect(pipe.transform('   Hello, World!   ', 5)).toBe('Hello...');
  });
});
