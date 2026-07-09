import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Enable JSON parser
app.use(express.json());

// Path to fallback local storage
const projectRoot = process.cwd();
const DATA_DIR = path.join(projectRoot, "data");
const DATA_FILE = path.join(DATA_DIR, "registrations.json");
const ROOM_ALLOCATIONS_FILE = path.join(DATA_DIR, "room_allocations.json");
const VEHICLE_ALLOCATIONS_FILE = path.join(DATA_DIR, "vehicle_allocations.json");

// Helper to load room allocations
function getLocalRoomAllocations(): any[] {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(ROOM_ALLOCATIONS_FILE)) {
    return [];
  }
  try {
    const data = fs.readFileSync(ROOM_ALLOCATIONS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

// Helper to save room allocations
function saveLocalRoomAllocations(allocs: any[]) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(ROOM_ALLOCATIONS_FILE, JSON.stringify(allocs, null, 2), "utf-8");
}

// Helper to load vehicle allocations
function getLocalVehicleAllocations(): string[] {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(VEHICLE_ALLOCATIONS_FILE)) {
    return [];
  }
  try {
    const data = fs.readFileSync(VEHICLE_ALLOCATIONS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

// Helper to save vehicle allocations
function saveLocalVehicleAllocations(xe1RegIds: string[]) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(VEHICLE_ALLOCATIONS_FILE, JSON.stringify(xe1RegIds, null, 2), "utf-8");
}

// Helper to load fallback data
function getLocalRegistrations(): any[] {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    // Seed initial data
    const initial = [
      {
        id: "comp-seed-1",
        employee: {
          fullName: "Nguyễn Văn Hùng",
          dob: "1990-05-15",
          phone: "0912345678",
        },
        companions: [
          {
            id: "comp-seed-1-1",
            fullName: "Lê Thị Hồng",
            dob: "1992-08-20",
            phone: "0988776655",
            relationship: "Vợ",
          },
          {
            id: "comp-seed-2",
            fullName: "Nguyễn Minh Quân",
            dob: "2018-03-10",
            phone: "",
            relationship: "Con",
          },
        ],
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      },
      {
        id: "comp-seed-2-parent",
        employee: {
          fullName: "Trần Thị Mai",
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
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      },
      {
        id: "comp-seed-3-single",
        employee: {
          fullName: "Phạm Minh Đức",
          dob: "1994-02-28",
          phone: "0977889900",
        },
        companions: [],
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      }
    ];
    fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), "utf-8");
    return initial;
  }
  try {
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

// Helper to save fallback data
function saveLocalRegistrations(regs: any[]) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(regs, null, 2), "utf-8");
}

// Lazy-initialized Supabase Client
let supabaseClient: any = null;
let isSupabaseConfigured = false;

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;

  if (url && key) {
    if (!supabaseClient) {
      try {
        supabaseClient = createClient(url, key);
        isSupabaseConfigured = true;
      } catch (err) {
        console.error("Lỗi khởi tạo Supabase Client:", err);
        isSupabaseConfigured = false;
        supabaseClient = null;
      }
    }
    return supabaseClient;
  }
  isSupabaseConfigured = false;
  return null;
}

// Ensure first try check
getSupabase();

// --- API ROUTES ---

// Health & Config Check API
app.get("/api/config", async (req, res) => {
  const supabase = getSupabase();
  const isConnected = !!supabase;
  
  const tablesStatus = {
    dang_ky: false,
    room_allocations: false,
    vehicle_allocations: false,
  };
  const tableErrors: Record<string, string> = {};

  if (supabase) {
    try {
      const { error: dkErr } = await supabase.from("dang_ky").select("id").limit(1);
      if (dkErr) {
        tableErrors.dang_ky = dkErr.message;
      } else {
        tablesStatus.dang_ky = true;
      }
    } catch (e: any) {
      tableErrors.dang_ky = e.message || String(e);
    }

    try {
      const { error: roomErr } = await supabase.from("room_allocations").select("id").limit(1);
      if (roomErr) {
        tableErrors.room_allocations = roomErr.message;
      } else {
        tablesStatus.room_allocations = true;
      }
    } catch (e: any) {
      tableErrors.room_allocations = e.message || String(e);
    }

    try {
      const { error: vehErr } = await supabase.from("vehicle_allocations").select("id").limit(1);
      if (vehErr) {
        tableErrors.vehicle_allocations = vehErr.message;
      } else {
        tablesStatus.vehicle_allocations = true;
      }
    } catch (e: any) {
      tableErrors.vehicle_allocations = e.message || String(e);
    }
  }

  res.json({
    supabaseConnected: isConnected,
    hasConfigEnv: !!(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY),
    tablesStatus,
    tableErrors,
  });
});

