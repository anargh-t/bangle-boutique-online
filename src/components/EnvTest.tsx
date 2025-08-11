import React, { useEffect, useState } from 'react';

const EnvTest: React.FC = () => {
  const [envStatus, setEnvStatus] = useState<{
    VITE_SUPABASE_URL: string;
    VITE_SUPABASE_ANON_KEY: string;
    mode: string;
  }>({
    VITE_SUPABASE_URL: '',
    VITE_SUPABASE_ANON_KEY: '',
    mode: ''
  });

  useEffect(() => {
    setEnvStatus({
      VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || 'NOT SET',
      VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'SET (length: ' + import.meta.env.VITE_SUPABASE_ANON_KEY.length + ')' : 'NOT SET',
      mode: import.meta.env.MODE || 'unknown'
    });
  }, []);

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Environment Variables Test</h3>
      <div className="space-y-2">
        <div>
          <strong>Mode:</strong> {envStatus.mode}
        </div>
        <div>
          <strong>VITE_SUPABASE_URL:</strong> {envStatus.VITE_SUPABASE_URL}
        </div>
        <div>
          <strong>VITE_SUPABASE_ANON_KEY:</strong> {envStatus.VITE_SUPABASE_ANON_KEY}
        </div>
      </div>
    </div>
  );
};

export default EnvTest;

