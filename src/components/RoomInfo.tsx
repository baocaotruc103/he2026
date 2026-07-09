import React, { useState, useMemo, useEffect } from "react";
import { 
  Bed, 
  Search, 
  User, 
  Users, 
  Key, 
  Home, 
  Info, 
  Plus, 
  Trash2, 
  Edit3, 
  RefreshCw, 
  AlertCircle, 
  Check, 
  Sparkles,
  Database
} from "lucide-react";
import { Registration } from "../types";

interface RoomInfoProps {
  registrations: Registration[];
}

interface RoomAllocation {
  roomNo: string;
  roomType: "Family" | "Double" | "Triple";
  roomTypeName: string;
  capacity: number;
  guests: { name: string; role: string; regId: string }[];
  notes?: string;
}

const formatRoomNo = (rNo: string): string => {
  if (!rNo) return "";
  const clean = rNo.trim().toUpperCase();
  if (clean.startsWith("PHÒNG ") || clean.startsWith("PHONG ")) {
    return `PHÒNG ${clean.replace(/^(PHÒNG|PHONG)\s+/i, "").trim()}`;
  }
  if (clean.startsWith("P.")) {
    return `PHÒNG ${clean.substring(2).trim()}`;
  }
  if (clean.startsWith("P ")) {
    return `PHÒNG ${clean.substring(2).trim()}`;
  }
  if (clean.startsWith("P") && /^\d/.test(clean.substring(1))) {
    return `PHÒNG ${clean.substring(1).trim()}`;
  }
  if (/^\d/.test(clean)) {
    return `PHÒNG ${clean}`;
  }
  return clean;
};

