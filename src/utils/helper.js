export const translateGender = (gender) => {
  switch (gender) {
    case "Male":
      return "Đực";
    case "Female":
      return "Cái";
    default:
      return "Không rõ";
  }
};

export const translateStatus = (status) => {
  switch (status) {
    case "Available":
      return "Có sẵn";
    case "Sold":
      return "Đã bán";
    default:
      return "Không rõ";
  }
};

export const calcAge = (dob) => {
  if (!dob) return "";
  const birthDate = new Date(dob);
  const today = new Date();

  // Tính số ngày chênh lệch
  const diffTime = today - birthDate;
  const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (days < 30) {
    return days + " ngày";
  }

  // Tính số tháng chênh lệch
  let months =
    (today.getFullYear() - birthDate.getFullYear()) * 12 +
    (today.getMonth() - birthDate.getMonth());

  if (months < 12) {
    return months + " tháng";
  }

  // Nếu >= 12 tháng thì tính theo năm
  const years = Math.floor(months / 12);
  return years + " năm";
};

export const formatPrice = (price) => {
  if (price == null || isNaN(price)) return "0 VND";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  })
    .format(price)
    .replace("₫", "VND");
};
