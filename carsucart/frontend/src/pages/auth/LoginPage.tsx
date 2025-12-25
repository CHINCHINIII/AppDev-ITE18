import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

type Props = { role: 'buyer' | 'seller' | 'admin'; title?: string };

const LoginPage: React.FC<Props> = ({ role, title }) => {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <div className="card p-6 space-y-4">
        <h1 className="text-xl font-semibold">{title ?? `${role} Login`}</h1>
        <label className="text-sm">Email</label>
        <input
          className="rounded-lg border border-gray-200 px-3 py-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
        />
        <label className="text-sm">Password</label>
        <input
          className="rounded-lg border border-gray-200 px-3 py-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
        />
        <label className="text-sm flex items-center gap-2">
          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
          Remember me
        </label>
        <button
          className="btn-primary w-full"
          disabled={loading}
          onClick={() => login({ email, password, role, remember })}
        >
          {loading ? 'Signing in...' : 'Login'}
        </button>
        <a className="text-sm text-primary" href="/forgot-password">
          Forgot password?
        </a>
      </div>
    </div>
  );
};

export default LoginPage;

