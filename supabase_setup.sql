-- Habilita extensão de IDs únicos
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabela EMPRESA
CREATE TABLE empresa (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabela EQUIPE
CREATE TABLE equipe (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID REFERENCES empresa(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabela VENDEDOR
CREATE TABLE vendedor (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  equipe_id UUID REFERENCES equipe(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabela META (Define se é individual ou competitiva)
CREATE TABLE meta (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID REFERENCES empresa(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('INDIVIDUAL', 'COMPETITIVA_EQUIPES', 'COMPETITIVA_VENDEDORES')),
  valor_meta DECIMAL(12,2) NOT NULL,
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Tabela PREMIO (Atrelado à posição do ranking ou atingimento simples)
CREATE TABLE premio (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meta_id UUID REFERENCES meta(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  foto_url TEXT,
  criterio_ganho TEXT NOT NULL CHECK (criterio_ganho IN ('ATINGIU_META', '1_LUGAR', '2_LUGAR', '3_LUGAR')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Tabela REGISTRO_VENDA (Cada venda lançada cai aqui para disparar os sons na tela)
CREATE TABLE registro_venda (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendedor_id UUID REFERENCES vendedor(id) ON DELETE CASCADE,
  valor DECIMAL(12,2) NOT NULL,
  data_venda TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ATIVAR REALTIME PARA O RANKING ANIMADO
alter publication supabase_realtime add table registro_venda;
