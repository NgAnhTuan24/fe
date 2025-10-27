export const getWeekRange = (year, month, week) => {
  const firstDay = new Date(year, month - 1, 1);
  const dayOfWeek = firstDay.getDay() || 7; // CN = 7
  const start = new Date(firstDay);
  start.setDate(1 - (dayOfWeek - 1) + (week - 1) * 7);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return { startOfWeek: start, endOfWeek: end };
};

export const getWeeksInMonth = (year, month) => {
  const lastDay = new Date(year, month, 0).getDate();
  return Math.ceil(lastDay / 7);
};
