export interface Employee {
  fullName: string;
  dob: string;
  phone: string;
}

export interface Companion {
  id: string;
  fullName: string;
  dob: string;
  phone: string;
  relationship: string; // e.g., 'Vợ/Chồng', 'Con', 'Bố/Mẹ', 'Khác'
}

export interface Registration {
  id: string;
  employee: Employee;
  companions: Companion[];
  createdAt: string;
  notes?: string;
  department?: string; // e.g., 'Hành chính', 'Kỹ thuật', 'Kinh doanh', v.v.
}

export interface DashboardStats {
  totalEmployees: number;
  totalCompanions: number;
  totalParticipants: number;
  avgAge: number;
  byDepartment: Record<string, number>;
  byRelationship: Record<string, number>;
}
