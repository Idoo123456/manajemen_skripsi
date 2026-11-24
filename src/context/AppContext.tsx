import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Fakultas,
  Jurusan,
  JenisDokumen,
  Pelapor,
  Skripsi,
  Tulisan,
  User,
  ViewFakjur,
  ViewSkripsi
} from '../types/database';
import {
  INITIAL_FAKULTAS,
  INITIAL_JURUSAN,
  INITIAL_JENIS_DOKUMEN,
  INITIAL_PELAPOR,
  INITIAL_SKRIPSI,
  INITIAL_TULISAN,
  INITIAL_USERS
} from '../data/initialData';

export interface DbInfo {
  status: string;
  database: string;
  engine: string;
  host: string;
  port: number;
  databaseName: string;
}

interface AppContextType {
  // Master data state
  fakultas: Fakultas[];
  jurusan: Jurusan[];
  jenisDokumen: JenisDokumen[];
  pelapor: Pelapor[];
  skripsi: Skripsi[];
  tulisan: Tulisan[];
  users: User[];

  // Database Connection Info
  isDbConnected: boolean;
  dbInfo: DbInfo | null;
  refreshFromDb: () => Promise<void>;

  // Computed views
  viewFakjur: ViewFakjur[];
  viewSkripsi: ViewSkripsi[];
  getJurusanByFakultas: (id_fakultas: number) => Jurusan[];

  // Auth & Session
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  login: (username: string, password?: string) => { success: boolean; message: string };
  logout: () => void;
  quickSwitchUser: (role: 'guest' | 'siti' | 'rizki' | 'admin' | 'nurul' | 'hendra' | 'rina') => void;

  // Portal Mode (Student vs Petugas)
  portalMode: 'student' | 'petugas';
  setPortalMode: (mode: 'student' | 'petugas') => void;

  // Navigation tab state
  activeTab: 'home' | 'repository' | 'guides' | 'student' | 'tracking' | 'admin';
  setActiveTab: (tab: 'home' | 'repository' | 'guides' | 'student' | 'tracking' | 'admin') => void;
  trackingNim: string;
  setTrackingNim: (nim: string) => void;

  // Modals state
  selectedAnnouncement: Tulisan | null;
  setSelectedAnnouncement: (tulisan: Tulisan | null) => void;
  selectedSkripsiForPrint: Skripsi | null;
  setSelectedSkripsiForPrint: (skripsi: Skripsi | null) => void;
  previewEmailModal: { skripsi: Skripsi; recipientEmail: string } | null;
  setPreviewEmailModal: (data: { skripsi: Skripsi; recipientEmail: string } | null) => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (isOpen: boolean) => void;

  // Email action
  sendCertificateToGmail: (skripsiId: number, customEmail?: string) => { success: boolean; message: string };

  // Skripsi Actions
  addSkripsi: (item: Omit<Skripsi, 'id_skripsi'>) => void;
  updateSkripsi: (id: number, updated: Partial<Skripsi>) => void;
  deleteSkripsi: (id: number) => void;
  toggleHardCopy: (id: number) => void;
  toggleSoftCopy: (id: number) => void;

  // Pelapor Actions
  addPelapor: (item: Omit<Pelapor, 'id_pelapor'>) => void;
  updatePelapor: (id: number, updated: Partial<Pelapor>) => void;
  deletePelapor: (id: number) => void;
  togglePelaporActive: (id: number) => void;

  // Tulisan Actions
  addTulisan: (item: Omit<Tulisan, 'idTulisan'>) => void;
  updateTulisan: (id: number, updated: Partial<Tulisan>) => void;
  deleteTulisan: (id: number) => void;
  toggleTulisanAktif: (id: number) => void;

  // User Actions
  addUser: (item: Omit<User, 'idUser'>) => void;
  updateUser: (id: number, updated: Partial<User>) => void;
  deleteUser: (id: number) => void;

  // Master Data Actions
  addFakultas: (item: Omit<Fakultas, 'id_fakultas'>) => void;
  updateFakultas: (id: number, updated: Partial<Fakultas>) => void;
  deleteFakultas: (id: number) => void;

  addJurusan: (item: Omit<Jurusan, 'id_jurusan'>) => void;
  updateJurusan: (id: number, updated: Partial<Jurusan>) => void;
  deleteJurusan: (id: number) => void;

