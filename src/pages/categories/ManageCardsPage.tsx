import PinAccessPage from "../../components/profile/PinAccessPage";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";

import { ArrowLeft, Plus, Pencil, Trash2, Loader2 } from "lucide-react";

import { useProfileContext } from "../../contexts/ProfileContext";
import { cardService } from "../../services/cardService";

import AppIcon from "../../components/common/AppIcon";
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
    setEnteredPin,
    setAccessPinError,
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
      navigate(`/categorias/${categoryId}`, {
        replace: true,
      });

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
    <main className="relative min-h-dvh overflow-hidden bg-[#FFF9F3] px-4 pb-28 pt-4 md:px-6 md:pt-6 lg:landscape:pb-8 xl:px-8 xl:pb-8 xl:pt-8">
      {/* Elementos decorativos */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#FFE6D0]/60"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 top-96 h-48 w-48 rounded-full bg-[#FFF0BB]/30"
      />

      <div className="relative mx-auto w-full max-w-lg md:max-w-3xl lg:max-w-4xl">
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

        {/* Apresentação */}

        <section className="mb-5 flex items-center gap-3 rounded-3xl bg-[#FFE0BD] p-4">
          <span
            aria-hidden="true"
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/70"
          >
            <AppIcon name="MessageCircle" size={48} />
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
              <AppIcon name="LayoutGrid" size={64} className="mx-auto mb-3" />

              <p className="font-bold text-[#42251D]">
                Nenhum cartão cadastrado
              </p>

              <p className="mt-2 text-sm leading-relaxed text-[#80685D]">
                Toque em Novo cartão para adicionar uma mensagem à categoria.
              </p>
            </div>
          ) : (
            <ul className="grid grid-cols-1 gap-3 lg:landscape:grid-cols-2 xl:grid-cols-2 md:gap-4">
              {cards.map((card, index) => {
                const backgroundColor = cardColors[index % cardColors.length];

                return (
                  <li
                    key={card.id}
                    className="rounded-2xl border border-[#F1E4D9] bg-[#FFFCF9] p-3 sm:p-4"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl"
                        style={{ backgroundColor }}
                      >
                        {card.image && !card.icon ? (
                          <img
                            src={card.image}
                            alt=""
                            width={72}
                            height={72}
                            draggable={false}
                            className="h-[72px] w-[72px] select-none object-contain"
                          />
                        ) : (
                          <AppIcon
                            name={card.icon || "MessageCircle"}
                            size={72}
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

      {!needsPin &&
        cardToDelete &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 py-6">
            <button
              type="button"
              aria-label="Cancelar exclusão e fechar janela"
              onClick={() => {
                setCardToDelete(null);
                setDeleteError("");
              }}
              disabled={isDeletingCard}
              className="absolute inset-0 h-full w-full bg-[#26160E]/60 backdrop-blur-[2px]"
            />

            <div
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="delete-card-title"
              aria-describedby="delete-card-description"
              className="relative z-10 w-full max-w-[360px] max-h-[calc(100dvh-3rem)] overflow-y-auto overscroll-contain rounded-3xl border border-[#F5E9DF] bg-white p-5 shadow-[0_24px_60px_rgba(38,22,14,0.25)]"
            >
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FFF0E4] text-brand-primary"
                >
                  <Trash2 size={23} strokeWidth={2.2} />
                </span>

                <h2
                  id="delete-card-title"
                  className="text-lg font-extrabold text-[#42251D]"
                >
                  Excluir cartão?
                </h2>
              </div>

              <p
                id="delete-card-description"
                className="mt-4 text-sm leading-6 text-[#80685D]"
              >
                Deseja excluir o cartão{" "}
                <strong className="break-words text-[#42251D]">
                  "{cardToDelete.title}"
                </strong>
                ? Esta ação não pode ser desfeita.
              </p>

              {deleteError && (
                <p
                  role="alert"
                  className="mt-4 rounded-xl border border-[#F4D4BD] bg-[#FFF0E4] p-3 text-sm text-[#9A3412]"
                >
                  {deleteError}
                </p>
              )}

              <div className="mt-5 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setCardToDelete(null);
                    setDeleteError("");
                  }}
                  disabled={isDeletingCard}
                  autoFocus
                  className="flex min-h-12 min-w-0 items-center justify-center rounded-2xl border border-[#F1E4D9] bg-white px-3 text-sm font-bold text-[#42251D] transition-colors active:bg-[#FFF0E4] disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-brand-primary"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={() => void handleDeleteCard()}
                  disabled={isDeletingCard}
                  className="flex min-h-12 min-w-0 items-center justify-center gap-2 rounded-2xl bg-brand-primary px-3 text-sm font-bold text-white transition-colors active:bg-[#9A3412] disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-brand-primary"
                >
                  {isDeletingCard ? (
                    <>
                      <Loader2
                        size={17}
                        className="animate-spin"
                        aria-hidden="true"
                      />
                      Excluindo
                    </>
                  ) : (
                    <>
                      <Trash2 size={17} aria-hidden="true" />
                      Apagar
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </main>
  );
}
