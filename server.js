app.get('/api/items/:id', authMiddleware, (req, res) => {
  const item = queryOne('SELECT * FROM items WHERE id = ?', [Number(req.params.id)]);
  if (!item) return res.status(404).json({ error: 'Barang tidak ditemukan.' });
  res.json(item);
});

app.post('/api/items', authMiddleware, (req, res) => {
  const { name, sku, category, qty, price, location, note } = req.body || {};

  if (!name || !String(name).trim()) {
    return res.status(400).json({ error: 'Nama barang wajib diisi.' });
  }
  if (!category || !String(category).trim()) {
    return res.status(400).json({ error: 'Kategori wajib diisi.' });
  }

  const quantity = Number(qty);
  const harga = Number(price);

  if (isNaN(quantity) || quantity < 0) {
    return res.status(400).json({ error: 'Stok harus angka ≥ 0.' });
  }
  if (isNaN(harga) || harga < 0) {
    return res.status(400).json({ error: 'Harga harus angka ≥ 0.' });
  }

  run(
    'INSERT INTO items (name, sku, category, qty, price, location, note) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [
      String(name).trim(),
      sku ? String(sku).trim() : '',
      String(category).trim(),
      quantity,
      harga,
      location ? String(location).trim() : '',
      note ? String(note).trim() : ''
    ]
  );

  const id = lastId();
  const item = queryOne('SELECT * FROM items WHERE id = ?', [id]);
  res.status(201).json(item);
});

app.put('/api/items/:id', authMiddleware, (req, res) => {
  const id = Number(req.params.id);
  const existing = queryOne('SELECT * FROM items WHERE id = ?', [id]);
  if (!existing) return res.status(404).json({ error: 'Barang tidak ditemukan.' });

  const { name, sku, category, qty, price, location, note } = req.body || {};

  if (!name || !String(name).trim()) {
    return res.status(400).json({ error: 'Nama barang wajib diisi.' });
  }
  if (!category || !String(category).trim()) {
    return res.status(400).json({ error: 'Kategori wajib diisi.' });
  }

  const quantity = Number(qty);
  const harga = Number(price);

  if (isNaN(quantity) || quantity < 0) {
    return res.status(400).json({ error: 'Stok harus angka ≥ 0.' });
  }
  if (isNaN(harga) || harga < 0) {
    return res.status(400).json({ error: 'Harga harus angka ≥ 0.' });
  }

  run(
    `UPDATE items SET
      name = ?, sku = ?, category = ?, qty = ?, price = ?,
      location = ?, note = ?, updated_at = datetime('now','localtime')
     WHERE id = ?`,
    [
      String(name).trim(),
      sku ? String(sku).trim() : '',
      String(category).trim(),
      quantity,
      harga,
      location ? String(location).trim() : '',
      note ? String(note).trim() : '',
      id
    ]
  );

  const item = queryOne('SELECT * FROM items WHERE id = ?', [id]);
  res.json(item);
});

app.delete('/api/items/:id', authMiddleware, (req, res) => {
  const id = Number(req.params.id);
  const existing = queryOne('SELECT * FROM items WHERE id = ?', [id]);
  if (!existing) return res.status(404).json({ error: 'Barang tidak ditemukan.' });

  run('DELETE FROM items WHERE id = ?', [id]);
  res.json({ success: true, message: 'Barang berhasil dihapus.', deleted: existing });
});

app.get('/api/stats', authMiddleware, (req, res) => {
  const total = queryOne('SELECT COUNT(*) as c FROM items').c;
  const totalStock = queryOne('SELECT COALESCE(SUM(qty),0) as s FROM items').s;
  const low = queryOne('SELECT COUNT(*) as c FROM items WHERE qty > 0 AND qty <= 5').c;
  const value = queryOne('SELECT COALESCE(SUM(qty * price),0) as v FROM items').v;
  res.json({ total, totalStock, low, value });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'crusher-inventory.html'));
});

initDatabase()
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log('');
      console.log('═══════════════════════════════════════');
      console.log('  Crusher Inventory Server');
      console.log('═══════════════════════════════════════');
      console.log('  URL   : http://localhost:' + PORT);
      console.log('  Login : admin / admin123');
      console.log('  DB    : ' + DB_PATH);
      console.log('═══════════════════════════════════════');
      console.log('');
    });
  })
  .catch((err) => {
    console.error('Gagal inisialisasi database:', err);
    process.exit(1);
  });
         
