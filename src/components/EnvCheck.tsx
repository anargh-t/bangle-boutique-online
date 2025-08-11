import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

const EnvCheck = () => {
  const [envStatus, setEnvStatus] = useState<{
    supabaseUrl: boolean;
    supabaseKey: boolean;
    connection: boolean;
  }>({
    supabaseUrl: false,
    supabaseKey: false,
    connection: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkEnvironment = async () => {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      setEnvStatus(prev => ({
        ...prev,
        supabaseUrl: !!supabaseUrl,
        supabaseKey: !!supabaseKey,
      }));

      // Test Supabase connection
      try {
        const { data, error } = await supabase.from('products').select('id').limit(1);
        setEnvStatus(prev => ({
          ...prev,
          connection: !error,
        }));
      } catch (err) {
        setEnvStatus(prev => ({
          ...prev,
          connection: false,
        }));
      } finally {
        setIsLoading(false);
      }
    };

    checkEnvironment();
  }, []);

  if (isLoading) {
    return (
      <div className="fixed top-4 right-4 bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-lg z-50">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-sm text-blue-800">Checking environment...</span>
        </div>
      </div>
    );
  }

  const allGood = envStatus.supabaseUrl && envStatus.supabaseKey && envStatus.connection;

  if (allGood) {
    return (
      <div className="fixed top-4 right-4 bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg z-50">
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <span className="text-sm text-green-800">Environment OK</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg z-50 max-w-sm">
      <div className="flex items-start space-x-2">
        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
        <div className="text-sm text-red-800">
          <p className="font-medium mb-2">Environment Issues Detected:</p>
          <ul className="space-y-1">
            {!envStatus.supabaseUrl && (
              <li className="flex items-center space-x-2">
                <XCircle className="h-3 w-3 text-red-500" />
                <span>Missing VITE_SUPABASE_URL</span>
              </li>
            )}
            {!envStatus.supabaseKey && (
              <li className="flex items-center space-x-2">
                <XCircle className="h-3 w-3 text-red-500" />
                <span>Missing VITE_SUPABASE_ANON_KEY</span>
              </li>
            )}
            {!envStatus.connection && (
              <li className="flex items-center space-x-2">
                <XCircle className="h-3 w-3 text-red-500" />
                <span>Cannot connect to Supabase</span>
              </li>
            )}
          </ul>
          <p className="mt-2 text-xs">Check your .env file and database setup</p>
        </div>
      </div>
    </div>
  );
};

export default EnvCheck;

