import React from "react";
import { Clock, MapPin, Coffee, Utensils, Camera, PartyPopper, ShoppingBag, CheckCircle, Bus, Heart } from "lucide-react";

export default function Itinerary() {
  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-orange-600/30 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-white/20 shadow-sm mb-3">
              <MapPin className="w-3.5 h-3.5" />
              <span>Nghệ An</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight">Lịch Trình Du Lịch Hè 2026</h1>
            <p className="mt-2 text-amber-50 font-medium text-sm max-w-xl">
              Chuyến đi biển Nghệ An kéo dài 3 ngày 2 đêm hứa hẹn mang lại những giây phút thư giãn, vui vẻ và gắn kết cho toàn thể đại gia đình. 
              <br />
              <strong>Điểm tập trung:</strong> Sảnh tòa nhà trung tâm Bệnh viện.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 shrink-0 text-center min-w-[140px]">
            <p className="text-[10px] uppercase font-black tracking-widest text-amber-100">Thời Gian</p>
            <p className="text-xl font-black mt-1">10/07 - 12/07</p>
            <p className="text-xs font-semibold text-orange-200 mt-0.5">3 Ngày 2 Đêm</p>
          </div>
        </div>
      </div>

      {/* Itinerary Timeline */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Day 1 */}
        <div className="p-6 md:p-8 border-b border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <span className="font-black text-xl">1</span>
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Ngày 1: Khởi hành đi Nghệ An</h2>
              <p className="text-xs font-bold text-blue-600">Thứ Sáu, 10/07/2026</p>
            </div>
          </div>
          
          <div className="relative pl-6 md:pl-8 space-y-8 before:absolute before:inset-y-2 before:left-[11px] md:before:left-[19px] before:w-0.5 before:bg-slate-100">
            {/* 12h00 */}
            <div className="relative">
              <div className="absolute -left-[30px] md:-left-[38px] w-4 h-4 rounded-full bg-white border-2 border-blue-500 z-10 mt-1"></div>
              <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                <div className="sm:w-24 shrink-0 mt-0.5 flex items-center gap-1.5 text-blue-600 font-black text-sm">
                  <Clock className="w-4 h-4" />
                  12:00
                </div>
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex-1 hover:border-blue-200 transition-colors">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    Xe xuất phát từ Bệnh viện <Bus className="w-4 h-4 text-slate-400" />
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Tập trung tại sảnh tòa nhà trung tâm. Điểm danh và lên xe di chuyển đi Nghệ An.</p>
                </div>
              </div>
            </div>

            {/* 19h00 */}
            <div className="relative">
              <div className="absolute -left-[30px] md:-left-[38px] w-4 h-4 rounded-full bg-white border-2 border-amber-500 z-10 mt-1"></div>
              <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                <div className="sm:w-24 shrink-0 mt-0.5 flex items-center gap-1.5 text-amber-600 font-black text-sm">
                  <Clock className="w-4 h-4" />
                  19:00
                </div>
                <div className="bg-amber-50/50 border border-amber-100/60 p-4 rounded-2xl flex-1 hover:border-amber-200 transition-colors">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    Ăn tối tại Resort <Utensils className="w-3.5 h-3.5 text-amber-600" />
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Đoàn dùng bữa tối ngon miệng tại nhà hàng trong khuôn viên Resort và nghỉ ngơi sau chuyến đi dài.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Day 2 */}
        <div className="p-6 md:p-8 border-b border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#059669] flex items-center justify-center shrink-0">
              <span className="font-black text-xl">2</span>
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Ngày 2: Tham quan & Gala Dinner</h2>
              <p className="text-xs font-bold text-[#059669]">Thứ Bảy, 11/07/2026</p>
            </div>
          </div>
          
          <div className="relative pl-6 md:pl-8 space-y-8 before:absolute before:inset-y-2 before:left-[11px] md:before:left-[19px] before:w-0.5 before:bg-slate-100">
            {/* 06h00 */}
            <div className="relative">
              <div className="absolute -left-[30px] md:-left-[38px] w-4 h-4 rounded-full bg-white border-2 border-emerald-500 z-10 mt-1"></div>
              <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                <div className="sm:w-24 shrink-0 mt-0.5 flex items-center gap-1.5 text-emerald-600 font-black text-sm">
                  <Clock className="w-4 h-4" />
                  06:00
                </div>
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex-1 hover:border-emerald-200 transition-colors">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    Ăn sáng <Coffee className="w-3.5 h-3.5 text-slate-400" />
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Đoàn thức dậy sớm tận hưởng không khí biển và dùng bữa sáng tại Resort.</p>
                </div>
              </div>
            </div>
            
            {/* 08h30 */}
            <div className="relative">
              <div className="absolute -left-[30px] md:-left-[38px] w-4 h-4 rounded-full bg-white border-2 border-sky-500 z-10 mt-1"></div>
              <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                <div className="sm:w-24 shrink-0 mt-0.5 flex items-center gap-1.5 text-sky-600 font-black text-sm">
                  <Clock className="w-4 h-4" />
                  08:30
                </div>
                <div className="bg-sky-50/50 border border-sky-100/60 p-4 rounded-2xl flex-1 hover:border-sky-200 transition-colors">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    Di chuyển tham quan <Camera className="w-3.5 h-3.5 text-sky-600" />
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Lên xe tham quan Đền Cờn, Hang Mắt Rồng và các địa điểm nổi tiếng theo lịch trình. Chụp ảnh lưu niệm cùng đoàn.</p>
                </div>
              </div>
            </div>

            {/* 11h00 */}
            <div className="relative">
              <div className="absolute -left-[30px] md:-left-[38px] w-4 h-4 rounded-full bg-white border-2 border-amber-500 z-10 mt-1"></div>
              <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                <div className="sm:w-24 shrink-0 mt-0.5 flex items-center gap-1.5 text-amber-600 font-black text-sm">
                  <Clock className="w-4 h-4" />
                  11:00
                </div>
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex-1 hover:border-amber-200 transition-colors">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    Xe di chuyển về Resort ăn trưa <Utensils className="w-3.5 h-3.5 text-amber-500" />
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Đoàn quay về Resort để dùng bữa trưa và nạp lại năng lượng.</p>
                </div>
              </div>
            </div>

            {/* Buổi chiều */}
            <div className="relative">
              <div className="absolute -left-[30px] md:-left-[38px] w-4 h-4 rounded-full bg-white border-2 border-indigo-500 z-10 mt-1"></div>
              <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                <div className="sm:w-24 shrink-0 mt-0.5 flex items-center gap-1.5 text-indigo-600 font-black text-sm">
                  <Clock className="w-4 h-4" />
                  Chiều
                </div>
                <div className="bg-indigo-50/50 border border-indigo-100/60 p-4 rounded-2xl flex-1 hover:border-indigo-200 transition-colors">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    Nghỉ trưa & Vui chơi tự do <Heart className="w-3.5 h-3.5 text-indigo-500" />
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Nghỉ ngơi tại phòng. Buổi chiều tự do tắm biển và tham gia các hoạt động vui chơi giải trí trong khuôn viên Resort.</p>
                </div>
              </div>
            </div>

            {/* 19h00 */}
            <div className="relative">
              <div className="absolute -left-[30px] md:-left-[38px] w-4 h-4 rounded-full bg-white border-2 border-purple-500 z-10 mt-1"></div>
              <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                <div className="sm:w-24 shrink-0 mt-0.5 flex items-center gap-1.5 text-purple-600 font-black text-sm">
                  <Clock className="w-4 h-4" />
                  19:00
                </div>
                <div className="bg-purple-50 border border-purple-200 p-4 rounded-2xl flex-1 shadow-sm">
                  <h3 className="font-bold text-purple-900 text-sm flex items-center gap-2">
                    Gala Dinner tại Resort <PartyPopper className="w-4 h-4 text-purple-600" />
                  </h3>
                  <p className="text-xs text-purple-700 mt-1 font-medium">Chương trình Gala Dinner bùng nổ: Giao lưu, liên hoan ẩm thực, ca nhạc và vô số phần quà hấp dẫn!</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Day 3 */}
        <div className="p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
              <span className="font-black text-xl">3</span>
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Ngày 3: Mua sắm & Trở về Hà Nội</h2>
              <p className="text-xs font-bold text-orange-600">Chủ Nhật, 12/07/2026</p>
            </div>
          </div>
          
          <div className="relative pl-6 md:pl-8 space-y-8 before:absolute before:inset-y-2 before:left-[11px] md:before:left-[19px] before:w-0.5 before:bg-slate-100">
            {/* 06h00 */}
            <div className="relative">
              <div className="absolute -left-[30px] md:-left-[38px] w-4 h-4 rounded-full bg-white border-2 border-orange-500 z-10 mt-1"></div>
              <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                <div className="sm:w-24 shrink-0 mt-0.5 flex items-center gap-1.5 text-orange-600 font-black text-sm">
                  <Clock className="w-4 h-4" />
                  06:00
                </div>
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex-1 hover:border-orange-200 transition-colors">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    Ăn sáng <Coffee className="w-3.5 h-3.5 text-slate-400" />
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Đoàn dùng bữa sáng ngày cuối cùng tại Resort.</p>
                </div>
              </div>
            </div>
            
            {/* 08h30 */}
            <div className="relative">
              <div className="absolute -left-[30px] md:-left-[38px] w-4 h-4 rounded-full bg-white border-2 border-rose-500 z-10 mt-1"></div>
              <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                <div className="sm:w-24 shrink-0 mt-0.5 flex items-center gap-1.5 text-rose-600 font-black text-sm">
                  <Clock className="w-4 h-4" />
                  08:30
                </div>
                <div className="bg-rose-50/50 border border-rose-100/60 p-4 rounded-2xl flex-1 hover:border-rose-200 transition-colors">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    Tự do đi chợ, mua sắm <ShoppingBag className="w-3.5 h-3.5 text-rose-500" />
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Thời gian lý tưởng để tự do đi dạo, mua sắm các loại hải sản đặc sản và đồ lưu niệm mang về làm quà cho người thân.</p>
                </div>
              </div>
            </div>

            {/* 11h00 */}
            <div className="relative">
              <div className="absolute -left-[30px] md:-left-[38px] w-4 h-4 rounded-full bg-white border-2 border-amber-500 z-10 mt-1"></div>
              <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                <div className="sm:w-24 shrink-0 mt-0.5 flex items-center gap-1.5 text-amber-600 font-black text-sm">
                  <Clock className="w-4 h-4" />
                  11:00
                </div>
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex-1 hover:border-amber-200 transition-colors">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    Ăn trưa <Utensils className="w-3.5 h-3.5 text-slate-400" />
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Đoàn dùng bữa trưa tại nhà hàng của Resort.</p>
                </div>
              </div>
            </div>

            {/* 12h00 */}
            <div className="relative">
              <div className="absolute -left-[30px] md:-left-[38px] w-4 h-4 rounded-full bg-white border-2 border-teal-500 z-10 mt-1"></div>
              <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                <div className="sm:w-24 shrink-0 mt-0.5 flex items-center gap-1.5 text-teal-600 font-black text-sm">
                  <Clock className="w-4 h-4" />
                  12:00
                </div>
                <div className="bg-teal-50/50 border border-teal-100/60 p-4 rounded-2xl flex-1 hover:border-teal-200 transition-colors">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    Checkout trả phòng <CheckCircle className="w-3.5 h-3.5 text-teal-600" />
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Kiểm tra lại hành lý, tư trang cá nhân và hoàn tất các thủ tục trả phòng tại lễ tân.</p>
                </div>
              </div>
            </div>

            {/* 12h30 */}
            <div className="relative">
              <div className="absolute -left-[30px] md:-left-[38px] w-4 h-4 rounded-full bg-white border-2 border-emerald-500 z-10 mt-1"></div>
              <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                <div className="sm:w-24 shrink-0 mt-0.5 flex items-center gap-1.5 text-emerald-600 font-black text-sm">
                  <Clock className="w-4 h-4" />
                  12:30
                </div>
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex-1 hover:border-emerald-200 transition-colors">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    Xe di chuyển về Hà Nội <Bus className="w-4 h-4 text-slate-400" />
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Đoàn tập trung lên xe, tạm biệt Nghệ An và bắt đầu hành trình trở về Hà Nội.</p>
                </div>
              </div>
            </div>

            {/* 18h00 */}
            <div className="relative">
              <div className="absolute -left-[30px] md:-left-[38px] w-4 h-4 rounded-full bg-emerald-500 border-2 border-emerald-200 z-10 mt-1"></div>
              <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                <div className="sm:w-24 shrink-0 mt-0.5 flex items-center gap-1.5 text-emerald-700 font-black text-sm">
                  <MapPin className="w-4 h-4" />
                  18:00
                </div>
                <div className="bg-emerald-600 border border-emerald-700 p-4 rounded-2xl flex-1 text-white shadow-md">
                  <h3 className="font-black text-sm flex items-center gap-2">
                    Về đến Hà Đông (Dự kiến)
                  </h3>
                  <p className="text-xs text-emerald-100 mt-1 font-medium">Xe về đến Hà Đông an toàn. Kết thúc chuyến du lịch hè 2026 với thật nhiều kỷ niệm đẹp và tiếng cười. Hẹn gặp lại vào những chuyến đi tiếp theo!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
