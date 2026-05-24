import { useState, useEffect, useCallback } from "react";
import { getProfile, updateProfileCurrency } from "@/lib/profiles";

const SUPPORTED_CURRENCIES = ["IDR", "USD", "EUR", "SGD", "JPY", "MYR", "GBP", "AUD"];

interface CurrencyState {
  baseCurrency: string;
  rates: Record<string, number>;
  isLoading: boolean;
}

// Format number automatically based on locale logic
export function formatCurrency(amount: number, currencyCode: string): string {
  // If IDR, no decimals typically
  const isIDR = currencyCode === "IDR";
  const isJPY = currencyCode === "JPY";
  
  return new Intl.NumberFormat(currencyCode === "IDR" ? "id-ID" : "en-US", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: isIDR || isJPY ? 0 : 2,
    maximumFractionDigits: isIDR || isJPY ? 0 : 2,
  }).format(amount);
}

export function useCurrency() {
  const [state, setState] = useState<CurrencyState>({
    baseCurrency: "IDR",
    rates: { IDR: 1 },
    isLoading: true,
  });

  // Load preferences and rates
  useEffect(() => {
    let mounted = true;
    
    async function init() {
      // 1. Fetch user's preferred currency
      const profile = await getProfile();
      const preferred = profile?.preferred_currency || "IDR";
      
      // 2. Fetch exchange rates (using IDR as base for easier calculation)
      // Usually exchangerate-api gives rates relative to a base like USD.
      // We will fetch based on IDR or USD and normalize to IDR.
      try {
        // Fetch from exchangerate-api (Using USD as base is standard for free tiers)
        const res = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
        const data = await res.json();
        
        if (mounted && data && data.rates) {
          // Normalize rates relative to IDR
          // If 1 USD = 16000 IDR, then IDR base means IDR = 1, USD = 1/16000
          const usdToIdr = data.rates["IDR"];
          const normalizedRates: Record<string, number> = {};
          
          SUPPORTED_CURRENCIES.forEach(c => {
            if (c === "IDR") {
              normalizedRates[c] = 1;
            } else if (c === "USD") {
              normalizedRates[c] = 1 / usdToIdr;
            } else {
              // 1 USD = X EUR. So 1 IDR = X EUR / usdToIdr
              normalizedRates[c] = data.rates[c] / usdToIdr;
            }
          });
          
          setState({
            baseCurrency: preferred,
            rates: normalizedRates,
            isLoading: false
          });
        }
      } catch (err) {
        console.error("Failed to fetch rates:", err);
        if (mounted) {
          setState(s => ({ ...s, baseCurrency: preferred, isLoading: false }));
        }
      }
    }
    
    init();
    
    return () => { mounted = false; };
  }, []);

  const changeCurrency = useCallback(async (currency: string) => {
    if (!SUPPORTED_CURRENCIES.includes(currency)) return;
    
    // Optimistic update
    setState(s => ({ ...s, baseCurrency: currency }));
    
    // Persist to DB
    await updateProfileCurrency(currency);
  }, []);

  // Convert an IDR value to the selected base currency
  const convertFromIDR = useCallback((amountIDR: number) => {
    const rate = state.rates[state.baseCurrency] || 1;
    return amountIDR * rate; // Since rate is e.g. 1/16000 for USD
  }, [state.rates, state.baseCurrency]);

  return {
    ...state,
    SUPPORTED_CURRENCIES,
    changeCurrency,
    convertFromIDR,
    formatCurrency,
  };
}
