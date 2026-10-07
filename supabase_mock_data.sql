-- 1. VIEW DE RANKING
CREATE OR REPLACE VIEW ranking_atual AS
SELECT 
  v.id,
  v.nome,
  v.avatar_url,
  COALESCE(SUM(rv.valor), 0) AS total_vendas,
  (SELECT valor_meta FROM meta LIMIT 1) AS meta_individual
FROM vendedor v
LEFT JOIN registro_venda rv ON v.id = rv.vendedor_id
GROUP BY v.id, v.nome, v.avatar_url;

-- 2. DADOS DE TESTE (Mock)
-- Insere uma Empresa
INSERT INTO empresa (id, nome, logo_url) VALUES ('c1b48b78-1cd4-40da-b7cf-5136ff93fcce', 'Minha Empresa Tech', 'https://via.placeholder.com/150');

-- Insere uma Meta
INSERT INTO meta (id, empresa_id, nome, tipo, valor_meta, data_inicio, data_fim) 
VALUES ('c2b48b78-1cd4-40da-b7cf-5136ff93fcce', 'c1b48b78-1cd4-40da-b7cf-5136ff93fcce', 'Meta de Outubro', 'INDIVIDUAL', 5000.00, '2026-10-01', '2026-10-31');

-- Insere uma Equipe
INSERT INTO equipe (id, empresa_id, nome, avatar_url) 
VALUES ('c3b48b78-1cd4-40da-b7cf-5136ff93fcce', 'c1b48b78-1cd4-40da-b7cf-5136ff93fcce', 'Tubarões de Vendas', 'https://via.placeholder.com/150');

-- Insere Vendedores
INSERT INTO vendedor (id, equipe_id, nome, avatar_url) VALUES 
('c4b48b78-1cd4-40da-b7cf-5136ff93fcce', 'c3b48b78-1cd4-40da-b7cf-5136ff93fcce', 'Carlos Silva', 'https://i.pravatar.cc/150?u=1'),
('c5b48b78-1cd4-40da-b7cf-5136ff93fcce', 'c3b48b78-1cd4-40da-b7cf-5136ff93fcce', 'Ana Paula', 'https://i.pravatar.cc/150?u=2');

-- Insere Registros Iniciais de Venda
INSERT INTO registro_venda (vendedor_id, valor) VALUES
('c4b48b78-1cd4-40da-b7cf-5136ff93fcce', 1500.00),
('c5b48b78-1cd4-40da-b7cf-5136ff93fcce', 2000.00);
