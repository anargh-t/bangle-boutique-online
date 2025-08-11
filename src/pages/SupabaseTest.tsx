import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const SupabaseTest: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<string>('Testing...');
  const [envVars, setEnvVars] = useState<any>({});
  const [testResult, setTestResult] = useState<string>('');

  useEffect(() => {
    // Check environment variables
    setEnvVars({
      VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
      VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'SET (length: ' + import.meta.env.VITE_SUPABASE_ANON_KEY.length + ')' : 'NOT SET',
      MODE: import.meta.env.MODE,
      DEV: import.meta.env.DEV,
      PROD: import.meta.env.PROD
    });

    // Test Supabase connection
    const testConnection = async () => {
      try {
        setConnectionStatus('Testing connection...');
        
        // Test basic connection
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          setConnectionStatus(`Connection failed: ${error.message}`);
          setTestResult(`Error: ${error.message}`);
        } else {
          setConnectionStatus('Connection successful!');
          setTestResult(`Session data: ${JSON.stringify(data, null, 2)}`);
        }
      } catch (err: any) {
        setConnectionStatus(`Connection error: ${err.message}`);
        setTestResult(`Exception: ${err.message}`);
      }
    };

    testConnection();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Supabase Connection Test</h1>
          
          <div className="grid gap-6">
            {/* Environment Variables */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
              <div className="space-y-2">
                {Object.entries(envVars).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="font-medium">{key}:</span>
                    <span className="font-mono text-sm">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Connection Status */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
              <div className="p-4 bg-blue-50 rounded">
                <p className="font-medium">{connectionStatus}</p>
              </div>
            </div>

            {/* Test Result */}
            {testResult && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Test Result</h2>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                  {testResult}
                </pre>
              </div>
            )}

            {/* Manual Test */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Manual Test</h2>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Refresh Test
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupabaseTest;

