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

/**
 * Exports registration data to a downloadable CSV file (UTF-8 with BOM for Vietnamese characters)
 */
export function exportToCSV(registrations: Registration[]) {
  const headers = [
    "STT",
    "Loại đối tượng",
    "Họ và tên",
    "Ngày sinh",
    "Tuổi",
    "Số điện thoại",
    "Quan hệ",
    "Ghi chú",
    "Ngày đăng ký",
  ];

  const rows: string[][] = [];
  let index = 1;

  registrations.forEach((reg) => {
    // Add employee row
    rows.push([
      String(index++),
      "Nhân viên",
      reg.employee.fullName,
      formatDate(reg.employee.dob),
      String(calculateAge(reg.employee.dob)),
      reg.employee.phone,
      "Bản thân",
      reg.notes || "",
      formatDate(reg.createdAt.substring(0, 10)),
    ]);

    // Add companion rows
    reg.companions.forEach((comp) => {
      rows.push([
        "",
        "Thân nhân",
        comp.fullName,
        formatDate(comp.dob),
        String(calculateAge(comp.dob)),
        comp.phone,
        comp.relationship,
        "",
        "",
      ]);
    });
  });

  const csvContent =
    "data:text/csv;charset=utf-8,\uFEFF" +
    [headers.join(","), ...rows.map((row) => row.map((val) => `"${val.replace(/"/g, '""')}"`).join(","))].join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `Danh_sach_dang_ky_nghi_he_${new Date().getFullYear()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
