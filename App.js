const express = require('express');
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('77b991b269ea4cabb386cb93d76b528e');
const path = require("path");

const app = express();
const PORT = 3000;

app.set("views engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.static('public'));

// Route to fetch top headlines
app.get('/news', async(req, res)=>{
  try{
    const response = await newsapi.v2.topHeadlines({
      q: req.query.q || '',
      category: req.query.category || '',
      language: req.query.language || 'en',
      country: req.query.country || ''
    });
    const news = response.articles;
    const str = "Latest News Headlines";
    res.render("index.ejs", {str, news});
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Route to fetch everything
app.get('/news/search', async (req, res) => {
  try {
    const response = await newsapi.v2.everything({
      q: req.query.q || '',
      sources: req.query.sources || '',
      domains: req.query.domains || '',
      from: req.query.from || '',
      to: req.query.to || '',
      language: req.query.language || 'en',
      sortBy: req.query.sortBy || 'publishedAt',
      page: req.query.page || 1
    });
    const news = response.articles;
    const str = "Search Results for " + req.query.q;
    res.render("index.ejs", {str, news});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
