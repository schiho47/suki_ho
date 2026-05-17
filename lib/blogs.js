const DEFAULT_ORDER = ['NeetCode', 'MuayLang', 'Reading', 'Dissertation'];

const orderTags = (allTags = [], order = DEFAULT_ORDER) => {
  if (!Array.isArray(allTags) || allTags.length === 0) return ['All'];
  const present = new Set(allTags);
  const ordered = order.filter((tag) => present.has(tag));
  const rest = allTags.filter((tag) => !order.includes(tag));
  return ['All', ...ordered, ...rest];
};

const getTotalPages = (total = 0, pageSize = 1) => {
  const safeSize = pageSize > 0 ? pageSize : 1;
  const pages = Math.ceil(total / safeSize);
  return Math.max(1, pages);
};

module.exports = {
  orderTags,
  getTotalPages,
};
