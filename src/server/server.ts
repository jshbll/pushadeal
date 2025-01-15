import express, { Request, Response } from 'express';
import cors from 'cors';
import { Client, Environment } from 'square';
import dotenv from 'dotenv';
import crypto from 'crypto';
import axios from 'axios';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Configure CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.com'] // Replace with your actual frontend domain
    : ['http://localhost:5173'],
  credentials: true
}));

// Parse JSON bodies
app.use(express.json());

// Store states for OAuth flow
const states = new Set<string>();

// Store tokens in memory (in production, use a secure storage solution)
let accessToken: string | null = null;
let refreshToken: string | null = process.env.CONSTANT_CONTACT_REFRESH_TOKEN || null;

// Helper function to get a valid access token
// Helper function to get a valid access token
const getValidAccessToken = async () => {
  try {
    if (!accessToken && refreshToken) {
      // Get new token using refresh token
      const tokenResponse = await axios.post(
        'https://authz.constantcontact.com/oauth2/default/v1/token',
        new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken
        }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${Buffer.from(
              `${process.env.CONSTANT_CONTACT_CLIENT_ID}:${process.env.CONSTANT_CONTACT_CLIENT_SECRET}`
            ).toString('base64')}`
          }
        }
      );

      accessToken = tokenResponse.data.access_token;
      // Update refresh token if a new one is provided
      if (tokenResponse.data.refresh_token) {
        refreshToken = tokenResponse.data.refresh_token;
        console.log('New refresh token received. Update your CONSTANT_CONTACT_REFRESH_TOKEN environment variable with:', refreshToken);
      }
    }

    if (!accessToken) {
      throw new Error('No access token available. Please set up initial authorization.');
    }

    return accessToken;
  } catch (error) {
    console.error('Error getting access token:', error.response?.data || error);
    throw new Error('Failed to authenticate with Constant Contact');
  }
};

// One-time setup route - visit this once to get the initial refresh token
app.get('/setup/constantcontact', (req, res) => {
  const state = crypto.randomBytes(16).toString('hex');
  states.add(state);

  const authUrl = new URL('https://authz.constantcontact.com/oauth2/default/v1/authorize');
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('client_id', process.env.CONSTANT_CONTACT_CLIENT_ID!);
  authUrl.searchParams.append('redirect_uri', 'http://localhost:3000/callback');
  authUrl.searchParams.append('scope', 'campaign_data contact_data offline_access');
  authUrl.searchParams.append('state', state);
  
  res.redirect(authUrl.toString());
});

// Constants
const CONSTANT_CONTACT_API_BASE = 'https://api.cc.email/v3';
const DEFAULT_LIST_ID = '8663e04a-d1c8-11ef-bde9-fa163e4037f6';

// Validate required environment variables
const requiredEnvVars = [
  'CONSTANT_CONTACT_CLIENT_ID',     // Your API Key
  'CONSTANT_CONTACT_CLIENT_SECRET', // Your App Secret
  'CONSTANT_CONTACT_ACCESS_TOKEN',  // Access Token
  'CONSTANT_CONTACT_FROM_EMAIL',    // Sender Email
  'BUSINESS_ADDRESS_LINE1',         // Address
  'BUSINESS_CITY',                  // City
  'BUSINESS_STATE',                 // State
  'BUSINESS_POSTAL_CODE'            // Postal Code
];

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
});

// Initialize Square client
const squareClient = new Client({
  accessToken: process.env.VITE_SQUARE_ACCESS_TOKEN || '',
  environment: process.env.NODE_ENV === 'production' 
    ? Environment.Production 
    : Environment.Sandbox,
});

// OAuth Routes
app.get('/auth/constantcontact', (req, res) => {
  const state = crypto.randomBytes(16).toString('hex');
  states.add(state);

  const authUrl = new URL('https://authz.constantcontact.com/oauth2/default/v1/authorize');
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('client_id', process.env.CONSTANT_CONTACT_CLIENT_ID!);
  authUrl.searchParams.append('redirect_uri', 'http://localhost:3000/callback');
  authUrl.searchParams.append('scope', 'campaign_data contact_data offline_access');
  authUrl.searchParams.append('state', state);
  
  res.redirect(authUrl.toString());
});

// Callback route for initial setup
app.get('/callback', async (req, res) => {
  const { code, state, error, error_description } = req.query;
  
  console.log('Callback received:', { code, state, error, error_description });

  if (error) {
    console.error('Auth error:', error, error_description);
    return res.status(400).send(`Authentication error: ${error_description}`);
  }

  if (!state || !states.has(state as string)) {
    return res.status(400).send('Invalid state parameter');
  }
  
  states.delete(state as string);

  try {
    const tokenResponse = await axios.post(
      'https://authz.constantcontact.com/oauth2/default/v1/token',
      new URLSearchParams({
        grant_type: 'authorization_code',
        code: code as string,
        redirect_uri: 'http://localhost:3000/callback'
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(
            `${process.env.CONSTANT_CONTACT_CLIENT_ID}:${process.env.CONSTANT_CONTACT_CLIENT_SECRET}`
          ).toString('base64')}`
        }
      }
    );

    // Store tokens
    accessToken = tokenResponse.data.access_token;
    refreshToken = tokenResponse.data.refresh_token;

    res.send(`
      <h1>Setup Complete!</h1>
      <p>Add this refresh token to your environment variables:</p>
      <pre>CONSTANT_CONTACT_REFRESH_TOKEN=${refreshToken}</pre>
      <p>You can now close this window and restart your server.</p>
    `);
  } catch (error: any) {
    console.error('Token Exchange Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    res.status(500).send('Authentication failed: ' + (error.response?.data?.error_description || error.message));
  }
});

