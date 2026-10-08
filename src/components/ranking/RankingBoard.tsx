"use client";

import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, Avatar, Paper } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

type Salesperson = {
  id: string;
  name: string;
  avatarUrl: string;
  sales: number;
  goal: number;
};

const initialData: Salesperson[] = [
  { id: "1", name: "Carlos Silva", avatarUrl: "https://i.pravatar.cc/150?u=1", sales: 4200, goal: 5000 },
  { id: "2", name: "Ana Paula", avatarUrl: "https://i.pravatar.cc/150?u=2", sales: 3400, goal: 5000 },
  { id: "3", name: "Roberto Dias", avatarUrl: "https://i.pravatar.cc/150?u=3", sales: 2800, goal: 5000 },
  { id: "4", name: "Juliana Costa", avatarUrl: "https://i.pravatar.cc/150?u=4", sales: 1900, goal: 5000 },
];

export default function RankingBoard() {
  const [sellers, setSellers] = useState<Salesperson[]>(initialData);
  const previousOrder = useRef(initialData.map(s => s.id));

  const playOvertakeSound = () => {
    try {
      const audio = new Audio('/sounds/ultrapassagem.mp3');
      audio.volume = 0.8;
      audio.play().catch(() => console.log("Áudio bloqueado pelo navegador. Interaja com a página primeiro."));
    } catch (e) {
      console.log("Erro ao tocar áudio");
    }
  };

  const playGoalReachedSound = () => {
    try {
      const audio = new Audio('/sounds/meta-batida.mp3');
      audio.volume = 1.0;
      audio.play().catch(() => console.log("Áudio bloqueado pelo navegador. Interaja com a página primeiro."));
    } catch (e) {
      console.log("Erro ao tocar áudio");
    }
  };

  // Conexão com o Supabase Realtime
  useEffect(() => {
    // Essa função busca os totais diretamente da nossa View no banco
    const fetchRealData = async () => {
      const { supabase } = await import('@/lib/supabase');
      const { data, error } = await supabase.from('ranking_atual').select('*');
      
      if (data) {
        // Formata os dados para o formato que a tela espera
        const formattedData = data.map((d: any) => ({
          id: d.id,
          name: d.nome,
          avatarUrl: d.avatar_url,
          sales: Number(d.total_vendas),
          goal: Number(d.meta_individual) || 5000
        })).sort((a, b) => b.sales - a.sales);
        
        setSellers(prev => {
          // Se for a primeira vez carregando a tela, apenas salva e não toca som
          if (prev.length === 0 || prev[0].id === "1") return formattedData; // ignora a inicial

          // Verifica mudanças para os Sons
          const newOrder = formattedData.map(s => s.id);
          const oldOrder = prev.map(s => s.id);
          
          if (JSON.stringify(newOrder) !== JSON.stringify(oldOrder)) {
             playOvertakeSound();
          }

          formattedData.forEach(newSeller => {
            const oldSeller = prev.find(s => s.id === newSeller.id);
            if (oldSeller && oldSeller.sales < oldSeller.goal && newSeller.sales >= newSeller.goal) {
              playGoalReachedSound();
            }
          });
          
          return formattedData;
        });
      }
    };

    fetchRealData(); // Busca a 1ª vez

    // Ouve o Supabase Realtime na tabela de vendas
    let subscription: any;
    import('@/lib/supabase').then(({ supabase }) => {
      subscription = supabase
        .channel('vendas-realtime')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'registro_venda' }, payload => {
          console.log("🔔 NOVA VENDA REGISTRADA!", payload.new);
          fetchRealData(); // Atualiza toda a tela com o novo cálculo
        })
        .subscribe();
    });

    return () => {
      if (subscription) {
        import('@/lib/supabase').then(({ supabase }) => {
          supabase.removeChannel(subscription);
        });
      }
    };
  }, []);

  return (
    <Box sx={{ p: 4, maxWidth: 900, mx: "auto" }}>
      <Typography variant="h3" fontWeight="bold" textAlign="center" mb={1} color="primary">
        🏆 Ranking de Vendas
      </Typography>
      <Typography variant="subtitle1" textAlign="center" mb={5} color="text.secondary">
        Acompanhamento ao vivo - Outubro/2026
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <AnimatePresence>
          {sellers.map((seller, index) => {
            const progress = Math.min((seller.sales / seller.goal) * 100, 100);
            const isTop3 = index < 3;
            const reachedGoal = seller.sales >= seller.goal;
            
            // Cores do Pódio
            let borderColor = 'divider';
            if (index === 0) borderColor = '#ffd700'; // Ouro
            else if (index === 1) borderColor = '#c0c0c0'; // Prata
            else if (index === 2) borderColor = '#cd7f32'; // Bronze

            return (
              <motion.div
                key={seller.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20
                }}
              >
                <Paper
                  elevation={isTop3 ? 8 : 2}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 2,
                    borderRadius: 3,
                    border: isTop3 ? '2px solid' : '1px solid',
                    borderColor: borderColor,
                    bgcolor: reachedGoal ? 'rgba(76, 175, 80, 0.05)' : 'background.paper',
                    transition: 'background-color 0.5s ease'
                  }}
                >
                  <Typography variant="h4" sx={{ width: 50, fontWeight: '900', color: isTop3 ? borderColor : 'text.secondary', textAlign: 'center' }}>
                    {index + 1}º
                  </Typography>
                  
                  <Avatar src={seller.avatarUrl} sx={{ width: 64, height: 64, mx: 2, border: '2px solid', borderColor: borderColor }} />
                  
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" fontWeight="bold">
                      {seller.name} {reachedGoal && "⭐"}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                      <Box sx={{ flexGrow: 1, height: 10, bgcolor: 'background.default', borderRadius: 4, overflow: 'hidden' }}>
                        <Box 
                          sx={{ 
                            width: `${progress}%`, 
                            height: '100%', 
                            bgcolor: reachedGoal ? 'success.main' : 'primary.main', 
                            transition: 'width 1s ease-in-out' 
                          }} 
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 40 }}>
                        {Math.floor(progress)}%
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ ml: 3, textAlign: 'right' }}>
                    <Typography variant="h5" fontWeight="bold" sx={{ color: reachedGoal ? 'success.light' : 'text.primary' }}>
                      R$ {seller.sales.toLocaleString('pt-BR')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Meta: R$ {seller.goal.toLocaleString('pt-BR')}
                    </Typography>
                  </Box>
                </Paper>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </Box>
    </Box>
  );
}
