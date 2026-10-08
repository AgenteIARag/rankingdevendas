import { Typography, Box, Paper } from "@mui/material";

export default function DashboardHome() {
  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={2} color="primary">Visão Geral Administrativa</Typography>
      <Typography color="text.secondary" mb={4}>
        Bem-vindo ao painel de controle. Aqui você pode gerenciar toda a operação do Ranking.
      </Typography>
      
      <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6" mb={2}>Estatísticas Rápidas</Typography>
        <Typography color="text.secondary">Em breve conectaremos ao banco de dados para mostrar o total de vendas do mês aqui.</Typography>
      </Paper>
    </Box>
  );
}
