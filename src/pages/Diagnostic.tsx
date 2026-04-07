import { useEffect, useState } from "react";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default function DiagnosticPage() {
  const [checks, setChecks] = useState({
    envVars: { status: 'checking', message: '' },
    backend: { status: 'checking', message: '' },
    token: { status: 'checking', message: '' },
  });

  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = async () => {
    // Check 1: Environment Variables
    const apiUrl = import.meta.env.VITE_API_URL;
    const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiUrl || apiUrl.includes('localhost')) {
      setChecks(prev => ({
        ...prev,
        envVars: {
          status: 'error',
          message: `API URL not set or pointing to localhost: ${apiUrl || 'undefined'}`
        }
      }));
    } else if (!geminiKey) {
      setChecks(prev => ({
        ...prev,
        envVars: {
          status: 'warning',
          message: `API URL OK (${apiUrl}), but Gemini key missing`
        }
      }));
    } else {
      setChecks(prev => ({
        ...prev,
        envVars: {
          status: 'success',
          message: `API URL: ${apiUrl}, Gemini Key: SET`
        }
      }));
    }

    // Check 2: Backend Connection
    try {
      const response = await fetch(`${apiUrl || 'https://chainflowbackend.onrender.com/api'}/health`);
      if (response.ok) {
        const data = await response.json();
        setChecks(prev => ({
          ...prev,
          backend: {
            status: 'success',
            message: `Backend online: ${data.status}, DB: ${data.db}`
          }
        }));
      } else {
        setChecks(prev => ({
          ...prev,
          backend: {
            status: 'error',
            message: `Backend returned ${response.status}`
          }
        }));
      }
    } catch (error) {
      setChecks(prev => ({
        ...prev,
        backend: {
          status: 'error',
          message: `Cannot reach backend: ${error}`
        }
      }));
    }

    // Check 3: Token
    const token = localStorage.getItem('cf_token');
    const user = localStorage.getItem('cf_user');
    
    if (token && user) {
      setChecks(prev => ({
        ...prev,
        token: {
          status: 'success',
          message: `Token and user data present`
        }
      }));
    } else {
      setChecks(prev => ({
        ...prev,
        token: {
          status: 'warning',
          message: 'Not logged in (this is OK if you just opened the app)'
        }
      }));
    }
  };

  const getIcon = (status: string) => {
    if (status === 'success') return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (status === 'error') return <XCircle className="h-5 w-5 text-red-500" />;
    if (status === 'warning') return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    return <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />;
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">TrackFlow Diagnostics</h1>
        <p className="text-muted-foreground mb-8">Checking your app configuration...</p>

        <div className="space-y-4">
          {Object.entries(checks).map(([key, check]) => (
            <div key={key} className="glass-card rounded-lg p-4 flex items-start gap-4">
              {getIcon(check.status)}
              <div className="flex-1">
                <h3 className="font-semibold capitalize mb-1">
                  {key === 'envVars' ? 'Environment Variables' : key === 'backend' ? 'Backend Connection' : 'Authentication'}
                </h3>
                <p className="text-sm text-muted-foreground">{check.message}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 glass-card rounded-lg p-6">
          <h3 className="font-semibold mb-4">Quick Fixes:</h3>
          <div className="space-y-3 text-sm">
            {checks.envVars.status === 'error' && (
              <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/40 rounded-lg">
                <p className="font-semibold text-red-600 mb-2">❌ Environment Variables Not Set</p>
                <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                  <li>Go to Vercel Dashboard</li>
                  <li>Add VITE_API_URL=https://chainflowbackend.onrender.com/api</li>
                  <li>Add VITE_GEMINI_API_KEY=AIzaSyDa61I3jcl2lRHzfGnjbFctp1Qi1q_eDVs</li>
                  <li>Redeploy</li>
                </ol>
              </div>
            )}

            {checks.backend.status === 'error' && (
              <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/40 rounded-lg">
                <p className="font-semibold text-red-600 mb-2">❌ Backend Not Responding</p>
                <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                  <li>Visit: https://chainflowbackend.onrender.com/api/health</li>
                  <li>Wait 30-60 seconds for backend to wake up</li>
                  <li>Refresh this page</li>
                </ol>
              </div>
            )}

            {checks.envVars.status === 'success' && checks.backend.status === 'success' && (
              <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/40 rounded-lg">
                <p className="font-semibold text-green-600 mb-2">✅ Everything looks good!</p>
                <p className="text-muted-foreground">You can now use the app normally.</p>
                <a href="/login" className="text-primary hover:underline mt-2 inline-block">Go to Login →</a>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={runDiagnostics}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
          >
            Run Diagnostics Again
          </button>
        </div>
      </div>
    </div>
  );
}
