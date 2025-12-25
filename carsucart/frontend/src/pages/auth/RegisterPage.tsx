import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import StarRating from '../../components/StarRating';

type Props = { role: 'buyer' | 'seller'; title?: string };

const RegisterPage: React.FC<Props> = ({ role, title }) => {
  const { register, loading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [contact, setContact] = useState('');
  const [storeName, setStoreName] = useState('');
  const [terms, setTerms] = useState(false);
  const [strength, setStrength] = useState(3);

  const submit = async () => {
    if (!terms) return;
    await register({
      role,
      name,
      email,
      password,
      password_confirmation: confirm,
      contact_no: contact,
      store_name: role === 'seller' ? storeName : undefined,
    });
  };

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <div className="card p-6 space-y-4">
        <h1 className="text-xl font-semibold">{title ?? `${role} Registration`}</h1>
        <label className="text-sm">Full name</label>
        <input className="rounded-lg border border-gray-200 px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} />
        <label className="text-sm">Email</label>
        <input className="rounded-lg border border-gray-200 px-3 py-2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label className="text-sm flex items-center justify-between">
          Password <span className="text-xs text-gray-500">Strength</span>
        </label>
        <input
          className="rounded-lg border border-gray-200 px-3 py-2"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setStrength(Math.min(5, Math.max(1, Math.floor(e.target.value.length / 3))));
          }}
        />
        <StarRating value={strength} onChange={setStrength} />
        <label className="text-sm">Confirm password</label>
        <input className="rounded-lg border border-gray-200 px-3 py-2" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        <label className="text-sm">Contact number</label>
        <input className="rounded-lg border border-gray-200 px-3 py-2" value={contact} onChange={(e) => setContact(e.target.value)} />
        {role === 'seller' && (
          <>
            <label className="text-sm">Store name</label>
            <input className="rounded-lg border border-gray-200 px-3 py-2" value={storeName} onChange={(e) => setStoreName(e.target.value)} />
          </>
        )}
        <label className="text-sm flex items-center gap-2">
          <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} />
          I agree to the terms & conditions
        </label>
        <button className="btn-primary w-full" disabled={loading || !terms} onClick={submit}>
          {loading ? 'Submitting...' : 'Create account'}
        </button>
      </div>
    </div>
  );
};

export default RegisterPage;

