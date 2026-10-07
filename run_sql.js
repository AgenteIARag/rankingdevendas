const { Client } = require('pg');
const fs = require('fs');

async function run() {
  const client = new Client({
    host: 'db.eqkseqsmzwedsyrxtijh.supabase.co',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'Supa9956#@#@',
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    const sql2 = fs.readFileSync('supabase_mock_data.sql', 'utf8');
    await client.query(sql2);
    console.log("✅ Dados de Teste Injetados com Sucesso.");
  } catch (err) {
    console.error("❌ Erro ao executar SQL:", err.message);
  } finally {
    await client.end();
  }
}

run();
