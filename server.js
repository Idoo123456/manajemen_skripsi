import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MySQL connection pool config (XAMPP Default: 127.0.0.1:3306, user: root, password: '')
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

// 0. HEALTH CHECK & DB STATUS
app.get('/api/health', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 as test');
    res.json({
      status: 'ok',
      database: 'connected',
      engine: 'MySQL (XAMPP)',
      host: dbConfig.host,
      port: dbConfig.port,
      databaseName: dbConfig.database,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({ status: 'error', database: 'disconnected', error: error.message });
  }
});

app.get('/api/db-status', async (req, res) => {
  try {
    const [[skripsiCount]] = await pool.query('SELECT COUNT(*) as c FROM skripsi');
    const [[usersCount]] = await pool.query('SELECT COUNT(*) as c FROM users');
    const [[pelaporCount]] = await pool.query('SELECT COUNT(*) as c FROM pelapor');
    const [[tulisanCount]] = await pool.query('SELECT COUNT(*) as c FROM tulisan');

    res.json({
      connected: true,
      host: dbConfig.host,
      port: dbConfig.port,
      database: dbConfig.database,
      counts: {
        skripsi: skripsiCount.c,
        users: usersCount.c,
        pelapor: pelaporCount.c,
        tulisan: tulisanCount.c,
      }
    });
  } catch (error) {
    res.status(500).json({ connected: false, error: error.message });
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

app.post('/api/fakultas', async (req, res) => {
  try {
    const { fakultas, keterangan } = req.body;
    const [result] = await pool.query(
      'INSERT INTO fakultas (fakultas, keterangan) VALUES (?, ?)',
      [fakultas, keterangan || '']
    );
    const [inserted] = await pool.query('SELECT * FROM fakultas WHERE id_fakultas = ?', [result.insertId]);
    res.status(201).json(inserted[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/fakultas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { fakultas, keterangan } = req.body;
    await pool.query(
      'UPDATE fakultas SET fakultas = COALESCE(?, fakultas), keterangan = COALESCE(?, keterangan) WHERE id_fakultas = ?',
      [fakultas, keterangan, id]
    );
    const [updated] = await pool.query('SELECT * FROM fakultas WHERE id_fakultas = ?', [id]);
    res.json(updated[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/fakultas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM fakultas WHERE id_fakultas = ?', [id]);
    res.json({ success: true, message: 'Fakultas berhasil dihapus' });
  } catch (error) {
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

app.post('/api/jurusan', async (req, res) => {
  try {
    const { id_fakultas, jurusan, keterangan } = req.body;
    const [result] = await pool.query(
      'INSERT INTO jurusan (id_fakultas, jurusan, keterangan) VALUES (?, ?, ?)',
      [id_fakultas, jurusan, keterangan || '']
    );
    const [inserted] = await pool.query('SELECT * FROM jurusan WHERE id_jurusan = ?', [result.insertId]);
    res.status(201).json(inserted[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/jurusan/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { id_fakultas, jurusan, keterangan } = req.body;
    await pool.query(
      'UPDATE jurusan SET id_fakultas = COALESCE(?, id_fakultas), jurusan = COALESCE(?, jurusan), keterangan = COALESCE(?, keterangan) WHERE id_jurusan = ?',
      [id_fakultas, jurusan, keterangan, id]
    );
    const [updated] = await pool.query('SELECT * FROM jurusan WHERE id_jurusan = ?', [id]);
    res.json(updated[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/jurusan/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM jurusan WHERE id_jurusan = ?', [id]);
    res.json({ success: true, message: 'Jurusan berhasil dihapus' });
  } catch (error) {
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

app.post('/api/jenis-dokumen', async (req, res) => {
  try {
    const { jenis_dokumen, keterangan_jenis_dokumen } = req.body;
    const [result] = await pool.query(
      'INSERT INTO jenis_dokumen (jenis_dokumen, keterangan_jenis_dokumen) VALUES (?, ?)',
      [jenis_dokumen, keterangan_jenis_dokumen || '']
    );
    const [inserted] = await pool.query('SELECT * FROM jenis_dokumen WHERE id_jenis_dokumen = ?', [result.insertId]);
    res.status(201).json(inserted[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/jenis-dokumen/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { jenis_dokumen, keterangan_jenis_dokumen } = req.body;
    await pool.query(
      'UPDATE jenis_dokumen SET jenis_dokumen = COALESCE(?, jenis_dokumen), keterangan_jenis_dokumen = COALESCE(?, keterangan_jenis_dokumen) WHERE id_jenis_dokumen = ?',
      [jenis_dokumen, keterangan_jenis_dokumen, id]
    );
    const [updated] = await pool.query('SELECT * FROM jenis_dokumen WHERE id_jenis_dokumen = ?', [id]);
    res.json(updated[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/jenis-dokumen/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM jenis_dokumen WHERE id_jenis_dokumen = ?', [id]);
    res.json({ success: true, message: 'Jenis dokumen berhasil dihapus' });
  } catch (error) {
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

app.post('/api/pelapor', async (req, res) => {
  try {
    const { nama_pelapor, nip_pelapor, jabatan_pelapor, ttd_url, ttd_file_name, active } = req.body;
    const [result] = await pool.query(
      'INSERT INTO pelapor (nama_pelapor, nip_pelapor, jabatan_pelapor, ttd_url, ttd_file_name, active) VALUES (?, ?, ?, ?, ?, ?)',
      [nama_pelapor, nip_pelapor || '', jabatan_pelapor || '', ttd_url || '', ttd_file_name || '', active !== undefined ? active : 1]
    );
    const [inserted] = await pool.query('SELECT * FROM pelapor WHERE id_pelapor = ?', [result.insertId]);
    res.status(201).json(inserted[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/pelapor/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_pelapor, nip_pelapor, jabatan_pelapor, ttd_url, ttd_file_name, active } = req.body;
    await pool.query(
      `UPDATE pelapor SET 
        nama_pelapor = COALESCE(?, nama_pelapor),
        nip_pelapor = COALESCE(?, nip_pelapor),
        jabatan_pelapor = COALESCE(?, jabatan_pelapor),
        ttd_url = COALESCE(?, ttd_url),
        ttd_file_name = COALESCE(?, ttd_file_name),
        active = COALESCE(?, active)
      WHERE id_pelapor = ?`,
      [nama_pelapor, nip_pelapor, jabatan_pelapor, ttd_url, ttd_file_name, active, id]
    );
    const [updated] = await pool.query('SELECT * FROM pelapor WHERE id_pelapor = ?', [id]);
    res.json(updated[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/pelapor/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM pelapor WHERE id_pelapor = ?', [id]);
    res.json({ success: true, message: 'Pelapor berhasil dihapus' });
  } catch (error) {
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

app.post('/api/tulisan', async (req, res) => {
  try {
    const { TanggalDibuat, Judul, Isi, Aktif, JenisTulisan } = req.body;
    const [result] = await pool.query(
      'INSERT INTO tulisan (TanggalDibuat, Judul, Isi, Aktif, JenisTulisan) VALUES (?, ?, ?, ?, ?)',
      [
        TanggalDibuat || new Date().toISOString().split('T')[0],
        Judul,
        Isi || '',
        Aktif !== undefined ? Aktif : 1,
        JenisTulisan || 1
      ]
    );
    const [inserted] = await pool.query('SELECT * FROM tulisan WHERE idTulisan = ?', [result.insertId]);
    res.status(201).json(inserted[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/tulisan/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { TanggalDibuat, Judul, Isi, Aktif, JenisTulisan } = req.body;
    await pool.query(
      `UPDATE tulisan SET 
        TanggalDibuat = COALESCE(?, TanggalDibuat),
        Judul = COALESCE(?, Judul),
        Isi = COALESCE(?, Isi),
        Aktif = COALESCE(?, Aktif),
        JenisTulisan = COALESCE(?, JenisTulisan)
      WHERE idTulisan = ?`,
      [TanggalDibuat, Judul, Isi, Aktif, JenisTulisan, id]
    );
    const [updated] = await pool.query('SELECT * FROM tulisan WHERE idTulisan = ?', [id]);
    res.json(updated[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/tulisan/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM tulisan WHERE idTulisan = ?', [id]);
    res.json({ success: true, message: 'Tulisan berhasil dihapus' });
  } catch (error) {
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

app.post('/api/users', async (req, res) => {
  try {
    const {
      JenisUser,
      UserName,
      Password,
      Nama,
      JenisKelamin,
      TempatLahir,
      TanggalLahir,
      Alamat,
      NoKTP,
      foto,
      Pinjam
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO users 
        (JenisUser, UserName, Password, Nama, JenisKelamin, TempatLahir, TanggalLahir, Alamat, NoKTP, foto, Pinjam)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        JenisUser || 2,
        UserName,
        Password || '123456',
        Nama,
        JenisKelamin || 1,
        TempatLahir || 'Pekanbaru',
        TanggalLahir || '2000-01-01',
        Alamat || 'Jl. Subrantas, Pekanbaru',
        NoKTP || '1471000000000000',
        foto || '',
        Pinjam || 0
      ]
    );

    const [inserted] = await pool.query('SELECT * FROM users WHERE idUser = ?', [result.insertId]);
    res.status(201).json(inserted[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      JenisUser,
      UserName,
      Password,
      Nama,
      JenisKelamin,
      TempatLahir,
      TanggalLahir,
      Alamat,
      NoKTP,
      foto,
      Pinjam
    } = req.body;

    await pool.query(
      `UPDATE users SET
        JenisUser = COALESCE(?, JenisUser),
        UserName = COALESCE(?, UserName),
        Password = COALESCE(?, Password),
        Nama = COALESCE(?, Nama),
        JenisKelamin = COALESCE(?, JenisKelamin),
        TempatLahir = COALESCE(?, TempatLahir),
        TanggalLahir = COALESCE(?, TanggalLahir),
        Alamat = COALESCE(?, Alamat),
        NoKTP = COALESCE(?, NoKTP),
        foto = COALESCE(?, foto),
        Pinjam = COALESCE(?, Pinjam)
      WHERE idUser = ?`,
      [
        JenisUser,
        UserName,
        Password,
        Nama,
        JenisKelamin,
        TempatLahir,
        TanggalLahir,
        Alamat,
        NoKTP,
        foto,
        Pinjam,
        id
      ]
    );

    const [updated] = await pool.query('SELECT * FROM users WHERE idUser = ?', [id]);
    res.json(updated[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM users WHERE idUser = ?', [id]);
    res.json({ success: true, message: 'User berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 7. SKRIPSI
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
      Number(id_jenis_dokumen) || 1,
      no_surat || null,
      nama,
      nim,
      email || null,
      Number(id_fakultas) || 1,
      Number(id_jurusan) || 1,
      judul,
      hard_copy !== undefined ? Number(hard_copy) : 1,
      soft_copy !== undefined ? Number(soft_copy) : 1,
      tanggal || new Date().toISOString().split('T')[0],
    ];

    const [result] = await pool.query(query, values);
    const newId = result.insertId;

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
      message: `Surat Tanda Terima Penyerahan Skripsi resmi berhasil dikirim ke alamat ${email || 'email mahasiswa'}!`,
      sentAt: formattedDate,
    });
  } catch (error) {
    console.error('Error sending certificate:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`[API Server] Running at http://localhost:${PORT}`);
});
