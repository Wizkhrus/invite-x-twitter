const express = require('express');
const router = express.Router();
const axios = require('axios');

// Middleware to get Twitter token for account
const getTwitterToken = async (twitterAccountId) => {
  // This should connect to your database/storage to get the token
  // Replace with your actual token retrieval logic
  try {
    // Example: const token = await db.getTokenByAccountId(twitterAccountId);
    // For now, returning placeholder - implement your token storage logic
    throw new Error('Token retrieval not implemented');
  } catch (error) {
    throw new Error(`Failed to get token for account ${twitterAccountId}: ${error.message}`);
  }
};

// POST /tweet - Publish a tweet via X API
router.post('/tweet', async (req, res) => {
  try {
    const { text, twitter_account_id } = req.body;

    // Validate required fields
    if (!text || !twitter_account_id) {
      return res.status(400).json({
        error: 'Missing required fields: text and twitter_account_id'
      });
    }

    // Validate tweet text length (X API limit is 280 characters)
    if (text.length > 280) {
      return res.status(400).json({
        error: 'Tweet text exceeds 280 character limit'
      });
    }

    // Get the access token for this Twitter account
    const accessToken = await getTwitterToken(twitter_account_id);

    // Prepare the tweet data
    const tweetData = {
      text: text
    };

    // Make request to X API v2
    const response = await axios.post(
      'https://api.twitter.com/2/tweets',
      tweetData,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Return success response
    res.status(201).json({
      success: true,
      tweet: response.data,
      message: 'Tweet posted successfully'
    });

  } catch (error) {
    console.error('Tweet posting error:', error);
    
    // Handle X API specific errors
    if (error.response) {
      const status = error.response.status;
      const errorData = error.response.data;
      
      return res.status(status).json({
        error: 'X API Error',
        details: errorData,
        message: 'Failed to post tweet to X'
      });
    }
    
    // Handle other errors (network, token issues, etc.)
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message || 'Failed to post tweet'
    });
  }
});

module.exports = router;
