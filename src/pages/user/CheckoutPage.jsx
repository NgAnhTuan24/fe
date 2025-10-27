import React, { useContext, useState, useEffect } from "react";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Truck,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { createOrder } from "../../services/api/OrderApi";
import { createPayment } from "../../services/api/PaymentApi";
import "../../styles/user/CheckoutPage.css";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();

  const { user } = useContext(AuthContext);

  const [currentStep, setCurrentStep] = useState(1);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [orderData, setOrderData] = useState({
    shippingInfo: {
      fullName: user?.username || "",
      phone: user?.phoneNumber || "",
      email: user?.email || "",
      address: user?.address || "",
    },
    shippingMethod: "home_delivery",
    paymentMethod: "cod",
  });

  useEffect(() => {
    if (user) {
      setOrderData((prev) => ({
        ...prev,
        shippingInfo: {
          fullName: prev.shippingInfo.fullName || user.username || "",
          phone: prev.shippingInfo.phone || user.phoneNumber || "",
          email: prev.shippingInfo.email || user.email || "",
          address: prev.shippingInfo.address || user.address || "",
        },
      }));
    }
  }, [user]);

  const shippingMethodLabel = {
    home_delivery: "Giao hàng tận nhà",
    store_pickup: "Nhận tại cửa hàng",
    // long_distance: "Vận chuyển đường xa",
  };

  const paymentMethodLabel = {
    cod: "Thanh toán khi nhận hàng (COD)",
    // bank_transfer: "Chuyển khoản ngân hàng",
    // e_wallet: "Ví điện tử",
    online_payment: "Thanh toán trực tuyến",
  };

  const shippingFee =
    orderData.shippingMethod === "home_delivery"
      ? 200000
      : // : orderData.shippingMethod === "long_distance"
        // ? 500000
        0;

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    })
      .format(price)
      .replace("₫", "VND");

  // ✅ Xử lý đặt hàng
  const handleSubmitOrder = async () => {
    if (!user || !user.id) {
      alert("Bạn cần đăng nhập để đặt hàng!");
      navigate("/login");
      return;
    }

    if (cartItems.length === 0) {
      alert("Giỏ hàng của bạn đang trống!");
      return;
    }

    try {
      setIsSubmitting(true);
      const catIds = cartItems.map((item) => item.id);

      const orderRequest = {
        userId: user.id,
        catIds,
        shippingFee,
        shippingMethod: orderData.shippingMethod,
        paymentMethod: orderData.paymentMethod,
      };

      if (orderData.paymentMethod === "online_payment") {
        alert("Đã đặt hàng, hãy tiến hành thanh toán!");
        const res = await createPayment(orderRequest);
        const paymentUrl = res.data.paymentUrl;

        const newTab = window.open(paymentUrl, "_blank");

        if (newTab) {
          window.close();
        } else {
          window.location.href = paymentUrl;
        }

        clearCart();
      } else {
        await createOrder(orderRequest);
        alert("Đặt hàng thành công!");
        clearCart();
        navigate("/shop", { replace: true });
      }
    } catch (error) {
      console.error("Lỗi đặt hàng:", error);
      alert("Đặt hàng thất bại, vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Nếu giỏ hàng trống
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="checkout-empty">
        <div className="checkout-empty-box">
          <h2>Giỏ hàng trống</h2>
          <p>Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán</p>
          <button onClick={() => navigate("/shop")}>Tiếp tục mua sắm</button>
        </div>
      </div>
    );
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);

  const totalWithShipping = subtotal + shippingFee;

  return (
    <div className="checkout">
      {/* Header */}
      <div className="checkout-header">
        <button onClick={() => navigate("/cart")} className="back-btn">
          <ArrowLeft size={16} /> Quay lại giỏ hàng
        </button>
        <h1>Thanh toán</h1>
      </div>

      {/* Steps */}
      <div className="steps">
        {[
          { step: 1, title: "Thông tin giao hàng" },
          { step: 2, title: "Vận chuyển" },
          { step: 3, title: "Thanh toán" },
          { step: 4, title: "Xác nhận" },
        ].map((item, idx) => (
          <div key={item.step} className="step">
            <div
              className={`step-circle ${
                currentStep >= item.step ? "active" : ""
              }`}
            >
              {currentStep > item.step ? <CheckCircle size={14} /> : item.step}
            </div>
            <span
              className={`step-title ${
                currentStep >= item.step ? "active" : ""
              }`}
            >
              {item.title}
            </span>
            {idx < 3 && (
              <div
                className={`step-line ${
                  currentStep > item.step ? "active" : ""
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="checkout-body">
        {/* Main */}
        <div className="checkout-main">
          {/* Step 1 */}
          {currentStep === 1 && (
            <div>
              <h3 className="section-title">
                <MapPin size={20} className="icon" />
                Thông tin giao hàng
              </h3>
              <div className="form-grid">
                <input
                  placeholder="Họ và tên *"
                  value={orderData.shippingInfo.fullName}
                  readOnly
                />
                <input
                  placeholder="Số điện thoại *"
                  value={orderData.shippingInfo.phone}
                  readOnly
                />
                <input
                  placeholder="Email *"
                  className="full"
                  value={orderData.shippingInfo.email}
                  readOnly
                />
                <input
                  placeholder="Địa chỉ *"
                  className="full"
                  value={orderData.shippingInfo.address}
                  readOnly
                />
              </div>
            </div>
          )}

          {/* Step 2 */}
          {currentStep === 2 && (
            <div>
              <h3 className="section-title">
                <Truck size={20} className="icon" />
                Phương thức vận chuyển
              </h3>
              <div className="option-box">
                <label>
                  <input
                    type="radio"
                    checked={orderData.shippingMethod === "home_delivery"}
                    onChange={() =>
                      setOrderData((p) => ({
                        ...p,
                        shippingMethod: "home_delivery",
                      }))
                    }
                  />
                  Giao hàng tận nhà ({formatPrice(200000)})
                </label>

                <label>
                  <input
                    type="radio"
                    checked={orderData.shippingMethod === "store_pickup"}
                    onChange={() =>
                      setOrderData((p) => ({
                        ...p,
                        shippingMethod: "store_pickup",
                      }))
                    }
                  />
                  Nhận tại cửa hàng (Miễn phí)
                </label>

                {/* <label>
                  <input
                    type="radio"
                    checked={orderData.shippingMethod === "long_distance"}
                    onChange={() =>
                      setOrderData((p) => ({
                        ...p,
                        shippingMethod: "long_distance",
                      }))
                    }
                  />
                  Vận chuyển đường xa ({formatPrice(500000)})
                </label> */}
              </div>
            </div>
          )}

          {/* Step 3 */}
          {currentStep === 3 && (
            <div>
              <h3 className="section-title">
                <CreditCard size={20} className="icon" />
                Phương thức thanh toán
              </h3>
              <div className="option-box">
                <label>
                  <input
                    type="radio"
                    checked={orderData.paymentMethod === "cod"}
                    onChange={() =>
                      setOrderData((p) => ({ ...p, paymentMethod: "cod" }))
                    }
                  />
                  Thanh toán khi nhận hàng (COD)
                </label>

                {/* <label>
                  <input
                    type="radio"
                    checked={orderData.paymentMethod === "bank_transfer"}
                    onChange={() =>
                      setOrderData((p) => ({
                        ...p,
                        paymentMethod: "bank_transfer",
                      }))
                    }
                  />
                  Chuyển khoản ngân hàng
                </label> */}

                <label>
                  <input
                    type="radio"
                    checked={orderData.paymentMethod === "online_payment"}
                    onChange={() =>
                      setOrderData((p) => ({
                        ...p,
                        paymentMethod: "online_payment",
                      }))
                    }
                  />
                  Thanh toán trực tuyến
                </label>
              </div>
            </div>
          )}

          {/* Step 4 */}
          {currentStep === 4 && (
            <div>
              <h3 className="section-title">
                <CheckCircle size={20} className="icon" />
                Xác nhận đơn hàng
              </h3>
              <div className="summary-box">
                <p>
                  <strong>Họ tên:</strong> {orderData.shippingInfo.fullName}
                </p>
                <p>
                  <strong>SĐT:</strong> {orderData.shippingInfo.phone}
                </p>
                <p>
                  <strong>Email:</strong> {orderData.shippingInfo.email}
                </p>
                <p>
                  <strong>Địa chỉ:</strong> {orderData.shippingInfo.address}
                </p>
                <p>
                  <strong>Phương thức vận chuyển:</strong>{" "}
                  {shippingMethodLabel[orderData.shippingMethod]}
                </p>
                <p>
                  <strong>Phương thức thanh toán:</strong>{" "}
                  {paymentMethodLabel[orderData.paymentMethod]}
                </p>
              </div>
            </div>
          )}

          {/* Nav Buttons */}
          <div className="nav-buttons">
            {currentStep > 1 && (
              <button onClick={() => setCurrentStep(currentStep - 1)}>
                Quay lại
              </button>
            )}
            {currentStep < 4 ? (
              <button
                className="primary"
                disabled={isSubmitting}
                onClick={() => setCurrentStep(currentStep + 1)}
              >
                Tiếp tục
              </button>
            ) : (
              <button
                className="success"
                disabled={isSubmitting}
                onClick={handleSubmitOrder}
              >
                {isSubmitting ? "Đang xử lý..." : "Đặt hàng"}
              </button>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="checkout-summary">
          <h3>Tóm tắt đơn hàng</h3>
          {cartItems.map((item) => (
            <div key={item.id} className="summary-item-cat">
              <img src={item.image} alt={item.name} />
              <div>
                <p className="item-name">{item.name}</p>
                <p className="item-breed">{item.breed}</p>
                <p className="item-price">{formatPrice(item.price)}</p>
              </div>
            </div>
          ))}

          <div className="summary-total">
            <p>Tạm tính: {formatPrice(subtotal)}</p>
            <p>
              Phí vận chuyển:{" "}
              {shippingFee === 0 ? "Miễn phí" : formatPrice(shippingFee)}
            </p>
            <p className="final">Tổng cộng: {formatPrice(totalWithShipping)}</p>
          </div>

          <div className="support-box">
            <h4>Cần hỗ trợ?</h4>
            <p>
              <Phone size={14} /> 0328 894 812
            </p>
            <p>
              <Mail size={14} /> luckytme2004@gmail.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
