import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MySQL connection pool config
const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'manajemen_skripsi',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

let pool;

try {
  pool = mysql.createPool(dbConfig);
  console.log(`[Database] MySQL pool initialized on ${dbConfig.host}:${dbConfig.port}, db: ${dbConfig.database}`);
} catch (err) {
  console.error('[Database] Failed to initialize MySQL pool:', err);
}

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 as test');
    res.json({ status: 'ok', database: 'connected', timestamp: new Date() });
  } catch (error) {
    res.status(500).json({ status: 'error', database: 'disconnected', error: error.message });
  }
});

// 1. FAKULTAS
app.get('/api/fakultas', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM fakultas ORDER BY id_fakultas ASC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching fakultas:', error);
    res.status(500).json({ error: error.message });
  }
});

// 2. JURUSAN
app.get('/api/jurusan', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM jurusan ORDER BY id_jurusan ASC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching jurusan:', error);
    res.status(500).json({ error: error.message });
  }
});

// 3. JENIS DOKUMEN
app.get('/api/jenis-dokumen', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM jenis_dokumen ORDER BY id_jenis_dokumen ASC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching jenis_dokumen:', error);
    res.status(500).json({ error: error.message });
  }
});

// 4. PELAPOR
app.get('/api/pelapor', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM pelapor ORDER BY id_pelapor ASC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching pelapor:', error);
    res.status(500).json({ error: error.message });
  }
});

// 5. TULISAN (PANDUAN & PENGUMUMAN)
app.get('/api/tulisan', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tulisan ORDER BY idTulisan ASC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching tulisan:', error);
    res.status(500).json({ error: error.message });
  }
});

// 6. USERS
app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT idUser, JenisUser, UserName, Password, Nama, JenisKelamin, TempatLahir, TanggalLahir, Alamat, NoKTP, foto, Pinjam FROM users ORDER BY idUser ASC'
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: error.message });
  }
});

// Lookup user by NIM / username
app.get('/api/users/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const [rows] = await pool.query('SELECT * FROM users WHERE UserName = ? LIMIT 1', [username]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching user by username:', error);
    res.status(500).json({ error: error.message });
  }
});