// Email Routes
app.post('/api/send-email', async (req, res) => {
  try {
    console.log('Starting email campaign creation...');
    const { emailHtml, subject, listId = DEFAULT_LIST_ID } = req.body;

    if (!emailHtml) {
      return res.status(400).json({ error: 'Email HTML content is required' });
    }

    // Get valid access token
    const token = await getValidAccessToken();
    
    // Use the OAuth token for requests
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Cache-Control': 'no-cache'
    };

    // Step 1: Create email campaign and campaign activities
    const createCampaignPayload = {
      name: `${subject || "Property Details"} - ${Date.now()}`,
      type: "CUSTOM_CODE_EMAIL",
      email_campaign_activities: [{
        format_type: 5,
        from_email: process.env.CONSTANT_CONTACT_FROM_EMAIL,
        from_name: "Deal Dispo",
        reply_to_email: process.env.CONSTANT_CONTACT_FROM_EMAIL,
        subject: subject || "Property Details",
        html_content: emailHtml
      }],
      physical_address_in_footer: {
        address_line1: process.env.BUSINESS_ADDRESS_LINE1,
        city: process.env.BUSINESS_CITY,
        state: process.env.BUSINESS_STATE,
        postal_code: process.env.BUSINESS_POSTAL_CODE
      }
    };

    const emailResponse = await axios.post(
      `${CONSTANT_CONTACT_API_BASE}/emails`,
      createCampaignPayload,
      { headers }
    );

    console.log('Email campaign created:', emailResponse.data);

    // Step 2: Get the primary email campaign activity
    const campaignId = emailResponse.data.campaign_id;
    const primaryActivity = emailResponse.data.campaign_activities.find(
      activity => activity.role === 'primary_email'
    );

    if (!primaryActivity) {
      throw new Error('Primary email campaign activity not found');
    }

    console.log('Using primary activity:', primaryActivity);

    // Step 3: Update the campaign activity with recipients
    const updatePayload = {
      contact_list_ids: [listId],
      from_email: process.env.CONSTANT_CONTACT_FROM_EMAIL,
      from_name: "Deal Dispo",
      reply_to_email: process.env.CONSTANT_CONTACT_FROM_EMAIL,
      subject: subject || "Property Details",
      html_content: emailHtml
    };

    await axios.put(
      `${CONSTANT_CONTACT_API_BASE}/emails/activities/${primaryActivity.campaign_activity_id}`,
      updatePayload,
      { headers }
    );

    // Step 4: Schedule the campaign
    const schedulePayload = {
      scheduled_date: new Date(Date.now() + 5 * 60 * 1000).toISOString() // Schedule 5 minutes from now
    };

    const scheduleResponse = await axios.post(
      `${CONSTANT_CONTACT_API_BASE}/emails/activities/${primaryActivity.campaign_activity_id}/schedules`,
      schedulePayload,
      { headers }
    );

    res.json({
      message: 'Email campaign created and scheduled successfully',
      campaignId: campaignId,
      activityId: primaryActivity.campaign_activity_id,
      scheduleId: scheduleResponse.data.schedule_id
    });

  } catch (error: any) {
    if (error.message === 'No access token available. Please authenticate first by visiting /auth/constantcontact') {
      res.status(401).json({
        error: 'Authentication required',
        details: 'Please visit http://localhost:3000/auth/constantcontact to authenticate with Constant Contact'
      });
      return;
    }

    console.error('Email campaign error:', error.response?.data || error);
    res.status(error.response?.status || 500).json({
      error: 'Failed to process email campaign',
      details: error.response?.data || error.message
    });
  }
});

// Payment Routes
app.post('/api/process-payment', async (req, res) => {
  try {
    const { sourceId, amount } = req.body;
    
    const payment = await squareClient.paymentsApi.createPayment({
      sourceId,
      idempotencyKey: crypto.randomUUID(),
      amountMoney: {
        amount: BigInt(amount),
        currency: 'USD'
      }
    });

    const paymentString = JSON.stringify(payment.result, (_, value) =>
      typeof value === 'bigint' ? value.toString() : value
    );

    res.json(JSON.parse(paymentString));
  } catch (error) {
    console.error('Payment failed:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Payment processing failed'
    });
  }
});

// Basic error handling
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Default route
app.get('/', (req: Request, res: Response) => {
  res.send('Server is running');
});

app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`);
});
