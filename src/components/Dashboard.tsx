import React, { useState, useMemo } from "react";
import {
  Users,
  Search,
  Download,
  Trash2,
  ChevronDown,
  ChevronUp,
  UserCheck,
  Heart,
  Activity,
  Building2,
  Calendar,
  AlertCircle,
  FileSpreadsheet,
  Phone,
  Pencil,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Registration } from "../types";
import { calculateAge, formatDate, exportToCSV } from "../utils";

interface DashboardProps {
  registrations: Registration[];
  onDeleteRegistration: (id: string) => void;
  onEditRegistration: (registration: Registration) => void;
}

export default function Dashboard({ registrations, onDeleteRegistration, onEditRegistration }: DashboardProps) {
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [companionFilter, setCompanionFilter] = useState("Tất cả");

  // Expanded registration IDs state
  const [expandedRegs, setExpandedRegs] = useState<Record<string, boolean>>({});

  // Delete confirmation state
  const [deleteConfirmReg, setDeleteConfirmReg] = useState<{ id: string; name: string } | null>(null);

  // Toggle expanded state
  const toggleExpand = (id: string) => {
    setExpandedRegs((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Statistics
  const stats = useMemo(() => {
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

  // Filtered registrations
  const filteredRegistrations = useMemo(() => {
    return registrations.filter((reg) => {
      // 1. Search filter (checks employee name, employee phone, and companion names)
      const query = searchTerm.toLowerCase().trim();
      const matchSearch =
        !query ||
        reg.employee.fullName.toLowerCase().includes(query) ||
        reg.employee.phone.includes(query) ||
        reg.companions.some((c) => c.fullName.toLowerCase().includes(query));

      // 2. Companion count filter
      const hasCompanions = reg.companions.length > 0;
      const matchCompanion =
        companionFilter === "Tất cả" ||
        (companionFilter === "Có thân nhân" && hasCompanions) ||
        (companionFilter === "Không có" && !hasCompanions);

      return matchSearch && matchCompanion;
    });
  }, [registrations, searchTerm, companionFilter]);

  return (
    <div className="space-y-6" id="dashboard-wrapper">
      {/* STATISTICS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="stats-grid">
        {/* Card 1: Tổng cộng */}
        <div className="bg-[#059669] text-white p-4 rounded-2xl shadow-md relative overflow-hidden">
          <div className="absolute right-[-10px] bottom-[-10px] opacity-15">
            <Users className="w-24 h-24" />
          </div>
          <p className="text-xs text-emerald-100 font-medium">Tổng Quân số</p>
          <p className="text-2xl font-bold mt-1" id="stat-total">
            {stats.totalParticipants}{" "}
            <span className="text-xs font-normal text-emerald-200">người</span>
          </p>
          <div className="mt-2 text-[10px] text-emerald-100/80 flex items-center gap-1">
            <span>NV: {stats.totalEmployees}</span> • <span>Thân nhân: {stats.totalCompanions}</span>
          </div>
        </div>

        {/* Card 2: Nhân viên */}
        <div className="bg-[#059669] text-white p-4 rounded-2xl shadow-md relative overflow-hidden flex items-center gap-3">
          <div className="p-3 bg-white/15 text-white rounded-xl">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-emerald-100 font-medium">Số nhân viên</p>
            <p className="text-xl font-bold text-white mt-0.5" id="stat-employees">
              {stats.totalEmployees}
            </p>
          </div>
        </div>

        {/* Card 3: Thân nhân */}
        <div className="bg-[#059669] text-white p-4 rounded-2xl shadow-md relative overflow-hidden flex items-center gap-3">
          <div className="p-3 bg-white/15 text-white rounded-xl">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-emerald-100 font-medium">Số thân nhân đi cùng</p>
            <p className="text-xl font-bold text-white mt-0.5" id="stat-companions">
              {stats.totalCompanions}
            </p>
          </div>
        </div>

        {/* Card 4: Tuổi trung bình */}
        <div className="bg-[#059669] text-white p-4 rounded-2xl shadow-md relative overflow-hidden flex items-center gap-3">
          <div className="p-3 bg-white/15 text-white rounded-xl">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-emerald-100 font-medium">Độ tuổi trung bình</p>
            <p className="text-xl font-bold text-white mt-0.5" id="stat-avg-age">
              {stats.avgAge} <span className="text-xs font-normal text-emerald-200">tuổi</span>
            </p>
          </div>
        </div>
      </div>

      {/* FILTER & ACTIONS BAR */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        {/* Left: Inputs */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          {/* Search */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm theo Tên, SĐT..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-100 focus:border-sky-500 transition-all"
            />
          </div>

          {/* Companion Filter */}
          <div className="w-full sm:w-48">
            <select
              value={companionFilter}
              onChange={(e) => setCompanionFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-100 focus:border-sky-500 transition-all appearance-none cursor-pointer"
            >
              <option value="Tất cả">Thân nhân: Tất cả</option>
              <option value="Có thân nhân">Có thân nhân đi kèm</option>
              <option value="Không có">Đi một mình</option>
            </select>
          </div>
        </div>
      </div>

      {/* REGISTRATION TABLE */}
      <div className="md:bg-white md:rounded-2xl md:border md:border-slate-100 md:shadow-sm md:overflow-hidden" id="dashboard-table-card">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-6 py-4 flex items-center justify-between mb-4 md:mb-0 md:rounded-none md:border-0 md:border-b md:border-slate-100 md:shadow-none">
          <h3 className="text-sm font-semibold text-slate-800">
            Danh sách đăng ký ({filteredRegistrations.length})
          </h3>
          {searchTerm || companionFilter !== "Tất cả" ? (
            <button
              onClick={() => {
                setSearchTerm("");
                setCompanionFilter("Tất cả");
              }}
              className="text-[11px] font-semibold text-sky-600 hover:underline"
            >
              Đặt lại bộ lọc
            </button>
          ) : null}
        </div>

        {filteredRegistrations.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-100 shadow-sm md:bg-transparent md:border-0 md:shadow-none">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-400 mb-3">
              <AlertCircle className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-slate-600">Không tìm thấy kết quả nào</p>
            <p className="text-xs text-slate-400 mt-1">
              Hãy thử thay đổi từ khóa tìm kiếm hoặc các tiêu chí bộ lọc.
            </p>
          </div>
        ) : (
          <>
            {/* DESKTOP TABLE VIEW */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse" id="registrations-table">
                <thead>
                  <tr className="bg-[#059669] text-[11px] font-bold text-white uppercase tracking-wider border-b border-emerald-700">
                    <th className="py-3 px-4 w-12 text-center rounded-tl-2xl">STT</th>
                    <th className="py-3 px-4">Nhân viên</th>
                    <th className="py-3 px-4 hidden md:table-cell">Thông tin liên lạc</th>
                    <th className="py-3 px-4 text-center">Số thân nhân</th>
                    <th className="py-3 px-4 text-center rounded-tr-2xl">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/80 text-xs text-slate-700">
                  {filteredRegistrations.map((reg, idx) => {
                    const hasCompanions = reg.companions.length > 0;
                    const isExpanded = !!expandedRegs[reg.id];

                    return (
                      <React.Fragment key={reg.id}>
                        {/* Main row */}
                        <tr
                          className={`hover:bg-slate-50/40 transition-colors ${
                            isExpanded ? "bg-slate-50/20" : ""
                          }`}
                        >
                          {/* STT */}
                          <td className="py-4 px-4 text-center text-slate-400 font-medium">
                            {idx + 1}
                          </td>

                          {/* Nhân viên */}
                          <td 
                            className={`py-4 px-4 ${hasCompanions ? "cursor-pointer select-none" : ""}`}
                            onClick={() => hasCompanions && toggleExpand(reg.id)}
                            title={hasCompanions ? "Nhấp để xem/thu gọn thân nhân" : ""}
                          >
                            <div className="flex flex-col">
                              <p className="font-bold text-[#059669] uppercase hover:text-emerald-800 transition-colors">
                                {reg.employee.fullName.toUpperCase()}
                              </p>
                              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-slate-400 mt-1">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                                  <span>
                                    {formatDate(reg.employee.dob)} ({calculateAge(reg.employee.dob)} tuổi)
                                  </span>
                                </div>
                                <div className="md:hidden flex items-center gap-1">
                                  <span className="text-slate-300">|</span>
                                  <span className="font-semibold text-slate-600">{reg.employee.phone}</span>
                                  {reg.employee.phone && (
                                    <a
                                      href={`tel:${reg.employee.phone}`}
                                      className="inline-flex items-center gap-0.5 text-[9px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-200/30 transition-colors cursor-pointer"
                                      title="Gọi điện cho nhân viên"
                                    >
                                      <Phone className="w-2.5 h-2.5" />
                                      Gọi ngay
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Thông tin liên lạc */}
                          <td className="py-4 px-4 hidden md:table-cell">
                            <div className="flex flex-col gap-1.5">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-slate-600">{reg.employee.phone}</span>
                                {reg.employee.phone && (
                                  <a
                                    href={`tel:${reg.employee.phone}`}
                                    className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-1.5 py-0.5 rounded-md border border-emerald-200/30 transition-colors cursor-pointer"
                                    title="Gọi điện cho nhân viên"
                                  >
                                    <Phone className="w-2.5 h-2.5" />
                                    Gọi ngay
                                  </a>
                                )}
                              </div>
                              {reg.notes && (
                                <span className="text-[10px] text-sky-600 font-medium truncate max-w-[180px]" title={reg.notes}>
                                  Ghi chú: {reg.notes}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Số thân nhân */}
                          <td className="py-4 px-4 text-center">
                            {hasCompanions ? (
                              <button
                                type="button"
                                onClick={() => toggleExpand(reg.id)}
                                className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-full font-bold text-[10px] transition-all cursor-pointer"
                              >
                                <Heart className="w-2.5 h-2.5 fill-emerald-500 stroke-none" />
                                {reg.companions.length} người
                              </button>
                            ) : (
                              <span className="text-slate-400 text-[10px]">Đi một mình</span>
                            )}
                          </td>

                          {/* Thao tác */}
                          <td className="py-4 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => onEditRegistration(reg)}
                                className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors inline-block cursor-pointer"
                                title="Sửa thông tin đăng ký"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setDeleteConfirmReg({ id: reg.id, name: reg.employee.fullName });
                                }}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors inline-block cursor-pointer"
                                title="Xóa bản đăng ký"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Expanded Companion List row */}
                        {hasCompanions && isExpanded && (
                          <tr>
                            <td colSpan={5} className="bg-slate-50/50 p-0 border-y border-slate-100">
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="px-6 py-4"
                              >
                                <div className="border-l-2 border-emerald-400 pl-4 space-y-3">
                                  <h4 className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                                    <Heart className="w-3.5 h-3.5 fill-emerald-500 stroke-none animate-pulse" />
                                    Danh sách thân nhân đi cùng nhân viên
                                  </h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {reg.companions.map((comp) => (
                                      <div
                                        key={comp.id}
                                        className="p-3 bg-white border border-slate-200/60 rounded-xl flex flex-col justify-between shadow-sm relative animate-fade-in"
                                      >
                                        <div>
                                          <div className="flex items-center justify-between mb-1.5">
                                            <span className="font-bold text-slate-800 text-xs">
                                              {comp.fullName}
                                            </span>
                                            <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-bold rounded-md uppercase">
                                              {comp.relationship}
                                            </span>
                                          </div>
                                          <div className="space-y-1.5 text-[10px] text-slate-500">
                                            <div className="flex items-center gap-1">
                                              <Calendar className="w-3 h-3 text-slate-400" />
                                              <span>
                                                {formatDate(comp.dob)} ({calculateAge(comp.dob)} tuổi)
                                              </span>
                                            </div>
                                            {comp.phone && (
                                              <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-100">
                                                <div className="flex items-center gap-1">
                                                  <Phone className="w-3 h-3 text-slate-400" />
                                                  <span className="font-semibold text-slate-600">{comp.phone}</span>
                                                </div>
                                                <a
                                                  href={`tel:${comp.phone}`}
                                                  className="inline-flex items-center gap-1.5 text-[9px] font-extrabold text-white bg-[#059669] hover:bg-[#047857] px-2 py-1 rounded border-b-[3px] border-[#036c4b] active:border-b-[1px] active:translate-y-[2px] transition-all cursor-pointer"
                                                  title="Gọi điện cho thân nhân"
                                                >
                                                  <Phone className="w-2.5 h-2.5" />
                                                  Gọi ngay
                                                </a>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </motion.div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* MOBILE CARD VIEW */}
            <div className="block md:hidden space-y-4">
              {filteredRegistrations.map((reg) => {
                const hasCompanions = reg.companions.length > 0;
                const isExpanded = !!expandedRegs[reg.id];

                return (
                  <div
                    key={reg.id}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 hover:border-emerald-100/50 transition-all"
                  >
                    {/* Employee Info Header */}
                    <div className="flex items-start">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-extrabold text-[#059669] text-base uppercase tracking-wide">
                          {reg.employee.fullName.toUpperCase()}
                        </h4>
                        <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>
                            {formatDate(reg.employee.dob)} ({calculateAge(reg.employee.dob)} tuổi)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Contact detail & optional note */}
                    <div className="mt-3 space-y-2">
                      {reg.employee.phone && (
                        <div className="flex items-center justify-between bg-slate-50/80 border border-slate-100 rounded-xl p-2.5">
                          <div className="flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="font-bold text-slate-700 text-xs">{reg.employee.phone}</span>
                          </div>
                          <a
                            href={`tel:${reg.employee.phone}`}
                            className="inline-flex items-center gap-1.5 text-[10px] font-extrabold text-white bg-[#059669] hover:bg-[#047857] px-3.5 py-1.5 rounded-xl border-b-[3px] border-[#036c4b] active:border-b-[1px] active:translate-y-[2px] transition-all shadow-md shadow-emerald-900/10 cursor-pointer"
                          >
                            <Phone className="w-3 h-3" />
                            Gọi ngay
                          </a>
                        </div>
                      )}

                      {reg.notes && (
                        <div className="bg-sky-50/30 border border-sky-100/40 rounded-xl p-2.5 text-[11px] text-sky-700">
                          <span className="font-semibold">Ghi chú:</span> {reg.notes}
                        </div>
                      )}
                    </div>

                    {/* Companions Badge & Toggle */}
                    {hasCompanions ? (
                      <div className="mt-3 pt-3 border-t border-slate-100/60">
                        <button
                          type="button"
                          onClick={() => toggleExpand(reg.id)}
                          className="w-full flex items-center justify-between p-2.5 bg-emerald-50/50 hover:bg-emerald-50 rounded-xl border border-emerald-100/40 transition-all text-[11px] font-semibold text-emerald-800 cursor-pointer"
                        >
                          <span className="flex items-center gap-2">
                            <Heart className="w-3.5 h-3.5 fill-emerald-500 stroke-none animate-pulse" />
                            Thân nhân đi cùng: <b className="text-emerald-900 bg-white px-2 py-0.5 rounded-md border border-emerald-100 font-extrabold text-[11px]">{reg.companions.length} người</b>
                          </span>
                          <span className="text-emerald-600 flex items-center gap-1 text-[10px]">
                            {isExpanded ? "Thu gọn" : "Xem danh sách"}
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </span>
                        </button>
                      </div>
                    ) : (
                      <div className="mt-3 pt-3 border-t border-slate-100/60 flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-500 bg-slate-100/60 border border-slate-200/30 px-3 py-1 rounded-xl uppercase tracking-wider">
                          Đi một mình
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => onEditRegistration(reg)}
                            className="px-3 py-1.5 text-sky-600 hover:text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-xl transition-all cursor-pointer flex items-center gap-1 text-xs font-bold border border-sky-100 shadow-sm"
                          >
                            <Pencil className="w-3.5 h-3.5 text-sky-500" /> Sửa
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setDeleteConfirmReg({ id: reg.id, name: reg.employee.fullName });
                            }}
                            className="px-3 py-1.5 text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-all cursor-pointer flex items-center gap-1 text-xs font-bold border border-rose-100/40 shadow-sm"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Xóa
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Companion List Drawer */}
                    {hasCompanions && isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 pl-3 border-l-2 border-emerald-500 space-y-2"
                      >
                        <h5 className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider mb-2 mt-1">
                          Danh sách thân nhân cụ thể:
                        </h5>
                        <div className="space-y-2">
                          {reg.companions.map((comp) => (
                            <div
                              key={comp.id}
                              className="p-3 bg-slate-50/80 border border-slate-200/50 rounded-xl"
                            >
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="font-bold text-slate-800 text-xs">
                                  {comp.fullName}
                                </span>
                                <span className="inline-block px-2 py-0.5 bg-emerald-100/60 text-emerald-800 text-[9px] font-bold rounded-md uppercase">
                                  {comp.relationship}
                                </span>
                              </div>
                              <div className="space-y-1.5 text-[10px] text-slate-500">
                                <div className="flex items-center gap-1.5">
                                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                  <span>
                                    {formatDate(comp.dob)} ({calculateAge(comp.dob)} tuổi)
                                  </span>
                                </div>
                                {comp.phone && (
                                  <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-200/60">
                                    <div className="flex items-center gap-1">
                                      <Phone className="w-3 h-3 text-slate-400" />
                                      <span className="font-semibold text-slate-600">{comp.phone}</span>
                                    </div>
                                    <a
                                      href={`tel:${comp.phone}`}
                                      className="inline-flex items-center gap-1.5 text-[9px] font-extrabold text-white bg-[#059669] hover:bg-[#047857] px-2.5 py-1.5 rounded-lg border-b-[3px] border-[#036c4b] active:border-b-[1px] active:translate-y-[2px] transition-all shadow-sm cursor-pointer"
                                    >
                                      <Phone className="w-2.5 h-2.5" />
                                      Gọi ngay
                                    </a>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Edit & Delete actions at the bottom of companion list drawer */}
                        <div className="pt-3 border-t border-dashed border-slate-200 mt-3 flex items-center justify-end gap-2">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mr-auto">
                            Tác vụ bản ghi:
                          </span>
                          <button
                            type="button"
                            onClick={() => onEditRegistration(reg)}
                            className="px-3 py-1.5 text-sky-600 hover:text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-xl transition-all cursor-pointer flex items-center gap-1 text-xs font-bold border border-sky-100 shadow-sm"
                          >
                            <Pencil className="w-3.5 h-3.5 text-sky-500" /> Sửa
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setDeleteConfirmReg({ id: reg.id, name: reg.employee.fullName });
                            }}
                            className="px-3 py-1.5 text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-all cursor-pointer flex items-center gap-1 text-xs font-bold border border-rose-100/40 shadow-sm"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Xóa
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmReg && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop overlay with blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirmReg(null)}
              className="absolute inset-0 bg-slate-900/45 backdrop-blur-[1.5px]"
            />
            
            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl relative border border-slate-100 z-10 overflow-hidden"
              id="delete-confirmation-dialog"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 mb-4 animate-bounce">
                  <Trash2 className="w-5 h-5" />
                </div>
                
                <h3 className="text-base font-extrabold text-slate-800">
                  Xác nhận xóa đăng ký?
                </h3>
                
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Bạn có chắc chắn muốn xóa toàn bộ thông tin đăng ký của nhân viên{" "}
                  <span className="font-bold text-rose-600 uppercase">
                    {deleteConfirmReg.name}
                  </span>{" "}
                  và toàn bộ thân nhân đi kèm?
                </p>
                
                <p className="text-[10px] text-rose-500 bg-rose-50 px-2.5 py-1 rounded-md font-medium mt-3 border border-rose-100/40">
                  Hành động này không thể hoàn tác.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmReg(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer border border-slate-200/40"
                >
                  Bỏ qua
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDeleteRegistration(deleteConfirmReg.id);
                    setDeleteConfirmReg(null);
                  }}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-rose-200 cursor-pointer"
                >
                  Xác nhận xóa
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
