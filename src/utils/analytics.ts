// Google Analytics 4 integration
export const initializeAnalytics = () => {
  // Add your Google Analytics 4 tracking ID here
  const GA_TRACKING_ID = 'G-XXXXXXXXXX';
  
  if (typeof window !== 'undefined' && GA_TRACKING_ID !== 'G-XXXXXXXXXX') {
    // Load Google Analytics
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: GtagArguments) {
      window.dataLayer.push(args);
    }
    gtag('js', new Date());
    gtag('config', GA_TRACKING_ID, {
      page_title: document.title,
      page_location: window.location.href,
    });

    // Make gtag available globally
    (window.gtag as (...args: GtagArguments) => void)('config', GA_TRACKING_ID, {
      page_title: document.title,
      page_location: window.location.href,
    });

    // Make gtag available globally
    
  }
};

// Track page views
export const trackPageView = (path: string, title: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: path,
      page_title: title,
    });
  }
};

// Track events
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

interface ConfigParameters {
  page_title?: string;
  page_location?: string;
  page_path?: string;
}

interface EventParameters {
  event_category?: string;
  event_label?: string;
  value?: number;
}

type GtagArguments =
  | ['js', Date]
  | ['config', string, ConfigParameters?]
  | ['event', string, EventParameters?];

declare global {
  interface Window {
    dataLayer: GtagArguments[];
    gtag: (...args: GtagArguments) => void;
  }
}