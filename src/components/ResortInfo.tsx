import { 
  MapPin, 
  Calendar, 
  Clock, 
  Sparkles, 
  Check, 
  Phone, 
  HelpCircle, 
  Wifi, 
  Utensils, 
  Coffee, 
  ShieldAlert, 
  Info,
  Gift,
  Smile
} from "lucide-react";

export default function ResortInfo() {
  const scheduleTimes = [
    { title: "Giờ nhận phòng", value: "14:00", note: "Ưu tiên nhận trước nếu có phòng trống" },
    { title: "Giờ trả phòng", value: "Trước 12:00", note: "Vui lòng hoàn tất trước giờ quy định" },
  ];

  const mealTimes = [
    { type: "Ăn sáng", time: "07:00 - 08:30", place: "Quầy Buffet sau Lễ tân", desc: "Quý khách vui lòng gửi lại phiếu ăn sáng cho nhân viên soát vé khi dùng buffet." },
    { type: "Ăn trưa", time: "11:00 - 13:30", place: "Nhà hàng Resort", desc: "Thực đơn đa dạng với ẩm thực miền biển phong phú." },
    { type: "Ăn tối", time: "18:30 - 20:00", place: "Nhà hàng Resort / Gala Dinner", desc: "Thời gian phục vụ tiệc tối ấm cúng cùng đoàn." },
  ];

  const freeServices = [
    { icon: <Wifi className="w-4 h-4 text-emerald-600" />, title: "Wifi Resort", desc: "Kết nối mạng không dây tốc độ cao, không cần mật khẩu." },
    { icon: <Check className="w-4 h-4 text-emerald-600" />, title: "Bể bơi ngoài trời", desc: "Vị trí sau quầy Lễ tân (Miễn phí hoàn toàn đối với khách lưu trú)." },
    { icon: <Smile className="w-4 h-4 text-emerald-600" />, title: "Khu vui chơi trẻ em", desc: "Nằm trước Resort, mở cửa miễn phí đối với trẻ em dưới 12 tuổi." },
    { icon: <Gift className="w-4 h-4 text-emerald-600" />, title: "Phiếu quà tặng", desc: "Mỗi khách nhận 1 phiếu buffet sáng + 1 phiếu cà phê sử dụng vào sáng hôm sau." },
  ];

  const roomRegulations = [
    {
      title: "Đồ uống miễn phí",
      content: "Nước lọc Aquafina đặt sẵn trên bàn trong phòng là miễn phí.",
      type: "free"
    },
    {
      title: "Đồ uống & dịch vụ tính phí",
      content: "Các đồ còn lại đặt trong tủ lạnh (kể cả nước lọc trong tủ lạnh) đều tính phí. Mỳ ly, bia và bánh kẹo đặt trên bàn sẽ được tính phí theo bill đặt sẵn trong phòng.",
      type: "charge"
    },
    {
      title: "Bảo quản hành lý",
      content: "Hành lý, tư trang quý giá quý khách vui lòng tự bảo quản cẩn thận.",
      type: "warning"
    }
  ];

  return (
    <div className="space-y-6" id="resort-info-page">
      {/* Title Header */}
      <div className="flex items-center gap-3 mb-4 bg-white border border-slate-200/60 p-4.5 rounded-2xl shadow-sm">
        <div className="p-2.5 bg-emerald-50 rounded-xl text-[#059669] border border-emerald-100 shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Ruby Star Beach Quynh Resort</h2>
          <p className="text-xs text-slate-500 font-medium">Thông tin điểm đến nghỉ dưỡng hè chi tiết từ Ban tổ chức</p>
        </div>
      </div>

      {/* Hero Header with exact address */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Địa chỉ resort</p>
            <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
              Thôn 3, Quỳnh Phú, Nghệ An
            </h3>
          </div>
          <div className="bg-emerald-50 text-[#059669] font-extrabold text-xs px-3.5 py-1.5 rounded-xl border border-emerald-100 flex items-center gap-1.5 self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Điểm đến chính thức
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {scheduleTimes.map((item, idx) => (
            <div key={idx} className="bg-slate-50/50 border border-slate-100 p-4 rounded-xl flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#059669] flex items-center justify-center shrink-0 border border-emerald-100/60 mt-0.5">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{item.title}</span>
                <p className="text-base font-black text-slate-800 mt-0.5">{item.value}</p>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">{item.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dining Timetable Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        <h4 className="font-extrabold text-sm text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Utensils className="w-4 h-4 text-emerald-600" /> THỜI GIAN PHỤC VỤ ĂN UỐNG
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mealTimes.map((meal, idx) => (
            <div key={idx} className="bg-slate-50/40 border border-slate-100 p-4 rounded-xl space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-1.5 mb-2">
                  <span className="font-black text-slate-800 text-xs uppercase">{meal.type}</span>
                  <span className="bg-emerald-50 text-[#059669] text-[10px] font-extrabold px-2 py-0.5 rounded-lg border border-emerald-100">
                    {meal.time}
                  </span>
                </div>
                <p className="text-[11px] font-bold text-[#059669] flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {meal.place}
                </p>
                <p className="text-[11px] text-slate-500 leading-relaxed mt-1.5 font-medium">{meal.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Amenities & Free Services */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Free services card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <h4 className="font-extrabold text-sm text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Gift className="w-4 h-4 text-emerald-600" /> TIỆN ÍCH & DỊCH VỤ MIỄN PHÍ
          </h4>
          <div className="space-y-3.5">
            {freeServices.map((service, idx) => (
              <div key={idx} className="flex gap-3 items-start p-2.5 bg-slate-50/50 border border-slate-100/60 rounded-xl">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-100 text-[#059669] flex items-center justify-center shrink-0 mt-0.5">
                  {service.icon}
                </div>
                <div>
                  <h5 className="text-xs font-black text-slate-800">{service.title}</h5>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5 leading-relaxed">{service.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Room Regulations and Guidelines */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <h4 className="font-extrabold text-sm text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
            <ShieldAlert className="w-4 h-4 text-rose-500" /> QUY ĐỊNH PHÒNG & TƯ TRANG
          </h4>
          <div className="space-y-3">
            {roomRegulations.map((reg, idx) => (
              <div 
                key={idx} 
                className={`p-4 rounded-xl border leading-relaxed space-y-1 ${
                  reg.type === "free" 
                    ? "bg-emerald-50/30 border-emerald-100/80" 
                    : reg.type === "charge"
                    ? "bg-amber-50/30 border-amber-100/80"
                    : "bg-rose-50/30 border-rose-100/80"
                }`}
              >
                <div className="flex items-center gap-1.5 border-b border-slate-100/30 pb-1 mb-1.5">
                  <span className={`w-2 h-2 rounded-full ${
                    reg.type === "free" ? "bg-emerald-500" : reg.type === "charge" ? "bg-amber-500" : "bg-rose-500"
                  }`} />
                  <span className="text-[11px] font-black uppercase text-slate-800 tracking-wide">{reg.title}</span>
                </div>
                <p className="text-[11px] text-slate-600 font-medium">{reg.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Support Hotlines & Communications */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md relative overflow-hidden space-y-4">
        <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
          <HelpCircle className="w-28 h-28 text-white" />
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h4 className="font-black text-sm text-white tracking-wide uppercase">LIÊN HỆ & TRỢ GIÚP ĐOÀN</h4>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Mọi vướng mắc xin vui lòng thông báo theo các kênh chính thức sau</p>
          </div>
          <a
            href="tel:0833464646"
            className="inline-flex items-center gap-2 bg-[#059669] hover:bg-[#047857] text-white font-black text-xs px-4 py-2 rounded-xl transition-all shadow-md shadow-emerald-950/20 self-start sm:self-auto cursor-pointer"
          >
            <Phone className="w-3.5 h-3.5" />
            Gọi Quầy Lễ Tân: 0833.464.646
          </a>
        </div>

        <div className="flex gap-3 text-xs text-slate-300 bg-slate-850 p-4 rounded-xl border border-slate-800/80 leading-relaxed font-medium">
          <Info className="w-4.5 h-4.5 text-amber-400 shrink-0 mt-0.5" />
          <span>
            <strong>Trao đổi nhanh:</strong> Mọi thông tin phát sinh cần hỗ trợ thêm hoặc trao đổi chi tiết, Trưởng các tiểu ban/đoàn vui lòng nhắn tin trực tiếp lên nhóm chat chung của đoàn để được Ban tổ chức phản hồi sớm nhất.
          </span>
        </div>
      </div>
    </div>
  );
}

