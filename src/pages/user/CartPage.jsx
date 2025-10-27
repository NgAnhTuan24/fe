import React from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "../../context/CartContext";
import "../../styles/user/CartPage.css";

export default function CartPage() {
  const navigate = useNavigate();

  const { cartItems, removeFromCart, clearCart } = useCart();

  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="cart-wrapper">
      <h2>Giỏ hàng {cartItems.length > 0 && `(${cartItems.length})`}</h2>

      {cartItems.length === 0 ? (
        <div className="cart-empty">
          <ShoppingBag size={75} />
          <h3>Giỏ hàng trống</h3>
          <p>Bạn chưa có sản phẩm nào trong giỏ hàng</p>
          <button onClick={() => navigate("/shop")} className="continue-btn">
            Tiếp tục mua sắm
          </button>
        </div>
      ) : (
        <div className="cart-container">
          {/* Left: list sản phẩm */}
          <div className="cart-left">
            <div className="cart-header">
              <h3>Sản phẩm đã chọn</h3>
              <button onClick={clearCart} className="clear-btn">
                Xóa tất cả
              </button>
            </div>

            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div className="cart-info">
                  <h4>{item.name}</h4>
                  <p>{item.breed}</p>
                  <p className="price">{item.price.toLocaleString()} VND</p>
                </div>

                <div className="cart-actions">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="remove-btn"
                  >
                    <Trash2 size={16} /> Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right: summary */}
          <div className="cart-summary">
            <h3>Tóm tắt đơn hàng</h3>
            <div className="summary-row">
              <span>Tạm tính:</span>
              <span>{subtotal.toLocaleString()} VND</span>
            </div>
            <div className="summary-row">
              <span>Phí giao hàng:</span>
              <span>Liên hệ</span>
            </div>
            <hr />
            <div className="summary-row total">
              <span>Tổng cộng:</span>
              <span>{subtotal.toLocaleString()} VND</span>
            </div>
            <button
              className="checkout-btn"
              onClick={() => navigate("/checkout")}
            >
              Tiến hành thanh toán →
            </button>
            <button onClick={() => navigate("/shop")} className="continue-btn2">
              Tiếp tục mua sắm
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
