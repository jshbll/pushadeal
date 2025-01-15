import { Client, Environment } from 'square';

const squareClient = new Client({
  accessToken: import.meta.env.VITE_SQUARE_ACCESS_TOKEN,
  environment: import.meta.env.MODE === 'production'
    ? Environment.Production 
    : Environment.Sandbox,
});

export async function processPayment(req: { sourceId: string; amount: number }) {
  try {
    console.log('Processing payment request:', req);
    const response = await fetch('http://localhost:3000/api/process-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req),
    });

    const data = await response.json();
    console.log('Payment response:', { status: response.status, data });

    if (!response.ok) {
      throw new Error(data.error || 'Payment failed');
    }

    return data;
  } catch (error: any) {
    console.error('Payment processing error:', error);
    throw error;
  }
}
