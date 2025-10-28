export const getWeekRange = (year, month, week) => {
  const firstDayOfMonth = new Date(year, month - 1, 1);
  const dayOfWeek = firstDayOfMonth.getDay(); // 0 = CN, 1 = T2, ..., 6 = T7
  const offset = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Đưa về ISO: T2 = 0
  const start = new Date(year, month - 1, 1 - offset + (week - 1) * 7);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return { startOfWeek: start, endOfWeek: end };
};

export const getWeeksInMonth = (year, month) => {
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const used = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // ISO offset
  return Math.ceil((lastDay.getDate() + used) / 7);
};

export const getCurrentWeekOfMonth = (year, month) => {
  const date = new Date();
  if (year !== date.getFullYear() || month !== date.getMonth() + 1) return 1;

  const firstDay = new Date(year, month - 1, 1);
  const dayOfWeek = firstDay.getDay(); // 0 = CN, 1 = T2, ...
  const offset = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // ISO-style: T2 là đầu tuần

  const diff = date.getDate() + offset;
  return Math.ceil(diff / 7);
};
