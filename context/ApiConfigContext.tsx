import React, { createContext, ReactNode } from 'react';

interface ApiConfigContextType {
  apiKey: string | undefined;
}

export const ApiConfigContext = createContext<ApiConfigContextType | undefined>(undefined);

export const ApiConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // As per instructions, the key MUST come from process.env.API_KEY.
  // This context serves as an abstraction layer.
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.error("API_KEY environment variable is not set. AI features will be disabled.");
  }

  return (
    <ApiConfigContext.Provider value={{ apiKey }}>
      {children}
    </ApiConfigContext.Provider>
  );
};