  addJenisDokumen: (item: Omit<JenisDokumen, 'id_jenis_dokumen'>) => void;
  updateJenisDokumen: (id: number, updated: Partial<JenisDokumen>) => void;
  deleteJenisDokumen: (id: number) => void;

  // Reset Demo Data
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'sim_skripsi_unri_v5';
const USER_STORAGE_KEY = 'sim_skripsi_current_user_v5';
const PORTAL_MODE_KEY = 'sim_skripsi_portal_mode_v6';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Portal mode: 'student' (Mahasiswa/Publik) or 'petugas' (Web Khusus Petugas/Admin)
  const [portalMode, setPortalModeState] = useState<'student' | 'petugas'>(() => {
    const saved = localStorage.getItem(PORTAL_MODE_KEY);
    return saved === 'petugas' ? 'petugas' : 'student';
  });

  const setPortalMode = (mode: 'student' | 'petugas') => {
    setPortalModeState(mode);
    localStorage.setItem(PORTAL_MODE_KEY, mode);
  };

  // Database Connection State
  const [isDbConnected, setIsDbConnected] = useState<boolean>(false);
  const [dbInfo, setDbInfo] = useState<DbInfo | null>(null);

  // Load state directly from database (initialized empty)
  const [fakultas, setFakultas] = useState<Fakultas[]>([]);
  const [jurusan, setJurusan] = useState<Jurusan[]>([]);
  const [jenisDokumen, setJenisDokumen] = useState<JenisDokumen[]>([]);
  const [pelapor, setPelapor] = useState<Pelapor[]>([]);
  const [skripsi, setSkripsi] = useState<Skripsi[]>([]);
  const [tulisan, setTulisan] = useState<Tulisan[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(USER_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  // UI Navigation & Modals
  const [activeTab, setActiveTab] = useState<'home' | 'repository' | 'guides' | 'student' | 'tracking' | 'admin'>('home');
  const [trackingNim, setTrackingNim] = useState<string>('');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Tulisan | null>(null);
  const [selectedSkripsiForPrint, setSelectedSkripsiForPrint] = useState<Skripsi | null>(null);
  const [previewEmailModal, setPreviewEmailModal] = useState<{ skripsi: Skripsi; recipientEmail: string } | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // Sync to API
  const fetchDbData = async () => {
    try {
      const healthRes = await fetch('/api/health')
        .then(r => (r.ok ? r.json() : null))
        .catch(() => null);

      if (healthRes && healthRes.database === 'connected') {
        setIsDbConnected(true);
        setDbInfo(healthRes);
      } else {
        setIsDbConnected(false);
      }

      const [resFak, resJur, resDoc, resPel, resSkr, resTul, resUsr] = await Promise.allSettled([
        fetch('/api/fakultas').then(r => (r.ok ? r.json() : null)),
        fetch('/api/jurusan').then(r => (r.ok ? r.json() : null)),
        fetch('/api/jenis-dokumen').then(r => (r.ok ? r.json() : null)),
        fetch('/api/pelapor').then(r => (r.ok ? r.json() : null)),
        fetch('/api/skripsi').then(r => (r.ok ? r.json() : null)),
        fetch('/api/tulisan').then(r => (r.ok ? r.json() : null)),
        fetch('/api/users').then(r => (r.ok ? r.json() : null)),
      ]);

      if (resFak.status === 'fulfilled' && Array.isArray(resFak.value)) {
        setFakultas(resFak.value);
      }
      if (resJur.status === 'fulfilled' && Array.isArray(resJur.value)) {
        setJurusan(resJur.value);
      }
      if (resDoc.status === 'fulfilled' && Array.isArray(resDoc.value)) {
        setJenisDokumen(resDoc.value);
      }
      if (resPel.status === 'fulfilled' && Array.isArray(resPel.value)) {
        setPelapor(resPel.value);
      }
      if (resSkr.status === 'fulfilled' && Array.isArray(resSkr.value)) {
        setSkripsi(resSkr.value);
      }
      if (resTul.status === 'fulfilled' && Array.isArray(resTul.value)) {
        setTulisan(resTul.value);
      }
      if (resUsr.status === 'fulfilled' && Array.isArray(resUsr.value)) {
        setUsers(resUsr.value);
      }
    } catch (err) {
      console.warn('API sync warning:', err);
    }
  };

  useEffect(() => {
    // Clear old mock localStorage caches
    try {
      localStorage.removeItem(`${STORAGE_KEY}_fakultas`);
      localStorage.removeItem(`${STORAGE_KEY}_jurusan`);
      localStorage.removeItem(`${STORAGE_KEY}_jenis_dokumen`);
      localStorage.removeItem(`${STORAGE_KEY}_pelapor`);
      localStorage.removeItem(`${STORAGE_KEY}_skripsi`);
      localStorage.removeItem(`${STORAGE_KEY}_tulisan`);
      localStorage.removeItem(`${STORAGE_KEY}_users`);
    } catch {
      // ignore
    }
    fetchDbData();
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, [currentUser]);

  // Derived Views
  const viewFakjur: ViewFakjur[] = useMemo(() => {
    return jurusan.map(j => {
      const fak = fakultas.find(f => f.id_fakultas === j.id_fakultas);
      return {
        id_jurusan: j.id_jurusan,
        jurusan: j.jurusan,
        keterangan: j.keterangan,
        id_fakultas: j.id_fakultas,
        fakultas: fak ? fak.fakultas : 'Fakultas Tidak Diketahui',
      };
    });
  }, [jurusan, fakultas]);

  const viewSkripsi: ViewSkripsi[] = useMemo(() => {
    return skripsi.map(s => {
      const fak = fakultas.find(f => f.id_fakultas === s.id_fakultas);
      const jur = jurusan.find(j => j.id_jurusan === s.id_jurusan);
      const jenis = jenisDokumen.find(d => d.id_jenis_dokumen === s.id_jenis_dokumen);

      return {
        id_skripsi: s.id_skripsi,
        id_jenis_dokumen: s.id_jenis_dokumen,
        no_surat: s.no_surat,
        nama: s.nama,
        nim: s.nim,
        email: s.email,
        email_sent_at: s.email_sent_at,
        id_fakultas: s.id_fakultas,
        id_jurusan: s.id_jurusan,
        judul: s.judul,
        hard_copy: s.hard_copy,
        soft_copy: s.soft_copy,
        tanggal: s.tanggal,
        jurusan: jur ? jur.jurusan : '-',
        ket_jurusan: jur ? jur.keterangan : '-',
        fakultas: fak ? fak.fakultas : '-',
        ket_fakultas: fak ? fak.keterangan : '-',
        jenis_dokumen: jenis ? jenis.jenis_dokumen : 'Skripsi',
      };
    });
  }, [skripsi, fakultas, jurusan, jenisDokumen]);

  const getJurusanByFakultas = (id_fakultas: number) => {
    return jurusan.filter(j => j.id_fakultas === Number(id_fakultas));
  };

  // Auth handlers
  const login = (username: string, password?: string) => {
    const trimmed = username.trim();
    const found = users.find(u => u.UserName.toLowerCase() === trimmed.toLowerCase());
    if (!found) {
      return { success: false, message: 'NIM / NIP / Username tidak ditemukan!' };
    }
    if (password && found.Password && found.Password !== password) {
      return { success: false, message: 'Password salah!' };
    }
    setCurrentUser(found);
    if (found.JenisUser === 1) {
      setPortalMode('petugas');
      setActiveTab('admin');
    } else {
      setPortalMode('student');
      setActiveTab('student');
    }
    setIsLoginModalOpen(false);
    return { success: true, message: `Selamat datang, ${found.Nama}!` };
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveTab('home');
  };

  const quickSwitchUser = (role: 'guest' | 'siti' | 'rizki' | 'admin' | 'nurul' | 'hendra' | 'rina') => {
    if (role === 'guest') {
      logout();
      return;
    }

    if (role === 'siti') {
      const siti = users.find(u => u.UserName === '2007111002');
      if (siti) {
        setCurrentUser(siti);
        setPortalMode('student');
        setActiveTab('student');
      }
      return;
    }

    if (role === 'rizki') {
      const rizki = users.find(u => u.UserName === '2007111001');
      if (rizki) {
        setCurrentUser(rizki);
        setPortalMode('student');
        setActiveTab('student');
      }
      return;
    }

    if (role === 'admin') {
      const admin = users.find(u => u.UserName === 'admin');
      if (admin) {
        setCurrentUser(admin);
        setPortalMode('petugas');
        setActiveTab('admin');
      }
      return;
    }

    if (role === 'nurul') {
      const nurul = users.find(u => u.UserName === '198204122005012001');
      if (nurul) {
        setCurrentUser(nurul);
        setPortalMode('petugas');
        setActiveTab('admin');
      }
      return;
    }

    if (role === 'hendra') {
      const hendra = users.find(u => u.UserName === '198708152010011002');
      if (hendra) {
        setCurrentUser(hendra);
        setPortalMode('petugas');
        setActiveTab('admin');
      }
      return;
    }

    if (role === 'rina') {
      const rina = users.find(u => u.UserName === '199203202015022001');
      if (rina) {
        setCurrentUser(rina);
        setPortalMode('petugas');
        setActiveTab('admin');
      }
      return;
    }
  };

  // Skripsi Handlers (Directly synced to XAMPP MySQL Database)
  const addSkripsi = async (item: Omit<Skripsi, 'id_skripsi'>) => {
    try {
      const res = await fetch('/api/skripsi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (res.ok) {
        const created: Skripsi = await res.json();
        setSkripsi(prev => [created, ...prev.filter(s => s.id_skripsi !== created.id_skripsi)]);
        return;
      }
    } catch (err) {
      console.warn('Database insert offline fallback:', err);
    }

    const nextId = skripsi.length > 0 ? Math.max(...skripsi.map(s => s.id_skripsi)) + 1 : 1;
    const newEntry: Skripsi = { ...item, id_skripsi: nextId };
    setSkripsi(prev => [newEntry, ...prev]);
  };

  const updateSkripsi = async (id: number, updated: Partial<Skripsi>) => {
    setSkripsi(prev => prev.map(s => (s.id_skripsi === id ? { ...s, ...updated } : s)));
    try {
      await fetch(`/api/skripsi/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
    } catch (err) {
      console.warn('Database update offline fallback:', err);
    }
  };

  const deleteSkripsi = async (id: number) => {
    setSkripsi(prev => prev.filter(s => s.id_skripsi !== id));
    try {
      await fetch(`/api/skripsi/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('Database delete offline fallback:', err);
    }
  };

  const toggleHardCopy = (id: number) => {
    const item = skripsi.find(s => s.id_skripsi === id);
    if (!item) return;
    const newVal = item.hard_copy === 1 ? 0 : 1;
    updateSkripsi(id, { hard_copy: newVal });
  };

  const toggleSoftCopy = (id: number) => {
    const item = skripsi.find(s => s.id_skripsi === id);
    if (!item) return;
    const newVal = item.soft_copy === 1 ? 0 : 1;
    updateSkripsi(id, { soft_copy: newVal });
  };

  // Pelapor Handlers
  const addPelapor = async (item: Omit<Pelapor, 'id_pelapor'>) => {
    try {
      const res = await fetch('/api/pelapor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (res.ok) {
        const created: Pelapor = await res.json();
        setPelapor(prev => [...prev, created]);
        return;
      }
    } catch (err) {
      console.warn('Pelapor insert error:', err);
    }
    const nextId = pelapor.length > 0 ? Math.max(...pelapor.map(p => p.id_pelapor)) + 1 : 1;
    setPelapor(prev => [...prev, { ...item, id_pelapor: nextId }]);
  };

  const updatePelapor = async (id: number, updated: Partial<Pelapor>) => {
    setPelapor(prev => prev.map(p => (p.id_pelapor === id ? { ...p, ...updated } : p)));
    try {
      await fetch(`/api/pelapor/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
    } catch (err) {
      console.warn('Pelapor update error:', err);
    }
  };

  const deletePelapor = async (id: number) => {
    setPelapor(prev => prev.filter(p => p.id_pelapor !== id));
    try {
      await fetch(`/api/pelapor/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('Pelapor delete error:', err);
    }
  };

  const togglePelaporActive = (id: number) => {
    const p = pelapor.find(item => item.id_pelapor === id);
    if (!p) return;
    const nextActive = p.active === 1 ? 0 : 1;
    updatePelapor(id, { active: nextActive });
  };

  // Tulisan Handlers
  const addTulisan = async (item: Omit<Tulisan, 'idTulisan'>) => {
    try {
      const res = await fetch('/api/tulisan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (res.ok) {
        const created: Tulisan = await res.json();
        setTulisan(prev => [created, ...prev]);
        return;
      }
    } catch (err) {
      console.warn('Tulisan insert error:', err);
    }
    const nextId = tulisan.length > 0 ? Math.max(...tulisan.map(t => t.idTulisan)) + 1 : 1;
    setTulisan(prev => [{ ...item, idTulisan: nextId }, ...prev]);
  };

  const updateTulisan = async (id: number, updated: Partial<Tulisan>) => {
    setTulisan(prev => prev.map(t => (t.idTulisan === id ? { ...t, ...updated } : t)));
    try {
      await fetch(`/api/tulisan/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
    } catch (err) {
      console.warn('Tulisan update error:', err);
    }
  };

  const deleteTulisan = async (id: number) => {
    setTulisan(prev => prev.filter(t => t.idTulisan !== id));
    try {
      await fetch(`/api/tulisan/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('Tulisan delete error:', err);
    }
  };

  const toggleTulisanAktif = (id: number) => {
    const t = tulisan.find(item => item.idTulisan === id);
    if (!t) return;
    const nextAktif = t.Aktif === 1 ? 0 : 1;
    updateTulisan(id, { Aktif: nextAktif });
  };

  // User Handlers
  const addUser = async (item: Omit<User, 'idUser'>) => {
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (res.ok) {
        const created: User = await res.json();
        setUsers(prev => [...prev, created]);
        return;
      }
    } catch (err) {
      console.warn('User insert error:', err);
    }
    const nextId = users.length > 0 ? Math.max(...users.map(u => u.idUser)) + 1 : 1;
    setUsers(prev => [...prev, { ...item, idUser: nextId }]);
  };

  const updateUser = async (id: number, updated: Partial<User>) => {
    setUsers(prev => prev.map(u => (u.idUser === id ? { ...u, ...updated } : u)));
    try {
      await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
    } catch (err) {
      console.warn('User update error:', err);
    }
  };

  const deleteUser = async (id: number) => {
    setUsers(prev => prev.filter(u => u.idUser !== id));
    try {
      await fetch(`/api/users/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('User delete error:', err);
    }
  };

  // Master Data Handlers
  const addFakultas = async (item: Omit<Fakultas, 'id_fakultas'>) => {
    try {
      const res = await fetch('/api/fakultas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (res.ok) {
        const created: Fakultas = await res.json();
        setFakultas(prev => [...prev, created]);
        return;
      }
    } catch (err) {
      console.warn('Fakultas insert error:', err);
    }
    const nextId = fakultas.length > 0 ? Math.max(...fakultas.map(f => f.id_fakultas)) + 1 : 1;
    setFakultas(prev => [...prev, { ...item, id_fakultas: nextId }]);
  };

  const updateFakultas = async (id: number, updated: Partial<Fakultas>) => {
    setFakultas(prev => prev.map(f => (f.id_fakultas === id ? { ...f, ...updated } : f)));
    try {
      await fetch(`/api/fakultas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
    } catch (err) {
      console.warn('Fakultas update error:', err);
    }
  };

  const deleteFakultas = async (id: number) => {
    setFakultas(prev => prev.filter(f => f.id_fakultas !== id));
    try {
      await fetch(`/api/fakultas/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('Fakultas delete error:', err);
    }
  };

  const addJurusan = async (item: Omit<Jurusan, 'id_jurusan'>) => {
    try {
      const res = await fetch('/api/jurusan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (res.ok) {
        const created: Jurusan = await res.json();
        setJurusan(prev => [...prev, created]);
        return;
      }
    } catch (err) {
      console.warn('Jurusan insert error:', err);
    }
    const nextId = jurusan.length > 0 ? Math.max(...jurusan.map(j => j.id_jurusan)) + 1 : 1;
    setJurusan(prev => [...prev, { ...item, id_jurusan: nextId }]);
  };

  const updateJurusan = async (id: number, updated: Partial<Jurusan>) => {
    setJurusan(prev => prev.map(j => (j.id_jurusan === id ? { ...j, ...updated } : j)));
    try {
      await fetch(`/api/jurusan/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
    } catch (err) {
      console.warn('Jurusan update error:', err);
    }
  };

  const deleteJurusan = async (id: number) => {
    setJurusan(prev => prev.filter(j => j.id_jurusan !== id));
    try {
      await fetch(`/api/jurusan/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('Jurusan delete error:', err);
    }
  };

  const addJenisDokumen = async (item: Omit<JenisDokumen, 'id_jenis_dokumen'>) => {
    try {
      const res = await fetch('/api/jenis-dokumen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (res.ok) {
        const created: JenisDokumen = await res.json();
        setJenisDokumen(prev => [...prev, created]);
        return;
      }
    } catch (err) {
      console.warn('JenisDokumen insert error:', err);
    }
    const nextId = jenisDokumen.length > 0 ? Math.max(...jenisDokumen.map(d => d.id_jenis_dokumen)) + 1 : 1;
    setJenisDokumen(prev => [...prev, { ...item, id_jenis_dokumen: nextId }]);
  };

  const updateJenisDokumen = async (id: number, updated: Partial<JenisDokumen>) => {
    setJenisDokumen(prev => prev.map(d => (d.id_jenis_dokumen === id ? { ...d, ...updated } : d)));
    try {
      await fetch(`/api/jenis-dokumen/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
    } catch (err) {
      console.warn('JenisDokumen update error:', err);
    }
  };

  const deleteJenisDokumen = async (id: number) => {
    setJenisDokumen(prev => prev.filter(d => d.id_jenis_dokumen !== id));
    try {
      await fetch(`/api/jenis-dokumen/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('JenisDokumen delete error:', err);
    }
  };

  const resetDemoData = () => {
    setFakultas(INITIAL_FAKULTAS);
    setJurusan(INITIAL_JURUSAN);
    setJenisDokumen(INITIAL_JENIS_DOKUMEN);
    setPelapor(INITIAL_PELAPOR);
    setSkripsi(INITIAL_SKRIPSI);
    setTulisan(INITIAL_TULISAN);
    setUsers(INITIAL_USERS);
    setCurrentUser(null);
    setActiveTab('home');
    localStorage.clear();
  };

  // Send Certificate to Gmail simulation & API logging
  const sendCertificateToGmail = (skripsiId: number, customEmail?: string) => {
    const targetSkripsi = skripsi.find(s => s.id_skripsi === skripsiId);
    if (!targetSkripsi) {
      return { success: false, message: 'Data karya ilmiah tidak ditemukan!' };
    }

    const recipient = customEmail?.trim() || targetSkripsi.email || `${targetSkripsi.nim}@student.unri.ac.id`;
    const nowTimestamp = new Date().toLocaleString('id-ID', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });

    updateSkripsi(skripsiId, {
      email: recipient,
      email_sent_at: nowTimestamp,
    });

    fetch('/api/send-certificate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skripsiId, email: recipient }),
    }).catch(err => console.warn('API email log warning:', err));

    return {
      success: true,
      message: `Surat Tanda Terima Penyerahan Skripsi resmi berhasil dikirim ke alamat ${recipient}!`,
    };
  };

  return (
    <AppContext.Provider
      value={{
        fakultas,
        jurusan,
        jenisDokumen,
        pelapor,
        skripsi,
        tulisan,
        users,
        isDbConnected,
        dbInfo,
        refreshFromDb: fetchDbData,
        viewFakjur,
        viewSkripsi,
        getJurusanByFakultas,
        currentUser,
        setCurrentUser,
        portalMode,
        setPortalMode,
        login,
        logout,
        quickSwitchUser,
        activeTab,
        setActiveTab,
        trackingNim,
        setTrackingNim,
        selectedAnnouncement,
        setSelectedAnnouncement,
        selectedSkripsiForPrint,
        setSelectedSkripsiForPrint,
        previewEmailModal,
        setPreviewEmailModal,
        isLoginModalOpen,
        setIsLoginModalOpen,
        sendCertificateToGmail,
        addSkripsi,
        updateSkripsi,
        deleteSkripsi,
        toggleHardCopy,
        toggleSoftCopy,
        addPelapor,
        updatePelapor,
        deletePelapor,
        togglePelaporActive,
        addTulisan,
        updateTulisan,
        deleteTulisan,
        toggleTulisanAktif,
        addUser,
        updateUser,
        deleteUser,
        addFakultas,
        updateFakultas,
        deleteFakultas,
        addJurusan,
        updateJurusan,
        deleteJurusan,
        addJenisDokumen,
        updateJenisDokumen,
        deleteJenisDokumen,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
