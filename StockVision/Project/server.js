import express from 'express';
import fs from 'fs';
import cors from 'cors';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';


const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app  = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());


const DB_PATH = path.join(__dirname, 'src', 'data', 'tickers.db');

if (!fs.existsSync(DB_PATH)) {
  throw new Error(`SQLite file not found: ${DB_PATH}`);
}

const db = new Database(DB_PATH, { readonly: true });


const runPythonScript = (scriptName, functionName, args = []) =>
  new Promise((resolve, reject) => {
    const fullArgs = [
      path.join(__dirname, 'src', scriptName),  // absolute path to script
      functionName,
      ...args,
    ];

    const py = spawn('python', fullArgs, { shell: true });

    let output = '';
    let errorOutput = '';

    py.stdout.on('data', data => {
      output += data.toString();
    });

    py.stderr.on('data', data => {
      errorOutput += data.toString();
    });

    py.on('close', code => {
      if (code !== 0) {
        console.error('Python script failed:', errorOutput);
        return reject(new Error(`Python exited with code ${code}`));
      }

      try {
        resolve(JSON.parse(output.trim()));
      } catch (err) {
        console.error('Failed to parse JSON:', output);
        reject(err);
      }
    });
  });



app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});


app.get('/api/stocks', (req, res) => {
  try {
    const limit = Number(req.query.limit) || 25;
    const rows  = db.prepare('SELECT * FROM prices LIMIT ?').all(limit);
    res.json(rows);
  } catch (err) {
    console.error('Error in /api/stocks:', err);
    res.status(500).json({ error: 'DB query failed' });
  }
});


app.get('/api/search', async (req, res) => {
  try {
    const { q: query, limit = 10 } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Missing query' });
    }

    const result = await runPythonScript(
      'stock_api.py',
      'search_stocks',
      [query, limit]
    );

    res.json(result);
  } catch (error) {
    console.error('Error in /api/search:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});


app.get('/test-python', async (_req, res) => {
  try {
    const result = await runPythonScript(
      'stock_api.py',
      'search_stocks',
      ['AAPL', '5']
    );
    res.json(result);
  } catch (err) {
    console.error('Error in /test-python:', err);
    res.status(500).json({ error: err.toString() });
  }
});


/* ---------- start the server ---------- */
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
