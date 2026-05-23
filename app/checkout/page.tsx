"use client";
export const dynamic = 'force-dynamic';

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../components/CartContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { items = [], clearCart } = useCart() ?? {};

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 99;
  const total = subtotal + shipping;

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pin: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    setCartCount(items.reduce((s, i) => s + i.quantity, 0));
  }, [items]);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "preconnect";
    link.href = "https://fonts.googleapis.com";
    document.head.appendChild(link);
    const link2 = document.createElement("link");
    link2.rel = "stylesheet";
    link2.href = "https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700&family=Source+Sans+3:wght@400;500;600&display=swap";
    document.head.appendChild(link2);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Full name is required";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Valid email is required";
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone)) newErrors.phone = "Enter a valid 10-digit phone number";
    if (!form.address.trim()) newErrors.address = "Address is required";
    if (!form.city.trim()) newErrors.city = "City is required";
    if (!form.state.trim()) newErrors.state = "State is required";
    if (!form.pin.trim() || !/^\d{6}$/.test(form.pin)) newErrors.pin = "Enter a valid 6-digit PIN code";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total }),
      });
      const order = await res.json();
      if (typeof window !== "undefined" && (window as any).Razorpay) {
        const rzp = new (window as any).Razorpay({
          key: "rzp_test_",
          amount: order.amount || total * 100,
          currency: "INR",
          name: "Zeppoli Bakers",
          description: "Order Payment",
          handler: () => {
            clearCart?.();
            setOrderSuccess(true);
            setTimeout(() => router.push("/"), 2500);
          },
          prefill: { name: form.name, email: form.email, contact: form.phone },
          theme: { color: "#8D1D1C" },
        });
        rzp.open();
      } else {
        clearCart?.();
        setOrderSuccess(true);
        setTimeout(() => router.push("/"), 2500);
      }
    } catch {
      clearCart?.();
      setOrderSuccess(true);
      setTimeout(() => router.push("/"), 2500);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#F5EDE0", fontFamily: "'Source Sans 3', sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "24px" }}>
        <div style={{ width: "80px", height: "80px", borderRadius: "50%", backgroundColor: "#8D1D1C", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h2 style={{ fontFamily: "'Nunito', sans-serif", fontSize: "2rem", fontWeight: 700, color: "#1A1A1A", letterSpacing: "-0.02em" }}>Order Placed!</h2>
        <p style={{ color: "#9B8B7D", fontSize: "1.1rem" }}>Thank you for your order. Redirecting you home…</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#F5EDE0", fontFamily: "'Source Sans 3', sans-serif" }}>
        <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, transition: "background-color 250ms ease, box-shadow 250ms ease", backgroundColor: scrolled ? "#F5EDE0" : "transparent", boxShadow: scrolled ? "0 1px 0 #EDE7E1" : "none", padding: "0 48px", height: "72px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <img src="/logo.png" alt="Zeppoli Bakers logo" style={{ height: "40px", objectFit: "contain", cursor: "pointer" }} onClick={() => router.push("/")} />
          <button onClick={() => router.push("/checkout")} style={{ background: "none", border: "none", cursor: "pointer", position: "relative" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          </button>
        </nav>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", gap: "24px", padding: "0 24px" }}>
          <div style={{ width: "88px", height: "88px", borderRadius: "50%", backgroundColor: "rgba(141,29,28,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#8D1D1C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          </div>
          <h2 style={{ fontFamily: "'Nunito', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 700, color: "#1A1A1A", letterSpacing: "-0.02em", textAlign: "center" }}>Your cart is empty</h2>
          <p style={{ color: "#9B8B7D", fontSize: "1.1rem", lineHeight: 1.7, textAlign: "center", maxWidth: "400px" }}>Looks like you haven't added any cakes yet. Let's fix that!</p>
          <button
            onClick={() => router.push("/shop")}
            onMouseEnter={e => { (e.currentTarget.style.transform = "scale(1.02)"); }}
            onMouseLeave={e => { (e.currentTarget.style.transform = "scale(1)"); }}
            onMouseDown={e => { (e.currentTarget.style.transform = "scale(0.98)"); }}
            onMouseUp={e => { (e.currentTarget.style.transform = "scale(1.02)"); }}
            style={{ padding: "16px 40px", backgroundColor: "#8D1D1C", color: "#fff", border: "none", borderRadius: "12px", cursor: "pointer", fontFamily: "'Nunito', sans-serif", fontSize: "1.05rem", fontWeight: 700, transition: "transform 200ms cubic-bezier(0.4,0,0.2,1), box-shadow 200ms", boxShadow: "0 8px 24px rgba(141,29,28,0.30)" }}
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  const inputStyle = (field: string) => ({
    width: "100%",
    height: "48px",
    padding: "0 16px",
    border: errors[field] ? "2px solid #C0392B" : "1.5px solid #DDD3C6",
    borderRadius: "10px",
    backgroundColor: "#fff",
    fontFamily: "'Source Sans 3', sans-serif",
    fontSize: "15px",
    color: "#1A1A1A",
    outline: "none",
    transition: "border-color 180ms",
    boxSizing: "border-box" as const,
  });

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F5EDE0", fontFamily: "'Source Sans 3', sans-serif", overflowX: "hidden" }}>

      {/* NAVBAR */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, transition: "background-color 250ms ease, box-shadow 250ms ease", backgroundColor: scrolled ? "#F5EDE0" : "rgba(245,237,224,0.92)", backdropFilter: "blur(8px)", boxShadow: scrolled ? "0 1px 0 #EDE7E1" : "none" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 32px", height: "72px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ padding: "4px 8px", borderRadius: "8px" }}>
            <img src="/logo.png" alt="Zeppoli Bakers logo" style={{ height: "40px", objectFit: "contain", cursor: "pointer" }} onClick={() => router.push("/")} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: "1.3rem", color: "#1A1A1A", letterSpacing: "-0.01em" }}>Checkout</span>
          </div>
          <button
            onClick={() => router.push("/checkout")}
            style={{ position: "relative", background: "none", border: "none", cursor: "pointer", padding: "8px" }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            {cartCount > 0 && (
              <span style={{ position: "absolute", top: "2px", right: "2px", width: "18px", height: "18px", borderRadius: "50%", backgroundColor: "#8D1D1C", color: "#fff", fontSize: "11px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Nunito', sans-serif" }}>{cartCount}</span>
            )}
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "clamp(100px, 12vw, 120px) clamp(16px, 4vw, 48px) 96px" }}>

        {/* PAGE HEADER */}
        <div style={{ marginBottom: "48px" }}>
          <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "11px", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "#9B8B7D", display: "block", marginBottom: "12px" }}>Almost There</span>
          <h1 style={{ fontFamily: "'Nunito', sans-serif", fontSize: "clamp(2.2rem, 5vw, 3.5rem)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.05, color: "#1A1A1A", margin: 0 }}>Complete Your Order</h1>
        </div>

        {/* CHECKOUT GRID */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 500px), 1fr))", gap: "40px", alignItems: "start" }}>

          {/* LEFT — DELIVERY FORM */}
          <div style={{ backgroundColor: "#fff", borderRadius: "20px", padding: "clamp(24px, 4vw, 40px)", boxShadow: "0 8px 40px rgba(141,29,28,0.08)" }}>
            <h2 style={{ fontFamily: "'Nunito', sans-serif", fontSize: "1.4rem", fontWeight: 700, color: "#1A1A1A", marginBottom: "32px", letterSpacing: "-0.01em" }}>Delivery Details</h2>

            {/* Full Name */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontFamily: "'Source Sans 3', sans-serif", fontSize: "13px", fontWeight: 600, color: "#583127", marginBottom: "8px", letterSpacing: "0.04em", textTransform: "uppercase" }}>Full Name *</label>
              <input
                type="text"
                placeholder="Aarav Mehta"
                value={form.name}
                onChange={e => { setForm(p => ({ ...p, name: e.target.value })); setErrors(p => ({ ...p, name: "" })); }}
                style={inputStyle("name")}
                onFocus={e => { e.target.style.borderColor = "#8D1D1C"; }}
                onBlur={e => { e.target.style.borderColor = errors.name ? "#C0392B" : "#DDD3C6"; }}
              />
              {errors.name && <p style={{ color: "#C0392B", fontSize: "12px", marginTop: "6px", fontFamily: "'Source Sans 3', sans-serif" }}>{errors.name}</p>}
            </div>

            {/* Email + Phone row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
              <div>
                <label style={{ display: "block", fontFamily: "'Source Sans 3', sans-serif", fontSize: "13px", fontWeight: 600, color: "#583127", marginBottom: "8px", letterSpacing: "0.04em", textTransform: "uppercase" }}>Email *</label>
                <input
                  type="email"
                  placeholder="hello@example.com"
                  value={form.email}
                  onChange={e => { setForm(p => ({ ...p, email: e.target.value })); setErrors(p => ({ ...p, email: "" })); }}
                  style={inputStyle("email")}
                  onFocus={e => { e.target.style.borderColor = "#8D1D1C"; }}
                  onBlur={e => { e.target.style.borderColor = errors.email ? "#C0392B" : "#DDD3C6"; }}
                />
                {errors.email && <p style={{ color: "#C0392B", fontSize: "12px", marginTop: "6px", fontFamily: "'Source Sans 3', sans-serif" }}>{errors.email}</p>}
              </div>
              <div>
                <label style={{ display: "block", fontFamily: "'Source Sans 3', sans-serif", fontSize: "13px", fontWeight: 600, color: "#583127", marginBottom: "8px", letterSpacing: "0.04em", textTransform: "uppercase" }}>Phone *</label>
                <input
                  type="tel"
                  placeholder="9876543210"
                  value={form.phone}
                  maxLength={10}
                  onChange={e => { setForm(p => ({ ...p, phone: e.target.value.replace(/\D/g, "") })); setErrors(p => ({ ...p, phone: "" })); }}
                  style={inputStyle("phone")}
                  onFocus={e => { e.target.style.borderColor = "#8D1D1C"; }}
                  onBlur={e => { e.target.style.borderColor = errors.phone ? "#C0392B" : "#DDD3C6"; }}
                />
                {errors.phone && <p style={{ color: "#C0392B", fontSize: "12px", marginTop: "6px", fontFamily: "'Source Sans 3', sans-serif" }}>{errors.phone}</p>}
              </div>
            </div>

            {/* Address */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontFamily: "'Source Sans 3', sans-serif", fontSize: "13px", fontWeight: 600, color: "#583127", marginBottom: "8px", letterSpacing: "0.04em", textTransform: "uppercase" }}>Street Address *</label>
              <input
                type="text"
                placeholder="12, Rose Garden Apartments, MG Road"
                value={form.address}
                onChange={e => { setForm(p => ({ ...p, address: e.target.value })); setErrors(p => ({ ...p, address: "" })); }}
                style={{ ...inputStyle("address"), height: "56px" }}
                onFocus={e => { e.target.style.borderColor = "#8D1D1C"; }}
                onBlur={e => { e.target.style.borderColor = errors.address ? "#C0392B" : "#DDD3C6"; }}
              />
              {errors.address && <p style={{ color: "#C0392B", fontSize: "12px", marginTop: "6px", fontFamily: "'Source Sans 3', sans-serif" }}>{errors.address}</p>}
            </div>

            {/* City + State */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
              <div>
                <label style={{ display: "block", fontFamily: "'Source Sans 3', sans-serif", fontSize: "13px", fontWeight: 600, color: "#583127", marginBottom: "8px", letterSpacing: "0.04em", textTransform: "uppercase" }}>City *</label>
                <input
                  type="text"
                  placeholder="Mumbai"
                  value={form.city}
                  onChange={e => { setForm(p => ({ ...p, city: e.target.value })); setErrors(p => ({ ...p, city: "" })); }}
                  style={inputStyle("city")}
                  onFocus={e => { e.target.style.borderColor = "#8D1D1C"; }}
                  onBlur={e => { e.target.style.borderColor = errors.city ? "#C0392B" : "#DDD3C6"; }}
                />
                {errors.city && <p style={{ color: "#C0392B", fontSize: "12px", marginTop: "6px", fontFamily: "'Source Sans 3', sans-serif" }}>{errors.city}</p>}
              </div>
              <div>
                <label style={{ display: "block", fontFamily: "'Source Sans 3', sans-serif", fontSize: "13px", fontWeight: 600, color: "#583127", marginBottom: "8px", letterSpacing: "0.04em", textTransform: "uppercase" }}>State *</label>
                <select
                  value={form.state}
                  onChange={e => { setForm(p => ({ ...p, state: e.target.value })); setErrors(p => ({ ...p, state: "" })); }}
                  style={{ ...inputStyle("state"), cursor: "pointer", appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%239B8B7D' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center" }}
                  onFocus={e => { e.target.style.borderColor = "#8D1D1C"; }}
                  onBlur={e => { e.target.style.borderColor = errors.state ? "#C0392B" : "#DDD3C6"; }}
                >
                  <option value="">Select State</option>
                  {["Andhra Pradesh","Assam","Bihar","Delhi","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Odisha","Punjab","Rajasthan","Tamil Nadu","Telangana","Uttar Pradesh","Uttarakhand","West Bengal"].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {errors.state && <p style={{ color: "#C0392B", fontSize: "12px", marginTop: "6px", fontFamily: "'Source Sans 3', sans-serif" }}>{errors.state}</p>}
              </div>
            </div>

            {/* PIN */}
            <div style={{ marginBottom: "32px" }}>
              <label style={{ display: "block", fontFamily: "'Source Sans 3', sans-serif", fontSize: "13px", fontWeight: 600, color: "#583127", marginBottom: "8px", letterSpacing: "0.04em", textTransform: "uppercase" }}>PIN Code *</label>
              <input
                type="text"
                placeholder="400001"
                value={form.pin}
                maxLength={6}
                onChange={e => { setForm(p => ({ ...p, pin: e.target.value.replace(/\D/g, "") })); setErrors(p => ({ ...p, pin: "" })); }}
                style={{ ...inputStyle("pin"), maxWidth: "200px" }}
                onFocus={e => { e.target.style.borderColor = "#8D1D1C"; }}
                onBlur={e => { e.target.style.borderColor = errors.pin ? "#C0392B" : "#DDD3C6"; }}
              />
              {errors.pin && <p style={{ color: "#C0392B", fontSize: "12px", marginTop: "6px", fontFamily: "'Source Sans 3', sans-serif" }}>{errors.pin}</p>}
            </div>

            {/* Trust badges */}
            <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", padding: "20px", backgroundColor: "#F5EDE0", borderRadius: "12px", marginBottom: "24px" }}>
              {[
                { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8D1D1C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, text: "Secure Payment" },
                { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8D1D1C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>, text: "Fresh Delivery" },
                { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8D1D1C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>, text: "Made with Love" },
              ].map((b, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  {b.icon}
                  <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "13px", color: "#583127", fontWeight: 500 }}>{b.text}</span>
                </div>
              ))}
            </div>

            {/* Place Order Button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              onMouseEnter={e => { if (!isSubmitting) e.currentTarget.style.transform = "scale(1.02)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
              onMouseDown={e => { e.currentTarget.style.transform = "scale(0.98)"; }}
              onMouseUp={e => { e.currentTarget.style.transform = "scale(1.02)"; }}
              style={{ width: "100%", height: "60px", backgroundColor: isSubmitting ? "#B8786A" : "#8D1D1C", color: "#fff", border: "none", borderRadius: "12px", cursor: isSubmitting ? "not-allowed" : "pointer", fontFamily: "'Nunito', sans-serif", fontSize: "1.1rem", fontWeight: 700, letterSpacing: "0.01em", transition: "transform 200ms cubic-bezier(0.4,0,0.2,1), background-color 200ms", boxShadow: "0 10px 30px rgba(141,29,28,0.30)", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}
            >
              {isSubmitting ? (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M21 12a9 9 0 1 1-6.219-8.56" style={{ animation: "spin 1s linear infinite" }}/></svg>
                  Processing…
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                  Place Order · ₹{total.toLocaleString("en-IN")}
                </>
              )}
            </button>
            <p style={{ textAlign: "center", marginTop: "12px", fontFamily: "'Source Sans 3', sans-serif", fontSize: "13px", color: "#9B8B7D" }}>100% Secure · SSL Encrypted · Powered by Razorpay</p>
          </div>

          {/* RIGHT — ORDER SUMMARY */}
          <div style={{ position: "sticky", top: "96px" }}>
            <div style={{ backgroundColor: "#fff", borderRadius: "20px", padding: "clamp(24px, 4vw, 36px)", boxShadow: "0 8px 40px rgba(141,29,28,0.08)", marginBottom: "24px" }}>
              <h2 style={{ fontFamily: "'Nunito', sans-serif", fontSize: "1.4rem", fontWeight: 700, color: "#1A1A1A", marginBottom: "28px", letterSpacing: "-0.01em" }}>
                Order Summary
                <span style={{ marginLeft: "8px", fontFamily: "'Source Sans 3', sans-serif", fontSize: "13px", fontWeight: 400, color: "#9B8B7D" }}>({items.reduce((s, i) => s + i.quantity, 0)} item{items.reduce((s, i) => s + i.quantity, 0) !== 1 ? "s" : ""})</span>
              </h2>

              {/* Items */}
              <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "28px" }}>
                {items.map((item) => (
                  <div key={item.id} style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                    <div style={{ overflow: "hidden", borderRadius: "10px", flexShrink: 0, width: "72px", height: "72px", backgroundColor: "#F5EDE0" }}>
                      <img
                        src={item.image || "/product-1.jpg"}
                        alt={item.name}
                        style={{ width: "72px", height: "72px", objectFit: "cover", display: "block" }}
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 600, fontSize: "15px", color: "#1A1A1A", marginBottom: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</p>
                      <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "13px", color: "#9B8B7D" }}>Qty: {item.quantity}</p>
                    </div>
                    <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, fontSize: "15px", color: "#8D1D1C", flexShrink: 0 }}>
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </p>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div style={{ height: "1px", backgroundColor: "#EDE7E1", marginBottom: "20px" }} />

              {/* Shipping Banner */}
              {shipping === 0 ? (
                <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", backgroundColor: "rgba(141,29,28,0.06)", borderRadius: "10px", marginBottom: "20px" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8D1D1C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "13px", color: "#8D1D1C", fontWeight: 600 }}>You've unlocked FREE delivery!</span>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", backgroundColor: "#FEF9F5", borderRadius: "10px", border: "1px dashed #DDD3C6", marginBottom: "20px" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9B8B7D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "13px", color: "#9B8B7D" }}>Add ₹{(500 - subtotal).toLocaleString("en-IN")} more for FREE delivery</span>
                </div>
              )}

              {/* Price Breakdown */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "15px", color: "#9B8B7D" }}>Subtotal</span>
                  <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "15px", color: "#1A1A1A", fontWeight: 500 }}>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "15px", color: "#9B8B7D" }}>Delivery</span>
                  {shipping === 0 ? (
                    <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "15px", color: "#8D1D1C", fontWeight: 600 }}>FREE</span>
                  ) : (
                    <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "15px", color: "#1A1A1A", fontWeight: 500 }}>₹{shipping.toLocaleString("en-IN")}</span>
                  )}
                </div>

                <div style={{ height: "1px", backgroundColor: "#EDE7E1", margin: "4px 0" }} />

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: "1.15rem", color: "#1A1A1A", fontWeight: 700 }}>Total</span>
                  <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: "1.4rem", color: "#8D1D1C", fontWeight: 700 }}>₹{total.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>

            {/* Freshly Baked notice */}
            <div style={{ backgroundColor: "#583127", borderRadius: "16px", padding: "24px", display: "flex", gap: "16px", alignItems: "flex-start" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "rgba(245,237,224,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5EDE0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>
              </div>
              <div>
                <p style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: "15px", color: "#F5EDE0", marginBottom: "6px" }}>Freshly Baked Daily</p>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "13px", color: "rgba(245,237,224,0.70)", lineHeight: 1.6 }}>Your cake is baked fresh on the day of dispatch. We use premium Belgian chocolate and locally sourced ingredients.</p>
              </div>
            </div>

            {/* Payment icons */}
            <div style={{ marginTop: "20px", display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "12px", color: "#9B8B7D", marginRight: "4px" }}>Accepted:</span>
              {["VISA", "MC", "UPI", "NET"].map(p => (
                <div key={p} style={{ padding: "6px 10px", backgroundColor: "#fff", borderRadius: "6px", border: "1px solid #EDE7E1" }}>
                  <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "11px", fontWeight: 700, color: "#583127", letterSpacing: "0.05em" }}>{p}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ backgroundColor: "#1A1A1A", color: "#fff", padding: "64px clamp(16px,4vw,48px) 32px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "48px", marginBottom: "48px" }}>
            <div>
              <div style={{ marginBottom: "16px" }}>
                <img src="/logo.png" alt="Zeppoli Bakers logo" style={{ height: "32px", objectFit: "contain", opacity: 0.85 }} />
              </div>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "14px", color: "#CCCCCC", lineHeight: 1.7 }}>Layered moments, pure indulgence. Handcrafted cakes for every celebration.</p>
            </div>
            <div>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#AAAAAA", marginBottom: "16px" }}>Shop</p>
              {["Our Cakes", "Chocolate Cakes", "Seasonal Specials", "Gift Cards"].map(l => (
                <p key={l} onClick={() => router.push("/shop")} style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "14px", color: "#CCCCCC", lineHeight: 2.2, cursor: "pointer" }}>{l}</p>
              ))}
            </div>
            <div>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#AAAAAA", marginBottom: "16px" }}>Learn</p>
              {["Our Story", "The Craft", "FAQs", "Contact Us"].map(l => (
                <p key={l} onClick={() => router.push("/")} style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "14px", color: "#CCCCCC", lineHeight: 2.2, cursor: "pointer" }}>{l}</p>
              ))}
            </div>
            <div>
              <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: "1.05rem", fontWeight: 700, color: "#fff", marginBottom: "16px" }}>Stay in the Loop</p>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "14px", color: "#CCCCCC", marginBottom: "16px", lineHeight: 1.6 }}>New flavours, seasonal drops, and sweet offers.</p>
              <div style={{ display: "flex", gap: "8px" }}>
                <input type="email" placeholder="your@email.com" style={{ flex: 1, height: "44px", padding: "0 14px", border: "1px solid #5C5C5C", borderRadius: "8px", backgroundColor: "transparent", color: "#fff", fontFamily: "'Source Sans 3', sans-serif", fontSize: "14px", outline: "none" }} />
                <button style={{ height: "44px", padding: "0 18px", backgroundColor: "#8D1D1C", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontFamily: "'Source Sans 3', sans-serif", fontSize: "14px", fontWeight: 600, whiteSpace: "nowrap" }}>Subscribe</button>
              </div>
            </div>
          </div>
          <div style={{ borderTop: "1px solid #5C5C5C", paddingTop: "24px", display: "flex", flexWrap: "wrap", gap: "16px", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "13px", color: "#AAAAAA" }}>© 2026 Zeppoli Bakers · Privacy Policy · Terms of Service</p>
            <div style={{ display: "flex", gap: "8px" }}>
              {["VISA","MC","UPI","AMEX"].map(p => (
                <div key={p} style={{ padding: "4px 8px", border: "1px solid #5C5C5C", borderRadius: "4px" }}>
                  <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "11px", color: "#AAAAAA", fontWeight: 700 }}>{p}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}