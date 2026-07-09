import { useState, useEffect, useMemo } from "react";
import { 
  Sun, ShieldAlert, Sparkles, AlertCircle, Heart, CheckCircle, Info, Plus, X, 
  Hotel, Bed, Truck, Compass, ArrowLeft, Users, Home, UserCheck, Activity 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Registration } from "./types";
import RegistrationForm from "./components/RegistrationForm";
import Dashboard from "./components/Dashboard";
import ResortInfo from "./components/ResortInfo";
import RoomInfo from "./components/RoomInfo";
import DriverInfo from "./components/DriverInfo";
import VehicleList from "./components/VehicleList";
import Itinerary from "./components/Itinerary";
import { calculateAge } from "./utils";
import { createClient } from "@supabase/supabase-js";

// Initialize direct client-side Supabase client using injected env variables or Vite env variables
const metaEnv = (import.meta as any).env || {};
const supabaseUrl = (typeof process !== "undefined" && process.env?.SUPABASE_URL) || metaEnv.VITE_SUPABASE_URL || "";
const supabaseAnonKey = (typeof process !== "undefined" && process.env?.SUPABASE_ANON_KEY) || metaEnv.VITE_SUPABASE_ANON_KEY || "";

const clientSupabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

// Mock seed data for an instantly satisfying preview
const INITIAL_REGISTRATIONS: Registration[] = [
  {
    id: "reg-seed-1",
    employee: {
      fullName: "Nguyễn Văn Hải",
      dob: "1990-05-15",
      phone: "0912345678",
    },
    companions: [
      {
        id: "comp-seed-1",
        fullName: "Lê Thị Hồng",
        dob: "1992-08-20",
        phone: "0988776655",
        relationship: "Vợ",
      },
      {
        id: "comp-seed-2",
        fullName: "Nguyễn Hải Nam",
        dob: "2018-03-10",
        phone: "",
        relationship: "Con",
      },
    ],
    notes: "Xin sắp xếp phòng gia đình hướng biển.",
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(), // 2 days ago
  },
  {
    id: "reg-seed-2",
    employee: {
      fullName: "Trần Thị Thu Mai",
      dob: "1985-11-22",
      phone: "0955112233",
    },
    companions: [
      {
        id: "comp-seed-3",
        fullName: "Phạm Hoàng Long",
        dob: "1983-04-14",
        phone: "0900112233",
        relationship: "Chồng",
      },
    ],
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(), // 12 hours ago
  },
  {
    id: "reg-seed-3",
    employee: {
      fullName: "Lê Minh Tuấn",
      dob: "1994-02-28",
      phone: "0977889900",
    },
    companions: [],
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
  },
  {
    id: "reg-seed-4",
    employee: {
      fullName: "Phạm Thanh Thảo",
      dob: "1992-09-05",
      phone: "0933445566",
    },
    companions: [
      {
        id: "comp-seed-4",
        fullName: "Phạm Minh Đức",
        dob: "2021-07-15",
        phone: "",
        relationship: "Con",
      },
    ],
    notes: "Đăng ký thêm ghế phụ cho trẻ em trên xe.",
    createdAt: new Date().toISOString(),
  },
];

interface ToastMessage {
  id: string;
  type: "success" | "info" | "danger";
  title: string;
  message: string;
}

