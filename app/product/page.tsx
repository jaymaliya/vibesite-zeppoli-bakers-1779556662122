"use client";
export const dynamic = 'force-dynamic';

import { useRouter } from "next/navigation";
import { Suspense, useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "../../components/CartContext";

const ALL_PRODUCTS = [
  { id: 1, img: "/product-1.jpg", name: "Classic Chocolate Ganache Cake", description: "A decadent whole chocolate cake, generously frosted with rich dark chocolate ganache and adorned with elegant piped swirls and abundant chocolate shavings. Each layer is moist, indulgent, and crafted to perfection.", price: 1299 },
  { id: 2, img: "/product-2.jpg", name: "Blueberry Cheesecake", description: "A meticulously crafted blueberry cheesecake, perfectly round, with a velvety cream cheese filling and a buttery biscuit base, topped with fresh blueberry compote.", price: 299 },
  { id: 3, img: "/product-3.jpg", name: "Red Velvet Layer Cake", description: "A stunning multi-layered red velvet cake with silken cream cheese frosting, featuring a distinctive crimson crumb and a wedge-shaped slice reveal.", price: 399 },
  { id: 4, img: "/product-4.jpg", name: "Caramel Celebration Cake", description: "A premium single-tier celebration cake with luscious caramel toffee drizzle, decorated for any special occasion with refined elegance.", price: 499 },
];

const SIZES = [
  { label: "500g", multiplier: 0.7 },
  { label: "1 KG", multiplier: 1 },
  { label: "1.5 KG", multiplier: 1.4 },
  { label: "2 KG", multiplier: 1.8 },
];

const REVIEWS = [
  { name: "Priya Sharma", date: "12 Jan 2026", rating: 5, text: "Absolutely divine! The chocolate shavings melt in your mouth and the ganache is the richest I have ever tasted. Ordered for my daughter's birthday and everyone was asking for the bakery name." },
  { name: "Rohit Mehra", date: "5 Feb 2026", rating: 5, text: "Impeccable quality. The cake arrived perfectly packaged and tasted even better than it looked. The ridged sides are a beautiful detail — this is clearly made by skilled hands." },
  { name: "Ananya Iyer", date: "28 Jan 2026", rating: 5, text: "Zeppoli Bakers never disappoints. The layering inside was moist and light, and the ganache on top was incredibly smooth. A celebration-worthy cake every single time." },
  { name: "Vikram Bose", date: "3 Mar 2026", rating: 4, text: "Wonderful flavour and beautiful presentation. The chocolate curls on top are the showstopper. Would love to see a sugar-free option added to the menu!" },
];

const ACCORDION_ITEMS = [
  { title: "Description", content: "Each cake is baked fresh daily in our artisanal kitchen using Belgian couverture chocolate, free-range eggs, and unrefined cane sugar. The ganache is prepared in small batches, poured while warm, and finished with hand-curled chocolate shavings sourced from Valrhona. Serves 6–10 people." },
  { title: "Ingredients", content: "Belgian dark chocolate (70% cocoa), fresh cream, unrefined cane sugar, free-range eggs, whole wheat flour, unsalted butter, vanilla extract, cocoa powder, baking powder, sea salt." },
  { title: "Allergens", content: "Contains: Gluten, Dairy, Eggs. May contain traces of nuts and soy. Not suitable for those with severe nut allergies. Please inform us at the time of ordering if you have specific dietary requirements." },
  { title: "Storage Instructions", content: "Best consumed within 3 days of delivery. Store in a cool, dry place or refrigerate at 4°C. Remove from refrigerator 30 minutes before serving for best flavour and texture. Do not freeze." },
];

function StarRating({ count }: { count: number }) {
  return (
    <div style={{ display: "flex", gap: "3px" }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={i < count ? "#B56A3C" : "#E5D5C8"} xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function Navbar({ cartCount }: { cartCount: number }) {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks = [
    { label: "Our Cakes", action: () => router.push("/shop") },
    { label: "Seasonal Specials", action: () => router.push("/shop") },
    { label: "Our Story", action: () => router.push("/") },
    { label: "Gifting", action: () => router.push("/shop") },
  ];

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        backgroundColor: scrolled ? "#F5EDE0" : "transparent",
        borderBottom: scrolled ? "1px solid #EDE7E1" : "none",
        transition: "background-color 250ms ease, border-bottom 250ms ease",
        padding: "0 48px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: "72px",
      }}>
        <button
          onClick={() => setMenuOpen(true)}
          style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: "8px" }}
          className="mobile-hamburger"
          aria-label="Open menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={scrolled ? "#1A1A1A" : "#1A1A1A"} strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <img
          src="/logo.png" alt="Zeppoli Bakers logo"
          style={{ height: "40px", objectFit: "contain", cursor: "pointer" }}
          onClick={() => router.push("/")}
        />

        <div style={{ display: "flex", gap: "32px" }} className="desktop-nav">
          {navLinks.map(link => (
            <button key={link.label} onClick={link.action} style={{
              background: "none", border: "none", cursor: "pointer",
              fontFamily: "'Nunito', sans-serif", fontWeight: 600, fontSize: "15px",
              letterSpacing: "0.02em", color: scrolled ? "#1A1A1A" : "#1A1A1A",
              transition: "color 200ms ease",
            }}
              onMouseEnter={e => (e.currentTarget.style.color = "#8D1D1C")}
              onMouseLeave={e => (e.currentTarget.style.color = scrolled ? "#1A1A1A" : "#1A1A1A")}
            >{link.label}</button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button onClick={() => router.push("/checkout")} style={{ position: "relative", background: "none", border: "none", cursor: "pointer", padding: "4px" }} aria-label="Cart">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {cartCount > 0 && (
              <span style={{
                position: "absolute", top: "-6px", right: "-6px",
                background: "#8D1D1C", color: "#fff", borderRadius: "999px",
                width: "18px", height: "18px", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "11px", fontWeight: 600, fontFamily: "'Nunito', sans-serif",
              }}>{cartCount}</span>
            )}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 200,
          backgroundColor: "#F5EDE0",
          display: "flex", flexDirection: "column",
          padding: "32px",
          animation: "slideIn 350ms ease-out",
        }}>
          <button onClick={() => setMenuOpen(false)} style={{ alignSelf: "flex-end", background: "none", border: "none", cursor: "pointer", marginBottom: "48px" }} aria-label="Close">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          {navLinks.map(link => (
            <button key={link.label} onClick={() => { link.action(); setMenuOpen(false); }} style={{
              background: "none", border: "none", cursor: "pointer", textAlign: "left",
              fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: "26px",
              color: "#1A1A1A", padding: "12px 0", borderBottom: "1px solid #EDE7E1",
              height: "56px", display: "flex", alignItems: "center",
            }}>{link.label}</button>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-hamburger { display: flex !important; }
        }
        @keyframes slideIn { from { transform: translateX(-100%); } to { transform: translateX(0); } }
        @keyframes toastIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .reveal { opacity: 0; transform: translateY(24px); transition: opacity 600ms ease-out, transform 600ms ease-out; }
        .reveal.visible { opacity: 1; transform: translateY(0); }
      `}</style>
    </>
  );
}

function ProductContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addItem, items } = useCart() ?? { addItem: () => {}, items: [] };

  const paramImg   = searchParams.get("img")   ? decodeURIComponent(searchParams.get("img")!)   : null;
  const paramName  = searchParams.get("name")  ? decodeURIComponent(searchParams.get("name")!)  : null;
  const paramPrice = searchParams.get("price") ? Number(searchParams.get("price"))               : null;

  const displayImg = paramImg ?? "/product-1.jpg";

  const matchedProduct = ALL_PRODUCTS.find(p =>
    (paramImg && p.img === displayImg) ||
    (paramName && p.name.toLowerCase().includes(paramName.toLowerCase()))
  ) ?? ALL_PRODUCTS[0];

  const displayName  = paramName  ?? matchedProduct.name;
  const displayPrice = (paramPrice && paramPrice > 0) ? paramPrice : (matchedProduct.price > 0 ? matchedProduct.price : 1299);
  const displayDesc  = matchedProduct.description;

  const thumbnails = [
    { img: displayImg, alt: "Main product view" },
    { img: ALL_PRODUCTS[1].img, alt: "Side angle view" },
    { img: ALL_PRODUCTS[2].img, alt: "Close up detail" },
    { img: ALL_PRODUCTS[3].img, alt: "Slice view" },
  ];

  const [activeThumb, setActiveThumb] = useState(0);
  const [selectedSize, setSelectedSize] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");

  const cartCount = items ? items.reduce((acc: number, i: any) => acc + i.quantity, 0) : 0;

  const currentPrice = Math.round(displayPrice * SIZES[selectedSize].multiplier);

  const relatedProducts = ALL_PRODUCTS.filter(p => p.img !== displayImg).slice(0, 3);

  const revealRefs = useRef<HTMLElement[]>([]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.12 }
    );
    revealRefs.current.forEach(el => { if (el) { el.classList.add("reveal"); observer.observe(el); } });
    return () => observer.disconnect();
  }, []);

  const addRevealRef = (el: HTMLElement | null) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  const handleAddToCart = () => {
    addItem({
      id: `product-${matchedProduct.id}-${selectedSize}`,
      name: `${displayName} (${SIZES[selectedSize].label})`,
      price: currentPrice,
      quantity,
      image: displayImg,
    });
    setAdding(true);
    setShowToast(true);
    setTimeout(() => setAdding(false), 1500);
    setTimeout(() => setShowToast(false), 2200);
  };

  const handleBuyNow = () => {
    addItem({
      id: `product-${matchedProduct.id}-${selectedSize}`,
      name: `${displayName} (${SIZES[selectedSize].label})`,
      price: currentPrice,
      quantity,
      image: displayImg,
    });
    router.push("/checkout");
  };

  const handleRazorpay = () => {
    const options = {
      key: "rzp_test_",
      amount: currentPrice * quantity * 100,
      currency: "INR",
      name: "Zeppoli Bakers",
      description: displayName,
      handler: () => router.push("/checkout"),
      prefill: { name: "", email: "", contact: "" },
      theme: { color: "#8D1D1C" },
    };
    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh", fontFamily: "'Source Sans 3', sans-serif" }}>
      <Navbar cartCount={cartCount} />

      {/* Product Hero Section */}
      <section style={{ paddingTop: "72px", maxWidth: "1400px", margin: "0 auto" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "55% 45%",
          minHeight: "calc(100vh - 72px)",
          gap: "0",
        }}
          className="product-grid"
        >
          {/* LEFT: Sticky Image Gallery */}
          <div style={{
            position: "sticky", top: "72px",
            height: "calc(100vh - 72px)",
            display: "flex", flexDirection: "column",
            padding: "40px 40px 40px 48px",
            gap: "16px",
          }}
            className="product-gallery-sticky"
          >
            {/* Main Image */}
            <div
              style={{
                flex: 1, overflow: "hidden", borderRadius: "16px",
                backgroundColor: "#F8F5F1",
                cursor: "zoom-in",
                boxShadow: "0 16px 60px rgba(141, 29, 28, 0.08)",
                position: "relative",
              }}
              onClick={() => setLightboxOpen(true)}
            >
              <img
                src={thumbnails[activeThumb].img}
                alt={thumbnails[activeThumb].alt}
                style={{
                  width: "100%", height: "100%", objectFit: "cover",
                  aspectRatio: "3/4",
                  transition: "transform 400ms ease",
                  display: "block",
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.03)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
              />
              <div style={{
                position: "absolute", top: "16px", left: "16px",
                background: "rgba(245,237,224,0.9)", borderRadius: "999px",
                padding: "6px 14px", fontSize: "11px", fontWeight: 600,
                letterSpacing: "0.1em", textTransform: "uppercase", color: "#8D1D1C",
                fontFamily: "'Source Sans 3', sans-serif",
              }}>
                Click to enlarge
              </div>
            </div>

            {/* Thumbnails */}
            <div style={{ display: "flex", gap: "12px", flexShrink: 0 }}>
              {thumbnails.map((t, i) => (
                <button
                  key={i}
                  onClick={() => setActiveThumb(i)}
                  style={{
                    width: "80px", height: "100px", border: "none",
                    borderRadius: "8px", overflow: "hidden", cursor: "pointer", padding: 0,
                    outline: activeThumb === i ? "3px solid #583127" : "2px solid transparent",
                    outlineOffset: "2px",
                    transition: "outline 150ms ease",
                    flexShrink: 0,
                  }}
                  aria-label={t.alt}
                >
                  <img src={t.img} alt={t.alt} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: Product Info */}
          <div style={{
            padding: "56px 48px 96px 40px",
            overflowY: "auto",
            display: "flex", flexDirection: "column", gap: "0",
          }}
            className="product-info-col"
          >
            {/* Eyebrow */}
            <span style={{
              fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, fontSize: "11px",
              letterSpacing: "0.18em", textTransform: "uppercase", color: "#9B8B7D",
              marginBottom: "12px", display: "block",
            }}>
              HANDCRAFTED DAILY · ZEPPOLI BAKERS
            </span>

            {/* Product Name */}
            <h1 style={{
              fontFamily: "'Nunito', sans-serif", fontWeight: 700,
              fontSize: "clamp(2rem, 3.5vw, 3rem)",
              lineHeight: 1.1, letterSpacing: "-0.03em",
              color: "var(--text)", marginBottom: "16px",
            }}>
              {displayName}
            </h1>

            {/* Rating Row */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
              <StarRating count={5} />
              <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "14px", color: "#9B8B7D" }}>
                4.9 · 286 reviews
              </span>
              <span style={{
                background: "#F5EDE0", border: "1px solid #EDE7E1",
                borderRadius: "999px", padding: "2px 12px",
                fontSize: "12px", fontWeight: 600, color: "#8D1D1C",
                fontFamily: "'Source Sans 3', sans-serif",
              }}>Bestseller</span>
            </div>

            {/* Trust Strip */}
            <div style={{
              display: "flex", gap: "20px", flexWrap: "wrap",
              padding: "14px 16px", borderRadius: "12px",
              backgroundColor: "#EDE7E1", marginBottom: "28px",
            }}>
              {["🎂 Freshly Baked Daily", "🇮🇳 Made in India", "🚚 Free delivery above ₹999", "✦ Serves 6–10"].map((t, i) => (
                <span key={i} style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "13px", fontWeight: 500, color: "#583127" }}>
                  {t}
                </span>
              ))}
            </div>

            {/* Price */}
            <div style={{ marginBottom: "28px" }}>
              <span style={{
                fontFamily: "'Nunito', sans-serif", fontWeight: 700,
                fontSize: "32px", color: "#8D1D1C",
              }}>
                ₹{currentPrice.toLocaleString("en-IN")}
              </span>
              <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "14px", color: "#9B8B7D", marginLeft: "8px" }}>
                Inclusive of all taxes
              </span>
            </div>

            {/* Size Selector */}
            <div style={{ marginBottom: "28px" }}>
              <span style={{
                fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600,
                fontSize: "14px", color: "#1A1A1A", letterSpacing: "0.05em",
                textTransform: "uppercase", display: "block", marginBottom: "12px",
              }}>
                Select Size
              </span>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {SIZES.map((s, i) => (
                  <button
                    key={s.label}
                    onClick={() => setSelectedSize(i)}
                    style={{
                      height: "40px", padding: "0 20px", borderRadius: "999px",
                      border: selectedSize === i ? "none" : "1px solid #DDC2A7",
                      background: selectedSize === i ? "#8D1D1C" : "#F5EDE0",
                      color: selectedSize === i ? "#fff" : "#1A1A1A",
                      fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, fontSize: "14px",
                      cursor: "pointer",
                      transition: "background-color 150ms ease, color 150ms ease",
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div style={{ marginBottom: "32px" }}>
              <span style={{
                fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600,
                fontSize: "14px", color: "#1A1A1A", letterSpacing: "0.05em",
                textTransform: "uppercase", display: "block", marginBottom: "12px",
              }}>
                Quantity
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: "0" }}>
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  style={{
                    width: "44px", height: "44px", border: "1px solid #DDC2A7",
                    borderRadius: "8px 0 0 8px", background: "#F5EDE0",
                    fontSize: "20px", fontWeight: 700, cursor: "pointer",
                    color: "#1A1A1A", display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "'Source Sans 3', sans-serif",
                  }}
                  aria-label="Decrease quantity"
                >−</button>
                <div style={{
                  width: "52px", height: "44px", border: "1px solid #DDC2A7",
                  borderLeft: "none", borderRight: "none",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600,
                  fontSize: "16px", color: "#1A1A1A", background: "#fff",
                }}>
                  {quantity}
                </div>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  style={{
                    width: "44px", height: "44px", border: "1px solid #DDC2A7",
                    borderRadius: "0 8px 8px 0", background: "#F5EDE0",
                    fontSize: "20px", fontWeight: 700, cursor: "pointer",
                    color: "#1A1A1A", display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "'Source Sans 3', sans-serif",
                  }}
                  aria-label="Increase quantity"
                >+</button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px" }}>
              <button
                onClick={handleAddToCart}
                style={{
                  height: "60px", borderRadius: "12px",
                  border: "2px solid #8D1D1C",
                  background: adding ? "#583127" : "var(--bg)",
                  color: adding ? "#fff" : "#8D1D1C",
                  fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: "17px",
                  cursor: "pointer",
                  transition: "background-color 200ms ease, color 200ms ease, transform 150ms ease",
                  letterSpacing: "-0.01em",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
                onMouseDown={e => { e.currentTarget.style.transform = "scale(0.98)"; }}
                onMouseUp={e => { e.currentTarget.style.transform = "scale(1)"; }}
              >
                {adding ? "✓ Added to Cart" : "Add to Cart"}
              </button>

              <button
                onClick={handleBuyNow}
                style={{
                  height: "60px", borderRadius: "12px",
                  border: "none", background: "#8D1D1C",
                  color: "#fff",
                  fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: "17px",
                  cursor: "pointer",
                  boxShadow: "0 10px 30px -10px #8D1D1C80",
                  transition: "transform 150ms ease, box-shadow 200ms ease",
                  letterSpacing: "-0.01em",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 16px 40px -10px #8D1D1C90"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 10px 30px -10px #8D1D1C80"; }}
                onMouseDown={e => { e.currentTarget.style.transform = "scale(0.98)"; }}
                onMouseUp={e => { e.currentTarget.style.transform = "scale(1)"; }}
              >
                Buy Now
              </button>

              <button
                onClick={handleRazorpay}
                style={{
                  height: "52px", borderRadius: "12px",
                  border: "1px solid #DDC2A7", background: "#fff",
                  color: "#583127",
                  fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, fontSize: "15px",
                  cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                  transition: "transform 150ms ease",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.01)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#583127" strokeWidth="2">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
                </svg>
                Pay via Razorpay (UPI / Cards)
              </button>
            </div>

            {/* Short desc */}
            <p style={{
              fontFamily: "'Source Sans 3', sans-serif", fontSize: "16px",
              lineHeight: 1.7, color: "#5C5C5C", marginBottom: "32px",
            }}>
              {displayDesc}
            </p>

            {/* Accordion */}
            <div style={{ borderTop: "1px solid #F0EDE8", marginBottom: "8px" }}>
              {ACCORDION_ITEMS.map((item, i) => (
                <div key={i} style={{ borderBottom: "1px solid #F0EDE8" }}>
                  <button
                    onClick={() => setOpenAccordion(openAccordion === i ? null : i)}
                    style={{
                      width: "100%", background: "none", border: "none", cursor: "pointer",
                      padding: "18px 0", display: "flex", justifyContent: "space-between",
                      alignItems: "center",
                    }}
                    aria-expanded={openAccordion === i}
                  >
                    <span style={{
                      fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600,
                      fontSize: "17px", color: "#1A1A1A",
                    }}>{item.title}</span>
                    <svg
                      width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9B8B7D" strokeWidth="2"
                      style={{ transform: openAccordion === i ? "rotate(180deg)" : "rotate(0)", transition: "transform 250ms ease" }}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  {openAccordion === i && (
                    <div style={{ paddingBottom: "18px" }}>
                      <p style={{
                        fontFamily: "'Source Sans 3', sans-serif", fontSize: "15px",
                        lineHeight: 1.7, color: "#5C5C5C", margin: 0,
                      }}>{item.content}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Craft Details Strip */}
      <section
        ref={addRevealRef}
        style={{
          backgroundColor: "#EDE7E1",
          padding: "32px 48px",
          display: "flex", gap: "48px", justifyContent: "center", flexWrap: "wrap",
        }}
      >
        {[
          { icon: "🍫", label: "Belgian Couverture Chocolate", sub: "70% Dark Cocoa" },
          { icon: "🥚", label: "Free-Range Eggs", sub: "Sourced locally" },
          { icon: "🔥", label: "Baked Fresh Daily", sub: "No preservatives" },
          { icon: "🎁", label: "Elegantly Packaged", sub: "Gift-ready box included" },
        ].map((f, i) => (
          <div key={i} style={{ textAlign: "center", minWidth: "160px" }}>
            <div style={{ fontSize: "28px", marginBottom: "8px" }}>{f.icon}</div>
            <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: "14px", color: "#1A1A1A" }}>{f.label}</div>
            <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "13px", color: "#9B8B7D" }}>{f.sub}</div>
          </div>
        ))}
      </section>

      {/* Reviews Section */}
      <section
        ref={addRevealRef}
        style={{
          backgroundColor: "var(--bg)",
          padding: "96px 48px",
          maxWidth: "1280px", margin: "0 auto",
        }}
      >
        <div style={{ marginBottom: "56px" }}>
          <span style={{
            fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, fontSize: "11px",
            letterSpacing: "0.18em", textTransform: "uppercase", color: "#9B8B7D",
            display: "block", marginBottom: "12px",
          }}>WHAT OUR CUSTOMERS SAY</span>
          <h2 style={{
            fontFamily: "'Nunito', sans-serif", fontWeight: 700,
            fontSize: "clamp(2rem, 4vw, 3rem)",
            letterSpacing: "-0.03em", lineHeight: 1.1,
            color: "#1A1A1A", marginBottom: "16px",
          }}>Loved by Dessert Connoisseurs</h2>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <StarRating count={5} />
            <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "15px", color: "#9B8B7D" }}>
              4.9 out of 5 · Based on 286 verified reviews
            </span>
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "24px",
        }}>
          {REVIEWS.map((r, i) => (
            <div
              key={i}
              ref={addRevealRef}
              style={{
                backgroundColor: "#fff", borderRadius: "16px",
                padding: "32px",
                boxShadow: "0 8px 30px rgba(141,29,28,0.05)",
                transition: "transform 300ms cubic-bezier(0.4,0,0.2,1), box-shadow 300ms cubic-bezier(0.4,0,0.2,1)",
                transitionDelay: `${i * 80}ms`,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = "0 16px 40px rgba(141,29,28,0.12)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 8px 30px rgba(141,29,28,0.05)";
              }}
            >
              <StarRating count={r.rating} />
              <p style={{
                fontFamily: "'Source Sans 3', sans-serif", fontSize: "15px",
                lineHeight: 1.65, color: "#1A1A1A", margin: "16px 0 20px",
                fontStyle: "italic",
              }}>"{r.text}"</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: "14px", color: "#583127" }}>{r.name}</span>
                <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "12px", color: "#9B8B7D" }}>{r.date}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Related Products */}
      <section
        ref={addRevealRef}
        style={{
          backgroundColor: "#EDE7E1",
          padding: "96px 48px",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <span style={{
            fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, fontSize: "11px",
            letterSpacing: "0.18em", textTransform: "uppercase", color: "#9B8B7D",
            display: "block", marginBottom: "12px",
          }}>YOU MIGHT ALSO LOVE</span>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px", flexWrap: "wrap", gap: "16px" }}>
            <h2 style={{
              fontFamily: "'Nunito', sans-serif", fontWeight: 700,
              fontSize: "clamp(2rem, 4vw, 3rem)",
              letterSpacing: "-0.03em", lineHeight: 1.1,
              color: "#1A1A1A", margin: 0,
            }}>More From the Bakery</h2>
            <button
              onClick={() => router.push("/shop")}
              style={{
                height: "44px", padding: "0 24px", borderRadius: "999px",
                border: "1px solid #8D1D1C", background: "transparent",
                color: "#8D1D1C", fontFamily: "'Source Sans 3', sans-serif",
                fontWeight: 600, fontSize: "14px", cursor: "pointer",
                transition: "background-color 200ms ease, color 200ms ease",
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#8D1D1C"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#8D1D1C"; }}
            >View All Cakes</button>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "32px",
          }}
            className="related-grid"
          >
            {relatedProducts.map((p, i) => (
              <article
                key={p.id}
                ref={addRevealRef}
                style={{
                  backgroundColor: "#fff", borderRadius: "16px",
                  overflow: "hidden", cursor: "pointer",
                  boxShadow: "0 6px 24px rgba(141,29,28,0.06)",
                  transition: "transform 300ms cubic-bezier(0.4,0,0.2,1), box-shadow 300ms",
                  transitionDelay: `${i * 80}ms`,
                }}
                onClick={() => router.push(`/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`)}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow = "0 16px 48px rgba(141,29,28,0.14)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 6px 24px rgba(141,29,28,0.06)";
                }}
              >
                <div style={{ overflow: "hidden", aspectRatio: "4/3" }}>
                  <img
                    src={p.img} alt={p.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 600ms ease" }}
                    onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                  />
                </div>
                <div style={{ padding: "24px" }}>
                  <h3 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: "18px", color: "#1A1A1A", marginBottom: "6px" }}>{p.name}</h3>
                  <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "14px", color: "#9B8B7D", marginBottom: "16px" }}>Artisanal · Handcrafted</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: "18px", color: "#8D1D1C" }}>
                      ₹{(p.price > 0 ? p.price : 1299).toLocaleString("en-IN")}
                    </span>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        router.push(`/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`);
                      }}
                      style={{
                        height: "36px", padding: "0 16px", borderRadius: "999px",
                        border: "1px solid #DDC2A7", background: "transparent",
                        color: "#583127", fontFamily: "'Source Sans 3', sans-serif",
                        fontWeight: 600, fontSize: "13px", cursor: "pointer",
                        transition: "background 200ms",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = "#583127"; e.currentTarget.style.color = "#fff"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#583127"; }}
                    >View Details</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section
        ref={addRevealRef}
        style={{
          backgroundColor: "#8D1D1C",
          padding: "80px 48px",
          textAlign: "center",
        }}
      >
        <h2 style={{
          fontFamily: "'Nunito', sans-serif", fontWeight: 700,
          fontSize: "clamp(2rem, 3.5vw, 3rem)",
          letterSpacing: "-0.02em", lineHeight: 1.2,
          color: "#fff", marginBottom: "32px",
        }}>Ready to Indulge? Explore Our Full Collection</h2>
        <button
          onClick={() => router.push("/shop")}
          style={{
            height: "52px", padding: "0 32px", borderRadius: "999px",
            border: "2px solid #fff", background: "transparent",
            color: "#fff", fontFamily: "'Nunito', sans-serif", fontWeight: 700,
            fontSize: "16px", cursor: "pointer",
            transition: "background-color 200ms, color 200ms, transform 150ms",
          }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#fff"; e.currentTarget.style.color = "#8D1D1C"; e.currentTarget.style.transform = "scale(1.02)"; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.transform = "scale(1)"; }}
        >Explore Our Full Collection</button>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: "#3A241F", color: "#fff", padding: "80px 48px 0" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "48px",
          maxWidth: "1280px", margin: "0 auto", paddingBottom: "64px",
        }}
          className="footer-grid"
        >
          <div>
            <img src="/logo.png" alt="Zeppoli Bakers logo" style={{ height: "36px", objectFit: "contain", opacity: 0.9, marginBottom: "12px" }} />
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "14px", color: "#CCCCCC", lineHeight: 1.7, marginBottom: "20px" }}>
              Indulgence Crafted with Love
            </p>
            <div style={{ display: "flex", gap: "16px" }}>
              {["instagram", "facebook", "pinterest"].map(social => (
                <button key={social} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }} aria-label={social}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8">
                    {social === "instagram" && <><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.5" fill="#fff" /></>}
                    {social === "facebook" && <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />}
                    {social === "pinterest" && <path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.65 7.86 6.39 9.29-.09-.78-.17-1.98.04-2.83.18-.76 1.22-5.16 1.22-5.16s-.31-.62-.31-1.54c0-1.45.84-2.53 1.88-2.53.89 0 1.32.67 1.32 1.47 0 .89-.57 2.23-.87 3.47-.25 1.04.52 1.88 1.54 1.88 1.85 0 3.27-1.95 3.27-4.77 0-2.49-1.79-4.24-4.35-4.24-2.96 0-4.7 2.22-4.7 4.51 0 .89.34 1.85.77 2.37.08.1.09.19.07.29-.08.33-.25 1.04-.28 1.18-.05.19-.17.23-.39.14-1.39-.65-2.26-2.68-2.26-4.32 0-3.51 2.55-6.74 7.35-6.74 3.86 0 6.86 2.75 6.86 6.42 0 3.83-2.41 6.91-5.76 6.91-1.13 0-2.19-.59-2.55-1.28l-.69 2.58c-.25.97-.93 2.18-1.39 2.92C11 21.96 11.5 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" />}
                  </svg>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "20px", color: "#fff" }}>Shop</h4>
            {["Our Cakes", "Chocolate Cakes", "Seasonal Specials", "Gift Cards"].map(link => (
              <button key={link} onClick={() => router.push("/shop")} style={{ display: "block", background: "none", border: "none", cursor: "pointer", fontFamily: "'Source Sans 3', sans-serif", fontSize: "15px", color: "#CCCCCC", lineHeight: 2.2, textAlign: "left", padding: 0 }}
                onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={e => (e.currentTarget.style.color = "#CCCCCC")}
              >{link}</button>
            ))}
          </div>

          <div>
            <h4 style={{ fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "20px", color: "#fff" }}>Learn</h4>
            {["Our Story", "The Craft", "Blog", "FAQs", "Contact Us"].map(link => (
              <button key={link} onClick={() => router.push("/")} style={{ display: "block", background: "none", border: "none", cursor: "pointer", fontFamily: "'Source Sans 3', sans-serif", fontSize: "15px", color: "#CCCCCC", lineHeight: 2.2, textAlign: "left", padding: 0 }}
                onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={e => (e.currentTarget.style.color = "#CCCCCC")}
              >{link}</button>
            ))}
          </div>

          <div>
            <h3 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: "18px", color: "#fff", marginBottom: "16px" }}>Stay in the Loop</h3>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "14px", color: "#CCCCCC", lineHeight: 1.6, marginBottom: "16px" }}>New flavours, seasonal specials, and exclusive offers.</p>
            {subscribed ? (
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "15px", color: "#A67C52", fontWeight: 600 }}>✓ Thank you for subscribing!</p>
            ) : (
              <form onSubmit={e => { e.preventDefault(); if (email) setSubscribed(true); }} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <input
                  type="email" placeholder="your@email.com" value={email}
                  onChange={e => setEmail(e.target.value)} required
                  style={{
                    height: "48px", padding: "0 16px", borderRadius: "6px",
                    border: "1px solid #CCCCCC", background: "transparent",
                    color: "#fff", fontFamily: "'Source Sans 3', sans-serif", fontSize: "14px",
                    outline: "none",
                  }}
                />
                <button type="submit" style={{
                  height: "48px", borderRadius: "6px", border: "none",
                  background: "#A67C52", color: "#fff",
                  fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, fontSize: "15px",
                  cursor: "pointer",
                  transition: "background-color 200ms",
                }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#8D1D1C")}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#A67C52")}
                >Subscribe</button>
              </form>
            )}
          </div>
        </div>

        <div style={{
          borderTop: "1px solid #5C5C5C", padding: "24px 0",
          maxWidth: "1280px", margin: "0 auto",
          display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px",
        }}>
          <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "13px", color: "#AAAAAA", margin: 0 }}>
            © 2026 Zeppoli Bakers · Privacy Policy · Terms of Service
          </p>
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            {["VISA", "MC", "UPI", "AMEX"].map(pay => (
              <span key={pay} style={{
                fontFamily: "'Source Sans 3', sans-serif", fontSize: "11px", fontWeight: 700,
                color: "#AAAAAA", border: "1px solid #5C5C5C", borderRadius: "4px",
                padding: "3px 8px", letterSpacing: "0.05em",
              }}>{pay}</span>
            ))}
          </div>
        </div>
      </footer>

      {/* Toast Notification */}
      {showToast && (
        <div style={{
          position: "fixed", bottom: "32px", right: "32px", zIndex: 300,
          backgroundColor: "#3A241F", color: "#fff",
          padding: "14px 24px", borderRadius: "12px",
          fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, fontSize: "15px",
          boxShadow: "0 8px 32px rgba(58,36,31,0.3)",
          animation: "toastIn 300ms ease-out",
          display: "flex", alignItems: "center", gap: "10px",
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A67C52" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Item added to your bag!
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          onClick={() => setLightboxOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 500,
            backgroundColor: "rgba(26,26,26,0.92)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            style={{
              position: "absolute", top: "24px", right: "24px",
              background: "rgba(255,255,255,0.1)", border: "none",
              borderRadius: "999px", width: "48px", height: "48px",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            }}
            aria-label="Close lightbox"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <img
            src={thumbnails[activeThumb].img}
            alt={thumbnails[activeThumb].alt}
            style={{
              maxWidth: "90vw", maxHeight: "90vh", objectFit: "contain",
              borderRadius: "8px",
            }}
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}

      {/* Sticky Mobile Bottom Bar */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 200,
        backgroundColor: "#fff",
        borderTop: "1px solid #EDE7E1",
        padding: "12px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px",
      }}
        className="mobile-bottom-bar"
      >
        <div>
          <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: "20px", color: "#8D1D1C" }}>
            ₹{currentPrice.toLocaleString("en-IN")}
          </div>
          <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "12px", color: "#9B8B7D" }}>
            {SIZES[selectedSize].label} · Qty: {quantity}
          </div>
        </div>
        <button
          onClick={handleAddToCart}
          style={{
            flex: 1, maxWidth: "200px",
            height: "52px", borderRadius: "12px",
            border: "none", background: adding ? "#583127" : "#8D1D1C",
            color: "#fff", fontFamily: "'Nunito', sans-serif",
            fontWeight: 700, fontSize: "16px", cursor: "pointer",
            transition: "background-color 200ms",
          }}
        >
          {adding ? "✓ Added!" : "Add to Cart"}
        </button>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700&family=Source+Sans+3:ital,wght@0,400;0,500;0,600;1,400&display=swap');
        :root {
          --bg: #F5EDE0;
          --surface: #A67C52;
          --primary: #8D1D1C;
          --accent: #583127;
          --text: #1A1A1A;
          --muted: #9B8B7D;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Source Sans 3', sans-serif; }
        .mobile-bottom-bar { display: none; }
        @media (max-width: 768px) {
          .mobile-bottom-bar { display: flex !important; }
          .product-grid { grid-template-columns: 1fr !important; }
          .product-gallery-sticky { position: relative !important; top: auto !important; height: auto !important; padding: 24px !important; }
          .product-info-col { padding: 24px 24px 120px !important; }
          .footer-grid { grid-template-columns: 1fr !important; }
          .related-grid { grid-template-columns: 1fr !important; }
          section { padding-left: 24px !important; padding-right: 24px !important; }
        }
        @media (max-width: 1024px) {
          .related-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .footer-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        button:focus-visible { outline: 2px solid #8D1D1C; outline-offset: 2px; }
        input:focus { outline: 2px solid #8D1D1C; outline-offset: 0; }
      `}</style>
    </div>
  );
}

export default function ProductPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "var(--bg)" }} />}>
      <ProductContent />
    </Suspense>
  );
}