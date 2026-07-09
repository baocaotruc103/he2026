import React, { useState, useEffect } from "react";
import { Plus, Trash2, User, Phone, Calendar, Briefcase, PlusCircle, Sparkles, Heart } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Employee, Companion, Registration } from "../types";
import { validatePhoneNumber } from "../utils";

interface RegistrationFormProps {
  onRegisterSuccess: (registration: Registration) => void;
  editingRegistration?: Registration | null;
  onCancel?: () => void;
}

const RELATIONSHIPS = ["Vợ", "Chồng", "Con"];

export default function RegistrationForm({ onRegisterSuccess, editingRegistration, onCancel }: RegistrationFormProps) {
  // Employee form states
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [phone, setPhone] = useState("");

  // Companions state
  const [companions, setCompanions] = useState<Companion[]>([]);

  // Update form fields when editingRegistration changes
  useEffect(() => {
    if (editingRegistration) {
      setFullName(editingRegistration.employee.fullName);
      setDob(editingRegistration.employee.dob);
      setPhone(editingRegistration.employee.phone);
      setCompanions(editingRegistration.companions || []);
    } else {
      setFullName("");
      setDob("");
      setPhone("");
      setCompanions([]);
    }
  }, [editingRegistration]);

  // Validation error states
  const [errors, setErrors] = useState<{
    employeeName?: string;
    employeeDob?: string;
    employeePhone?: string;
    companions?: Record<string, { fullName?: string; dob?: string; phone?: string }>;
  }>({});

  // Add new empty companion
  const handleAddCompanion = () => {
    const newCompanion: Companion = {
      id: Math.random().toString(36).substring(2, 9),
      fullName: "",
      dob: "",
      phone: "",
      relationship: RELATIONSHIPS[0],
    };
    setCompanions([...companions, newCompanion]);
    // Clear companion errors for this index if any
    setErrors((prev) => ({ ...prev, companions: { ...prev.companions } }));
  };

  // Remove companion
  const handleRemoveCompanion = (id: string) => {
    setCompanions(companions.filter((comp) => comp.id !== id));
    if (errors.companions) {
      const updatedCompErrors = { ...errors.companions };
      delete updatedCompErrors[id];
      setErrors((prev) => ({ ...prev, companions: updatedCompErrors }));
    }
  };

  // Handle companion field changes
  const handleCompanionChange = (id: string, field: keyof Companion, value: string) => {
    setCompanions(
      companions.map((comp) => {
        if (comp.id === id) {
          return { ...comp, [field]: value };
        }
        return comp;
      })
    );

    // Clear specific error on keystroke
    if (errors.companions && errors.companions[id]) {
      const updatedCompErrors = { ...errors.companions };
      const compErr = { ...updatedCompErrors[id] };

      if (field === "fullName") delete compErr.fullName;
      if (field === "dob") delete compErr.dob;
      if (field === "phone") delete compErr.phone;

      if (Object.keys(compErr).length === 0) {
        delete updatedCompErrors[id];
      } else {
        updatedCompErrors[id] = compErr;
      }

      setErrors((prev) => ({ ...prev, companions: updatedCompErrors }));
    }
  };

  // Validate whole form
  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};
    let isValid = true;

    // Validate Employee
    if (!fullName.trim()) {
      newErrors.employeeName = "Vui lòng nhập họ và tên nhân viên.";
      isValid = false;
    } else if (fullName.trim().length < 3) {
      newErrors.employeeName = "Họ và tên phải có ít nhất 3 ký tự.";
      isValid = false;
    }

    if (!dob) {
      newErrors.employeeDob = "Vui lòng chọn ngày tháng năm sinh.";
      isValid = false;
    } else {
      const birthYear = new Date(dob).getFullYear();
      const currentYear = new Date().getFullYear();
      if (birthYear > currentYear - 15) {
        newErrors.employeeDob = "Độ tuổi nhân viên không hợp lệ (phải từ 15 tuổi trở lên).";
        isValid = false;
      }
    }

    if (!phone.trim()) {
      newErrors.employeePhone = "Vui lòng nhập số điện thoại.";
      isValid = false;
    } else if (!validatePhoneNumber(phone)) {
      newErrors.employeePhone = "Số điện thoại không đúng định dạng (VD: 0912345678).";
      isValid = false;
    }

    // Validate Companions
    const companionErrors: Record<string, { fullName?: string; dob?: string; phone?: string }> = {};
    companions.forEach((comp) => {
      const compErr: { fullName?: string; dob?: string; phone?: string } = {};
      let hasCompErr = false;

      if (!comp.fullName.trim()) {
        compErr.fullName = "Nhập họ tên thân nhân.";
        hasCompErr = true;
        isValid = false;
      }

      if (!comp.dob) {
        compErr.dob = "Chọn ngày sinh.";
        hasCompErr = true;
        isValid = false;
      }

      if (comp.phone.trim() && !validatePhoneNumber(comp.phone)) {
        compErr.phone = "SĐT chưa đúng định dạng.";
        hasCompErr = true;
        isValid = false;
      }

      if (hasCompErr) {
        companionErrors[comp.id] = compErr;
      }
    });

    if (Object.keys(companionErrors).length > 0) {
      newErrors.companions = companionErrors;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle Submit Form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const registration: Registration = {
      id: editingRegistration ? editingRegistration.id : Math.random().toString(36).substring(2, 11),
      employee: {
        fullName: fullName.trim(),
        dob,
        phone: phone.trim(),
      },
      companions,
      createdAt: editingRegistration ? editingRegistration.createdAt : new Date().toISOString(),
    };

    onRegisterSuccess(registration);

    // Reset Form
    setFullName("");
    setDob("");
    setPhone("");
    setCompanions([]);
    setErrors({});
  };

  return (
    <div className="bg-white/85 backdrop-blur-md rounded-2xl border border-slate-100 shadow-xl p-6 lg:p-8" id="reg-form-card">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
        <div className="p-2.5 bg-sky-50 text-sky-600 rounded-xl">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight" id="form-title">
            {editingRegistration ? "Cập Nhật Thông Tin Đăng Ký" : "Đăng Ký Nghỉ Hè 2026"}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {editingRegistration ? "Chỉnh sửa thông tin nhân viên và danh sách thân nhân đi cùng" : "Điền đầy đủ thông tin để tham gia kỳ nghỉ hè cùng công ty"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" id="registration-form">
        {/* SECTION 1: NHÂN VIÊN */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1 h-4 bg-sky-500 rounded"></span>
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
              1. Thông tin nhân viên đăng ký
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Họ và tên */}
            <div className="space-y-1.5 md:col-span-2">
              <label htmlFor="emp-fullname" className="block text-xs font-medium text-slate-600">
                Họ và tên nhân viên <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="emp-fullname"
                  type="text"
                  placeholder="Ví dụ: Nguyễn Văn Hải"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (errors.employeeName) setErrors((prev) => ({ ...prev, employeeName: undefined }));
                  }}
                  className={`w-full pl-9 pr-3 py-2 text-sm bg-slate-50/50 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    errors.employeeName
                      ? "border-rose-300 focus:ring-rose-100 focus:border-rose-500"
                      : "border-slate-200 focus:ring-sky-100 focus:border-sky-500"
                  }`}
                />
              </div>
              {errors.employeeName && (
                <p className="text-[11px] text-rose-500 font-medium" id="err-emp-name">
                  {errors.employeeName}
                </p>
              )}
            </div>

            {/* Ngày sinh */}
            <div className="space-y-1.5">
              <label htmlFor="emp-dob" className="block text-xs font-medium text-slate-600">
                Ngày tháng năm sinh <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Calendar className="w-4 h-4" />
                </div>
                <input
                  id="emp-dob"
                  type="date"
                  value={dob}
                  onChange={(e) => {
                    setDob(e.target.value);
                    if (errors.employeeDob) setErrors((prev) => ({ ...prev, employeeDob: undefined }));
                  }}
                  className={`w-full pl-9 pr-3 py-2 text-sm bg-slate-50/50 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    errors.employeeDob
                      ? "border-rose-300 focus:ring-rose-100 focus:border-rose-500"
                      : "border-slate-200 focus:ring-sky-100 focus:border-sky-500"
                  }`}
                />
              </div>
              {errors.employeeDob && (
                <p className="text-[11px] text-rose-500 font-medium" id="err-emp-dob">
                  {errors.employeeDob}
                </p>
              )}
            </div>

            {/* Số điện thoại */}
            <div className="space-y-1.5">
              <label htmlFor="emp-phone" className="block text-xs font-medium text-slate-600">
                Số điện thoại <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  id="emp-phone"
                  type="tel"
                  placeholder="Ví dụ: 0987654321"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (errors.employeePhone) setErrors((prev) => ({ ...prev, employeePhone: undefined }));
                  }}
                  className={`w-full pl-9 pr-3 py-2 text-sm bg-slate-50/50 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    errors.employeePhone
                      ? "border-rose-300 focus:ring-rose-100 focus:border-rose-500"
                      : "border-slate-200 focus:ring-sky-100 focus:border-sky-500"
                  }`}
                />
              </div>
              {errors.employeePhone && (
                <p className="text-[11px] text-rose-500 font-medium" id="err-emp-phone">
                  {errors.employeePhone}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 2: THÂN NHÂN ĐI CÙNG */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-t border-slate-100 pt-5">
            <div className="flex items-center gap-2">
              <span className="w-1 h-4 bg-emerald-500 rounded"></span>
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                2. Thân nhân đi cùng ({companions.length})
              </h3>
            </div>
          </div>

          {companions.length === 0 ? (
            <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl bg-slate-50/30">
              <p className="text-xs text-slate-400">Chưa có thân nhân đi cùng được chọn.</p>
              <button
                type="button"
                onClick={handleAddCompanion}
                className="mt-2 text-[11px] font-semibold text-sky-600 hover:underline"
              >
                Nhấp để thêm ngay
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence initial={false}>
                {companions.map((comp, idx) => (
                  <motion.div
                    key={comp.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="p-4 bg-slate-50/70 border border-slate-200/60 rounded-xl relative space-y-3 shadow-inner"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500">Thân nhân #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCompanion(comp.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded-md hover:bg-rose-50 transition-colors"
                        title="Xóa thân nhân"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* Tên thân nhân */}
                      <div className="space-y-1">
                        <label className="block text-[11px] font-medium text-slate-600">
                          Họ tên thân nhân <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Ví dụ: Nguyễn Khánh Linh"
                          value={comp.fullName}
                          onChange={(e) => handleCompanionChange(comp.id, "fullName", e.target.value)}
                          className={`w-full px-3 py-1.5 text-xs bg-white border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                            errors.companions?.[comp.id]?.fullName
                              ? "border-rose-300 focus:ring-rose-100 focus:border-rose-500"
                              : "border-slate-200 focus:ring-sky-100 focus:border-sky-500"
                          }`}
                        />
                        {errors.companions?.[comp.id]?.fullName && (
                          <p className="text-[10px] text-rose-500 font-medium">
                            {errors.companions[comp.id].fullName}
                          </p>
                        )}
                      </div>

                      {/* Ngày sinh thân nhân */}
                      <div className="space-y-1">
                        <label className="block text-[11px] font-medium text-slate-600">
                          Ngày tháng năm sinh <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="date"
                          value={comp.dob}
                          onChange={(e) => handleCompanionChange(comp.id, "dob", e.target.value)}
                          className={`w-full px-3 py-1.5 text-xs bg-white border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                            errors.companions?.[comp.id]?.dob
                              ? "border-rose-300 focus:ring-rose-100 focus:border-rose-500"
                              : "border-slate-200 focus:ring-sky-100 focus:border-sky-500"
                          }`}
                        />
                        {errors.companions?.[comp.id]?.dob && (
                          <p className="text-[10px] text-rose-500 font-medium">
                            {errors.companions[comp.id].dob}
                          </p>
                        )}
                      </div>

                      {/* Số điện thoại thân nhân */}
                      <div className="space-y-1">
                        <label className="block text-[11px] font-medium text-slate-600">
                          Số điện thoại <span className="text-slate-400">(không bắt buộc)</span>
                        </label>
                        <input
                          type="tel"
                          placeholder="Nhập SĐT thân nhân"
                          value={comp.phone}
                          onChange={(e) => handleCompanionChange(comp.id, "phone", e.target.value)}
                          className={`w-full px-3 py-1.5 text-xs bg-white border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                            errors.companions?.[comp.id]?.phone
                              ? "border-rose-300 focus:ring-rose-100 focus:border-rose-500"
                              : "border-slate-200 focus:ring-sky-100 focus:border-sky-500"
                          }`}
                        />
                        {errors.companions?.[comp.id]?.phone && (
                          <p className="text-[10px] text-rose-500 font-medium">
                            {errors.companions[comp.id].phone}
                          </p>
                        )}
                      </div>

                      {/* Quan hệ */}
                      <div className="space-y-1">
                        <label className="block text-[11px] font-medium text-slate-600">Quan hệ với nhân viên</label>
                        <div className="relative">
                          <select
                            value={comp.relationship}
                            onChange={(e) => handleCompanionChange(comp.id, "relationship", e.target.value)}
                            className="w-full pl-3 pr-8 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-100 focus:border-sky-500 transition-all appearance-none cursor-pointer"
                          >
                            {RELATIONSHIPS.map((rel) => (
                              <option key={rel} value={rel}>
                                {rel}
                              </option>
                            ))}
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-slate-500">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Nút thêm thân nhân đặt ở cuối form, trước nút hoàn tất đăng ký */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={handleAddCompanion}
            className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50/80 hover:bg-emerald-100 px-4 py-2.5 rounded-xl transition-all border border-emerald-200/50 cursor-pointer shadow-sm w-full sm:w-auto"
            id="add-companion-btn"
          >
            <Plus className="w-4 h-4" /> Thêm thân nhân đi cùng
          </button>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="flex gap-3 pt-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 px-4 rounded-xl text-xs font-semibold text-[#059669] bg-emerald-50/50 hover:bg-emerald-50 transition-all cursor-pointer border border-[#059669]/20"
            >
              Hủy
            </button>
          )}
          <button
            type="submit"
            className={`${onCancel ? "flex-[2]" : "w-full"} flex items-center justify-center gap-2 text-white bg-[#059669] hover:bg-[#047857] font-semibold text-sm py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-lg focus:ring-4 focus:ring-emerald-100 cursor-pointer active:scale-[0.99]`}
            id="submit-registration-btn"
          >
            <Sparkles className="w-4 h-4" /> {editingRegistration ? "Lưu thay đổi" : "Gửi"}
          </button>
        </div>
      </form>
    </div>
  );
}
