import PinAccessPage from "../../components/profile/PinAccessPage";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  LayoutGrid,
  MessageCircle,
  X,
} from "lucide-react";

import { useProfileContext } from "../../contexts/ProfileContext";
import { PinVerificationForm } from "../../components/profile/PinVerificationForm";
import { cardService } from "../../services/cardService";
import { quickPhraseIcons } from "../../constants/quickPhraseIcons";

import CardForm from "../../components/cards/CardForm";
import type { CardFormData } from "../../components/cards/CardForm";
import type { Card } from "../../types/card";

const cardColors = [
  "#DDEBFA",
  "#DDEFE3",
  "#FFE0BD",
  "#EBE1FA",
  "#F9D5D6",
  "#FFE5A3",
];

export default function ManageCardsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { categoryId } = useParams<{ categoryId: string }>();

  const [cards, setCards] = useState<Card[]>([]);
  const [cardsLoading, setCardsLoading] = useState(true);
  const [cardsError, setCardsError] = useState("");

  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<Card | null>(null);

  const [cardToDelete, setCardToDelete] = useState<Card | null>(null);
  const [isDeletingCard, setIsDeletingCard] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const {
    user,
    loading,
    isPinVerified,
    setIsPinVerified,
    enteredPin,
    setEnteredPin,
    verifyingPin,
    accessPinError,
    setAccessPinError,
    handleVerifyPin,
  } = useProfileContext();

  const needsPin = Boolean(user?.pinHash && !isPinVerified);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/perfil", { replace: true });
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    if (loading || !user || needsPin || !categoryId) return;

    let active = true;

    async function loadCards() {
      setCardsLoading(true);
      setCardsError("");

      try {
        const data = await cardService.getByCategory(categoryId!);

        if (active) {
          setCards(data);
        }
      } catch (error) {
        console.error("Erro ao carregar cartões:", error);

        if (active) {
          setCardsError("Não foi possível carregar os cartões.");
        }
      } finally {
        if (active) {
          setCardsLoading(false);
        }
      }
    }

    void loadCards();

    return () => {
      active = false;
    };
  }, [loading, user, needsPin, categoryId]);

  // Fecha a confirmação de exclusão ao pressionar Esc.
  useEffect(() => {
    if (!cardToDelete) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && !isDeletingCard) {
        setCardToDelete(null);
        setDeleteError("");
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [cardToDelete, isDeletingCard]);

  function handleBack() {
    if (location.state?.origin === "category" && categoryId) {
      navigate(`/categorias/${categoryId}`, { replace: true });
      return;
    }

    navigate("/perfil/categorias", { replace: true });
  }

  function handleConfirm() {
    setIsPinVerified(false);
    setEnteredPin("");
    setAccessPinError("");

    navigate(categoryId ? `/categorias/${categoryId}` : "/", {
      replace: true,
    });
  }

  async function handleSaveCard(data: CardFormData): Promise<void> {
    if (!user || needsPin || !categoryId) {
      throw new Error("Acesso não autorizado.");
    }

    const newCard: Card = {
      id: crypto.randomUUID(),
      title: data.title,
      speechText: data.speechText,
      altText: data.altText,
      image: data.image,
      categoryId,
      ownerId: user.id,
      keywords: [],
      isActive: true,
      icon: data.icon,
    };

    await cardService.create(newCard);

    setCards((previous) => [...previous, newCard]);
    setCardsError("");
  }

  async function handleUpdateCard(data: CardFormData): Promise<void> {
    if (!user || needsPin || !editingCard || !categoryId) {
      throw new Error("Acesso não autorizado.");
    }

    const changes: Partial<Card> = {
      title: data.title,
      speechText: data.speechText,
      icon: data.icon,
    };

    const updated = await cardService.update(editingCard.id, changes);

    if (updated === 0) {
      throw new Error("Cartão não encontrado.");
    }

    setCards((previous) =>
      previous.map((card) =>
        card.id === editingCard.id ? { ...card, ...changes } : card,
      ),
    );

    setEditingCard(null);
  }

  async function handleDeleteCard(): Promise<void> {
    if (!user || needsPin || !cardToDelete || isDeletingCard) {
      return;
    }

    setIsDeletingCard(true);
    setDeleteError("");

    try {
      await cardService.remove(cardToDelete.id);

      setCards((previous) =>
        previous.filter((card) => card.id !== cardToDelete.id),
      );

      setCardToDelete(null);
      setEditingCard(null);
    } catch (error) {
      console.error("Erro ao excluir cartão:", error);
      setDeleteError("Não foi possível excluir o cartão.");
    } finally {
      setIsDeletingCard(false);
    }
  }

  if (loading || !user) return null;

  if (needsPin) {
    return <PinAccessPage title="Gerenciar Cartões" onBack={handleBack} />;
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FFF9F3] px-4 pb-28 pt-4">
      {/* Elementos decorativos */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#FFE6D0]/60"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 top-96 h-48 w-48 rounded-full bg-[#FFF0BB]/30"
      />

      <div className="relative mx-auto w-full max-w-lg">
        {/* Cabeçalho */}
        <header className="mb-6 pt-3">
          <div className="flex min-h-14 items-center gap-4">
            <button
              type="button"
              onClick={handleBack}
              aria-label="Voltar"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-[#42251D] shadow-sm transition-transform active:scale-95"
            >
              <ArrowLeft size={24} strokeWidth={2.5} aria-hidden="true" />
            </button>

            <h1 className="min-w-0 text-xl font-extrabold leading-tight tracking-tight text-[#42251D] sm:text-2xl">
              Gerenciar Cartões
            </h1>
          </div>
        </header>

        {needsPin ? (
          <section className="rounded-3xl border border-[#F5E9DF] bg-white p-5 shadow-[0_5px_14px_rgba(41,37,36,0.06)]">
            <h2 className="mb-4 text-lg font-extrabold text-[#42251D]">
              Verificar PIN de acesso
            </h2>

            <PinVerificationForm
              enteredPin={enteredPin}
              accessPinError={accessPinError}
              verifyingPin={verifyingPin}
              onPinChange={setEnteredPin}
              onSubmit={handleVerifyPin}
              onCancel={handleBack}
              onForgotPin={() => navigate("/perfil/recuperar-pin")}
            />
          </section>
        ) : (
          <>
            {/* Apresentação */}
            <section className="mb-5 flex items-center gap-3 rounded-3xl bg-[#FFE0BD] p-4">
              <span
                aria-hidden="true"
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/70"
              >
                <MessageCircle size={30} strokeWidth={2.3} color="#C2410C" />
              </span>

              <div className="min-w-0">
                <h2 className="font-extrabold text-[#42251D]">
                  Personalize seus cartões
                </h2>

                <p className="mt-1 text-sm leading-relaxed text-[#775A49]">
                  Adicione palavras e mensagens para facilitar a comunicação.
                </p>
              </div>
            </section>

            {/* Lista de cartões */}
            <section className="rounded-3xl border border-[#F5E9DF] bg-white p-4 shadow-[0_5px_14px_rgba(41,37,36,0.06)] sm:p-5">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-extrabold text-[#42251D]">
                    Cartões cadastrados
                  </h2>

                  <p className="mt-1 text-xs font-medium text-[#80685D]">
                    {cards.length} cartão(ões)
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddCardOpen(true)}
                  className="flex min-h-11 items-center gap-2 rounded-xl bg-brand-primary px-4 py-2.5 text-sm font-bold text-white transition-transform active:scale-95"
                >
                  <Plus size={19} aria-hidden="true" />
                  Novo cartão
                </button>
              </div>

              {cardsError && (
                <p
                  role="alert"
                  className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700"
                >
                  {cardsError}
                </p>
              )}

              {cardsLoading ? (
                <p className="text-sm text-app-muted">Carregando cartões...</p>
              ) : cards.length === 0 ? (
                <div className="rounded-2xl bg-[#FFF9F3] p-6 text-center">
                  <LayoutGrid
                    size={42}
                    className="mx-auto mb-3 text-brand-primary"
                    aria-hidden="true"
                  />

                  <p className="font-bold text-[#42251D]">
                    Nenhum cartão cadastrado
                  </p>

                  <p className="mt-2 text-sm leading-relaxed text-[#80685D]">
                    Toque em Novo cartão para adicionar uma mensagem à
                    categoria.
                  </p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {cards.map((card, index) => {
                    const selectedIcon = quickPhraseIcons.find(
                      (item) => item.id === card.icon,
                    );

                    const Icon = selectedIcon?.Icon ?? MessageCircle;

                    const backgroundColor =
                      cardColors[index % cardColors.length];

                    return (
                      <li
                        key={card.id}
                        className="rounded-2xl border border-[#F1E4D9] bg-[#FFFCF9] p-3 sm:p-4"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            aria-hidden="true"
                            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl"
                            style={{
                              backgroundColor,
                            }}
                          >
                            {card.image && !card.icon ? (
                              <img
                                src={card.image}
                                alt=""
                                className="h-12 w-12 object-contain"
                              />
                            ) : (
                              <Icon
                                size={32}
                                strokeWidth={2.2}
                                color="#42251D"
                              />
                            )}
                          </span>

                          <div className="min-w-0 flex-1">
                            <h3 className="break-words font-extrabold text-[#42251D]">
                              {card.title}
                            </h3>

                            <p className="mt-1 break-words text-sm leading-relaxed text-[#80685D]">
                              {card.speechText}
                            </p>
                          </div>
                        </div>

                        {/* Ações do cartão */}
                        <div className="mt-3 flex justify-end gap-2 border-t border-[#F1E4D9] pt-3">
                          <button
                            type="button"
                            onClick={() => setEditingCard(card)}
                            aria-label={`Editar cartão ${card.title}`}
                            className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#F5F0EA] px-3 py-2 text-sm font-semibold text-[#42251D] transition-colors hover:bg-[#EEE4DB]"
                          >
                            <Pencil size={17} aria-hidden="true" />
                            Editar
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setDeleteError("");
                              setCardToDelete(card);
                            }}
                            aria-label={`Excluir cartão ${card.title}`}
                            className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50"
                          >
                            <Trash2 size={17} aria-hidden="true" />
                            Excluir
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}

              <button
                type="button"
                onClick={handleConfirm}
                className="mt-6 min-h-12 w-full rounded-xl bg-brand-primary px-4 py-3 font-bold text-white transition-colors hover:bg-brand-hover"
              >
                Confirmar
              </button>
            </section>
          </>
        )}
      </div>

      {/* Formulário de novo cartão */}
      {!needsPin && isAddCardOpen && (
        <CardForm
          onClose={() => setIsAddCardOpen(false)}
          onSave={handleSaveCard}
        />
      )}

      {/* Formulário de edição */}
      {!needsPin && editingCard && (
        <CardForm
          key={editingCard.id}
          initialCard={editingCard}
          onClose={() => setEditingCard(null)}
          onSave={handleUpdateCard}
        />
      )}

      {/* Confirmação de exclusão */}
      {!needsPin && cardToDelete && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/45 p-4"
          onClick={(event) => {
            if (event.target === event.currentTarget && !isDeletingCard) {
              setCardToDelete(null);
              setDeleteError("");
            }
          }}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-card-title"
            aria-describedby="delete-card-description"
            className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            {/* Cabeçalho do modal */}
            <div className="flex items-center justify-between gap-3 border-b border-[#F1E4D9] bg-[#FFF7F0] p-5">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-100"
                >
                  <Trash2 size={24} color="#B91C1C" />
                </span>

                <h2
                  id="delete-card-title"
                  className="text-xl font-extrabold text-[#42251D]"
                >
                  Excluir cartão?
                </h2>
              </div>

              <button
                type="button"
                disabled={isDeletingCard}
                onClick={() => setCardToDelete(null)}
                aria-label="Fechar confirmação"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#592B1D] disabled:opacity-50"
              >
                <X size={21} aria-hidden="true" />
              </button>
            </div>

            <div className="p-5">
              <p
                id="delete-card-description"
                className="text-sm leading-relaxed text-[#775F54]"
              >
                Deseja excluir o cartão{" "}
                <strong className="text-[#42251D]">
                  "{cardToDelete.title}"
                </strong>
                ? Esta ação não poderá ser desfeita.
              </p>

              {deleteError && (
                <p
                  role="alert"
                  className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700"
                >
                  {deleteError}
                </p>
              )}
            </div>

            {/* Botões do modal */}
            <div className="grid grid-cols-2 gap-3 border-t border-[#F1E4D9] bg-white p-4">
              <button
                type="button"
                disabled={isDeletingCard}
                onClick={() => setCardToDelete(null)}
                className="min-h-12 rounded-xl border border-[#E7D5C8] bg-white px-3 py-3 font-semibold text-[#42251D] disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                type="button"
                disabled={isDeletingCard}
                onClick={() => void handleDeleteCard()}
                className="min-h-12 rounded-xl bg-red-600 px-3 py-3 font-bold text-white disabled:opacity-50"
              >
                {isDeletingCard ? "Excluindo..." : "Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
