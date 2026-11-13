import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router";

export default function ManageCardsPage() {
  const navigate = useNavigate();
  const { categoryId } = useParams<{ categoryId: string }>();

  return (
    <main className="min-h-screen p-6">
      <button
        type="button"
        onClick={() => navigate("/perfil/categorias")}
        className="mb-6 flex items-center gap-2"
      >
        <ArrowLeft size={20} />
        Voltar
      </button>

      <h1 className="text-2xl font-bold">Gerenciar cartões</h1>

      <p className="mt-2">Categoria: {categoryId}</p>
    </main>
  );
}
