import { useState, useMemo, useEffect } from "react";
import { Truck, Search, User, Users, Phone, HelpCircle, Info, Star, Settings, RefreshCw, Check, AlertCircle } from "lucide-react";
import { Registration } from "../types";

interface VehicleListProps {
  registrations: Registration[];
}

interface BusPassenger {
  name: string;
  subName?: string;
  phone: string;
  role: "Nhân viên" | "Thân nhân";
  detail: string; // e.g. "Trưởng phòng" or Relationship like "Vợ"
  regId: string;
}

interface BusAllocation {
  busId: string;
  busName: string;
  plate: string;
  capacity: number;
  leaderName: string;
  leaderPhone: string;
  passengers: BusPassenger[];
}

export default function VehicleList({ registrations }: VehicleListProps) {
  const [activeTab, setActiveTab] = useState<"all" | "xe-1" | "xe-2">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [adminSearchTerm, setAdminSearchTerm] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const isAdmin = typeof window !== "undefined" && (
    window.location.pathname.includes("/admin") ||
    window.location.href.includes("admin") ||
    window.location.hash.includes("admin")
  );

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const showError = (msg: string) => {
    setErrMsg(msg);
    setTimeout(() => setErrMsg(""), 12000);
  };

  // Load custom vehicle assignments from localStorage
  const [xe1RegIds, setXe1RegIds] = useState<string[]>(() => {
    const saved = localStorage.getItem("custom_vehicle_xe1_reg_ids");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback below
      }
    }
    
    // Default Automatic allocation:
    // If Xe 1 total occupants (employees + companions) is <= 28 people, assign to Xe 1.
    // Otherwise assign to Xe 2. This keeps families together!
    const initialXe1Ids: string[] = [];
    let xe1Count = 0;
    registrations.forEach((reg) => {
      const regPeopleCount = 1 + reg.companions.length;
      if (xe1Count + regPeopleCount <= 28) {
        xe1Count += regPeopleCount;
        initialXe1Ids.push(reg.id);
      }
    });
    return initialXe1Ids;
  });

  // Import and setup clientSupabase
  const metaEnv = (import.meta as any).env || {};
  const supabaseUrl = (typeof process !== "undefined" && process.env?.SUPABASE_URL) || metaEnv.VITE_SUPABASE_URL || "";
  const supabaseAnonKey = (typeof process !== "undefined" && process.env?.SUPABASE_ANON_KEY) || metaEnv.VITE_SUPABASE_ANON_KEY || "";

  // Sync with backend on mount & registration changes
  useEffect(() => {
    const fetchVehicleAllocations = async () => {
      let useDirectFallback = false;
      try {
        const res = await fetch("/api/vehicle-allocations");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            if (data.length > 0) {
              setXe1RegIds(data);
              localStorage.setItem("custom_vehicle_xe1_reg_ids", JSON.stringify(data));
            } else if (registrations.length > 0) {
              // If backend has no data, but we have a default list, let's sync our current state to the backend
              const saved = localStorage.getItem("custom_vehicle_xe1_reg_ids");
              const currentList = saved ? JSON.parse(saved) : xe1RegIds;
              if (currentList && currentList.length > 0) {
                await fetch("/api/vehicle-allocations", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(currentList),
                });
              }
            }
          }
        } else {
          useDirectFallback = true;
        }
      } catch (err) {
        useDirectFallback = true;
      }

      if (useDirectFallback && supabaseUrl && supabaseAnonKey) {
        import("@supabase/supabase-js").then(async ({ createClient }) => {
          const clientSupabase = createClient(supabaseUrl, supabaseAnonKey);
          try {
            const { data, error } = await clientSupabase
              .from("vehicle_allocations")
              .select("xe1_reg_ids")
              .eq("id", "current")
              .single();
            if (!error && data && Array.isArray(data.xe1_reg_ids) && data.xe1_reg_ids.length > 0) {
              setXe1RegIds(data.xe1_reg_ids);
              localStorage.setItem("custom_vehicle_xe1_reg_ids", JSON.stringify(data.xe1_reg_ids));
            }
          } catch (e) {
            console.error("Lỗi khi tải từ Supabase:", e);
          }
        });
      }
    };
    fetchVehicleAllocations();
  }, [registrations, supabaseUrl, supabaseAnonKey]);

  const saveVehicleAllocations = async (updatedList: string[]) => {
    setXe1RegIds(updatedList);
    localStorage.setItem("custom_vehicle_xe1_reg_ids", JSON.stringify(updatedList));
    
    let useDirectFallback = false;
    try {
      const res = await fetch("/api/vehicle-allocations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedList),
      });
      if (res.ok) {
        showSuccess("Đã cập nhật sơ đồ phân xe thành công!");
        setErrMsg(""); // Clear error on success
      } else {
        throw new Error("Lỗi lưu qua backend");
      }
    } catch (err: any) {
      console.warn("Lỗi gửi lên backend, thực hiện đồng bộ trực tiếp:", err);
      useDirectFallback = true;
    }

    if (useDirectFallback) {
      if (supabaseUrl && supabaseAnonKey) {
        import("@supabase/supabase-js").then(async ({ createClient }) => {
          const clientSupabase = createClient(supabaseUrl, supabaseAnonKey);
          try {
            const { error } = await clientSupabase
              .from("vehicle_allocations")
              .upsert({
                id: "current",
                xe1_reg_ids: updatedList,
                updated_at: new Date().toISOString()
              }, { onConflict: "id" });
            if (error) throw error;
            showSuccess("Đã cập nhật sơ đồ phân xe thành công!");
            setErrMsg("");
          } catch (supabaseErr: any) {
            showError(`Không thể lưu sơ đồ phân xe lên Supabase: ${supabaseErr.message || supabaseErr}`);
          }
        });
      } else {
        showError("Không kết nối được backend và không có URL Supabase dự phòng.");
      }
    }
  };

  const handleToggleXe1 = (regId: string) => {
    let updated: string[];
    if (xe1RegIds.includes(regId)) {
      updated = xe1RegIds.filter(id => id !== regId);
    } else {
      updated = [...xe1RegIds, regId];
    }
    saveVehicleAllocations(updated);
  };

  const handleResetVehicles = () => {
    if (window.confirm("Bạn có chắc chắn muốn khôi phục phân bổ xe về mặc định?")) {
      const initialXe1Ids: string[] = [];
      let xe1Count = 0;
      registrations.forEach((reg) => {
        const regPeopleCount = 1 + reg.companions.length;
        if (xe1Count + regPeopleCount <= 28) {
          xe1Count += regPeopleCount;
          initialXe1Ids.push(reg.id);
        }
      });
      saveVehicleAllocations(initialXe1Ids);
    }
  };

  // Quick search inside admin panel
  const filteredAdminRegs = useMemo(() => {
    const query = adminSearchTerm.toLowerCase().trim();
    if (!query) return registrations;
    return registrations.filter(reg => 
      reg.employee.fullName.toLowerCase().includes(query) ||
      reg.companions.some(c => c.fullName.toLowerCase().includes(query))
    );
  }, [registrations, adminSearchTerm]);

  // Dynamically allocate registrations to buses based on xe1RegIds
  const busAllocations = useMemo<BusAllocation[]>(() => {
    const xe1Passengers: BusPassenger[] = [];
    const xe2Passengers: BusPassenger[] = [];

    registrations.forEach((reg) => {
      const isXe1 = xe1RegIds.includes(reg.id);
      const busDest = isXe1 ? xe1Passengers : xe2Passengers;

      // Add main employee
      busDest.push({
        name: reg.employee.fullName.toUpperCase(),
        phone: reg.employee.phone,
        role: "Nhân viên",
        detail: reg.department || "Hồi sức ngoại",
        regId: reg.id,
      });

      // Add companions
      reg.companions.forEach((c) => {
        busDest.push({
          name: c.fullName,
          subName: `(${c.relationship} của ${reg.employee.fullName})`,
          phone: c.phone || reg.employee.phone, // fallback to employee phone
          role: "Thân nhân",
          detail: "Thân nhân",
          regId: reg.id,
        });
      });
    });

    return [
      {
        busId: "xe-1",
        busName: "Xe số 1 (Xe 45 chỗ)",
        plate: "29H-925.48",
        capacity: 45,
        leaderName: "Nguyễn Quang Huy",
        leaderPhone: "0984540785",
        passengers: xe1Passengers,
      },
      {
        busId: "xe-2",
        busName: "Xe số 2 (Xe 45 chỗ)",
        plate: "29F-043.77",
        capacity: 45,
        leaderName: "Phan Duy Thắng",
        leaderPhone: "0988231083",
        passengers: xe2Passengers,
      },
    ];
  }, [registrations, xe1RegIds]);

  // Apply Search Filter and Tab Filter
  const filteredBuses = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();

    return busAllocations.map((bus) => {
      // 1. Tab check
      const matchesTab = activeTab === "all" || activeTab === bus.busId;
      if (!matchesTab) {
        return { ...bus, passengers: [] };
      }

      // 2. Search check inside passengers
      const matchingPassengers = bus.passengers.filter((p) =>
        !query ||
        p.name.toLowerCase().includes(query) ||
        p.phone.includes(query) ||
        p.detail.toLowerCase().includes(query)
      );

      return {
        ...bus,
        passengers: matchingPassengers,
      };
    });
  }, [busAllocations, activeTab, searchTerm]);

  // Count summary
  const counts = useMemo(() => {
    const bus1 = busAllocations.find((b) => b.busId === "xe-1")?.passengers.length || 0;
    const bus2 = busAllocations.find((b) => b.busId === "xe-2")?.passengers.length || 0;
    return { bus1, bus2, total: bus1 + bus2 };
  }, [busAllocations]);

  return (
    <div className="space-y-6" id="vehicle-list-page">
      {/* Page Title */}
      <div className="flex items-center gap-3 mb-4 bg-white border border-slate-200/60 p-4.5 rounded-2xl shadow-sm">
        <div className="p-2.5 bg-emerald-50 rounded-xl text-[#059669] border border-emerald-100 shrink-0">
          <Truck className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight">Danh sách sắp xếp theo xe</h2>
          <p className="text-sm text-slate-500 font-medium">Tra cứu xem bạn và thân nhân được phân bổ di chuyển ở xe nào</p>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-[#059669] px-4 py-3 rounded-2xl flex items-center gap-2.5 shadow-sm text-sm font-semibold animate-fadeIn">
          <Check className="w-4 h-4 shrink-0 bg-emerald-100 p-0.5 rounded-full" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Database Error Notification Banner */}
      {errMsg && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3.5 rounded-2xl flex items-start gap-2.5 shadow-sm text-sm font-semibold animate-fadeIn">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
          <div className="space-y-1">
            <p className="font-extrabold uppercase tracking-wide text-rose-700">Lỗi đồng bộ dữ liệu xe:</p>
            <p className="text-rose-600 font-medium leading-relaxed">{errMsg}</p>
          </div>
        </div>
      )}

      {/* Admin Vehicle Configuration Panel */}
      {isAdmin && (
        <div className="bg-white rounded-2xl border border-emerald-200 shadow-sm overflow-hidden animate-fadeIn space-y-4 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-emerald-600 shrink-0 animate-spin-slow" />
              <div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                  Cấu hình phân xe (Chỉ hiển thị ở /admin)
                </h3>
                <p className="text-xs text-slate-400 font-semibold">
                  Tích chọn nhân viên đi Xe số 1. Người không chọn sẽ tự động xếp vào Xe số 2. Toàn bộ người thân sẽ được xếp đi cùng xe với nhân viên đó.
                </p>
              </div>
            </div>
            <button
              onClick={handleResetVehicles}
              className="inline-flex items-center gap-1 text-xs font-black uppercase text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200/50 px-3 py-1.5 rounded-xl cursor-pointer shadow-xs active:scale-95 transition-all self-start sm:self-center shrink-0"
            >
              <RefreshCw className="w-3 h-3" />
              Khôi phục mặc định
            </button>
          </div>

          {/* Seat count indicator */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-emerald-50/50 border border-emerald-100/60 p-3.5 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider">Xe số 1 (Xe 45 chỗ)</p>
                <p className="text-sm text-slate-500 font-semibold">Khuyến nghị tải: ≤ 45 người</p>
              </div>
              <div className="text-right">
                <span className={`text-lg font-black ${counts.bus1 > 45 ? "text-rose-600 animate-pulse" : "text-emerald-700"}`}>
                  {counts.bus1}
                </span>
                <span className="text-sm text-slate-400 font-bold"> / 45 ghế</span>
              </div>
            </div>

            <div className="bg-blue-50/50 border border-blue-100/60 p-3.5 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-xs font-extrabold text-blue-800 uppercase tracking-wider">Xe số 2 (Xe 29 chỗ)</p>
                <p className="text-sm text-slate-500 font-semibold">Khuyến nghị tải: ≤ 29 người</p>
              </div>
              <div className="text-right">
                <span className={`text-lg font-black ${counts.bus2 > 29 ? "text-rose-600 animate-pulse" : "text-blue-700"}`}>
                  {counts.bus2}
                </span>
                <span className="text-sm text-slate-400 font-bold"> / 29 ghế</span>
              </div>
            </div>
          </div>

          {/* Quick search inside admin panel */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Tìm nhanh nhân viên để xếp xe..."
              value={adminSearchTerm}
              onChange={(e) => setAdminSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 transition-all"
            />
          </div>

          {/* Checkboxes List */}
          <div className="max-h-60 overflow-y-auto border border-slate-100 rounded-xl divide-y divide-slate-50/80 bg-slate-50/30 p-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {filteredAdminRegs.map((reg) => {
              const totalCount = 1 + reg.companions.length;
              const isChecked = xe1RegIds.includes(reg.id);
              return (
                <label
                  key={reg.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                    isChecked
                      ? "bg-emerald-50/60 border-emerald-200 text-emerald-900 shadow-xs"
                      : "bg-white border-slate-200/60 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleToggleXe1(reg.id)}
                    className="w-4 h-4 text-[#059669] border-slate-300 rounded focus:ring-emerald-500 accent-[#059669] cursor-pointer"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-extrabold truncate">{reg.employee.fullName}</p>
                    <p className="text-xs text-slate-400 font-bold mt-0.5">
                      {reg.companions.length > 0 
                        ? `+ ${reg.companions.length} thân nhân (${totalCount} người)` 
                        : "Đi một mình"}
                    </p>
                  </div>
                  <span className={`text-[11px] font-black uppercase px-2 py-0.5 rounded-full shrink-0 ${
                    isChecked ? "bg-emerald-100 text-emerald-800" : "bg-blue-50 text-blue-800"
                  }`}>
                    {isChecked ? "Xe 1" : "Xe 2"}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Navigation Tabs and Search */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Navigation Tabs */}
        <div className="flex gap-1.5 bg-slate-50 p-1.5 rounded-xl w-full md:w-auto overflow-x-auto" id="bus-tabs">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 text-sm font-bold rounded-lg cursor-pointer transition-all ${
              activeTab === "all"
                ? "bg-[#059669] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Tất cả xe ({counts.total})
          </button>
          <button
            onClick={() => setActiveTab("xe-1")}
            className={`px-4 py-2 text-sm font-bold rounded-lg cursor-pointer transition-all ${
              activeTab === "xe-1"
                ? "bg-[#059669] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Xe số 1 ({counts.bus1} người)
          </button>
          <button
            onClick={() => setActiveTab("xe-2")}
            className={`px-4 py-2 text-sm font-bold rounded-lg cursor-pointer transition-all ${
              activeTab === "xe-2"
                ? "bg-[#059669] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Xe số 2 ({counts.bus2} người)
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Tìm theo tên hành khách..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 transition-all"
          />
        </div>
      </div>

      {/* Bus Passengers List */}
      <div className="space-y-6" id="buses-passengers-container">
        {filteredBuses.map((bus) => {
          // If tab is active but passengers are empty, check if it's because of search query
          if (activeTab !== "all" && activeTab !== bus.busId) return null;

          return (
            <div key={bus.busId} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              {/* Bus Header */}
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <h3 className="text-base font-extrabold text-slate-800">{bus.busName}</h3>
                    <span className="bg-emerald-50 text-emerald-700 text-[11px] font-black uppercase px-2 py-0.5 rounded-md border border-emerald-100">
                      {bus.plate}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Trưởng xe điều hành: <strong>{bus.leaderName}</strong> ({bus.leaderPhone})
                  </p>
                </div>
                <div className="text-right text-[13px] text-slate-500 font-bold bg-white border border-slate-200/60 px-3 py-1 rounded-lg">
                  Sức chứa: {bus.passengers.length}/{bus.capacity} hành khách
                </div>
              </div>

              {/* Passengers Table / Mobile Cards */}
              {bus.passengers.length === 0 ? (
                <div className="p-8 text-center text-sm text-slate-400">
                  {searchTerm.trim() ? "Không tìm thấy hành khách nào phù hợp từ khóa." : "Chưa có hành khách nào được xếp xe."}
                </div>
              ) : (
                <>
                  {/* Desktop View */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/50 text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-100">
                          <th className="py-3 px-6 w-16 text-center">STT</th>
                          <th className="py-3 px-6">Họ và tên</th>
                          <th className="py-3 px-6">Phân loại</th>
                          <th className="py-3 px-6">Ghi chú chi tiết</th>
                          <th className="py-3 px-6 text-right">Số điện thoại</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                        {bus.passengers.map((passenger, pIdx) => (
                          <tr key={pIdx} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-3 px-6 text-center font-bold text-slate-400">{pIdx + 1}</td>
                            <td className="py-3 px-6">
                              <div className={`font-extrabold ${passenger.role === "Nhân viên" ? "text-[#059669]" : "text-slate-800"}`}>
                                {passenger.name}
                              </div>
                              {passenger.subName && (
                                <div className="text-[12.5px] text-slate-500 font-medium mt-0.5">{passenger.subName}</div>
                              )}
                            </td>
                            <td className="py-3 px-6">
                              <span className={`text-[11px] font-black uppercase px-2 py-0.5 rounded-md ${
                                passenger.role === "Nhân viên"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-100/50"
                                  : "bg-amber-50 text-amber-700 border border-amber-100/50"
                              }`}>
                                {passenger.role}
                              </span>
                            </td>
                            <td className="py-3 px-6 text-slate-500 italic">{passenger.detail}</td>
                            <td className="py-3 px-6 text-right">
                              <a
                                href={`tel:${passenger.phone}`}
                                className="inline-flex items-center gap-1 text-xs font-extrabold text-[#059669] hover:underline"
                              >
                                {passenger.phone}
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile View */}
                  <div className="block md:hidden divide-y divide-slate-100">
                    {bus.passengers.map((passenger, pIdx) => (
                      <div key={pIdx} className="p-4 flex justify-between items-center hover:bg-slate-50/50 transition-all">
                        <div className="space-y-1">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-400">#{pIdx + 1}</span>
                              <span className={`font-extrabold text-sm ${passenger.role === "Nhân viên" ? "text-[#059669]" : "text-slate-800"}`}>
                                {passenger.name}
                              </span>
                            </div>
                            {passenger.subName && (
                              <div className="text-xs text-slate-500 mt-0.5 ml-[26px]">
                                {passenger.subName}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded-md ${
                              passenger.role === "Nhân viên"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-100/30"
                                : "bg-amber-50 text-amber-700 border border-amber-100/30"
                            }`}>
                              {passenger.role}
                            </span>
                            <span className="text-xs text-slate-400 italic">{passenger.detail}</span>
                          </div>
                        </div>

                        {/* 3D-styled green call button */}
                        <a
                          href={`tel:${passenger.phone}`}
                          className="inline-flex items-center justify-center gap-1 text-xs font-extrabold text-white bg-[#059669] hover:bg-[#047857] px-3 py-1.5 rounded-xl border-b-[3px] border-[#036c4b] active:border-b-[1px] active:translate-y-[1px] transition-all shadow-sm cursor-pointer"
                        >
                          <Phone className="w-3 h-3" />
                          Gọi ngay
                        </a>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Allocation policy */}
      <div className="bg-amber-50/50 border border-amber-100/40 rounded-2xl p-4 flex gap-3 text-sm leading-relaxed text-slate-600">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-extrabold text-slate-700">Chính sách điều phối sắp xếp phương tiện:</p>
          <p className="text-[13px] text-slate-500">
            • <strong>Tính gắn kết gia đình:</strong> Hệ thống luôn xếp toàn bộ thành viên trong cùng một phiếu đăng ký di chuyển trên cùng một chuyến xe để đảm bảo các gia đình luôn đồng hành cùng nhau.
          </p>
          <p className="text-[13px] text-slate-500">
            • <strong>Điều chỉnh xe:</strong> Nếu anh/chị có nguyện vọng chuyển đổi xe để di chuyển cùng nhóm bạn hoặc đồng nghiệp khác, vui lòng liên hệ sớm với Ban tổ chức trước ngày khởi hành 03 ngày.
          </p>
        </div>
      </div>
    </div>
  );
}
