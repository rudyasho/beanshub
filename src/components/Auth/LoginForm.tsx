import React, { useState } from 'react';
import { Coffee, User, Lock, Loader } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export default function LoginForm() {
  const { dispatch, services, state } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const mockCredentials = [
    { email: 'admin@beanshub.com', password: 'admin123' },
    { email: 'roaster@beanshub.com', password: 'roaster123' },
    { email: 'staff@beanshub.com', password: 'staff123' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Check mock credentials
      const validCredential = mockCredentials.find(
        cred => cred.email === email && cred.password === password
      );

      if (!validCredential) {
        setError('Email atau password salah');
        setIsLoading(false);
        return;
      }

      // Find user in Firestore
      const user = state.users.find(u => u.email === email);
      
      if (user) {
        // Update last login
        await services.users.update(user.id, {
          lastLogin: new Date()
        });

        dispatch({
          type: 'SET_USER',
          payload: {
            ...user,
            lastLogin: new Date()
          }
        });
      } else {
        setError('User tidak ditemukan dalam sistem');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Terjadi kesalahan saat login');
    } finally {
      setIsLoading(false);
    }
  };

  if (state.loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-12 w-12 animate-spin text-amber-600 mx-auto mb-4" />
          <p className="text-gray-600">Memuat aplikasi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-amber-600 rounded-full mb-4">
              <Coffee className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              BeansHub
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Sistem Manajemen Roastery Coffee House
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                  placeholder="Masukkan email Anda"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                  placeholder="Masukkan password Anda"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-amber-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader className="h-5 w-5 animate-spin" />
                  <span>Masuk...</span>
                </>
              ) : (
                <span>Masuk</span>
              )}
            </button>
          </form>

          <div className="mt-6 sm:mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-800 mb-2">Demo Akun:</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p><strong>Admin:</strong> admin@beanshub.com / admin123</p>
              <p><strong>Roaster:</strong> roaster@beanshub.com / roaster123</p>
              <p><strong>Staff:</strong> staff@beanshub.com / staff123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}