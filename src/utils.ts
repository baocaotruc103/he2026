import { Registration } from "./types";

/**
 * Validates a Vietnamese phone number (starts with 0, total 10 digits)
 */
export function validatePhoneNumber(phone: string): boolean {
  const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
  return phoneRegex.test(phone.trim());
}

/**
 * Calculates age from a date string (YYYY-MM-DD)
 */
export function calculateAge(dobString: string): number {
  if (!dobString) return 0;
  const today = new Date();
  const birthDate = new Date(dobString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 0 ? age : 0;
}

/**
 * Formats a date string from YYYY-MM-DD to DD/MM/YYYY
 */
export function formatDate(dateString: string): string {
  if (!dateString) return "";
  const parts = dateString.split("-");
  if (parts.length !== 3) return dateString;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

import * as XLSX from "xlsx";

/**
 * Exports registration data to a downloadable Excel file
 */
export function exportToExcel(registrations: Registration[]) {
  const data: any[] = [];
  let index = 1;

  registrations.forEach((reg) => {
    // Add employee row
    data.push({
      "Số TT": index++,
      "Họ và tên": reg.employee.fullName,
      "Ngày tháng năm sinh": formatDate(reg.employee.dob),
      "Số điện thoại": reg.employee.phone,
      "Ghi chú": ""
    });

    // Add companion rows
    reg.companions.forEach((comp) => {
      data.push({
        "Số TT": index++,
        "Họ và tên": comp.fullName,
        "Ngày tháng năm sinh": formatDate(comp.dob),
        "Số điện thoại": comp.phone,
        "Ghi chú": ""
      });
    });
  });

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "DanhSach");
  
  // Auto-size columns slightly
  const wscols = [
    {wch: 8},
    {wch: 25},
    {wch: 15},
    {wch: 15},
    {wch: 40}
  ];
  worksheet['!cols'] = wscols;

  XLSX.writeFile(workbook, `Danh_sach_doan_${new Date().getFullYear()}.xlsx`);
}