// 7. SKRIPSI
// Get all skripsi (with joined faculty, major, and document details)
app.get('/api/skripsi', async (req, res) => {
  try {
    const query = `
      SELECT 
        s.id_skripsi,
        s.id_jenis_dokumen,
        s.no_surat,
        s.nama,
        s.nim,
        s.email,
        s.email_sent_at,
        s.id_fakultas,
        s.id_jurusan,
        s.judul,
        s.hard_copy,
        s.soft_copy,
        s.tanggal,
        COALESCE(j.jurusan, '') AS jurusan,
        COALESCE(j.keterangan, '') AS ket_jurusan,
        COALESCE(f.fakultas, '') AS fakultas,
        COALESCE(f.keterangan, '') AS ket_fakultas,
        COALESCE(jd.jenis_dokumen, '') AS jenis_dokumen
      FROM skripsi s
      LEFT JOIN jurusan j ON s.id_jurusan = j.id_jurusan
      LEFT JOIN fakultas f ON s.id_fakultas = f.id_fakultas
      LEFT JOIN jenis_dokumen jd ON s.id_jenis_dokumen = jd.id_jenis_dokumen
      ORDER BY s.id_skripsi DESC
    `;
    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching skripsi:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add new skripsi submission
app.post('/api/skripsi', async (req, res) => {
  try {
    const {
      id_jenis_dokumen,
      no_surat,
      nama,
      nim,
      email,
      id_fakultas,
      id_jurusan,
      judul,
      hard_copy,
      soft_copy,
      tanggal,
    } = req.body;

    const query = `
      INSERT INTO skripsi 
      (id_jenis_dokumen, no_surat, nama, nim, email, id_fakultas, id_jurusan, judul, hard_copy, soft_copy, tanggal)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      id_jenis_dokumen || 1,
      no_surat || null,
      nama,
      nim,
      email || null,
      id_fakultas,
      id_jurusan,
      judul,
      hard_copy || 0,
      soft_copy || 0,
      tanggal || new Date().toISOString().split('T')[0],
    ];

    const [result] = await pool.query(query, values);
    const newId = result.insertId;

    // Fetch the inserted record with joined info
    const [inserted] = await pool.query(
      `
      SELECT 
        s.id_skripsi,
        s.id_jenis_dokumen,
        s.no_surat,
        s.nama,
        s.nim,
        s.email,
        s.email_sent_at,
        s.id_fakultas,
        s.id_jurusan,
        s.judul,
        s.hard_copy,
        s.soft_copy,
        s.tanggal,
        COALESCE(j.jurusan, '') AS jurusan,
        COALESCE(j.keterangan, '') AS ket_jurusan,
        COALESCE(f.fakultas, '') AS fakultas,
        COALESCE(f.keterangan, '') AS ket_fakultas,
        COALESCE(jd.jenis_dokumen, '') AS jenis_dokumen
      FROM skripsi s
      LEFT JOIN jurusan j ON s.id_jurusan = j.id_jurusan
      LEFT JOIN fakultas f ON s.id_fakultas = f.id_fakultas
      LEFT JOIN jenis_dokumen jd ON s.id_jenis_dokumen = jd.id_jenis_dokumen
      WHERE s.id_skripsi = ?
    `,
      [newId]
    );

    res.status(201).json(inserted[0]);
  } catch (error) {
    console.error('Error inserting skripsi:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update skripsi
app.put('/api/skripsi/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      id_jenis_dokumen,
      no_surat,
      nama,
      nim,
      email,
      id_fakultas,
      id_jurusan,
      judul,
      hard_copy,
      soft_copy,
      tanggal,
    } = req.body;

    const query = `
      UPDATE skripsi
      SET 
        id_jenis_dokumen = COALESCE(?, id_jenis_dokumen),
        no_surat = COALESCE(?, no_surat),
        nama = COALESCE(?, nama),
        nim = COALESCE(?, nim),
        email = COALESCE(?, email),
        id_fakultas = COALESCE(?, id_fakultas),
        id_jurusan = COALESCE(?, id_jurusan),
        judul = COALESCE(?, judul),
        hard_copy = COALESCE(?, hard_copy),
        soft_copy = COALESCE(?, soft_copy),
        tanggal = COALESCE(?, tanggal)
      WHERE id_skripsi = ?
    `;

    await pool.query(query, [
      id_jenis_dokumen,
      no_surat,
      nama,
      nim,
      email,
      id_fakultas,
      id_jurusan,
      judul,
      hard_copy,
      soft_copy,
      tanggal,
      id,
    ]);

    // Fetch updated record
    const [rows] = await pool.query(
      `
      SELECT 
        s.id_skripsi,
        s.id_jenis_dokumen,
        s.no_surat,
        s.nama,
        s.nim,
        s.email,
        s.email_sent_at,
        s.id_fakultas,
        s.id_jurusan,
        s.judul,
        s.hard_copy,
        s.soft_copy,
        s.tanggal,
        COALESCE(j.jurusan, '') AS jurusan,
        COALESCE(j.keterangan, '') AS ket_jurusan,
        COALESCE(f.fakultas, '') AS fakultas,
        COALESCE(f.keterangan, '') AS ket_fakultas,
        COALESCE(jd.jenis_dokumen, '') AS jenis_dokumen
      FROM skripsi s
      LEFT JOIN jurusan j ON s.id_jurusan = j.id_jurusan
      LEFT JOIN fakultas f ON s.id_fakultas = f.id_fakultas
      LEFT JOIN jenis_dokumen jd ON s.id_jenis_dokumen = jd.id_jenis_dokumen
      WHERE s.id_skripsi = ?
    `,
      [id]
    );

    res.json(rows[0]);
  } catch (error) {
    console.error('Error updating skripsi:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete skripsi
app.delete('/api/skripsi/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM skripsi WHERE id_skripsi = ?', [id]);
    res.json({ success: true, message: 'Skripsi berhasil dihapus dari basis data' });
  } catch (error) {
    console.error('Error deleting skripsi:', error);
    res.status(500).json({ error: error.message });
  }
});

// Dispatch email update
app.post('/api/send-certificate', async (req, res) => {
  try {
    const { skripsiId, email } = req.body;
    const now = new Date();
    const formattedDate = `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    await pool.query('UPDATE skripsi SET email = COALESCE(?, email), email_sent_at = ? WHERE id_skripsi = ?', [
      email || null,
      formattedDate,
      skripsiId,
    ]);

    res.json({
      success: true,
      message: `Surat Bebas Pustaka resmi berhasil dikirim ke alamat ${email || 'Gmail Mahasiswa'}!`,
      sentAt: formattedDate,
    });
  } catch (error) {
    console.error('Error sending certificate:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start Express server
app.listen(PORT, () => {
  console.log(`[API Server] Running at http://localhost:${PORT}`);
});