// GET all registrations
app.get("/api/registrations", async (req, res) => {
  const supabase = getSupabase();

  if (supabase) {
    try {
      // Fetch from Supabase dang_ky table
      const { data, error } = await supabase
        .from("dang_ky")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      // Map from DB schema to frontend Registration structure if needed
      const mapped = data.map((item: any) => ({
        id: item.id,
        employee: item.employee,
        companions: item.companions || [],
        createdAt: item.created_at,
      }));

      return res.json(mapped);
    } catch (err: any) {
      console.error("Lỗi khi fetch từ Supabase, chuyển sang Fallback:", err.message || err);
      // Fallback to local
      return res.json(getLocalRegistrations());
    }
  } else {
    // Local fallback
    return res.json(getLocalRegistrations());
  }
});

// POST new registration
app.post("/api/registrations", async (req, res) => {
  const newReg = req.body;
  if (!newReg || !newReg.id || !newReg.employee) {
    return res.status(400).json({ error: "Dữ liệu đăng ký không hợp lệ" });
  }

  const supabase = getSupabase();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("dang_ky")
        .insert([
          {
            id: newReg.id,
            employee: newReg.employee,
            companions: newReg.companions || [],
            created_at: newReg.createdAt || new Date().toISOString(),
          },
        ]);

      if (error) {
        throw error;
      }

      return res.status(201).json({ success: true, data: newReg });
    } catch (err: any) {
      console.error("Lỗi khi insert vào Supabase, lưu tạm vào Fallback:", err.message || err);
      const local = getLocalRegistrations();
      const updated = [newReg, ...local];
      saveLocalRegistrations(updated);
      return res.status(201).json({ success: true, data: newReg, fallbackUsed: true });
    }
  } else {
    const local = getLocalRegistrations();
    const updated = [newReg, ...local];
    saveLocalRegistrations(updated);
    return res.status(201).json({ success: true, data: newReg, fallbackUsed: true });
  }
});

// PUT (update) an existing registration
app.put("/api/registrations/:id", async (req, res) => {
  const { id } = req.params;
  const updatedReg = req.body;
  if (!updatedReg || !updatedReg.employee) {
    return res.status(400).json({ error: "Dữ liệu đăng ký không hợp lệ" });
  }

  const supabase = getSupabase();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("dang_ky")
        .update({
          employee: updatedReg.employee,
          companions: updatedReg.companions || [],
        })
        .eq("id", id);

      if (error) {
        throw error;
      }

      return res.json({ success: true, data: updatedReg });
    } catch (err: any) {
      console.error("Lỗi khi update vào Supabase, thực hiện trên Fallback:", err.message || err);
      const local = getLocalRegistrations();
      const idx = local.findIndex((r) => r.id === id);
      if (idx !== -1) {
        local[idx] = { ...local[idx], ...updatedReg };
      } else {
        local.unshift(updatedReg);
      }
      saveLocalRegistrations(local);
      return res.json({ success: true, data: updatedReg, fallbackUsed: true });
    }
  } else {
    const local = getLocalRegistrations();
    const idx = local.findIndex((r) => r.id === id);
    if (idx !== -1) {
      local[idx] = { ...local[idx], ...updatedReg };
    } else {
      local.unshift(updatedReg);
    }
    saveLocalRegistrations(local);
    return res.json({ success: true, data: updatedReg, fallbackUsed: true });
  }
});

