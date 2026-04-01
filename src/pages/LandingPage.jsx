import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, CheckCircle, CreditCard, Users, Star } from 'lucide-react'

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-[#372660] selection:text-white">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="#372660" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z" />
            </svg>
            <span className="text-2xl font-bold text-[#2b1d4c]">MentorMatch</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-[#372660] transition-colors">Features</a>
            <a href="#mentors" className="hover:text-[#372660] transition-colors">Mentors</a>
            <a href="#success" className="hover:text-[#372660] transition-colors">Success Stories</a>
            <a href="#about" className="hover:text-[#372660] transition-colors">About</a>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-[#372660] transition-colors">Login</Link>
            <Link to="/auth" className="text-sm font-bold bg-[#372660] text-white px-6 py-2.5 rounded-full hover:bg-[#2b1d4c] shadow-sm shadow-[#372660]/30 transition-all">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <p className="text-[#372660] font-bold text-xs tracking-widest uppercase mb-6 flex items-center justify-center gap-2">
            <span className="w-8 h-[2px] bg-[#372660]/30"></span>
            Mạng xã hội Mentor - Mentee Số 1
            <span className="w-8 h-[2px] bg-[#372660]/30"></span>
          </p>
          <h1 className="text-5xl md:text-6xl font-extrabold text-[#2b1d4c] leading-tight mb-6">
            Kết nối tài năng, <br />
            <span className="text-[#987dd1]">dẫn lối thành công</span>
          </h1>
          <p className="text-lg text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Nền tảng mạng xã hội kết nối Người học (Mentee) và Người hướng dẫn (Mentor) uy tín nhất Việt Nam.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <button 
              onClick={() => navigate('/auth')} 
              className="group flex items-center gap-2 bg-[#372660] text-white px-8 py-4 rounded-full font-bold text-base hover:bg-[#2b1d4c] transition-all shadow-lg shadow-[#372660]/30"
            >
              Bắt đầu hành trình của bạn ngay 
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Hero Images Overlap */}
          <div className="relative max-w-5xl mx-auto h-[400px] sm:h-[500px] w-full rounded-2xl">
            {/* Main Background Image */}
            <div className="absolute left-0 bottom-0 w-[80%] h-[90%] rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-50">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2670&auto=format&fit=crop" 
                alt="Mentorship Meeting" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
            
            {/* Overlapping Small Image */}
            <div className="absolute right-0 top-10 w-[45%] h-[60%] rounded-xl overflow-hidden shadow-2xl border-8 border-slate-50 z-10 tranform rotate-2 hover:rotate-0 transition-transform duration-500">
              <img 
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=2000&auto=format&fit=crop" 
                alt="Mentor Happy" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-50 px-4">
        <div className="container mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-[#2b1d4c]">Tại sao chọn MentorMatch?</h2>
            <div className="w-16 h-1.5 bg-[#372660] mt-4 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {/* Feature 1 */}
             <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl transition-shadow group">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <CheckCircle className="w-6 h-6 text-[#372660]" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Mentor Chuyên Nghiệp</h3>
                <p className="text-slate-500 leading-relaxed text-sm">
                  Hệ thống Mentor được kiểm duyệt kỹ lưỡng với hồ sơ kinh nghiệm từ các tập đoàn hàng đầu.
                </p>
             </div>
             
             {/* Feature 2 */}
             <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl transition-shadow group">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <CreditCard className="w-6 h-6 text-[#372660]" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Học Phí Linh Hoạt</h3>
                <p className="text-slate-500 leading-relaxed text-sm">
                  Nhiều gói mentorship từ miễn phí đến trả phí cao cấp, phù hợp với mọi lộ trình cá nhân.
                </p>
             </div>

             {/* Feature 3 */}
             <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl transition-shadow group">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6 text-[#372660]" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Cộng Đồng Sôi Động</h3>
                <p className="text-slate-500 leading-relaxed text-sm">
                  Kết nối không giới hạn với hàng nghìn mentee cùng mục tiêu, tạo dựng mạng lưới chuyên nghiệp.
                </p>
             </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-[#231542] text-white">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
           <div className="pt-8 md:pt-0">
              <h2 className="text-5xl font-extrabold mb-2 text-[#b096e6]">500+</h2>
              <p className="text-sm font-bold tracking-widest text-[#987dd1] uppercase">Mentor Uy Tín</p>
           </div>
           <div className="pt-8 md:pt-0">
              <h2 className="text-5xl font-extrabold mb-2 text-[#b096e6]">2000+</h2>
              <p className="text-sm font-bold tracking-widest text-[#987dd1] uppercase">Mentee Năng Động</p>
           </div>
           <div className="pt-8 md:pt-0">
              <h2 className="text-5xl font-extrabold mb-2 text-[#b096e6]">10,000+</h2>
              <p className="text-sm font-bold tracking-widest text-[#987dd1] uppercase">Ca Học Thành Công</p>
           </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="success" className="py-24 bg-slate-50 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#372660] font-bold text-xs tracking-widest uppercase mb-4">Câu chuyện thành công</p>
            <h2 className="text-3xl font-bold text-[#2b1d4c]">Người dùng nói gì về chúng tôi</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border-l-4 border-[#8b5cf6]">
               <div className="flex items-center gap-4 mb-6">
                 <img src="https://ui-avatars.com/api/?name=Minh+Anh&background=f3e8ff&color=7e22ce" alt="Minh Anh" className="w-12 h-12 rounded-full" />
                 <div>
                   <h4 className="font-bold text-slate-800">Minh Anh</h4>
                   <p className="text-xs text-slate-500">Marketing Executive</p>
                 </div>
               </div>
               <p className="text-sm italic text-slate-600 leading-relaxed">
                 "Nhờ MentorMatch, mình đã tìm được người dẫn dắt tuyệt vời giúp định hướng sự nghiệp trong ngành Marketing. Một nền tảng rất cần thiết!"
               </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border-l-4 border-[#3b82f6]">
               <div className="flex items-center gap-4 mb-6">
                 <img src="https://ui-avatars.com/api/?name=Trần+Long&background=dbeafe&color=1d4ed8" alt="Tran Long" className="w-12 h-12 rounded-full" />
                 <div>
                   <h4 className="font-bold text-slate-800">Trần Long</h4>
                   <p className="text-xs text-slate-500">Software Engineer</p>
                 </div>
               </div>
               <p className="text-sm italic text-slate-600 leading-relaxed">
                 "Các khóa học 1-kèm-1 tràn đầy cực kỳ chất lượng. Mentor có chuyên môn sâu và rất nhiệt tình chia sẻ kinh nghiệm thực chiến."
               </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border-l-4 border-[#ec4899]">
               <div className="flex items-center gap-4 mb-6">
                 <img src="https://ui-avatars.com/api/?name=Phương+Thảo&background=fce7f3&color=be185d" alt="Phuong Thao" className="w-12 h-12 rounded-full" />
                 <div>
                   <h4 className="font-bold text-slate-800">Phương Thảo</h4>
                   <p className="text-xs text-slate-500">UI/UX Designer</p>
                 </div>
               </div>
               <p className="text-sm italic text-slate-600 leading-relaxed">
                 "Mạng lưới mentor phong phú, cộng đồng luôn sẵn sàng hỗ trợ. Đây thực sự là nơi ươm mầm tài năng tuyệt vời nhất."
               </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-slate-50">
         <div className="container mx-auto">
            <div className="bg-gradient-to-br from-[#231542] to-[#3a226b] max-w-5xl mx-auto rounded-3xl p-12 md:p-20 text-center shadow-2xl relative overflow-hidden">
               {/* Decorative circles */}
               <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>
               <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
               
               <div className="relative z-10">
                 <h2 className="text-4xl font-bold text-white mb-6">Sẵn sàng bắt đầu chưa?</h2>
                 <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto">
                   Gia nhập cộng đồng MentorMatch ngay hôm nay để khai phá tiềm năng vô hạn của chính bạn.
                 </p>
                 <button 
                   onClick={() => navigate('/auth')} 
                   className="bg-white text-[#2b1d4c] px-10 py-4 rounded-full font-bold text-base hover:bg-slate-100 hover:scale-105 transition-all shadow-xl"
                 >
                   Đăng ký ngay
                 </button>
               </div>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 px-4">
         <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col items-center md:items-start gap-2">
               <div className="flex items-center gap-2">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#372660" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z" />
                  </svg>
                  <span className="text-xl font-bold text-[#2b1d4c]">MentorMatch</span>
               </div>
               <p className="text-xs text-slate-400">© 2026 MentorMatch. The Architectural Mentor.</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 text-xs font-semibold text-slate-500">
               <a href="#" className="hover:text-[#372660]">Privacy Policy</a>
               <a href="#" className="hover:text-[#372660]">Terms of Service</a>
               <a href="#" className="hover:text-[#372660]">Cookie Settings</a>
               <a href="#" className="hover:text-[#372660]">Contact Us</a>
            </div>
         </div>
      </footer>
    </div>
  )
}
