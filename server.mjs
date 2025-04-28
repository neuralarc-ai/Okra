import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// API Routes
app.get('/api/models', async (req, res) => {
  try {
    const response = await openai.models.list();
    const models = response.data.map(model => ({
      id: model.id,
      name: model.id,
      description: model.description || model.id
    }));
    res.json({ models });
  } catch (error) {
    console.error('Error fetching models:', error);
    res.status(500).json({ error: 'Failed to fetch models' });
  }
});

app.post('/api/analyze', async (req, res) => {
  try {
    const { prompt, settings } = req.body;
    
    const systemMessage = `You are Oracle, an AI market research analyst for startups and businesses. Conduct deep research on the business idea provided and deliver comprehensive analysis with real-time market insights. 

    Analyze the business idea thoroughly and provide a structured JSON response with the following:
    1. validationScore (0-100): Calculated based on market potential, uniqueness, feasibility, and timing
    2. competitors (array with name, strengthScore 0-100, and description): Include real competitors in the market
    3. priceSuggestions (array with type, value, and description): Provide evidence-based pricing strategies
    4. forecasts (object with bestCase and worstCase scenarios, each containing revenue, marketShare, customers)
    5. clients (array with potential client name, industry, and useCase): Identify specific target segments
    6. sources (array with title, url, and relevance): Include research sources that would be relevant for this analysis
    7. summary (brief analysis, max 250 characters): Clear, actionable assessment
    
    Format as valid JSON without markdown formatting or explanations. Use realistic data based on current market trends.`;

    const response = await openai.chat.completions.create({
      model: settings.primaryModel || process.env.DEFAULT_PRIMARY_MODEL,
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: `Analyze this business idea and provide deep market research: ${prompt}` }
      ],
      temperature: 0.7,
      max_tokens: 3000
    });

    const content = response.choices[0].message.content;
    const jsonMatch = content.match(/(\{.*\})/s);
    const jsonString = jsonMatch ? jsonMatch[0] : content;
    const result = JSON.parse(jsonString);

    res.json(result);
  } catch (error) {
    console.error('Error generating analysis:', error);
    res.status(500).json({ error: 'Failed to generate analysis' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 