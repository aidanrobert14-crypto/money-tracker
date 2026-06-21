import express from "express";
import path from "path";
import fs from "fs/promises";
import { createServer as createViteServer } from "vite";
import crypto from "crypto";

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(process.cwd(), "data.json");

// Middleware
app.use(express.json());

// Initialize data file
async function initDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify([]));
  }
}
initDataFile();

// Basic API endpoints for Money Tracking
app.get("/api/transactions", async (req, res) => {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    const transactions = JSON.parse(data);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: "Failed to read data" });
  }
});

app.post("/api/transactions", async (req, res) => {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    const transactions = JSON.parse(data);
    
    const newTransaction = {
      id: crypto.randomUUID(),
      ...req.body,
      createdAt: new Date().toISOString()
    };
    
    // Most recent first
    transactions.unshift(newTransaction);
    await fs.writeFile(DATA_FILE, JSON.stringify(transactions, null, 2));
    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(500).json({ error: "Failed to save data" });
  }
});

app.delete("/api/transactions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await fs.readFile(DATA_FILE, "utf-8");
    let transactions = JSON.parse(data);
    transactions = transactions.filter((t: any) => t.id !== id);
    await fs.writeFile(DATA_FILE, JSON.stringify(transactions, null, 2));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete data" });
  }
});

// Vite middleware and fallbacks
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
