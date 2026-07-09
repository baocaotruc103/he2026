import { Phone, Shield, Truck } from "lucide-react";

export default function DriverInfo() {
  const drivers = [
    {
      id: "xe-1",
      busNumber: "Xe số 1",
      plate: "29H-925.48",
      driverName: "Bình",
      driverPhone: "0979973768",
      leaderName: "Nguyễn Quang Huy",
      leaderPhone: "0984540785",
    },
    {
      id: "xe-2",
      busNumber: "Xe số 2",
      plate: "29F-043.77",
      driverName: "Phố",
      driverPhone: "0988632355",
      leaderName: "Phan Duy Thắng",
      leaderPhone: "0988231083",
    },
  ];

  return (
    <div className="space-y-6" id="driver-info-page">
      {/* Page Title */}
      <div className="flex items-center gap-3 mb-4 bg-white border border-slate-200/60 p-4.5 rounded-2xl shadow-sm">
        <div className="p-2.5 bg-emerald-50 rounded-xl text-[#059669] border border-emerald-100 shrink-0">
          <Truck className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight">Thông tin lái xe</h2>
        </div>
      </div>

      {/* Driver cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="driver-list-grid">
        {drivers.map((driver) => (
          <div key={driver.id} className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-all space-y-4">
            {/* Header: Xe số... */}
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <span className="text-lg font-black text-[#059669] uppercase tracking-tight">{driver.busNumber}</span>
              <span className="bg-emerald-50 text-[#059669] text-xs font-black uppercase px-2.5 py-1 rounded-xl border border-emerald-100">
                Đang hoạt động
              </span>
            </div>

            {/* Structured details */}
            <div className="space-y-3.5 text-sm text-slate-700">
              {/* Lái xe section */}
              <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-extrabold uppercase tracking-wider text-xs">Biển số:</span>
                  <span className="font-black text-slate-800 text-base">{driver.plate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-extrabold uppercase tracking-wider text-xs">Tên lái xe:</span>
                  <span className="font-extrabold text-slate-800">{driver.driverName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-extrabold uppercase tracking-wider text-xs">SĐT:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-[#059669] text-base">{driver.driverPhone}</span>
                    <a
                      href={`tel:${driver.driverPhone}`}
                      className="inline-flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-[#059669] font-black text-xs px-2.5 py-1 rounded-lg border border-emerald-200/60 transition-colors cursor-pointer"
                    >
                      <Phone className="w-3 h-3" />
                      Gọi
                    </a>
                  </div>
                </div>
              </div>

              {/* Phụ trách xe section */}
              <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-extrabold uppercase tracking-wider text-xs">Phụ trách xe:</span>
                  <span className="font-extrabold text-slate-800">{driver.leaderName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-extrabold uppercase tracking-wider text-xs">SĐT:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-800 text-base">{driver.leaderPhone}</span>
                    <a
                      href={`tel:${driver.leaderPhone}`}
                      className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs px-2.5 py-1 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                    >
                      <Phone className="w-3 h-3" />
                      Gọi
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Preparation instructions */}
      <div className="bg-emerald-50/50 border border-emerald-100/40 rounded-2xl p-4 flex gap-3 text-sm leading-relaxed text-slate-600">
        <Shield className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-extrabold text-slate-700">Hướng dẫn dành cho thành viên đi xe đoàn:</p>
          <p className="text-[13px] text-slate-500">
            • <strong>Thời gian tập trung:</strong> Toàn bộ thành viên có mặt trước giờ xe khởi hành 15 phút để trưởng xe điểm danh và sắp xếp hành lý ký gửi dưới gầm xe.
          </p>
          <p className="text-[13px] text-slate-500">
            • <strong>Dược phẩm say xe:</strong> Trưởng xe luôn mang sẵn nước khoáng, khăn lạnh, túi nôn, thuốc chống say tàu xe và bông băng sơ cứu y tế. Thành viên cần dùng có thể liên hệ ngay.
          </p>
          <p className="text-[13px] text-slate-500">
            • <strong>Kiểm soát trẻ nhỏ:</strong> Gia đình đi kèm em bé vui lòng quản lý các cháu trong suốt chuyến đi để đảm bảo an toàn tuyệt đối khi xe đang di chuyển.
          </p>
        </div>
      </div>
    </div>
  );
}
