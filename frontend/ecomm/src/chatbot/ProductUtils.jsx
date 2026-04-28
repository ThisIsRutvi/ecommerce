import { useNavigate } from "react-router-dom"

export const parseMessage = (text) => {
  const lines = text.split("\n")
  const products = []
  const textLines = []
  let currentProduct = null

  lines.forEach((line) => {
    const trimmed = line.trim()
    const namePriceMatch = trimmed.match(/^(.+?)\s*-\s*₹(\d+)$/)
    const imageMatch = trimmed.match(/^Image:\s*(https?:\/\/\S+)$/i)
    const idMatch = trimmed.match(/^ID:\s*(\d+)$/i)

    if (namePriceMatch) {
      if (currentProduct) products.push(currentProduct)
      currentProduct = { name: namePriceMatch[1].trim(), price: namePriceMatch[2], image: null, id: null }
    } else if (imageMatch && currentProduct) {
      currentProduct.image = imageMatch[1]
    } else if (idMatch && currentProduct) {
      currentProduct.id = idMatch[1]
    } else {
      if (currentProduct) { products.push(currentProduct); currentProduct = null }
      if (trimmed) textLines.push(trimmed)
    }
  })

  if (currentProduct) products.push(currentProduct)
  return { text: textLines.join("\n").trim(), products }
}

export const ProductCard = ({ product }) => {
  const navigate = useNavigate()

  const handleClick = () => {
    console.log("Full product:", product)
    console.log("Product ID:", product.id)
    
    if (product.id) {
      navigate(`/product/${product.id}`)
    } else {
      console.log("No ID found — AI not returning ID in reply")
    }
  }

  return (
    <div
      onClick={handleClick}
      style={{
        border: "1px solid #eee", borderRadius: "12px", overflow: "hidden",
        width: "140px", flexShrink: 0, background: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        cursor: product.id ? "pointer" : "default",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-4px)"
        e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.15)"
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)"
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)"
      }}
    >
      {product.image ? (
        <img src={product.image} alt={product.name}
          style={{ width: "100%", height: "120px", objectFit: "cover", display: "block" }}
          onError={(e) => { e.target.style.display = "none" }}
        />
      ) : (
        <div style={{ width: "100%", height: "120px", background: "#f5f5f5",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "11px", color: "#999" }}>No image</div>
      )}
      <div style={{ padding: "8px" }}>
        <div style={{ fontSize: "11px", fontWeight: 600, color: "#222",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: "4px" }}>
          {product.name}
        </div>
        <div style={{ fontSize: "12px", color: "#e44", fontWeight: 700 }}>₹{product.price}</div>
        {product.id && (
          <div style={{ marginTop: "6px", fontSize: "10px", color: "#fff",
            background: "#333", borderRadius: "6px", padding: "3px 6px", textAlign: "center" }}>
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
        <div style={{ display: "flex", gap: "10px", overflowX: "auto",
          paddingBottom: "8px", paddingTop: "4px", scrollbarWidth: "none" }}>
          {products.map((p, i) => <ProductCard key={i} product={p} />)}
        </div>
      )}
    </div>
  )
}