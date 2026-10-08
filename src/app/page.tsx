import { redirect } from 'next/navigation';

export default function Home() {
  // Redireciona a raiz direto para a tela de ranking por enquanto
  redirect('/ranking');
}
