import { ArrowLeft, Plus, Pencil, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { useProfileContext } from "../contexts/ProfileContext";
import { PinVerificationForm } from "../components/profile/PinVerificationForm";
import { cardService } from "../services/cardService";
import type { Card } from "../types/card";
import CardForm from "../components/cards/CardForm";
import type { CardFormData } from "../components/cards/CardForm";
import { quickPhraseIcons } from "../constants/quickPhraseIcons";

export default function ManageCardsPage() {
  const navigate = useNavigate();
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

  function handleBack() {
    navigate("/perfil/categorias", { replace: true });
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
    if (!user || needsPin || !cardToDelete || isDeletingCard) return;

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

  useEffect(() => {
    if (loading || !user || needsPin || !categoryId) return;

    let active = true;

    async function loadCards() {
      try {
        const data = await cardService.getByCategory(categoryId!);

        if (active) {
          setCards(data);
          setCardsError("");
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

  if (loading || !user) {
    return null;
  }

  return (
    <main className="min-h-screen p-6">
      <button
        type="button"
        onClick={handleBack}
        className="mb-6 flex items-center gap-2"
      >
        <ArrowLeft size={20} />
        Voltar
      </button>

      <h1 className="text-2xl font-bold">Gerenciar cartões</h1>

      <section className="mt-4 rounded-2xl bg-white p-5">
        {needsPin ? (
          <>
            <h2 className="mb-4 text-lg font-semibold text-app-text">
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
          </>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between gap-2">
              <h2 className="min-w-0 flex-1 text-base font-semibold text-app-text sm:text-lg">
                Cartões da categoria
              </h2>

              <button
                type="button"
                onClick={() => setIsAddCardOpen(true)}
                className="flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-brand-primary px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-hover sm:px-4"
              >
                <Plus size={18} />
                Novo cartão
              </button>
            </div>

            {cardsLoading ? (
              <p className="mt-4 text-sm text-app-muted">
                Carregando cartões...
              </p>
            ) : cardsError ? (
              <p role="alert" className="mt-4 text-sm text-app-danger">
                {cardsError}
              </p>
            ) : cards.length === 0 ? (
              <p className="mt-4 text-sm text-app-muted">
                Nenhum cartão cadastrado nesta categoria.
              </p>
            ) : (
              <ul className="mt-4 flex flex-col gap-3">
                {cards.map((card) => {
                  const selectedIcon = quickPhraseIcons.find(
                    (item) => item.id === (card.icon ?? "message-circle"),
                  );

                  const Icon = selectedIcon?.Icon;

                  return (
                    <li
                      key={card.id}
                      className="rounded-xl border border-app-border bg-white p-3 sm:p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-stone-100">
                          {Icon ? (
                            <Icon
                              size={28}
                              color="#383838"
                              aria-hidden="true"
                            />
                          ) : card.image ? (
                            <img
                              src={card.image}
                              alt={card.altText}
                              className="h-12 w-12 object-contain"
                            />
                          ) : null}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="break-words font-semibold text-app-text">
                            {card.title}
                          </h3>

                          <p className="mt-1 break-words text-sm text-app-muted">
                            {card.speechText}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 flex justify-end gap-2 border-t border-app-border pt-3">
                        <button
                          type="button"
                          onClick={() => setEditingCard(card)}
                          aria-label={`Editar cartão ${card.title}`}
                          className="flex items-center justify-center gap-2 rounded-xl bg-stone-100 px-4 py-2 text-sm font-medium text-app-text transition-colors hover:bg-stone-200"
                        >
                          <Pencil size={16} aria-hidden="true" />
                          Editar
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setDeleteError("");
                            setCardToDelete(card);
                          }}
                          aria-label={`Excluir cartão ${card.title}`}
                          className="flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-app-danger transition-colors hover:bg-red-50"
                        >
                          <Trash2 size={16} aria-hidden="true" />
                          Excluir
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </>
        )}
      </section>

      {!needsPin && isAddCardOpen && (
        <CardForm
          onClose={() => setIsAddCardOpen(false)}
          onSave={handleSaveCard}
        />
      )}

      {!needsPin && editingCard && (
        <CardForm
          key={editingCard.id}
          initialCard={editingCard}
          onClose={() => setEditingCard(null)}
          onSave={handleUpdateCard}
        />
      )}

      {!needsPin && cardToDelete && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
          onClick={(event) => {
            if (event.target === event.currentTarget && !isDeletingCard) {
              setCardToDelete(null);
            }
          }}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-card-title"
            aria-describedby="delete-card-description"
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
          >
            <h2
              id="delete-card-title"
              className="text-xl font-bold text-app-text"
            >
              Excluir cartão?
            </h2>

            <p
              id="delete-card-description"
              className="mt-3 text-sm leading-relaxed text-app-muted"
            >
              Tem certeza de que deseja excluir o cartão{" "}
              <strong className="text-app-text">"{cardToDelete.title}"</strong>?
              Esta ação não poderá ser desfeita.
            </p>

            {deleteError && (
              <p role="alert" className="mt-3 text-sm text-app-danger">
                {deleteError}
              </p>
            )}

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                disabled={isDeletingCard}
                onClick={() => setCardToDelete(null)}
                className="flex-1 rounded-xl bg-stone-100 px-4 py-3 font-semibold text-app-text disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                type="button"
                disabled={isDeletingCard}
                onClick={() => void handleDeleteCard()}
                className="flex-1 rounded-xl bg-app-danger px-4 py-3 font-semibold text-white transition-colors hover:bg-red-800 disabled:opacity-50"
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
