const { getTotalPages, orderTags } = require('../lib/blogs');

describe('orderTags', () => {
  it('orders known tags and keeps the rest', () => {
    const input = ['Reading', 'Other', 'NeetCode'];
    const result = orderTags(input);
    expect(result).toEqual(['All', 'NeetCode', 'Reading', 'Other']);
  });

  it('returns only All when empty', () => {
    expect(orderTags([])).toEqual(['All']);
  });
});

describe('getTotalPages', () => {
  it('returns at least 1', () => {
    expect(getTotalPages(0, 5)).toBe(1);
  });

  it('calculates total pages', () => {
    expect(getTotalPages(12, 5)).toBe(3);
  });
});
