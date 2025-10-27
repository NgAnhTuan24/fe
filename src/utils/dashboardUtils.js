export const isSameDay = (dateStr, today = new Date()) => {
  const d = new Date(dateStr);
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
};

export const isSameMonth = (dateStr, today = new Date()) => {
  const d = new Date(dateStr);
  return (
    d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear()
  );
};

export const isSameYear = (dateStr, today = new Date()) => {
  const d = new Date(dateStr);
  return d.getFullYear() === today.getFullYear();
};

export const translateStatus = (status) => {
  switch (status?.toLowerCase()) {
    case "pending":
      return "Chờ xử lý";
    case "confirmed":
      return "Đã xác nhận";
    case "shipping":
      return "Đang giao hàng";
    case "completed":
      return "Hoàn thành";
    case "cancelled":
      return "Đã hủy";
    default:
      return "Khác";
  }
};
