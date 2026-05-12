import Groq from 'groq-sdk'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'
import mongoose from 'mongoose'
dotenv.config()

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

const productSchema = new mongoose.Schema({
   id:Number,
   name: String,
  image: String,
  category: String,
  new_price: Number,
  old_price: Number,
  available: Boolean
})

const Product = mongoose.models.Product || mongoose.model('Product', productSchema)

const chatbotController = async (req, res) => {
  try {
    const { message } = req.body

    if (!message) {
      return res.status(400).json({ success: false, message: "message is required" })
    }

    const supportFolderPath = path.join(process.cwd(), "support")
    if (!fs.existsSync(supportFolderPath)) {
      return res.status(500).json({ success: false, message: "Knowledge base not found" })
    }

    const files = fs.readdirSync(supportFolderPath)
    let knowledge = []

    files.forEach((file) => {
      const filePath = path.join(supportFolderPath, file)
      if (fs.statSync(filePath).isFile()) {
        const rawData = fs.readFileSync(filePath, "utf-8")
        try {
          knowledge.push(JSON.parse(rawData))
        } catch (err) {
          console.error(`Invalid JSON in file: ${file}`, err.message)
        }
      }
    })

    const allproducts = await Product.find({available:true})

    const pricematch = message.match(/under\s*[₹]?\s*(\d+)/i)
    const maxPrice = pricematch ? parseInt(pricematch[1]) :null

    const messageLower =message.toLowerCase()
    let categoryFilter = null
    if(messageLower.includes("men")) categoryFilter ="men"
    else if(messageLower.includes("women")) categoryFilter = "women"
    else if(messageLower.includes("kid")) categoryFilter = "kids"

    const productlist = allproducts.
    filter(p=>{
        const passPrice = maxPrice ? p.new_price < maxPrice : true  
    const passCategory = categoryFilter ? p.category === categoryFilter : true
    return passPrice && passCategory
    })
    .map(p=>({
        id:p.id,
        name: p.name,
        category: p.category,
        price: p.new_price,
        image: p.image
    }))

    const knowledgeData = JSON.stringify(knowledge)
    const productData = JSON.stringify(productlist)

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `You are a helpful customer support assistant for UrbanSole shoe store.
                 STRICT RULES:
- For store policies use ONLY the FAQ Knowledge below
- For product questions use ONLY the Product Catalog below
- Do NOT add any extra text like "prices may change" or "availability may vary"
- Do NOT use your own knowledge or make up anything
- If not found in either source say exactly: "I don't have information on that. Please contact support at support_urbansole.com or call 9845236781."
- Do NOT number products (no "1." "2." etc)
- Do NOT add intro text like "Here are the products from our catalog:"
- Start DIRECTLY with the first product name

PRICE FILTER RULES — follow strictly:
- "under X" or "below X" means price LESS THAN X (do NOT include X itself)
- "up to X" or "within X" means price LESS THAN OR EQUAL TO X (include X)
- "above X" means price GREATER THAN X (do NOT include X itself)
- Always filter products strictly based on these rules

                  MANDATORY PRODUCT FORMAT — you MUST follow this exactly, no extra text:
ProductName - ₹Price
Image: imageURL
ID: productId

Example:
Nike Air Max - ₹2499
Image: http://localhost:4000/imgs/product_123.jpg
ID: 62

FAQ Knowledge:
${knowledgeData}

Product Catalog:
${productData}`

        },
        {
          role: "user",
          content: message
        }
      ]
    })

    res.json({
      success: true,
      reply: response.choices[0].message.content
    })

  } catch (error) {
    console.error("Error:", error?.message || error)
    res.status(500).json({ success: false, message: "Error generating response" })
  }
}

export default chatbotController