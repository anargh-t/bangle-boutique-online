import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/components/ui/sonner';
import { Loader2, Lock, Mail, Eye, EyeOff, Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { signIn, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already logged in and is admin
  React.useEffect(() => {
    if (isAdmin) {
      const from = location.state?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    }
  }, [isAdmin, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        setError(error.message);
        toast.error('Login failed');
      } else {
        toast.success('Login successful!');
        const from = location.state?.from?.pathname || '/admin';
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      toast.error('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
                 <div className="text-center mb-8">
           <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
             <Shield className="w-8 h-8 text-primary" />
           </div>
         </div>

        <Card className="shadow-xl border-0">
                     <CardHeader className="text-center pb-4">
           </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

                             <div className="space-y-2">
                 <Label htmlFor="email">Username</Label>
                 <div className="relative">
                   <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                   <Input
                     id="email"
                     type="text"
                     placeholder="Enter username"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     className="pl-10"
                     required
                     disabled={isLoading}
                   />
                 </div>
               </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

                         <div className="mt-6 text-center">
               <div className="mt-4">
                 <Button
                   variant="link"
                   onClick={() => {}}
                   className="text-primary hover:text-primary/80"
                 >
                   Don't have an account? Sign up
                 </Button>
               </div>
             </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Button
            variant="link"
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;

