export function validateRegister({
  username,
  email,
  password,
  confirmPassword,
  phone,
  address,
}) {
  const errors = {};

  // Tên người dùng
  if (!username.trim()) {
    errors.username = "Tên người dùng không được để trống";
  }

  // Email
  if (!email.trim()) {
    errors.email = "Email không được để trống";
  } else if (!/^[\w.%+-]+@gmail\.com$/i.test(email)) {
    errors.email = "Email phải có định dạng hợp lệ (ví dụ: abc@gmail.com)";
  }

  // Mật khẩu
  if (!password) {
    errors.password = "Mật khẩu không được để trống";
  } else if (password.length < 6) {
    errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
  }

  // Xác nhận mật khẩu
  if (!confirmPassword) {
    errors.confirmPassword = "Vui lòng nhập lại mật khẩu";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Mật khẩu xác nhận không khớp";
  }

  // Số điện thoại
  if (!phone.trim()) {
    errors.phone = "Số điện thoại không được để trống";
  } else if (!/^(0[0-9]{9})$/.test(phone)) {
    errors.phone = "Số điện thoại phải bắt đầu bằng 0 và có 10 chữ số";
  }

  // Địa chỉ
  if (!address.trim()) {
    errors.address = "Địa chỉ không được để trống";
  }

  return errors;
}

export const validateLogin = ({ email, password }) => {
  const errors = {};

  if (!email.trim()) errors.email = "Email không được để trống";
  else if (!/^[\w.%+-]+@gmail\.com$/i.test(email))
    errors.email = "Email phải có định dạng hợp lệ (abc@gmail.com)";

  if (!password.trim()) errors.password = "Mật khẩu không được để trống";
  else if (password.length < 6)
    errors.password = "Mật khẩu phải có ít nhất 6 ký tự";

  return errors;
};
