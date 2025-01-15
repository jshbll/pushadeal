declare global {
  interface Window {
    Square: any;
  }
}

export const loadSquareSdk = async () => {
  try {
    const SQUARE_APP_ID = import.meta.env.VITE_SQUARE_APPLICATION_ID;
    const SQUARE_LOCATION_ID = import.meta.env.VITE_SQUARE_LOCATION_ID;
    const isDevelopment = import.meta.env.DEV;

    if (!SQUARE_APP_ID || !SQUARE_LOCATION_ID) {
      console.error('Square credentials:', { SQUARE_APP_ID, SQUARE_LOCATION_ID });
      throw new Error('Square credentials are not properly configured');
    }

    // Check if we're in a secure context
    if (!window.isSecureContext) {
      console.warn('Application is not running in a secure context. Square SDK requires HTTPS.');
      if (isDevelopment) {
        console.info('Please restart the development server with HTTPS enabled.');
      }
      throw new Error('Square SDK requires HTTPS');
    }

    // Check if Square is already loaded
    if (window.Square) {
      console.log('Square SDK already loaded');
      return window.Square.payments(SQUARE_APP_ID, SQUARE_LOCATION_ID);
    }

    // Load the Square script
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = isDevelopment 
        ? 'https://sandbox.web.squarecdn.com/v1/square.js'
        : 'https://web.squarecdn.com/v1/square.js';
      script.async = true;
      
      script.onload = async () => {
        try {
          // Give a small delay for Square to initialize
          await new Promise(resolve => setTimeout(resolve, 500));
          
          if (!window.Square) {
            throw new Error('Square SDK not loaded properly');
          }

          const payments = await window.Square.payments(SQUARE_APP_ID, SQUARE_LOCATION_ID);
          console.log('Square payments initialized successfully');
          resolve(payments);
        } catch (err) {
          console.error('Error initializing Square payments:', err);
          reject(err);
        }
      };

      script.onerror = () => {
        reject(new Error('Failed to load Square SDK script'));
      };

      document.body.appendChild(script);
    });
  } catch (error) {
    console.error('Square SDK loading error:', error);
    throw error;
  }
};
