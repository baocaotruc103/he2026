import React from "react";
import { Clock, MapPin, Coffee, Utensils, Moon, Sun, Camera, Waves, Music, PartyPopper } from "lucide-react";

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
              <Sun className="w-3.5 h-3.5" />
              <span>Chương Trình Đặc Biệt</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight">Lịch Trình Nghỉ Hè 2026</h1>
            <p className="mt-2 text-amber-50 font-medium text-sm max-w-xl">
              Đại gia đình Khoa Hồi Sức Ngoại sẽ cùng nhau tận hưởng kỳ nghỉ dưỡng tuyệt vời tại bãi biển Quỳnh Nghĩa. 
              Dưới đây là lịch trình chi tiết trong 3 ngày 2 đêm của chuyến đi.
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
              <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Ngày 1: Thứ Sáu, 10/07/2026</h2>
              <p className="text-xs font-bold text-blue-600">Khởi hành & Khám phá Biển Quỳnh</p>
            </div>
          </div>
          
          <div className="relative pl-6 md:pl-8 space-y-8 before:absolute before:inset-y-2 before:left-[11px] md:before:left-[19px] before:w-0.5 before:bg-slate-100">
            {/* Event 1 */}
            <div className="relative">
              <div className="absolute -left-[30px] md:-left-[38px] w-4 h-4 rounded-full bg-white border-2 border-blue-500 z-10 mt-1"></div>
              <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                <div className="sm:w-24 shrink-0 mt-0.5 flex items-center gap-1.5 text-blue-600 font-black text-sm">
                  <Clock className="w-4 h-4" />
                  06:00
                </div>
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex-1">
                  <h3 className="font-bold text-slate-800 text-sm">Tập trung & Điểm danh</h3>
                  <p className="text-xs text-slate-500 mt-1">Tập trung tại cổng bệnh viện, ban tổ chức điểm danh theo danh sách xe. Mọi người nhận nước suối và đồ ăn nhẹ.</p>
                </div>
              </div>
            </div>
            
            {/* Event 2 */}
            <div className="relative">
              <div className="absolute -left-[30px] md:-left-[38px] w-4 h-4 rounded-full bg-white border-2 border-blue-500 z-10 mt-1"></div>
              <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                <div className="sm:w-24 shrink-0 mt-0.5 flex items-center gap-1.5 text-blue-600 font-black text-sm">
                  <Clock className="w-4 h-4" />
                  06:30
                </div>
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex-1">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    Khởi hành <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Xe di chuyển đi Quỳnh Lưu, Nghệ An. Dọc đường xe dừng chân nghỉ ngơi 20 phút.</p>
                </div>
              </div>
            </div>

            {/* Event 3 */}
            <div className="relative">
              <div className="absolute -left-[30px] md:-left-[38px] w-4 h-4 rounded-full bg-white border-2 border-amber-500 z-10 mt-1"></div>
              <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                <div className="sm:w-24 shrink-0 mt-0.5 flex items-center gap-1.5 text-amber-600 font-black text-sm">
                  <Clock className="w-4 h-4" />
                  12:00
                </div>
                <div className="bg-amber-50/50 border border-amber-100/60 p-4 rounded-2xl flex-1">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    Ăn trưa & Nhận phòng <Utensils className="w-3.5 h-3.5 text-amber-600" />
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Đoàn dùng bữa trưa tại nhà hàng. Sau đó làm thủ tục nhận phòng tại Ruby Star Beach Quỳnh Resort và nghỉ ngơi.</p>
                </div>
              </div>
            </div>

            {/* Event 4 */}
            <div className="relative">
              <div className="absolute -left-[30px] md:-left-[38px] w-4 h-4 rounded-full bg-white border-2 border-cyan-500 z-10 mt-1"></div>
              <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                <div className="sm:w-24 shrink-0 mt-0.5 flex items-center gap-1.5 text-cyan-600 font-black text-sm">
                  <Clock className="w-4 h-4" />
                  15:30
                </div>
                <div className="bg-cyan-50/50 border border-cyan-100/60 p-4 rounded-2xl flex-1">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    Teambuilding bãi biển <Waves className="w-3.5 h-3.5 text-cyan-600" />
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Tập trung tại bãi biển riêng của resort tham gia các trò chơi Teambuilding gắn kết tinh thần đồng đội. Sau đó tự do tắm biển, tham quan.</p>
                </div>
              </div>
            </div>

            {/* Event 5 */}
            <div className="relative">
              <div className="absolute -left-[30px] md:-left-[38px] w-4 h-4 rounded-full bg-white border-2 border-purple-500 z-10 mt-1"></div>
              <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                <div className="sm:w-24 shrink-0 mt-0.5 flex items-center gap-1.5 text-purple-600 font-black text-sm">
                  <Clock className="w-4 h-4" />
                  19:00
                </div>
                <div className="bg-purple-50/50 border border-purple-100/60 p-4 rounded-2xl flex-1">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    Gala Dinner & Giao lưu <PartyPopper className="w-3.5 h-3.5 text-purple-600" />
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Ăn tối Gala Dinner hoành tráng với các tiết mục văn nghệ, trò chơi sân khấu và bốc thăm trúng thưởng.</p>
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
              <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Ngày 2: Thứ Bảy, 11/07/2026</h2>
              <p className="text-xs font-bold text-[#059669]">Tham quan & Tự do</p>
            </div>
          </div>
          
          <div className="relative pl-6 md:pl-8 space-y-8 before:absolute before:inset-y-2 before:left-[11px] md:before:left-[19px] before:w-0.5 before:bg-slate-100">
            {/* Event 1 */}
            <div className="relative">
              <div className="absolute -left-[30px] md:-left-[38px] w-4 h-4 rounded-full bg-white border-2 border-emerald-500 z-10 mt-1"></div>
              <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                <div className="sm:w-24 shrink-0 mt-0.5 flex items-center gap-1.5 text-emerald-600 font-black text-sm">
                  <Clock className="w-4 h-4" />
                  07:00
                </div>
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex-1">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    Ăn sáng Buffet <Coffee className="w-3.5 h-3.5 text-slate-400" />
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Quý khách dùng điểm tâm sáng Buffet tại nhà hàng của resort.</p>
                </div>
              </div>
            </div>
            
            {/* Event 2 */}
            <div className="relative">
              <div className="absolute -left-[30px] md:-left-[38px] w-4 h-4 rounded-full bg-white border-2 border-emerald-500 z-10 mt-1"></div>
              <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                <div className="sm:w-24 shrink-0 mt-0.5 flex items-center gap-1.5 text-emerald-600 font-black text-sm">
                  <Clock className="w-4 h-4" />
                  08:30
                </div>
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex-1">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    Tham quan danh thắng <Camera className="w-3.5 h-3.5 text-slate-400" />
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Xe đưa đoàn đi tham quan một số địa danh, đền đài nổi tiếng tại Quỳnh Lưu hoặc tự do vui chơi tắm biển tại resort.</p>
                </div>
              </div>
            </div>

            {/* Event 3 */}
            <div className="relative">
              <div className="absolute -left-[30px] md:-left-[38px] w-4 h-4 rounded-full bg-white border-2 border-amber-500 z-10 mt-1"></div>
              <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                <div className="sm:w-24 shrink-0 mt-0.5 flex items-center gap-1.5 text-amber-600 font-black text-sm">
                  <Clock className="w-4 h-4" />
                  11:30
                </div>
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex-1">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    Ăn trưa hải sản <Utensils className="w-3.5 h-3.5 text-amber-600" />
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Ăn trưa thưởng thức các món hải sản tươi sống đặc sản biển Quỳnh. Sau đó về phòng nghỉ ngơi.</p>
                </div>
              </div>
            </div>

            {/* Event 4 */}
            <div className="relative">
              <div className="absolute -left-[30px] md:-left-[38px] w-4 h-4 rounded-full bg-white border-2 border-indigo-500 z-10 mt-1"></div>
              <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                <div className="sm:w-24 shrink-0 mt-0.5 flex items-center gap-1.5 text-indigo-600 font-black text-sm">
                  <Clock className="w-4 h-4" />
                  19:00
                </div>
                <div className="bg-indigo-50/50 border border-indigo-100/60 p-4 rounded-2xl flex-1">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    Ăn tối tự do / Khám phá biển đêm <Moon className="w-3.5 h-3.5 text-indigo-600" />
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Bữa tối ngày 2 đoàn sẽ tự túc hoặc tự tổ chức theo từng nhóm gia đình. Trải nghiệm dạo biển đêm, câu mực, hoặc nướng BBQ.</p>
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
              <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Ngày 3: Chủ Nhật, 12/07/2026</h2>
              <p className="text-xs font-bold text-orange-600">Mua sắm & Trở về</p>
            </div>
          </div>
          
          <div className="relative pl-6 md:pl-8 space-y-8 before:absolute before:inset-y-2 before:left-[11px] md:before:left-[19px] before:w-0.5 before:bg-slate-100">
            {/* Event 1 */}
            <div className="relative">
              <div className="absolute -left-[30px] md:-left-[38px] w-4 h-4 rounded-full bg-white border-2 border-orange-500 z-10 mt-1"></div>
              <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                <div className="sm:w-24 shrink-0 mt-0.5 flex items-center gap-1.5 text-orange-600 font-black text-sm">
                  <Clock className="w-4 h-4" />
                  07:30
                </div>
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex-1">
                  <h3 className="font-bold text-slate-800 text-sm">Ăn sáng & Tự do mua sắm</h3>
                  <p className="text-xs text-slate-500 mt-1">Dùng điểm tâm sáng. Mọi người có thể đi chợ hải sản ven biển để mua quà về cho gia đình, người thân.</p>
                </div>
              </div>
            </div>
            
            {/* Event 2 */}
            <div className="relative">
              <div className="absolute -left-[30px] md:-left-[38px] w-4 h-4 rounded-full bg-white border-2 border-rose-500 z-10 mt-1"></div>
              <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                <div className="sm:w-24 shrink-0 mt-0.5 flex items-center gap-1.5 text-rose-600 font-black text-sm">
                  <Clock className="w-4 h-4" />
                  11:30
                </div>
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex-1">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    Trả phòng & Ăn trưa <Utensils className="w-3.5 h-3.5 text-slate-400" />
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Đoàn làm thủ tục trả phòng khách sạn. Sau đó lên xe di chuyển đến nhà hàng ăn trưa.</p>
                </div>
              </div>
            </div>

            {/* Event 3 */}
            <div className="relative">
              <div className="absolute -left-[30px] md:-left-[38px] w-4 h-4 rounded-full bg-white border-2 border-emerald-500 z-10 mt-1"></div>
              <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                <div className="sm:w-24 shrink-0 mt-0.5 flex items-center gap-1.5 text-emerald-600 font-black text-sm">
                  <Clock className="w-4 h-4" />
                  13:30
                </div>
                <div className="bg-emerald-50/50 border border-emerald-100/60 p-4 rounded-2xl flex-1">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    Lên xe trở về Hà Nội <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Xe khởi hành đưa đoàn về lại điểm xuất phát. Kết thúc kỳ nghỉ hè vui vẻ, an toàn và nhiều kỷ niệm.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
