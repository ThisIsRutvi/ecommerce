
export const parseMessage = (text) => {
  const lines = text.split("\n")
  const products = []
  const textLines = []
  let currentProduct = null

  lines.forEach((line) => {
    const trimmed = line.trim()

    if (!trimmed) {
      // Empty line = end of current product block
      if (currentProduct) { products.push(currentProduct); currentProduct = null }
      return
    }

    // ✅ Check Image and ID FIRST before namePriceMatch so they don't get misidentified
    const imageMatch = trimmed.match(/^Image:\s*(\S+)\s*$/i)
    const idMatch = trimmed.match(/^ID:\s*(\d+)\s*$/i)
    // Matches: "Product Name - ₹2499" or "Product Name - 2499"
    // Does NOT match lines starting with "Image:" or "ID:"
    const namePriceMatch = trimmed.match(/^(?:\d+\.\s*)?(.+?)\s*-\s*(?:₹|Rs\.?|INR)?\s*(\d+(?:\.\d+)?)\s*$/)

    if (imageMatch) {
      // This is an Image line — attach to current product
      if (currentProduct) {
        currentProduct.image = imageMatch[1]
      }
    } else if (idMatch) {
      // This is an ID line — attach to current product
      if (currentProduct) {
        currentProduct.id = idMatch[1]
      }
    } else if (namePriceMatch) {
      // This is a new product — push previous if exists
      if (currentProduct) products.push(currentProduct)
      currentProduct = {
        name: namePriceMatch[1].trim(),
        price: namePriceMatch[2],
        image: null,
        id: null,
      }
    } else {
      // Plain text line — end any open product block
      if (currentProduct) { products.push(currentProduct); currentProduct = null }
      textLines.push(trimmed)
    }
  })

  if (currentProduct) products.push(currentProduct)
  return { text: textLines.join("\n").trim(), products }
}

export const ProductCard = ({ product }) => {
  // ✅ Use React Router's navigate instead of window.location.href

  const handleClick = () => {
    if (product.id) {
      window.location.href = `/product/${product.id}`
    }
  }

  return (
    <div
      onClick={handleClick}
      style={{
        border: "1px solid #eee",
        borderRadius: "12px",
        overflow: "hidden",
        width: "140px",
        flexShrink: 0,
        background: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        cursor: product.id ? "pointer" : "default",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)"
        e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.15)"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)"
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)"
      }}
    >
      {product.image ? (
        <img
          src={product.image}
          alt={product.name}
          style={{ width: "100%", height: "120px", objectFit: "cover", display: "block" }}
          onError={(e) => { e.target.style.display = "none" }}
        />
      ) : (
        <div
          style={{
            width: "100%", height: "120px", background: "#f5f5f5",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "11px", color: "#999",
          }}
        >
          No image
        </div>
      )}
      <div style={{ padding: "8px" }}>
        <div
          style={{
            fontSize: "11px", fontWeight: 600, color: "#222",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: "4px",
          }}
        >
          {product.name}
        </div>
        <div style={{ fontSize: "12px", color: "#e44", fontWeight: 700 }}>₹{product.price}</div>
        {product.id && (
          <div
            style={{
              marginTop: "6px", fontSize: "10px", color: "#fff",
              background: "#333", borderRadius: "6px", padding: "3px 6px", textAlign: "center",
            }}
          >
            View Details →
          </div>
        )}
      </div>
    </div>
  )
}

export const BotMessage = ({ text }) => {
  const { text: cleanText, products } = parseMessage(text)

  return (
    <div style={{ maxWidth: "100%" }}>
      {cleanText && (
        <div className="sole-bubble bot" style={{ marginBottom: products.length ? "10px" : 0 }}>
          {cleanText}
        </div>
      )}
      {products.length > 0 && (
        <div
          style={{
            display: "flex", gap: "10px", overflowX: "auto",
            paddingBottom: "8px", paddingTop: "4px", scrollbarWidth: "none",
          }}
        >
          {products.map((p, i) => <ProductCard key={i} product={p} />)}
        </div>
      )}
    </div>
  )
}
