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

interface AppContextType {
  // Master data state
  fakultas: Fakultas[];
  jurusan: Jurusan[];
  jenisDokumen: JenisDokumen[];
  pelapor: Pelapor[];
  skripsi: Skripsi[];
  tulisan: Tulisan[];
  users: User[];

  // Computed views
  viewFakjur: ViewFakjur[];
  viewSkripsi: ViewSkripsi[];
  getJurusanByFakultas: (id_fakultas: number) => Jurusan[];

  // Auth & Session
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  login: (username: string, password?: string) => { success: boolean; message: string };
  logout: () => void;
  quickSwitchUser: (role: 'guest' | 'siti' | 'rizki' | 'admin') => void;

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

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from localStorage or initialData
  const [fakultas, setFakultas] = useState<Fakultas[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_fakultas`);
    return saved ? JSON.parse(saved) : INITIAL_FAKULTAS;
  });

  const [jurusan, setJurusan] = useState<Jurusan[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_jurusan`);
    return saved ? JSON.parse(saved) : INITIAL_JURUSAN;
  });

  const [jenisDokumen, setJenisDokumen] = useState<JenisDokumen[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_jenis_dokumen`);
    return saved ? JSON.parse(saved) : INITIAL_JENIS_DOKUMEN;
  });

  const [pelapor, setPelapor] = useState<Pelapor[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_pelapor`);
    return saved ? JSON.parse(saved) : INITIAL_PELAPOR;
  });

  const [skripsi, setSkripsi] = useState<Skripsi[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_skripsi`);
    return saved ? JSON.parse(saved) : INITIAL_SKRIPSI;
  });

  const [tulisan, setTulisan] = useState<Tulisan[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_tulisan`);
    return saved ? JSON.parse(saved) : INITIAL_TULISAN;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_users`);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

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

  // Sync to API on initial mount if server available
  useEffect(() => {
    const fetchDbData = async () => {
      try {
        const [resFak, resJur, resDoc, resPel, resSkr, resTul, resUsr] = await Promise.allSettled([
          fetch('/api/fakultas').then(r => (r.ok ? r.json() : null)),
          fetch('/api/jurusan').then(r => (r.ok ? r.json() : null)),
          fetch('/api/jenis-dokumen').then(r => (r.ok ? r.json() : null)),
          fetch('/api/pelapor').then(r => (r.ok ? r.json() : null)),
          fetch('/api/skripsi').then(r => (r.ok ? r.json() : null)),
          fetch('/api/tulisan').then(r => (r.ok ? r.json() : null)),
          fetch('/api/users').then(r => (r.ok ? r.json() : null)),
        ]);

        if (resFak.status === 'fulfilled' && resFak.value && resFak.value.length > 0) setFakultas(resFak.value);
        if (resJur.status === 'fulfilled' && resJur.value && resJur.value.length > 0) setJurusan(resJur.value);
        if (resDoc.status === 'fulfilled' && resDoc.value && resDoc.value.length > 0) setJenisDokumen(resDoc.value);
        if (resPel.status === 'fulfilled' && resPel.value && resPel.value.length > 0) setPelapor(resPel.value);
        if (resSkr.status === 'fulfilled' && resSkr.value && resSkr.value.length > 0) setSkripsi(resSkr.value);
        if (resTul.status === 'fulfilled' && resTul.value && resTul.value.length > 0) setTulisan(resTul.value);
        if (resUsr.status === 'fulfilled' && resUsr.value && resUsr.value.length > 0) setUsers(resUsr.value);
      } catch (err) {
        console.warn('API sync warning:', err);
      }
    };

    fetchDbData();
  }, []);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_fakultas`, JSON.stringify(fakultas));
  }, [fakultas]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_jurusan`, JSON.stringify(jurusan));
  }, [jurusan]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_jenis_dokumen`, JSON.stringify(jenisDokumen));
  }, [jenisDokumen]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_pelapor`, JSON.stringify(pelapor));
  }, [pelapor]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_skripsi`, JSON.stringify(skripsi));
  }, [skripsi]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_tulisan`, JSON.stringify(tulisan));
  }, [tulisan]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_users`, JSON.stringify(users));
    if (currentUser) {
      const updatedCurrent = users.find(u => u.idUser === currentUser.idUser);
      if (updatedCurrent) {
        setCurrentUser(updatedCurrent);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedCurrent));
      }
    }
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, [currentUser]);

  // Computed Views
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
      setActiveTab('admin');
    } else {
      setActiveTab('student');
    }
    setIsLoginModalOpen(false);
    return { success: true, message: `Selamat datang, ${found.Nama}!` };
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveTab('home');
  };

  const quickSwitchUser = (role: 'guest' | 'siti' | 'rizki' | 'admin') => {
    if (role === 'guest') {
      logout();
      return;
    }

    if (role === 'siti') {
      const siti = users.find(u => u.UserName === '2007111002');
      if (siti) {
        setCurrentUser(siti);
        setActiveTab('student');
      }
      return;
    }

    if (role === 'rizki') {
      const rizki = users.find(u => u.UserName === '2007111001');
      if (rizki) {
        setCurrentUser(rizki);
        setActiveTab('student');
      }
      return;
    }

    if (role === 'admin') {
      const admin = users.find(u => u.UserName === 'admin');
      if (admin) {
        setCurrentUser(admin);
        setActiveTab('admin');
      }
    }
  };

  // Skripsi Handlers (Connected to MySQL Database API)
  const addSkripsi = (item: Omit<Skripsi, 'id_skripsi'>) => {
    fetch('/api/skripsi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    })
      .then(r => (r.ok ? r.json() : null))
      .then(created => {
        if (created) {
          setSkripsi(prev => [created, ...prev.filter(s => s.id_skripsi !== created.id_skripsi)]);
        }
      })
      .catch(err => console.warn('Database insert offline fallback:', err));

    const nextId = skripsi.length > 0 ? Math.max(...skripsi.map(s => s.id_skripsi)) + 1 : 1;
    const newEntry: Skripsi = { ...item, id_skripsi: nextId };
    setSkripsi(prev => [newEntry, ...prev]);
  };

  const updateSkripsi = (id: number, updated: Partial<Skripsi>) => {
    fetch(`/api/skripsi/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    }).catch(err => console.warn('Database update offline fallback:', err));

    setSkripsi(prev => prev.map(s => (s.id_skripsi === id ? { ...s, ...updated } : s)));
  };

  const deleteSkripsi = (id: number) => {
    fetch(`/api/skripsi/${id}`, { method: 'DELETE' }).catch(err =>
      console.warn('Database delete offline fallback:', err)
    );

    setSkripsi(prev => prev.filter(s => s.id_skripsi !== id));
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
  const addPelapor = (item: Omit<Pelapor, 'id_pelapor'>) => {
    const nextId = pelapor.length > 0 ? Math.max(...pelapor.map(p => p.id_pelapor)) + 1 : 1;
    setPelapor(prev => [...prev, { ...item, id_pelapor: nextId }]);
  };

  const updatePelapor = (id: number, updated: Partial<Pelapor>) => {
    setPelapor(prev => prev.map(p => (p.id_pelapor === id ? { ...p, ...updated } : p)));
  };

  const deletePelapor = (id: number) => {
    setPelapor(prev => prev.filter(p => p.id_pelapor !== id));
  };

  const togglePelaporActive = (id: number) => {
    setPelapor(prev =>
      prev.map(p => (p.id_pelapor === id ? { ...p, active: p.active === 1 ? 0 : 1 } : p))
    );
  };

  // Tulisan Handlers
  const addTulisan = (item: Omit<Tulisan, 'idTulisan'>) => {
    const nextId = tulisan.length > 0 ? Math.max(...tulisan.map(t => t.idTulisan)) + 1 : 1;
    setTulisan(prev => [{ ...item, idTulisan: nextId }, ...prev]);
  };

  const updateTulisan = (id: number, updated: Partial<Tulisan>) => {
    setTulisan(prev => prev.map(t => (t.idTulisan === id ? { ...t, ...updated } : t)));
  };

  const deleteTulisan = (id: number) => {
    setTulisan(prev => prev.filter(t => t.idTulisan !== id));
  };

  const toggleTulisanAktif = (id: number) => {
    setTulisan(prev =>
      prev.map(t => (t.idTulisan === id ? { ...t, Aktif: t.Aktif === 1 ? 0 : 1 } : t))
    );
  };

  // User Handlers
  const addUser = (item: Omit<User, 'idUser'>) => {
    const nextId = users.length > 0 ? Math.max(...users.map(u => u.idUser)) + 1 : 1;
    setUsers(prev => [...prev, { ...item, idUser: nextId }]);
  };

  const updateUser = (id: number, updated: Partial<User>) => {
    setUsers(prev => prev.map(u => (u.idUser === id ? { ...u, ...updated } : u)));
  };

  const deleteUser = (id: number) => {
    setUsers(prev => prev.filter(u => u.idUser !== id));
  };

  // Master Data Handlers
  const addFakultas = (item: Omit<Fakultas, 'id_fakultas'>) => {
    const nextId = fakultas.length > 0 ? Math.max(...fakultas.map(f => f.id_fakultas)) + 1 : 1;
    setFakultas(prev => [...prev, { ...item, id_fakultas: nextId }]);
  };

  const updateFakultas = (id: number, updated: Partial<Fakultas>) => {
    setFakultas(prev => prev.map(f => (f.id_fakultas === id ? { ...f, ...updated } : f)));
  };

  const deleteFakultas = (id: number) => {
    setFakultas(prev => prev.filter(f => f.id_fakultas !== id));
  };

  const addJurusan = (item: Omit<Jurusan, 'id_jurusan'>) => {
    const nextId = jurusan.length > 0 ? Math.max(...jurusan.map(j => j.id_jurusan)) + 1 : 1;
    setJurusan(prev => [...prev, { ...item, id_jurusan: nextId }]);
  };

  const updateJurusan = (id: number, updated: Partial<Jurusan>) => {
    setJurusan(prev => prev.map(j => (j.id_jurusan === id ? { ...j, ...updated } : j)));
  };

  const deleteJurusan = (id: number) => {
    setJurusan(prev => prev.filter(j => j.id_jurusan !== id));
  };

  const addJenisDokumen = (item: Omit<JenisDokumen, 'id_jenis_dokumen'>) => {
    const nextId = jenisDokumen.length > 0 ? Math.max(...jenisDokumen.map(d => d.id_jenis_dokumen)) + 1 : 1;
    setJenisDokumen(prev => [...prev, { ...item, id_jenis_dokumen: nextId }]);
  };

  const updateJenisDokumen = (id: number, updated: Partial<JenisDokumen>) => {
    setJenisDokumen(prev => prev.map(d => (d.id_jenis_dokumen === id ? { ...d, ...updated } : d)));
  };

  const deleteJenisDokumen = (id: number) => {
    setJenisDokumen(prev => prev.filter(d => d.id_jenis_dokumen !== id));
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

  // Send Certificate to Gmail simulation
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

    // Update state & persistence
    updateSkripsi(skripsiId, {
      email: recipient,
      email_sent_at: nowTimestamp,
    });

    // Also call backend API if online
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
        viewFakjur,
        viewSkripsi,
        getJurusanByFakultas,
        currentUser,
        setCurrentUser,
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
