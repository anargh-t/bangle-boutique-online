import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';

const Debug = () => {
  const [envStatus, setEnvStatus] = useState<{
    supabaseUrl: boolean;
    supabaseKey: boolean;
  }>({
    supabaseUrl: false,
    supabaseKey: false,
  });
  const [connectionStatus, setConnectionStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [connectionError, setConnectionError] = useState<string>('');
  const [testQuery, setTestQuery] = useState<{ success: boolean; data: any; error: any } | null>(null);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);

  useEffect(() => {
    // Capture console logs
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    console.log = (...args) => {
      originalLog(...args);
      setConsoleLogs(prev => [...prev, `LOG: ${args.join(' ')}`]);
    };

    console.error = (...args) => {
      originalError(...args);
      setConsoleLogs(prev => [...prev, `ERROR: ${args.join(' ')}`]);
    };

    console.warn = (...args) => {
      originalWarn(...args);
      setConsoleLogs(prev => [...prev, `WARN: ${args.join(' ')}`]);
    };

    checkEnvironment();
    testConnection();

    return () => {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);

  const checkEnvironment = () => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    console.log('Checking environment variables...');
    console.log('VITE_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing');
    console.log('VITE_SUPABASE_ANON_KEY:', supabaseKey ? 'Set' : 'Missing');

    setEnvStatus({
      supabaseUrl: !!supabaseUrl,
      supabaseKey: !!supabaseKey,
    });
  };

  const testConnection = async () => {
    setConnectionStatus('loading');
    console.log('Testing Supabase connection...');
    
    try {
      console.log('Attempting to query products table...');
      const { data, error } = await supabase.from('products').select('id').limit(1);
      
      console.log('Query result:', { data, error });
      
      if (error) {
        console.error('Supabase query error:', error);
        setConnectionStatus('error');
        setConnectionError(error.message);
      } else {
        console.log('Supabase query successful:', data);
        setConnectionStatus('success');
        setTestQuery({ success: true, data, error: null });
      }
    } catch (err: any) {
      console.error('Exception during Supabase query:', err);
      setConnectionStatus('error');
      setConnectionError(err.message || 'Unknown error');
    }
  };

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : (
      <XCircle className="h-5 w-5 text-red-500" />
    );
  };

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case 'loading':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getConnectionText = () => {
    switch (connectionStatus) {
      case 'loading':
        return 'Testing connection...';
      case 'success':
        return 'Connected successfully';
      case 'error':
        return 'Connection failed';
      default:
        return 'Unknown status';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Debug Information</h1>
          
          <div className="grid gap-6">
            {/* Environment Variables */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Environment Variables
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">VITE_SUPABASE_URL</span>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(envStatus.supabaseUrl)}
                      <Badge variant={envStatus.supabaseUrl ? 'default' : 'destructive'}>
                        {envStatus.supabaseUrl ? 'Set' : 'Missing'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">VITE_SUPABASE_ANON_KEY</span>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(envStatus.supabaseKey)}
                      <Badge variant={envStatus.supabaseKey ? 'default' : 'destructive'}>
                        {envStatus.supabaseKey ? 'Set' : 'Missing'}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                {(!envStatus.supabaseUrl || !envStatus.supabaseKey) && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h3 className="font-medium text-yellow-800 mb-2">Missing Environment Variables</h3>
                    <p className="text-sm text-yellow-700 mb-3">
                      You need to create a <code className="bg-yellow-100 px-1 rounded">.env</code> file in your project root with the following variables:
                    </p>
                    <pre className="text-xs bg-yellow-100 p-3 rounded overflow-x-auto">
{`VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key`}
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Connection Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getConnectionIcon()}
                  Database Connection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-4">
                  <span className="font-medium">Status</span>
                  <div className="flex items-center gap-2">
                    {getConnectionIcon()}
                    <Badge variant={connectionStatus === 'success' ? 'default' : connectionStatus === 'error' ? 'destructive' : 'secondary'}>
                      {getConnectionText()}
                    </Badge>
                  </div>
                </div>
                
                {connectionStatus === 'error' && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
                    <h3 className="font-medium text-red-800 mb-2">Connection Error</h3>
                    <p className="text-sm text-red-700 mb-2">{connectionError}</p>
                    <p className="text-sm text-red-700">
                      This usually means either:
                    </p>
                    <ul className="text-sm text-red-700 mt-2 list-disc list-inside space-y-1">
                      <li>Your environment variables are incorrect</li>
                      <li>Your Supabase project is not accessible</li>
                      <li>Your database tables don't exist yet</li>
                    </ul>
                  </div>
                )}
                
                <Button onClick={testConnection} disabled={connectionStatus === 'loading'}>
                  {connectionStatus === 'loading' ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Testing...
                    </>
                  ) : (
                    'Test Connection Again'
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Test Query Results */}
            {testQuery && (
              <Card>
                <CardHeader>
                  <CardTitle>Test Query Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium mb-2">Query: SELECT id FROM products LIMIT 1</h3>
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium">Success:</span>
                        <Badge variant={testQuery.success ? 'default' : 'destructive'} className="ml-2">
                          {testQuery.success ? 'Yes' : 'No'}
                        </Badge>
                      </div>
                      {testQuery.error && (
                        <div>
                          <span className="font-medium">Error:</span>
                          <span className="text-red-600 ml-2">{testQuery.error}</span>
                        </div>
                      )}
                      <div>
                        <span className="font-medium">Data:</span>
                        <pre className="text-xs bg-white p-2 rounded mt-1 overflow-x-auto">
                          {JSON.stringify(testQuery.data, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Console Logs */}
            <Card>
              <CardHeader>
                <CardTitle>Console Logs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium mb-2">Recent Console Output</h3>
                  <div className="max-h-40 overflow-y-auto">
                    {consoleLogs.length === 0 ? (
                      <p className="text-sm text-gray-500">No console logs yet...</p>
                    ) : (
                      <pre className="text-xs bg-white p-2 rounded overflow-x-auto">
                        {consoleLogs.join('\n')}
                      </pre>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle>Next Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-medium text-blue-800 mb-2">1. Set Environment Variables</h3>
                    <p className="text-sm text-blue-700">
                      Create a <code className="bg-blue-100 px-1 rounded">.env</code> file with your Supabase credentials.
                    </p>
                  </div>
                  
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <h3 className="font-medium text-green-800 mb-2">2. Create Database Tables</h3>
                    <p className="text-sm text-green-700">
                      Run the SQL commands from <code className="bg-green-100 px-1 rounded">database-schema.sql</code> in your Supabase SQL Editor.
                    </p>
                  </div>
                  
                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <h3 className="font-medium text-purple-800 mb-2">3. Test the Application</h3>
                    <p className="text-sm text-purple-700">
                      Once everything is set up, go back to the home page and test the featured products.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Debug;
