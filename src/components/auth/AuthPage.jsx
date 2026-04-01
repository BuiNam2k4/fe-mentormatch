import React, { useState } from 'react'
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react'
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { useAuth } from "../../contexts/AuthContext"
import { useNavigate } from 'react-router-dom'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const { login, register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      if (isLogin) {
        const result = await login(userName, password)
        if (result.success) {
          if (userName.toLowerCase().includes('admin')) {
             window.location.href = '/admin'; 
          } else {
             navigate('/feed')
          }
        } else {
          setError(result.message)
        }
      } else {
        const result = await register(userName, email, password)
        if (result.success) {
          alert('Đăng ký thành công! Vui lòng đăng nhập.')
          setIsLogin(true)
        } else {
          setError(result.message)
        }
      }
    } catch (err) {
      console.error(err)
      setError('Đã xảy ra lỗi hệ thống.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Dots Pattern (Subtle) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 relative z-10">
        
        {/* Header Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-[#2b1d4c] rounded-xl flex items-center justify-center mb-4 shadow-sm">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[#2b1d4c] mb-2">MentorMatch</h1>
          <p className="text-sm text-slate-500">Kết nối tri thức, định hướng tương lai</p>
        </div>

        {/* Tabs Toggle */}
        <div className="flex w-full mb-8 border-b border-slate-200">
          <button 
            type="button"
            onClick={() => { setIsLogin(true); setError(''); }}
            className={`flex-1 pb-3 text-sm font-semibold transition-all ${isLogin ? 'text-[#372660] border-b-2 border-[#372660]' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Đăng nhập
          </button>
          <button 
            type="button"
            onClick={() => { setIsLogin(false); setError(''); }}
            className={`flex-1 pb-3 text-sm font-semibold transition-all ${!isLogin ? 'text-[#372660] border-b-2 border-[#372660]' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Đăng ký
          </button>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm font-medium rounded-lg text-center break-words">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Form Fields */}
          <div className="space-y-4">
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Tên đăng nhập (Username)</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input 
                  type="text" 
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Nhập username của bạn..." 
                  className="pl-10 bg-slate-50 border-slate-200 focus-visible:ring-[#372660]"
                  required
                />
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com" 
                    className="pl-10 bg-slate-50 border-slate-200 focus-visible:ring-[#372660]"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-700">Mật khẩu</label>
                {isLogin && <a href="#" className="text-xs font-semibold text-[#372660] hover:underline">Quên mật khẩu?</a>}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="pl-10 pr-10 bg-slate-50 border-slate-200 tracking-widest font-medium focus-visible:ring-[#372660]"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Main Submit Button */}
          <Button type="submit" disabled={isLoading} className="w-full mt-6 bg-[#372660] hover:bg-[#2b1d4c] text-white py-6 rounded-xl font-semibold text-base transition-colors shadow-md shadow-[#372660]/20 disabled:opacity-70 disabled:cursor-not-allowed">
            {isLoading ? 'Đang xử lý...' : (isLogin ? 'Đăng nhập' : 'Tạo tài khoản')}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-slate-400 font-medium">Hoặc tiếp tục với</span>
          </div>
        </div>

        {/* Google Login */}
        <Button variant="outline" className="w-full py-6 rounded-xl border-slate-200 hover:bg-slate-50 text-slate-700 font-medium transition-colors">
          <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
            <path d="M1 1h22v22H1z" fill="none" />
          </svg>
          Google
        </Button>

        {/* Footer Link */}
        <p className="mt-8 text-center text-sm text-slate-600">
          {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}{" "}
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="font-bold text-[#372660] hover:underline"
          >
            {isLogin ? "Tạo tài khoản ngay" : "Đăng nhập ngay"}
          </button>
        </p>
      </div>
    </div>
  )
}