export default function App() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRegistration, setEditingRegistration] = useState<Registration | null>(null);
  const [supabaseConnected, setSupabaseConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<"home" | "itinerary" | "resort" | "delegation" | "rooms" | "drivers" | "vehicles">("home");

  // Statistics for homepage Cards
  const homepageStats = useMemo(() => {
    const totalEmployees = registrations.length;
    let totalCompanions = 0;
    let ageSum = 0;
    let countWithAge = 0;

    registrations.forEach((reg) => {
      totalCompanions += reg.companions.length;

      // Age calculations
      const empAge = calculateAge(reg.employee.dob);
      if (empAge > 0) {
        ageSum += empAge;
        countWithAge++;
      }

      reg.companions.forEach((c) => {
        const compAge = calculateAge(c.dob);
        if (compAge > 0) {
          ageSum += compAge;
          countWithAge++;
        }
      });
    });

    const totalParticipants = totalEmployees + totalCompanions;
    const avgAge = countWithAge > 0 ? Math.round(ageSum / countWithAge) : 0;

    return {
      totalEmployees,
      totalCompanions,
      totalParticipants,
      avgAge,
    };
  }, [registrations]);

  // Load registrations & check configuration on mount
  useEffect(() => {
    checkSupabaseConfig();
    fetchRegistrations();
  }, []);

  const checkSupabaseConfig = async () => {
    try {
      const res = await fetch("/api/config");
      const data = await res.json();
      setSupabaseConnected(data.supabaseConnected);
    } catch (e) {
      console.warn("Lỗi khi kiểm tra cấu hình từ backend, thử check Supabase client-side:", e);
      setSupabaseConnected(!!clientSupabase);
    }
  };

  const fetchRegistrations = async () => {
    setIsLoading(true);
    try {
      // 1. Try to fetch from backend Node.js server
      const res = await fetch("/api/registrations");
      if (!res.ok) {
        throw new Error("Không thể kết nối API backend");
      }
      const data = await res.json();
      setRegistrations(data);
    } catch (e) {
      console.warn("Không kết nối được backend API (ví dụ: đang deploy Cloudflare Pages không server). Chuyển sang kết nối trực tiếp hoặc LocalStorage:", e);
      
      // 2. Direct client-side Supabase connection fallback
      if (clientSupabase) {
        try {
          const { data, error } = await clientSupabase
            .from("dang_ky")
            .select("*")
            .order("created_at", { ascending: false });
            
          if (error) throw error;
          
          if (data) {
            const mapped: Registration[] = data.map((item: any) => ({
              id: item.id,
              employee: typeof item.employee === 'string' ? JSON.parse(item.employee) : item.employee,
              companions: typeof item.companions === 'string' ? JSON.parse(item.companions) : (item.companions || []),
              createdAt: item.created_at || item.createdAt
            }));
            setRegistrations(mapped);
            setSupabaseConnected(true);
            return;
          }
        } catch (supabaseErr: any) {
          console.error("Lỗi kết nối trực tiếp đến bảng Supabase:", supabaseErr);
        }
      }
      
      // 3. Client-side LocalStorage fallback if both are unavailable
      const localData = localStorage.getItem("registrations");
      if (localData) {
        setRegistrations(JSON.parse(localData));
      } else {
        // First time initialization with seeds
        localStorage.setItem("registrations", JSON.stringify(INITIAL_REGISTRATIONS));
        setRegistrations(INITIAL_REGISTRATIONS);
      }
      setSupabaseConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Add Toast Notification helper
  const addToast = (title: string, message: string, type: ToastMessage["type"] = "success") => {
    const newToast: ToastMessage = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      title,
      message,
    };
    setToasts((prev) => [...prev, newToast]);

    // Self-destruct toast after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 4000);
  };

  // Open Form for edit
  const handleEditRegistration = (reg: Registration) => {
    setEditingRegistration(reg);
    setIsFormOpen(true);
  };

  // Close Form and clear editing
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingRegistration(null);
  };

  // Add or Update registration
  const handleRegisterSuccess = async (newReg: Registration) => {
    try {
      const isEditing = !!editingRegistration;
      const url = isEditing ? `/api/registrations/${newReg.id}` : "/api/registrations";
      const method = isEditing ? "PUT" : "POST";

      let useDirectFallback = false;
      try {
        const res = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newReg),
        });

        if (!res.ok) {
          throw new Error("Lỗi lưu qua backend");
        }
      } catch (backendErr) {
        console.warn("Lỗi gửi lên backend, thực hiện đồng bộ trực tiếp:", backendErr);
        useDirectFallback = true;
      }

      if (useDirectFallback) {
        // Direct Client-side sync to Supabase or LocalStorage
        if (clientSupabase) {
          if (isEditing) {
            const { error } = await clientSupabase
              .from("dang_ky")
              .update({
                employee: newReg.employee,
                companions: newReg.companions || [],
              })
              .eq("id", newReg.id);
            if (error) throw error;
          } else {
            const { error } = await clientSupabase
              .from("dang_ky")
              .insert([
                {
                  id: newReg.id,
                  employee: newReg.employee,
                  companions: newReg.companions || [],
                  created_at: newReg.createdAt || new Date().toISOString(),
                },
              ]);
            if (error) throw error;
          }
        } else {
          // Sync via LocalStorage only
          const localData = localStorage.getItem("registrations");
          let localList: Registration[] = localData ? JSON.parse(localData) : [];
          if (isEditing) {
            localList = localList.map(r => r.id === newReg.id ? newReg : r);
          } else {
            localList.unshift(newReg);
          }
          localStorage.setItem("registrations", JSON.stringify(localList));
        }
      }

      setIsFormOpen(false);
      setEditingRegistration(null);
      await fetchRegistrations();
      await checkSupabaseConfig();

      const companionText =
        newReg.companions.length > 0 ? ` cùng ${newReg.companions.length} thân nhân` : " (đi một mình)";
      addToast(
        isEditing ? "Cập nhật thành công!" : "Đăng ký thành công!",
        isEditing 
          ? `Đã cập nhật thông tin đi nghỉ hè của nhân viên ${newReg.employee.fullName}${companionText}.`
          : `Đã lưu thông tin đi nghỉ hè của nhân viên ${newReg.employee.fullName}${companionText}.`
      );
    } catch (e) {
      console.error("Lỗi khi gửi đăng ký:", e);
      addToast(
        "Lỗi thao tác",
        "Có lỗi xảy ra khi thực hiện gửi dữ liệu lên hệ thống.",
        "danger"
      );
    }
  };

  // Delete registration
  const handleDeleteRegistration = async (id: string) => {
    const found = registrations.find((r) => r.id === id);
    if (!found) return;

    try {
      let useDirectFallback = false;
      try {
        const res = await fetch(`/api/registrations/${id}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          throw new Error("Lỗi máy chủ khi xóa");
        }
      } catch (backendErr) {
        console.warn("Lỗi khi xóa qua backend, thực hiện xóa trực tiếp:", backendErr);
        useDirectFallback = true;
      }

      if (useDirectFallback) {
        if (clientSupabase) {
          const { error } = await clientSupabase
            .from("dang_ky")
            .delete()
            .eq("id", id);
          if (error) throw error;
        } else {
          const localData = localStorage.getItem("registrations");
          if (localData) {
            const localList: Registration[] = JSON.parse(localData);
            const filtered = localList.filter((r) => r.id !== id);
            localStorage.setItem("registrations", JSON.stringify(filtered));
          }
        }
      }

      await fetchRegistrations();
      await checkSupabaseConfig();

      addToast(
        "Đã xóa đăng ký",
        `Đã gỡ bỏ thông tin đăng ký của nhân viên ${found.employee.fullName}.`,
        "danger"
      );
    } catch (e) {
      console.error("Lỗi khi xóa đăng ký:", e);
      addToast(
        "Lỗi xóa đăng ký",
        "Không thể xóa thông tin đăng ký khỏi hệ thống.",
        "danger"
      );
    }
  };

  return (
    <div 
      className="min-h-screen text-slate-800 font-sans selection:bg-emerald-500 selection:text-white relative" 
      id="main-root"
    >
      {/* Beautiful Sea Background Image */}
      <div 
        className="fixed inset-0 bg-fixed bg-cover bg-center -z-20"
        style={{ backgroundImage: `url('https://static.vinwonders.com/production/bien-quynh-nghe-an-2.jpeg')` }}
      />
      {/* Translucent overlay with micro-blur for exquisite contrast and legibility */}
      <div className="fixed inset-0 bg-slate-50/80 backdrop-blur-[2px] pointer-events-none -z-10" />

      {/* HEADER BAR */}
      <header className="border-b border-[#047857]/40 bg-[#059669] text-white shadow-md sticky top-0 z-40" id="app-header">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-br from-amber-300 to-amber-500 rounded-xl shadow-md text-slate-900">
              <Sun className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="font-extrabold tracking-tight text-white text-base flex items-center gap-1.5 uppercase">
                Summer Retreat 2026
              </span>
              <span className="text-[10px] text-amber-300 font-semibold block uppercase tracking-wider -mt-0.5">
                Cổng thông tin kỳ nghỉ hè nội bộ
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
          </div>
        </div>
      </header>

      {/* MAIN LAYOUT CONTAINER */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24" id="app-main">
        {currentPage === "home" ? (
          <div className="space-y-8" id="homepage-content">
            {/* BANNER / HERO INTRO */}
            <div className="p-6 bg-white border border-slate-200/80 rounded-2xl text-slate-800 shadow-md relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/5 via-transparent to-transparent pointer-events-none" />
              <div className="space-y-1.5 z-10">
                <span className="bg-emerald-100 text-[#059669] text-[9px] font-black uppercase px-2.5 py-1 rounded-full tracking-wider inline-block">
                  Cổng Thông Tin 2026
                </span>
                <h1 className="text-xl md:text-2xl font-black tracking-tight text-[#059669] uppercase mt-1">KỲ NGHỈ HÈ RỰC RỠ & GẮN KẾT YÊU THƯƠNG</h1>
                <p className="text-xs md:text-sm text-slate-600 max-w-xl leading-relaxed">
                  Chào đón các thành viên đại gia đình khoa Hồi sức ngoại tham gia chuyến hành trình nghỉ dưỡng mùa hè. Hãy điền thông tin chi tiết của bạn và người thân để ban tổ chức chuẩn bị chu đáo nhất.
                </p>
              </div>
              
              <div className="flex flex-col gap-2 shrink-0 z-10 w-full md:w-auto min-w-[220px]">
                <div className="bg-[#059669] border border-[#047857]/20 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-sm">
                  <p className="text-emerald-200 uppercase tracking-wider text-[10px] font-bold">Thời gian diễn ra</p>
                  <p className="text-white mt-0.5 font-semibold text-xs">10/07 - 12/07/2026</p>
                </div>
                <div className="bg-[#059669] border border-[#047857]/20 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-sm">
                  <p className="text-emerald-200 uppercase tracking-wider text-[10px] font-bold">Địa điểm</p>
                  <p className="text-white mt-0.5 font-semibold text-xs">Ruby star Beach Quynh Resort</p>
                </div>
              </div>
            </div>

            {/* THẺ THỐNG KÊ (STATISTICS CARDS) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="homepage-stats-grid">
              {/* Card 1: Tổng quân số */}
              <div className="bg-[#059669] text-white p-4.5 rounded-2xl shadow-md relative overflow-hidden border border-[#047857]/20">
                <div className="absolute right-[-10px] bottom-[-10px] opacity-15">
                  <Users className="w-20 h-20" />
                </div>
                <p className="text-[10px] text-emerald-100 font-extrabold uppercase tracking-wider">Tổng Quân Số</p>
                <p className="text-2xl font-black mt-1">
                  {homepageStats.totalParticipants}{" "}
                  <span className="text-xs font-normal text-emerald-200">người</span>
                </p>
                <p className="text-[10px] text-emerald-200 font-medium mt-1.5">
                  NV: {homepageStats.totalEmployees} • TN: {homepageStats.totalCompanions}
                </p>
              </div>

              {/* Card 2: Nhân viên */}
              <div className="bg-white p-4.5 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-3">
                <div className="p-3 bg-emerald-50 text-[#059669] rounded-xl border border-emerald-100">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Nhân viên</p>
                  <p className="text-xl font-black text-slate-800 mt-0.5">
                    {homepageStats.totalEmployees} <span className="text-xs font-normal text-slate-500">người</span>
                  </p>
                </div>
              </div>

              {/* Card 3: Thân nhân */}
              <div className="bg-white p-4.5 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-3">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Thân nhân</p>
                  <p className="text-xl font-black text-slate-800 mt-0.5">
                    {homepageStats.totalCompanions} <span className="text-xs font-normal text-slate-500">người</span>
                  </p>
                </div>
              </div>

              {/* Card 4: Tuổi trung bình */}
              <div className="bg-white p-4.5 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-3">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Tuổi trung bình</p>
                  <p className="text-xl font-black text-slate-800 mt-0.5">
                    {homepageStats.avgAge} <span className="text-xs font-normal text-slate-500">tuổi</span>
                  </p>
                </div>
              </div>
            </div>

            {/* NAVIGATION BUTTONS GRID (6 CORE SECTIONS) */}
            <div className="space-y-3.5">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Danh mục cổng thông tin</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" id="homepage-navigation-grid">
                
                {/* 1. Thông tin Resort */}
                <button
                  onClick={() => setCurrentPage("resort")}
                  className="bg-white hover:bg-slate-50 border border-slate-200/60 p-5 rounded-2xl shadow-sm text-left hover:border-emerald-200 hover:-translate-y-1 transition-all cursor-pointer space-y-3 relative group overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-bl-full group-hover:bg-emerald-500/10 transition-colors" />
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#059669] flex items-center justify-center border border-emerald-100 shadow-sm">
                    <Hotel className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-800 group-hover:text-[#059669] transition-colors flex items-center gap-1.5">
                      Thông tin Resort
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                      Khám phá bãi biển Quỳnh Nghĩa, tiện ích phòng ốc, các khu hoạt động teambuilding và lưu ý chuẩn bị hành lý trước chuyến đi nghỉ mát.
                    </p>
                  </div>
                </button>

                {/* 2. Danh sách đoàn */}
                <button
                  onClick={() => setCurrentPage("delegation")}
                  className="bg-white hover:bg-slate-50 border border-slate-200/60 p-5 rounded-2xl shadow-sm text-left hover:border-blue-200 hover:-translate-y-1 transition-all cursor-pointer space-y-3 relative group overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-bl-full group-hover:bg-blue-500/10 transition-colors" />
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-sm">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-800 group-hover:text-blue-600 transition-colors flex items-center gap-1.5">
                      Danh sách đoàn
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                      Tra cứu, tìm kiếm danh sách toàn bộ cán bộ khoa Hồi sức ngoại và người thân đã đăng ký tham gia kỳ nghỉ mát 2026.
                    </p>
                  </div>
                </button>

                {/* 3. Thông tin phòng */}
                <button
                  onClick={() => setCurrentPage("rooms")}
                  className="bg-white hover:bg-slate-50 border border-slate-200/60 p-5 rounded-2xl shadow-sm text-left hover:border-purple-200 hover:-translate-y-1 transition-all cursor-pointer space-y-3 relative group overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/5 rounded-bl-full group-hover:bg-purple-500/10 transition-colors" />
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 shadow-sm">
                    <Bed className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-800 group-hover:text-purple-600 transition-colors flex items-center gap-1.5">
                      Thông tin phòng
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                      Xem danh sách sắp xếp phân phòng ngủ tự động tại Resort. Các gia đình được xếp phòng VIP, nhân viên đơn lẻ được ghép đôi phòng tiện nghi.
                    </p>
                  </div>
                </button>

                {/* 4. Thông tin lái xe */}
                <button
                  onClick={() => setCurrentPage("drivers")}
                  className="bg-white hover:bg-slate-50 border border-slate-200/60 p-5 rounded-2xl shadow-sm text-left hover:border-emerald-200 hover:-translate-y-1 transition-all cursor-pointer space-y-3 relative group overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-rose-500/5 rounded-bl-full group-hover:bg-rose-500/10 transition-colors" />
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 shadow-sm">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-800 group-hover:text-rose-600 transition-colors flex items-center gap-1.5">
                      Thông tin lái xe
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                      Tra cứu thông tin liên lạc của các tài xế, số điện thoại trưởng xe điều phối từng đoàn xe, giờ giấc xuất phát và điểm đón chính xác.
                    </p>
                  </div>
                </button>

                {/* 5. Danh sách theo xe */}
                <button
                  onClick={() => setCurrentPage("vehicles")}
                  className="bg-white hover:bg-slate-50 border border-slate-200/60 p-5 rounded-2xl shadow-sm text-left hover:border-amber-200 hover:-translate-y-1 transition-all cursor-pointer space-y-3 relative group overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 rounded-bl-full group-hover:bg-amber-500/10 transition-colors" />
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 shadow-sm">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-800 group-hover:text-amber-600 transition-colors flex items-center gap-1.5">
                      Danh sách theo xe
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                      Xem phân bổ chỗ ngồi hành khách theo Xe số 1 và Xe số 2. Đảm bảo toàn bộ các thành viên trong gia đình luôn di chuyển cùng nhau.
                    </p>
                  </div>
                </button>

                {/* 6. Lịch trình */}
                <button
                  onClick={() => setCurrentPage("itinerary")}
                  className="bg-white hover:bg-slate-50 border border-slate-200/60 p-5 rounded-2xl shadow-sm text-left hover:border-orange-200 hover:-translate-y-1 transition-all cursor-pointer space-y-3 relative group overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-orange-500/5 rounded-bl-full group-hover:bg-orange-500/10 transition-colors" />
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100 shadow-sm">
                    <Sun className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-800 group-hover:text-orange-600 transition-colors flex items-center gap-1.5">
                      Lịch trình du lịch hè
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                      Xem chi tiết kế hoạch các hoạt động, thời gian biểu và điểm đến trong suốt 3 ngày 2 đêm của chuyến đi.
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* REGISTRATION BUTTON AT BOTTOM */}
            <div className="flex flex-col items-center justify-center p-6 bg-emerald-50/50 border border-emerald-100/30 rounded-2xl text-center space-y-4 mt-8" id="registration-action-container">
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold text-slate-800">BẠN CHƯA ĐĂNG KÝ THÔNG TIN?</h3>
                <p className="text-xs text-slate-500">Đăng ký ngay hôm nay để nhận thông báo sắp xếp phòng nghỉ và phương tiện xe đưa đón sớm nhất.</p>
              </div>
              <button
                onClick={() => {
                  setEditingRegistration(null);
                  setIsFormOpen(true);
                }}
                className="group relative inline-flex items-center gap-2.5 px-8 py-3.5 bg-[#059669] hover:bg-[#047857] text-white font-black rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all transform duration-250 cursor-pointer text-xs tracking-wider active:scale-95"
                id="open-registration-form-btn"
              >
                <Plus className="w-4 h-4 font-bold group-hover:scale-110 transition-transform" />
                ĐĂNG KÝ THÔNG TIN
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6" id="subpage-content">
            {/* SUBPAGE HEADER BREADCRUMB */}
            <div className="hidden sm:flex items-center justify-between bg-white border border-slate-200/60 px-5 py-4.5 rounded-2xl shadow-sm">
              <button
                onClick={() => setCurrentPage("home")}
                className="inline-flex items-center gap-2 text-xs font-black text-slate-600 hover:text-[#059669] transition-colors cursor-pointer bg-slate-50 hover:bg-emerald-50 px-4 py-2 rounded-xl border border-slate-200 hover:border-emerald-100 shadow-sm active:scale-95"
              >
                <ArrowLeft className="w-4 h-4" />
                Quay lại
              </button>
              
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-semibold uppercase tracking-wider">
                <span className="cursor-pointer hover:text-[#059669]" onClick={() => setCurrentPage("home")}>Trang chủ</span>
                <span>/</span>
                <span className="text-[#059669]">
                  {currentPage === "resort" && "Thông tin Resort"}
                  {currentPage === "delegation" && "Danh sách đoàn"}
                  {currentPage === "rooms" && "Thông tin phòng"}
                  {currentPage === "drivers" && "Thông tin lái xe"}
                  {currentPage === "vehicles" && "Danh sách theo xe"}
                </span>
              </div>
            </div>

            {/* RENDER ACTIVE PAGE */}
            <div className="animate-fadeIn">
              {currentPage === "itinerary" && <Itinerary />}
          {currentPage === "resort" && <ResortInfo />}
              {currentPage === "delegation" && (
                <Dashboard
                  registrations={registrations}
                  onDeleteRegistration={handleDeleteRegistration}
                  onEditRegistration={handleEditRegistration}
                />
              )}
              {currentPage === "rooms" && <RoomInfo registrations={registrations} />}
              {currentPage === "drivers" && <DriverInfo />}
              {currentPage === "vehicles" && <VehicleList registrations={registrations} />}
            </div>
          </div>
        )}

        {/* REGISTRATION FORM MODAL */}
        <AnimatePresence>
          {isFormOpen && (
            <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
              {/* Backdrop Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleCloseForm}
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-md"
              />

              {/* Modal Container */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ type: "spring", duration: 0.35, bounce: 0.1 }}
                className="relative bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden border border-slate-100 z-10 max-h-[90vh] flex flex-col"
              >
                {/* Modal Header */}
                <div className="px-6 py-5 bg-[#059669] text-white flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-base tracking-tight uppercase">
                      {editingRegistration ? "Cập nhật thông tin đăng ký" : "Đăng ký thông tin"}
                    </h3>
                    <p className="text-[11px] text-sky-100 mt-0.5">
                      {editingRegistration ? "Chỉnh sửa thông tin đi nghỉ hè của nhân viên" : "Nhập thông tin nhân viên và người thân đi cùng"}
                    </p>
                  </div>
                  <button
                    onClick={handleCloseForm}
                    className="p-1.5 hover:bg-white/10 rounded-xl text-white/80 hover:text-white transition-all cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="overflow-y-auto p-6 bg-slate-50/50">
                  <RegistrationForm 
                    onRegisterSuccess={handleRegisterSuccess} 
                    editingRegistration={editingRegistration}
                    onCancel={handleCloseForm}
                  />
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>



      {/* PERSISTENT BOTTOM NAVIGATION BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200/80 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] z-40 pb-safe" id="bottom-navigation-bar">
        <div className={`max-w-md mx-auto h-16 flex items-center px-6 transition-all duration-300 ${
          currentPage !== "home" ? "justify-around" : "justify-center"
        }`}>
          {currentPage !== "home" && (
            <button
              onClick={() => setCurrentPage("home")}
              className="flex flex-col items-center justify-center text-slate-500 hover:text-[#059669] active:scale-95 transition-all cursor-pointer group"
            >
              <ArrowLeft className="w-5 h-5 text-slate-500 group-hover:text-[#059669] transition-colors" />
              <span className="text-[11px] font-bold tracking-tight mt-1 transition-colors group-hover:text-[#059669]">Quay lại</span>
            </button>
          )}

          <button
            onClick={() => setCurrentPage("home")}
            className={`flex flex-col items-center justify-center active:scale-95 transition-all cursor-pointer group ${
              currentPage === "home"
                ? "text-[#059669] font-black"
                : "text-slate-500 hover:text-[#059669]"
            }`}
          >
            <Home className={`w-5 h-5 transition-colors ${currentPage === "home" ? "text-[#059669]" : "text-slate-500 group-hover:text-[#059669]"}`} />
            <span className={`text-[11px] tracking-tight mt-1 transition-colors ${currentPage === "home" ? "text-[#059669] font-black" : "font-semibold text-slate-500 group-hover:text-[#059669]"}`}>Trang chủ</span>
          </button>
        </div>
      </div>

      {/* TOAST SYSTEM (FLOAT NOTIFICATIONS) */}
      <div className="fixed bottom-24 sm:bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none" id="toast-container">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.95 }}
              transition={{ type: "spring", damping: 15, stiffness: 200 }}
              className={`p-4 rounded-xl border shadow-lg flex items-start gap-3 pointer-events-auto bg-white ${
                t.type === "success"
                  ? "border-emerald-100 text-emerald-800 shadow-emerald-100/30"
                  : t.type === "danger"
                  ? "border-rose-100 text-rose-800 shadow-rose-100/30"
                  : "border-sky-100 text-sky-800 shadow-sky-100/30"
              }`}
            >
              {t.type === "success" && (
                <div className="text-emerald-500 shrink-0 mt-0.5">
                  <CheckCircle className="w-5 h-5 fill-emerald-50 text-emerald-500" />
                </div>
              )}
              {t.type === "danger" && (
                <div className="text-rose-500 shrink-0 mt-0.5">
                  <AlertCircle className="w-5 h-5 fill-rose-50 text-rose-500" />
                </div>
              )}
              {t.type === "info" && (
                <div className="text-sky-500 shrink-0 mt-0.5">
                  <Info className="w-5 h-5 fill-sky-50 text-sky-500" />
                </div>
              )}

              <div className="flex-1">
                <p className="font-bold text-xs leading-snug">{t.title}</p>
                <p className="text-[11px] opacity-90 mt-0.5 leading-relaxed">{t.message}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
