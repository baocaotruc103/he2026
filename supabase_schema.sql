-- SQL SCRIPT ĐỂ TẠO BẢNG DANG_KY TRÊN SUPABASE
-- Hãy sao chép toàn bộ nội dung dưới đây và dán vào phần SQL Editor của Supabase để chạy.

-- 1. Tạo bảng dang_ky
CREATE TABLE IF NOT EXISTS public.dang_ky (
    id TEXT PRIMARY KEY,                            -- Mã đăng ký (UUID hoặc chuỗi ngẫu nhiên từ client)
    employee JSONB NOT NULL,                        -- Thông tin nhân viên dưới dạng JSON (fullName, dob, phone)
    companions JSONB DEFAULT '[]'::jsonb,           -- Danh sách thân nhân đi kèm dưới dạng JSON Array
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL -- Thời gian đăng ký
);

-- Tạo bảng room_allocations để lưu sơ đồ xếp phòng
CREATE TABLE IF NOT EXISTS public.room_allocations (
    id TEXT PRIMARY KEY,                            -- Mã định danh (ví dụ: 'current')
    allocations JSONB DEFAULT '[]'::jsonb,          -- Mảng JSON lưu sơ đồ xếp phòng
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tạo bảng vehicle_allocations để lưu sơ đồ xếp xe
CREATE TABLE IF NOT EXISTS public.vehicle_allocations (
    id TEXT PRIMARY KEY,                            -- Mã định danh (ví dụ: 'current')
    xe1_reg_ids JSONB DEFAULT '[]'::jsonb,          -- Mảng JSON lưu ID đăng ký đi Xe 1
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Thiết lập chính sách bảo mật Row Level Security (RLS)
-- Để dễ dàng thử nghiệm, bạn có thể tắt RLS bằng cách chạy lệnh này:
ALTER TABLE public.dang_ky DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_allocations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_allocations DISABLE ROW LEVEL SECURITY;

-- HOẶC nếu bạn muốn bật RLS để bảo mật, hãy bỏ comment các dòng dưới đây:
/*
ALTER TABLE public.dang_ky ENABLE ROW LEVEL SECURITY;

-- Cho phép mọi người đọc dữ liệu đăng ký (Bao gồm cả người dùng chưa đăng nhập thông qua API Key)
CREATE POLICY "Cho phép đọc công khai" ON public.dang_ky
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Cho phép thêm mới dữ liệu đăng ký
CREATE POLICY "Cho phép thêm mới" ON public.dang_ky
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Cho phép xóa dữ liệu đăng ký
CREATE POLICY "Cho phép xóa" ON public.dang_ky
    FOR DELETE
    TO anon, authenticated
    USING (true);
*/