// DELETE a registration
app.delete("/api/registrations/:id", async (req, res) => {
  const { id } = req.params;
  const supabase = getSupabase();

  if (supabase) {
    try {
      const { error } = await supabase
        .from("dang_ky")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      return res.json({ success: true });
    } catch (err: any) {
      console.error("Lỗi khi delete từ Supabase, thực hiện trên Fallback:", err.message || err);
      const local = getLocalRegistrations();
      const updated = local.filter((r) => r.id !== id);
      saveLocalRegistrations(updated);
      return res.json({ success: true, fallbackUsed: true });
    }
  } else {
    const local = getLocalRegistrations();
    const updated = local.filter((r) => r.id !== id);
    saveLocalRegistrations(updated);
    return res.json({ success: true, fallbackUsed: true });
  }
});

// GET room allocations
app.get("/api/room-allocations", async (req, res) => {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("room_allocations")
        .select("*")
        .eq("id", "current")
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (data && data.allocations) {
        const allocations = typeof data.allocations === "string" ? JSON.parse(data.allocations) : data.allocations;
        return res.json(allocations);
      }
      return res.json(getLocalRoomAllocations());
    } catch (err: any) {
      console.error("Lỗi khi fetch room-allocations từ Supabase, dùng Fallback:", err.message || err);
      return res.json(getLocalRoomAllocations());
    }
  } else {
    return res.json(getLocalRoomAllocations());
  }
});

// POST room allocations
app.post("/api/room-allocations", async (req, res) => {
  const allocs = req.body;
  if (!Array.isArray(allocs)) {
    return res.status(400).json({ error: "Dữ liệu xếp phòng không hợp lệ" });
  }

  // Always save to fallback local file first to ensure persistent backup
  saveLocalRoomAllocations(allocs);

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { error } = await supabase
        .from("room_allocations")
        .upsert({
          id: "current",
          allocations: allocs,
          updated_at: new Date().toISOString()
        }, { onConflict: "id" });

      if (error) {
        throw error;
      }
      return res.json({ success: true, data: allocs });
    } catch (err: any) {
      console.error("Lỗi khi upsert room-allocations vào Supabase:", err.message || err);
      return res.status(500).json({ error: `Lỗi lưu vào Supabase: ${err.message || err}` });
    }
  } else {
    return res.json({ success: true, data: allocs, fallbackUsed: true });
  }
});

// GET vehicle allocations
app.get("/api/vehicle-allocations", async (req, res) => {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("vehicle_allocations")
        .select("*")
        .eq("id", "current")
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (data && data.xe1_reg_ids) {
        const xe1_reg_ids = typeof data.xe1_reg_ids === "string" ? JSON.parse(data.xe1_reg_ids) : data.xe1_reg_ids;
        return res.json(xe1_reg_ids);
      }
      return res.json(getLocalVehicleAllocations());
    } catch (err: any) {
      console.error("Lỗi khi fetch vehicle-allocations từ Supabase, dùng Fallback:", err.message || err);
      return res.json(getLocalVehicleAllocations());
    }
  } else {
    return res.json(getLocalVehicleAllocations());
  }
});

// POST vehicle allocations
app.post("/api/vehicle-allocations", async (req, res) => {
  const xe1RegIds = req.body;
  if (!Array.isArray(xe1RegIds)) {
    return res.status(400).json({ error: "Dữ liệu xếp xe không hợp lệ" });
  }

  // Always save to fallback local file first to ensure persistent backup
  saveLocalVehicleAllocations(xe1RegIds);

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { error } = await supabase
        .from("vehicle_allocations")
        .upsert({
          id: "current",
          xe1_reg_ids: xe1RegIds,
          updated_at: new Date().toISOString()
        }, { onConflict: "id" });

      if (error) {
        throw error;
      }
      return res.json({ success: true, data: xe1RegIds });
    } catch (err: any) {
      console.error("Lỗi khi upsert vehicle-allocations vào Supabase:", err.message || err);
      return res.status(500).json({ error: `Lỗi lưu vào Supabase: ${err.message || err}` });
    }
  } else {
    return res.json({ success: true, data: xe1RegIds, fallbackUsed: true });
  }
});

// --- VITE MIDDLEWARE AND STATIC SERVING ---
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    console.log(`Supabase connection state: ${getSupabase() ? "CONNECTED" : "FALLBACK_MODE (Local JSON)"}`);
  });
}

start();