export default function RoomInfo({ registrations }: RoomInfoProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [dbConfig, setDbConfig] = useState<any>(null);

  const isAdmin = typeof window !== "undefined" && (
    window.location.pathname.includes("/admin") ||
    window.location.href.includes("admin") ||
    window.location.hash.includes("admin")
  );

  const showError = (msg: string) => {
    setErrMsg(msg);
    setTimeout(() => setErrMsg(""), 12000);
  };

  // Form states for manual arrangement
  const [selectedRegIds, setSelectedRegIds] = useState<string[]>([]);
  const [regSearchTerm, setRegSearchTerm] = useState("");
  const [selectedGuestNames, setSelectedGuestNames] = useState<string[]>([]);
  const [roomNo, setRoomNo] = useState("");
  const [roomType, setRoomType] = useState<"Family" | "Double" | "Triple">("Double");
  const [roomTypeName, setRoomTypeName] = useState("Deluxe Twin Bed");
  const [isCustomRoomName, setIsCustomRoomName] = useState(false);
  const [customRoomTypeName, setCustomRoomTypeName] = useState("");
  const [roomNotes, setRoomNotes] = useState("");
  const [editingRoomNo, setEditingRoomNo] = useState<string | null>(null);

  // Load custom manual allocations from localStorage
  const [customAllocations, setCustomAllocations] = useState<RoomAllocation[]>(() => {
    const saved = localStorage.getItem("custom_room_allocations");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Lỗi parse custom room allocations:", e);
      }
    }
    return [];
  });

  // Import and setup clientSupabase
  const metaEnv = (import.meta as any).env || {};
  const supabaseUrl = (typeof process !== "undefined" && process.env?.SUPABASE_URL) || metaEnv.VITE_SUPABASE_URL || "";
  const supabaseAnonKey = (typeof process !== "undefined" && process.env?.SUPABASE_ANON_KEY) || metaEnv.VITE_SUPABASE_ANON_KEY || "";
  
  // Need to dynamically require/import or rely on global. For React components, we can just use the same logic as App.tsx
  // We need createClient from "@supabase/supabase-js". It's imported at the top. Let's add it there or here.
  // We'll update the top level imports separately if needed, but we can just use the direct import.
  
  // Sync with backend on mount
  useEffect(() => {
    const fetchAllocations = async () => {
      let useDirectFallback = false;
      try {
        const res = await fetch("/api/room-allocations");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setCustomAllocations(data);
            localStorage.setItem("custom_room_allocations", JSON.stringify(data));
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
              .from("room_allocations")
              .select("allocations")
              .eq("id", "current")
              .single();
            if (!error && data && Array.isArray(data.allocations)) {
              setCustomAllocations(data.allocations);
              localStorage.setItem("custom_room_allocations", JSON.stringify(data.allocations));
            }
          } catch (e) {
            console.error("Lỗi khi tải từ Supabase:", e);
          }
        });
      }
    };
    
    const fetchDbConfig = async () => {
      try {
        const res = await fetch("/api/config");
        if (res.ok) {
          const data = await res.json();
          setDbConfig(data);
        }
      } catch (err) {
        console.error("Lỗi tải thông tin cấu hình database:", err);
      }
    };

    fetchAllocations();
    fetchDbConfig();
  }, [supabaseUrl, supabaseAnonKey]);

  // Active allocations: ONLY use custom manual allocations
  const activeAllocations = useMemo<RoomAllocation[]>(() => {
    return customAllocations;
  }, [customAllocations]);

  // Map member name to their currently assigned room number
  const guestToRoomMap = useMemo(() => {
    const map = new Map<string, string>();
    activeAllocations.forEach(room => {
      room.guests.forEach(g => {
        map.set(g.name, room.roomNo);
      });
    });
    return map;
  }, [activeAllocations]);

  // Save changes to state & localStorage & database
  const saveAllocations = async (list: RoomAllocation[]) => {
    setCustomAllocations(list);
    localStorage.setItem("custom_room_allocations", JSON.stringify(list));
    
    let useDirectFallback = false;
    try {
      const res = await fetch("/api/room-allocations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(list),
      });
      if (!res.ok) {
        throw new Error("Lỗi lưu qua backend");
      }
      setErrMsg(""); // Clear error if success
    } catch (err: any) {
      console.warn("Lỗi gửi lên backend, thực hiện đồng bộ trực tiếp:", err);
      useDirectFallback = true;
    }

    if (useDirectFallback) {
      if (supabaseUrl && supabaseAnonKey) {
        // Use direct import dynamically if we can't import at top easily here, or assume App.tsx provided it?
        // Wait, I should add createClient to imports.
        import("@supabase/supabase-js").then(async ({ createClient }) => {
          const clientSupabase = createClient(supabaseUrl, supabaseAnonKey);
          try {
            const { error } = await clientSupabase
              .from("room_allocations")
              .upsert({
                id: "current",
                allocations: list,
                updated_at: new Date().toISOString()
              }, { onConflict: "id" });
            if (error) throw error;
            setErrMsg("");
          } catch (supabaseErr: any) {
            showError(`Không thể lưu sơ đồ phòng nghỉ lên Supabase: ${supabaseErr.message || supabaseErr}`);
          }
        });
      } else {
        showError("Không kết nối được backend và không có URL Supabase dự phòng.");
      }
    }
  };

  // Clear all manual allocations
  const handleClearAllAllocations = async () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa toàn bộ sơ đồ xếp phòng nghỉ và bắt đầu xếp lại từ đầu?")) {
      setCustomAllocations([]);
      localStorage.removeItem("custom_room_allocations");
      showSuccess("Đã xóa toàn bộ sơ đồ xếp phòng nghỉ thành công!");
      
      let useDirectFallback = false;
      try {
        const res = await fetch("/api/room-allocations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify([]),
        });
        if (!res.ok) {
          throw new Error("Lỗi lưu qua backend");
        }
        setErrMsg("");
      } catch (err: any) {
        useDirectFallback = true;
      }
      
      if (useDirectFallback && supabaseUrl && supabaseAnonKey) {
        import("@supabase/supabase-js").then(async ({ createClient }) => {
          const clientSupabase = createClient(supabaseUrl, supabaseAnonKey);
          await clientSupabase.from("room_allocations").upsert({
            id: "current",
            allocations: [],
            updated_at: new Date().toISOString()
          }, { onConflict: "id" });
        });
      }
    }
  };

  // Toast/Status messaging helper
  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  // Selected registration objects
  const selectedRegs = useMemo(() => {
    return registrations.filter((r) => selectedRegIds.includes(r.id));
  }, [registrations, selectedRegIds]);

  // Handle single select / quick select autocomplete
  const handleEmployeeChange = (regId: string) => {
    if (!regId) {
      setSelectedRegIds([]);
      setSelectedGuestNames([]);
      return;
    }
    setSelectedRegIds([regId]);

    const reg = registrations.find((r) => r.id === regId);
    if (reg) {
      const allNames = [
        reg.employee.fullName,
        ...reg.companions.map((c) => c.fullName)
      ];
      setSelectedGuestNames(allNames);

      if (reg.companions.length > 0) {
        setRoomType("Family");
        setRoomTypeName("Family Suite Ocean View");
        setIsCustomRoomName(false);
      } else {
        setRoomType("Double");
        setRoomTypeName("Deluxe Twin Bed");
        setIsCustomRoomName(false);
      }

      if (!editingRoomNo) {
        const existingNumbers = activeAllocations.map(r => parseInt(r.roomNo.replace(/\D/g, ""))).filter(n => !isNaN(n));
        const maxNum = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 100;
        setRoomNo(`P.${maxNum + 1}`);
      }
    }
  };

  // Toggle multiple registration IDs (families)
  const handleToggleReg = (regId: string) => {
    let newRegIds: string[];
    if (selectedRegIds.includes(regId)) {
      newRegIds = selectedRegIds.filter(id => id !== regId);
    } else {
      newRegIds = [...selectedRegIds, regId];
    }
    setSelectedRegIds(newRegIds);

    // Compute all allowed names
    const activeRegs = registrations.filter(r => newRegIds.includes(r.id));
    const allAllowedNames = activeRegs.flatMap(r => [
      r.employee.fullName,
      ...r.companions.map(c => c.fullName)
    ]);

    // Filter current selected names to only those in the allowed set,
    // and add any guest names from the registration that was just added
    const isAdding = newRegIds.includes(regId);
    let newGuestNames = selectedGuestNames.filter(name => allAllowedNames.includes(name));

    if (isAdding) {
      const addedReg = registrations.find(r => r.id === regId);
      if (addedReg) {
        const addedNames = [
          addedReg.employee.fullName,
          ...addedReg.companions.map(c => c.fullName)
        ];
        addedNames.forEach(name => {
          if (!newGuestNames.includes(name)) {
            newGuestNames.push(name);
          }
        });
      }
    }

    setSelectedGuestNames(newGuestNames);

    // Auto-suggest room settings based on total selected guests
    const totalSelectedCount = newGuestNames.length;
    if (totalSelectedCount > 2) {
      setRoomType("Family");
      setRoomTypeName("Family Suite Ocean View");
      setIsCustomRoomName(false);
    } else if (totalSelectedCount === 2) {
      setRoomType("Double");
      setRoomTypeName("Deluxe Twin Bed");
      setIsCustomRoomName(false);
    }

    if (!editingRoomNo) {
      const existingNumbers = activeAllocations.map(r => parseInt(r.roomNo.replace(/\D/g, ""))).filter(n => !isNaN(n));
      const maxNum = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 100;
      setRoomNo(`P.${maxNum + 1}`);
    }
  };

  // Toggle individual guests in the room list
  const handleToggleGuest = (name: string) => {
    if (selectedGuestNames.includes(name)) {
      setSelectedGuestNames(selectedGuestNames.filter(n => n !== name));
    } else {
      setSelectedGuestNames([...selectedGuestNames, name]);
    }
  };

  // Handle adding/updating room manual layout
  const handleSaveRoom = (e: React.FormEvent) => {
    e.preventDefault();

    if (!roomNo.trim()) {
      alert("Vui lòng nhập số phòng!");
      return;
    }
    if (selectedGuestNames.length === 0) {
      alert("Vui lòng tích chọn ít nhất một người để xếp vào phòng này!");
      return;
    }

    const finalRoomNo = roomNo.trim().toUpperCase();
    const finalRoomTypeName = isCustomRoomName ? (customRoomTypeName.trim() || "Phòng Tùy Chọn VIP") : roomTypeName;

    // Build the guests list based on selected names
    const guestsList: { name: string; role: string; regId: string }[] = [];
    selectedRegs.forEach(reg => {
      if (selectedGuestNames.includes(reg.employee.fullName)) {
        guestsList.push({
          name: reg.employee.fullName,
          role: "Nhân viên",
          regId: reg.id
        });
      }
      reg.companions.forEach(c => {
        if (selectedGuestNames.includes(c.fullName)) {
          guestsList.push({
            name: c.fullName,
            role: `Thân nhân (${c.relationship})`,
            regId: reg.id
          });
        }
      });
    });

    // Prepare current list (use active allocations, making a writable copy)
    let updatedAllocations = JSON.parse(JSON.stringify(activeAllocations)) as RoomAllocation[];

    // DEDUPLICATION: Remove these selected people from any other room they might already be assigned to
    updatedAllocations = updatedAllocations.map(room => {
      room.guests = room.guests.filter(g => !selectedGuestNames.includes(g.name));
      return room;
    }).filter(room => room.guests.length > 0); // Remove completely empty rooms

    // Create the new room allocation
    const newAllocation: RoomAllocation = {
      roomNo: finalRoomNo,
      roomType,
      roomTypeName: finalRoomTypeName,
      capacity: roomType === "Family" ? 4 : (roomType === "Triple" ? 3 : 2),
      guests: guestsList,
      notes: roomNotes.trim() || (roomType === "Family" ? "Phòng gia đình tiện nghi" : "Phòng ghép đồng nghiệp")
    };

    if (editingRoomNo) {
      // If we are editing, we might have renamed the room number or replaced the old one
      const oldIndex = updatedAllocations.findIndex(r => r.roomNo.toUpperCase() === editingRoomNo.toUpperCase());
      const existingNewIndex = updatedAllocations.findIndex(r => r.roomNo.toUpperCase() === finalRoomNo);

      if (existingNewIndex !== -1 && existingNewIndex !== oldIndex) {
        // Merging into an existing room number
        updatedAllocations[existingNewIndex].guests = [
          ...updatedAllocations[existingNewIndex].guests,
          ...guestsList
        ];
        // Remove old room if it's different
        if (oldIndex !== -1) {
          updatedAllocations.splice(oldIndex, 1);
        }
      } else if (oldIndex !== -1) {
        // Replacing the exact edited room
        updatedAllocations[oldIndex] = newAllocation;
      } else {
        updatedAllocations.push(newAllocation);
      }
    } else {
      // New room placement - check if room no already exists
      const existingIndex = updatedAllocations.findIndex(r => r.roomNo.toUpperCase() === finalRoomNo);
      if (existingIndex !== -1) {
        // Confirm override or merge
        if (window.confirm(`Phòng ${finalRoomNo} đã tồn tại trong danh sách. Bạn có muốn THAY THẾ thành viên phòng này bằng các thành viên mới được chọn không?`)) {
          updatedAllocations[existingIndex] = newAllocation;
        } else {
          return;
        }
      } else {
        updatedAllocations.push(newAllocation);
      }
    }

    // Save and alert success
    saveAllocations(updatedAllocations);
    showSuccess(`Sắp xếp phòng ${finalRoomNo} thành công!`);

    // Reset Form
    setSelectedRegIds([]);
    setSelectedGuestNames([]);
    setRoomNo("");
    setRoomNotes("");
    setEditingRoomNo(null);
    setIsFormOpen(false);
  };

  // Edit action on card
  const handleEditRoom = (room: RoomAllocation) => {
    setEditingRoomNo(room.roomNo);
    setRoomNo(room.roomNo);
    setRoomType(room.roomType);
    setRoomNotes(room.notes || "");

    // Set Room name
    const standardOptions = [
      "Family Suite Ocean View",
      "Deluxe Twin Bed",
      "Deluxe Double Bed",
      "Superior Triple Bed",
      "VIP Presidential Suite"
    ];
    if (standardOptions.includes(room.roomTypeName)) {
      setRoomTypeName(room.roomTypeName);
      setIsCustomRoomName(false);
    } else {
      setIsCustomRoomName(true);
      setCustomRoomTypeName(room.roomTypeName);
    }

    // Find the registrations these room guests belong to
    if (room.guests.length > 0) {
      const regIds = Array.from(new Set(room.guests.map(g => g.regId)));
      setSelectedRegIds(regIds);
      setSelectedGuestNames(room.guests.map(g => g.name));
    }

    setIsFormOpen(true);
    // Scroll to form panel smoothly
    document.getElementById("manual-room-form-section")?.scrollIntoView({ behavior: "smooth" });
  };

  // Delete action on card
  const handleDeleteRoom = (roomNoToDelete: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn giải phóng/xóa phòng ${roomNoToDelete}?`)) {
      const updated = activeAllocations.filter(r => r.roomNo.toUpperCase() !== roomNoToDelete.toUpperCase());
      saveAllocations(updated);
      showSuccess(`Đã xóa và giải phóng phòng ${roomNoToDelete}.`);
    }
  };

  // List of all participants allocated in some room
  const allocatedGuestsSet = useMemo(() => {
    return new Set(activeAllocations.flatMap((r) => r.guests.map((g) => g.name)));
  }, [activeAllocations]);

  // Unallocated participants
  const unallocatedGuests = useMemo(() => {
    const list: { name: string; role: string; regId: string; empName: string }[] = [];
    registrations.forEach((r) => {
      // Check employee
      if (!allocatedGuestsSet.has(r.employee.fullName)) {
        list.push({
          name: r.employee.fullName,
          role: "Nhân viên",
          regId: r.id,
          empName: r.employee.fullName
        });
      }
      // Check companions
      r.companions.forEach((c) => {
        if (!allocatedGuestsSet.has(c.fullName)) {
          list.push({
            name: c.fullName,
            role: `Thân nhân (${c.relationship})`,
            regId: r.id,
            empName: r.employee.fullName
          });
        }
      });
    });
    return list;
  }, [registrations, allocatedGuestsSet]);

  // Filtered room allocations based on search
  const filteredRooms = useMemo(() => {
    if (!searchTerm.trim()) return activeAllocations;
    const query = searchTerm.toLowerCase().trim();
    return activeAllocations.filter((room) =>
      room.roomNo.toLowerCase().includes(query) ||
      room.roomTypeName.toLowerCase().includes(query) ||
      room.guests.some((g) => g.name.toLowerCase().includes(query))
    );
  }, [activeAllocations, searchTerm]);

  // Statistics
  const stats = useMemo(() => {
    const totalRooms = activeAllocations.length;
    const familyCount = activeAllocations.filter((r) => r.roomType === "Family").length;
    const otherCount = activeAllocations.filter((r) => r.roomType !== "Family").length;
    const totalAllocatedGuests = activeAllocations.reduce((acc, r) => acc + r.guests.length, 0);
    return { totalRooms, familyCount, otherCount, totalAllocatedGuests };
  }, [activeAllocations]);

  // Quick fill employee details by clicking unallocated name
  const handleQuickSelectUnallocated = (regId: string, name: string) => {
    handleEmployeeChange(regId);
    setIsFormOpen(true);
    document.getElementById("manual-room-form-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="space-y-6" id="room-info-page">
      {/* Page Title */}
      {isAdmin ? (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-slate-200/60 p-4.5 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 rounded-xl text-[#059669] border border-emerald-100 shrink-0">
              <Bed className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 uppercase tracking-tight">Sắp xếp phòng nghỉ</h2>
              <p className="text-xs text-slate-500 font-medium">Xếp phòng thủ công: Chọn một hoặc nhiều gia đình, tích chọn thành viên và điền số phòng nghỉ</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {customAllocations.length > 0 && (
              <button
                onClick={handleClearAllAllocations}
                className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200/50 px-3.5 py-2 rounded-xl active:scale-95 transition-all cursor-pointer shadow-sm"
                title="Xóa toàn bộ sơ đồ xếp phòng để xếp lại từ đầu"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Xóa tất cả phòng
              </button>
            )}

            <button
              onClick={() => {
                setIsFormOpen(!isFormOpen);
                if (!isFormOpen) {
                  // reset form if opening fresh
                  setEditingRoomNo(null);
                  setSelectedRegIds([]);
                  setSelectedGuestNames([]);
                  setRoomNo("");
                  setRoomNotes("");
                }
              }}
              className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase text-white bg-[#059669] hover:bg-[#047857] px-4 py-2 rounded-xl active:scale-95 transition-all cursor-pointer shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              {isFormOpen ? "Đóng bộ sắp phòng" : "Xếp phòng thủ công"}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 bg-white border border-slate-200/60 p-4.5 rounded-2xl shadow-sm">
          <div className="p-2.5 bg-emerald-50 rounded-xl text-[#059669] border border-emerald-100 shrink-0">
            <Bed className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800 uppercase tracking-tight">Danh sách bố trí phòng nghỉ cho các thành viên tham gia đoàn</h2>
          </div>
        </div>
      )}

      {/* Success Notification Banner */}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-[#059669] px-4 py-3 rounded-2xl flex items-center gap-2.5 shadow-sm text-xs font-semibold animate-fadeIn">
          <Check className="w-4 h-4 shrink-0 bg-emerald-100 p-0.5 rounded-full" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Database Error Notification Banner */}
      {errMsg && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3.5 rounded-2xl flex items-start gap-2.5 shadow-sm text-xs font-semibold animate-fadeIn">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
          <div className="space-y-1">
            <p className="font-extrabold uppercase tracking-wide text-rose-700">Lỗi đồng bộ dữ liệu:</p>
            <p className="text-rose-600 font-medium leading-relaxed">{errMsg}</p>
          </div>
        </div>
      )}

      {/* Supabase Diagnostics Panel for Admin */}
      {isAdmin && dbConfig && (
        <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl shadow-sm text-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200/60 pb-2.5 gap-2">
            <span className="font-extrabold uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
              <Database className="w-4 h-4 text-emerald-600" />
              Trạng thái đồng bộ Supabase (Chỉ hiển thị với Admin)
            </span>
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold self-start sm:self-center ${dbConfig.supabaseConnected ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
              {dbConfig.supabaseConnected ? "● ĐÃ KẾT NỐI DATABASE" : "● CHẾ ĐỘ DỰ PHÒNG (LOCAL)"}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200/50">
              <span className="text-slate-500 font-medium">Bảng `dang_ky`:</span>
              <span className={`font-bold text-[11px] ${dbConfig.tablesStatus?.dang_ky ? "text-emerald-600" : "text-rose-600"}`}>
                {dbConfig.tablesStatus?.dang_ky ? "✓ Sẵn sàng" : "✕ Chưa tạo / Lỗi RLS"}
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200/50">
              <span className="text-slate-500 font-medium">Bảng `room_allocations`:</span>
              <span className={`font-bold text-[11px] ${dbConfig.tablesStatus?.room_allocations ? "text-emerald-600" : "text-rose-600"}`}>
                {dbConfig.tablesStatus?.room_allocations ? "✓ Sẵn sàng" : "✕ Chưa tạo / Lỗi RLS"}
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200/50">
              <span className="text-slate-500 font-medium">Bảng `vehicle_allocations`:</span>
              <span className={`font-bold text-[11px] ${dbConfig.tablesStatus?.vehicle_allocations ? "text-emerald-600" : "text-rose-600"}`}>
                {dbConfig.tablesStatus?.vehicle_allocations ? "✓ Sẵn sàng" : "✕ Chưa tạo / Lỗi RLS"}
              </span>
            </div>
          </div>
          {(!dbConfig.tablesStatus?.room_allocations || !dbConfig.tablesStatus?.vehicle_allocations) && dbConfig.supabaseConnected && (
            <div className="bg-rose-50 border border-rose-100/80 text-rose-800 p-3.5 rounded-xl space-y-2">
              <p className="font-extrabold text-[11px] uppercase tracking-wider text-rose-700">Lưu ý quan trọng:</p>
              <p className="text-[11px] leading-relaxed text-slate-600 font-medium">
                Dữ liệu xếp phòng và phân xe chưa được lưu vào bảng Supabase vì hệ thống chưa tìm thấy bảng <strong>room_allocations</strong> và <strong>vehicle_allocations</strong> trong cơ sở dữ liệu Supabase của bạn. 
                <br />
                Vui lòng truy cập <strong>Supabase Dashboard</strong> {" -> "} <strong>SQL Editor</strong> {" -> "} nhấn <strong>New query</strong>, sao chép toàn bộ mã SQL trong tệp <strong>supabase_schema.sql</strong> ở thư mục gốc của dự án này, dán vào đó rồi nhấn <strong>Run</strong> để khởi tạo bảng và tắt RLS.
              </p>
              {Object.keys(dbConfig.tableErrors || {}).length > 0 && (
                <div className="bg-white/80 p-2 rounded-lg border border-rose-200/40 text-[10px] font-mono text-slate-500 overflow-x-auto max-h-24">
                  <strong>Chi tiết lỗi từ Supabase:</strong>
                  {Object.entries(dbConfig.tableErrors).map(([tbl, err]: any) => (
                    <div key={tbl} className="truncate">{tbl}: {err}</div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Collapsible Manual Room Allocation Form */}
      {isAdmin && isFormOpen && (
        <div 
          id="manual-room-form-section" 
          className="bg-white rounded-3xl border border-emerald-200/80 shadow-md overflow-hidden animate-fadeIn"
        >
          <div className="bg-gradient-to-r from-[#059669] to-emerald-700 text-white px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-100" />
              <h3 className="font-extrabold text-sm uppercase tracking-wide">
                {editingRoomNo ? `Chỉnh Sửa Phòng ${editingRoomNo}` : "Bộ Sắp Xếp Phòng Thủ Công"}
              </h3>
            </div>
            <span className="text-[10px] bg-emerald-800/60 px-2 py-0.5 rounded-full border border-emerald-500/20 text-emerald-100 font-bold uppercase">
              {editingRoomNo ? "Chế độ sửa" : "Tạo mới"}
            </span>
          </div>

          <form onSubmit={handleSaveRoom} className="p-5 sm:p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* LEFT COLUMN: Employee & Companion checklist */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                    1. Chọn Nhân viên / Gia đình (Có thể chọn nhiều gia đình ghép phòng)
                  </label>
                  <input
                    type="text"
                    placeholder="Tìm nhanh nhân viên / gia đình..."
                    value={regSearchTerm}
                    onChange={(e) => setRegSearchTerm(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 text-xs rounded-xl mb-2 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                  />
                  <div className="border border-slate-200 rounded-2xl p-2 max-h-48 overflow-y-auto space-y-1 bg-slate-50/40">
                    {registrations
                      .filter(reg => 
                        !regSearchTerm || 
                        reg.employee.fullName.toLowerCase().includes(regSearchTerm.toLowerCase()) ||
                        (reg.department && reg.department.toLowerCase().includes(regSearchTerm.toLowerCase()))
                      )
                      .map(reg => {
                        const isSelected = selectedRegIds.includes(reg.id);
                        const companionCount = reg.companions.length;
                        return (
                          <label 
                            key={reg.id} 
                            className={`flex items-center gap-2 p-2 rounded-xl cursor-pointer transition-colors border ${
                              isSelected 
                                ? "bg-emerald-50/60 border-emerald-200 text-emerald-900" 
                                : "bg-white border-slate-100 text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleReg(reg.id)}
                              className="w-3.5 h-3.5 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 accent-[#059669]"
                            />
                            <div className="flex-1 min-w-0 text-xs">
                              <span className="font-bold">{reg.employee.fullName}</span>{" "}
                              <span className="text-slate-500 font-medium">({reg.department || "N/A"})</span>
                              {companionCount > 0 && (
                                <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-slate-100 text-[9px] text-slate-600 font-bold shrink-0">
                                  +{companionCount} người thân
                                </span>
                              )}
                            </div>
                          </label>
                        );
                      })}
                  </div>
                </div>

                {/* AUTOMATIC COMPANION CHECKLIST */}
                {selectedRegs.length > 0 && (
                  <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-4 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200/50 pb-2">
                      <span className="text-xs font-extrabold text-slate-700 uppercase tracking-tight">
                        Thành viên gia đình được chọn
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium italic">
                        (Đã tự chọn cả nhà, tích để bỏ bớt nếu muốn)
                      </span>
                    </div>

                    <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
                      {selectedRegs.map(reg => (
                        <div key={reg.id} className="space-y-2 border-b border-slate-100 last:border-0 pb-3 last:pb-0">
                          <p className="text-[10px] font-black text-[#059669] uppercase tracking-wider">
                            Gia đình {reg.employee.fullName}
                          </p>
                          
                          {/* Employee checkbox */}
                          <label className="flex items-center justify-between p-2.5 bg-white border border-slate-100 rounded-xl hover:bg-emerald-50/20 cursor-pointer transition-colors">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <input
                                type="checkbox"
                                checked={selectedGuestNames.includes(reg.employee.fullName)}
                                onChange={() => handleToggleGuest(reg.employee.fullName)}
                                className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 accent-[#059669]"
                              />
                              <div className="flex flex-col min-w-0">
                                <span className="text-xs font-bold text-slate-800 truncate">{reg.employee.fullName}</span>
                                {guestToRoomMap.has(reg.employee.fullName) && (
                                  <span className="text-[9px] text-amber-600 font-extrabold">
                                    (Đã ở {formatRoomNo(guestToRoomMap.get(reg.employee.fullName) || "")})
                                  </span>
                                )}
                              </div>
                            </div>
                            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100 shrink-0">
                              Nhân viên
                            </span>
                          </label>

                          {/* Companion checkboxes */}
                          {reg.companions.map((comp) => (
                            <label 
                              key={comp.id} 
                              className="flex items-center justify-between p-2.5 bg-white border border-slate-100 rounded-xl hover:bg-emerald-50/20 cursor-pointer transition-colors"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <input
                                  type="checkbox"
                                  checked={selectedGuestNames.includes(comp.fullName)}
                                  onChange={() => handleToggleGuest(comp.fullName)}
                                  className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 accent-[#059669]"
                                />
                                <div className="flex flex-col min-w-0">
                                  <span className="text-xs font-semibold text-slate-700 truncate">{comp.fullName}</span>
                                  {guestToRoomMap.has(comp.fullName) && (
                                    <span className="text-[9px] text-amber-600 font-extrabold">
                                      (Đã ở {formatRoomNo(guestToRoomMap.get(comp.fullName) || "")})
                                    </span>
                                  )}
                                </div>
                              </div>
                              <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 border border-sky-100 shrink-0">
                                Thân nhân ({comp.relationship})
                              </span>
                            </label>
                          ))}
                        </div>
                      ))}
                    </div>

                    {/* Warning if any of them is already in another room */}
                    {(() => {
                      const overlapNames = selectedGuestNames.filter(name => {
                        return activeAllocations.some(room => 
                          (!editingRoomNo || room.roomNo.toUpperCase() !== editingRoomNo.toUpperCase()) && 
                          room.guests.some(g => g.name === name)
                        );
                      });

                      if (overlapNames.length > 0) {
                        return (
                          <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-xl text-[10px] text-amber-800 font-medium flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 shrink-0 text-amber-500 mt-0.5" />
                            <div>
                              <span className="font-bold">Lưu ý di chuyển phòng:</span>{" "}
                              {overlapNames.join(", ")} đang được xếp phòng khác. Lưu sẽ tự động chuyển sang phòng mới này.
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </div>
                )}
              </div>

              {/* RIGHT COLUMN: Room details */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                    2. Nhập Số Phòng (Ví dụ: P.105, P.202)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nhập số phòng..."
                    value={roomNo}
                    onChange={(e) => setRoomNo(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 transition-all font-bold text-slate-800 uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                    3. Xếp Tên / Loại Phòng
                  </label>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <button
                      type="button"
                      onClick={() => {
                        setRoomType("Family");
                        setRoomTypeName("Family Suite Ocean View");
                        setIsCustomRoomName(false);
                      }}
                      className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                        roomType === "Family" && !isCustomRoomName
                          ? "bg-blue-50 border-blue-400 text-blue-700"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      Phòng Gia Đình (Family)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setRoomType("Double");
                        setRoomTypeName("Deluxe Twin Bed");
                        setIsCustomRoomName(false);
                      }}
                      className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                        roomType === "Double" && !isCustomRoomName
                          ? "bg-purple-50 border-purple-400 text-purple-700"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      Phòng Ghép Đôi (Double)
                    </button>
                  </div>

                  {/* Standard select options */}
                  <div className="space-y-2">
                    <select
                      value={isCustomRoomName ? "custom" : roomTypeName}
                      onChange={(e) => {
                        if (e.target.value === "custom") {
                          setIsCustomRoomName(true);
                        } else {
                          setIsCustomRoomName(false);
                          setRoomTypeName(e.target.value);
                          // Auto adjust roomType category
                          if (e.target.value.includes("Family") || e.target.value.includes("VIP")) {
                            setRoomType("Family");
                          } else if (e.target.value.includes("Triple")) {
                            setRoomType("Triple");
                          } else {
                            setRoomType("Double");
                          }
                        }
                      }}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 transition-all font-semibold text-slate-700"
                    >
                      <option value="Deluxe Twin Bed">Deluxe Twin Bed (Standard)</option>
                      <option value="Family Suite Ocean View">Family Suite Ocean View (VIP)</option>
                      <option value="Superior Triple Bed">Superior Triple Bed (3 giường)</option>
                      <option value="VIP Presidential Suite">VIP Presidential Suite (Siêu Cấp)</option>
                      <option value="Deluxe Double Bed">Deluxe Double Bed (1 Giường Lớn)</option>
                      <option value="custom">-- Khác (Tự nhập tên phòng) --</option>
                    </select>

                    {/* Custom text input if custom is chosen */}
                    {isCustomRoomName && (
                      <input
                        type="text"
                        placeholder="Nhập tên phòng tùy chỉnh (ví dụ: Bungalow Beachfront)..."
                        value={customRoomTypeName}
                        onChange={(e) => setCustomRoomTypeName(e.target.value)}
                        className="w-full bg-amber-50/50 border border-amber-200 p-2.5 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-100 focus:border-amber-500 transition-all font-medium text-slate-800"
                        required
                      />
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                    4. Ghi Chú Sắp Phòng
                  </label>
                  <input
                    type="text"
                    placeholder="Ghi chú thêm cho phòng này..."
                    value={roomNotes}
                    onChange={(e) => setRoomNotes(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 transition-all text-slate-700"
                  />
                </div>
              </div>
            </div>

            {/* Form actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setSelectedRegIds([]);
                  setSelectedGuestNames([]);
                  setRoomNo("");
                  setRoomNotes("");
                  setEditingRoomNo(null);
                  setIsFormOpen(false);
                }}
                className="text-xs text-slate-500 font-bold px-4 py-2 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="text-xs text-white bg-[#059669] hover:bg-[#047857] font-black uppercase px-6 py-2.5 rounded-xl cursor-pointer shadow-md active:scale-95 transition-all"
              >
                {editingRoomNo ? "Cập nhật phòng" : "Lưu xếp phòng"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Stats and Search Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Room Stats */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-4 shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center p-2 bg-emerald-50/40 rounded-xl border border-emerald-100/20">
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider">Tổng phòng cấp</p>
            <p className="text-lg font-black text-[#059669] mt-0.5">{stats.totalRooms}</p>
          </div>
          <div className="text-center p-2 bg-blue-50/40 rounded-xl border border-blue-100/20">
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider">Phòng Gia Đình</p>
            <p className="text-lg font-black text-blue-600 mt-0.5">{stats.familyCount}</p>
          </div>
          <div className="text-center p-2 bg-purple-50/40 rounded-xl border border-purple-100/20">
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider">Phòng Ghép</p>
            <p className="text-lg font-black text-purple-600 mt-0.5">{stats.otherCount}</p>
          </div>
          <div className="text-center p-2 bg-amber-50/40 rounded-xl border border-amber-100/20">
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider">Chưa xếp phòng</p>
            <p className={`text-lg font-black mt-0.5 ${unallocatedGuests.length > 0 ? "text-amber-600" : "text-slate-400"}`}>
              {unallocatedGuests.length} người
            </p>
          </div>
        </div>

        {/* Room Search */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex items-center">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Tìm theo tên bạn hoặc số phòng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 transition-all"
            />
          </div>
        </div>
      </div>

      {/* UNALLOCATED PEOPLE DRAWER/HELPER */}
      {unallocatedGuests.length > 0 && (
        <div className="bg-amber-50/60 border border-amber-200/50 rounded-2xl p-4.5 shadow-sm space-y-2.5">
          <div className="flex items-center gap-2 text-amber-800">
            <AlertCircle className="w-4.5 h-4.5 text-amber-500 shrink-0" />
            <h4 className="text-xs font-black uppercase tracking-wider">
              {isAdmin ? `Danh sách chưa được xếp phòng nghỉ (${unallocatedGuests.length}):` : `Danh sách chưa có phòng nghỉ (${unallocatedGuests.length}):`}
            </h4>
          </div>
          <p className="text-[10px] text-slate-500">
            {isAdmin 
              ? "Ấn vào tên nhân viên để mở bộ sắp xếp phòng và tự động điền thông tin xếp phòng cho họ:" 
              : "Danh sách nhân viên chưa có số phòng cụ thể:"}
          </p>
          <div className="flex flex-wrap gap-2">
            {/* Group unallocated by employee/family representation for clean display */}
            {registrations.map(reg => {
              const isEmpUnallocated = unallocatedGuests.some(u => u.name === reg.employee.fullName);
              const unallocatedComps = reg.companions.filter(c => unallocatedGuests.some(u => u.name === c.fullName));
              
              if (!isEmpUnallocated && unallocatedComps.length === 0) return null;

              if (isAdmin) {
                return (
                  <button
                    key={reg.id}
                    onClick={() => handleQuickSelectUnallocated(reg.id, reg.employee.fullName)}
                    className="bg-white hover:bg-emerald-50 border border-amber-200 hover:border-emerald-300 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 active:scale-95 transition-all text-left cursor-pointer group"
                  >
                    <User className="w-3 h-3 text-slate-400 group-hover:text-[#059669]" />
                    <span>
                      {reg.employee.fullName} 
                      {unallocatedComps.length > 0 && ` (+${unallocatedComps.length} người thân)`}
                    </span>
                  </button>
                );
              } else {
                return (
                  <div
                    key={reg.id}
                    className="bg-white border border-amber-100 text-slate-600 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5"
                  >
                    <User className="w-3 h-3 text-slate-400" />
                    <span>
                      {reg.employee.fullName} 
                      {unallocatedComps.length > 0 && ` (+${unallocatedComps.length} người thân)`}
                    </span>
                  </div>
                );
              }
            })}
          </div>
        </div>
      )}

      {/* Allocation Grid */}
      {filteredRooms.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center shadow-sm">
          <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mx-auto mb-3">
            <Home className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-slate-700">Không tìm thấy phòng tương ứng</h4>
          <p className="text-[10px] text-slate-400 mt-1">Vui lòng kiểm tra lại từ khóa tìm kiếm</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" id="room-allocation-grid">
          {filteredRooms.map((room) => (
            <div 
              key={room.roomNo}
              className={`bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all flex flex-col justify-between group ${
                room.roomType === "Family" ? "hover:border-blue-200" : "hover:border-purple-200"
              }`}
            >
              <div>
                {/* Header card with room number */}
                <div className={`px-4 py-3 flex items-center justify-between border-b ${
                  room.roomType === "Family" ? "bg-blue-50/50 border-blue-100/30 text-blue-900" : "bg-purple-50/50 border-purple-100/30 text-purple-900"
                }`}>
                  <div className="flex items-center gap-2">
                    <Key className={`w-4 h-4 ${room.roomType === "Family" ? "text-blue-500" : "text-purple-500"}`} />
                    <span className="font-extrabold text-sm tracking-wide">{formatRoomNo(room.roomNo)}</span>
                  </div>
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider ${
                    room.roomType === "Family" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
                  }`}>
                    {room.roomType === "Family" ? "Gia Đình" : (room.roomType === "Triple" ? "Phòng Ba" : "Phòng Ghép")}
                  </span>
                </div>

                {/* Room details */}
                <div className="p-4 space-y-3.5">
                  <div>
                    {room.roomTypeName !== "Family Suite Ocean View" && (
                      <h4 className="text-xs font-extrabold text-slate-800">{room.roomTypeName}</h4>
                    )}
                    {room.notes && room.notes !== "Phòng gia đình tiện nghi" && (
                      <p className="text-[9px] text-slate-400 mt-0.5 italic">{room.notes}</p>
                    )}
                  </div>

                  {/* Occupants list */}
                  <div className="space-y-2">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Thành viên phòng ({room.guests.length}):</p>
                    <div className="space-y-1.5">
                      {room.guests.map((g, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-slate-50 border border-slate-100 p-2 rounded-xl text-xs">
                          <div className="flex items-center gap-2 min-w-0">
                            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="font-bold text-slate-700 truncate">{g.name}</span>
                          </div>
                          <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded-md ${
                            g.role.includes("Nhân viên") 
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100/50" 
                              : "bg-amber-50 text-amber-700 border border-amber-100/50"
                          }`}>
                            {g.role.includes("Nhân viên") ? "Nhân viên" : "Thân nhân"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* MANUAL ACTION BAR FOOTER FOR CUSTOM ALLOCATION */}
              {isAdmin && (
                <div className="px-4 py-2.5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-end gap-2.5 text-xs">
                  <button
                    onClick={() => handleEditRoom(room)}
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 hover:text-[#059669] transition-colors cursor-pointer"
                    title="Chỉnh sửa phòng này"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDeleteRoom(room.roomNo)}
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Xóa sắp xếp phòng nghỉ"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Xóa
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
