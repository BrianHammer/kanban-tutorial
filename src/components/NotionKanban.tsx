"use client";

import { Flame, PlusIcon, Trash2 } from "lucide-react";
import React, { useState } from "react";

import { motion } from "framer-motion";

export type CardType = {
  id: string;
  title: string;
  column: string;
};

const DEFAULT_CARDS: CardType[] = [
  {
    id: "task-001",
    title: "Design new logo",
    column: "doing",
  },
  {
    id: "task-002",
    title: "Optimize database queries",
    column: "todo",
  },
  {
    id: "task-003",
    title: "Write user documentation",
    column: "backlog",
  },
  {
    id: "task-004",
    title: "Fix login bug",
    column: "done",
  },
  {
    id: "task-005",
    title: "Implement dark mode",
    column: "doing",
  },
  {
    id: "task-006",
    title: "Conduct user interviews",
    column: "todo",
  },
  {
    id: "task-007",
    title: "Upgrade server infrastructure",
    column: "backlog",
  },
  {
    id: "task-008",
    title: "Refactor legacy code",
    column: "doing",
  },
  {
    id: "task-009",
    title: "Create marketing materials",
    column: "todo",
  },
  {
    id: "task-010",
    title: "Implement two-factor authentication",
    column: "backlog",
  },
  {
    id: "task-011",
    title: "Optimize image loading",
    column: "done",
  },
  {
    id: "task-012",
    title: "Set up CI/CD pipeline",
    column: "doing",
  },
  {
    id: "task-013",
    title: "Create API documentation",
    column: "todo",
  },
  {
    id: "task-014",
    title: "Implement data analytics",
    column: "backlog",
  },
  {
    id: "task-015",
    title: "Localize app for new markets",
    column: "todo",
  },
  {
    id: "task-016",
    title: "Conduct security audit",
    column: "done",
  },
  {
    id: "task-017",
    title: "Redesign onboarding flow",
    column: "doing",
  },
  {
    id: "task-018",
    title: "Implement push notifications",
    column: "backlog",
  },
  {
    id: "task-019",
    title: "Optimize checkout process",
    column: "todo",
  },
  {
    id: "task-020",
    title: "Create data backup system",
    column: "doing",
  },
  {
    id: "task-021",
    title: "Update privacy policy",
    column: "backlog",
  },
  {
    id: "task-022",
    title: "Implement social media sharing",
    column: "todo",
  },
  {
    id: "task-023",
    title: "Redesign product pages",
    column: "doing",
  },
  {
    id: "task-024",
    title: "Optimize SEO strategy",
    column: "backlog",
  },
  {
    id: "task-025",
    title: "Implement customer feedback system",
    column: "todo",
  },
  {
    id: "task-026",
    title: "Create email marketing campaign",
    column: "doing",
  },
  {
    id: "task-027",
    title: "Upgrade payment gateway",
    column: "backlog",
  },
  {
    id: "task-028",
    title: "Implement product recommendations",
    column: "todo",
  },
  {
    id: "task-029",
    title: "Optimize mobile responsiveness",
    column: "done",
  },
  {
    id: "task-030",
    title: "Set up A/B testing framework",
    column: "doing",
  },
];

export const NotionKanban = () => {
  return (
    <div className="h-screen w-full bg-neutral-900 text-neutral-50">
      <Board />
    </div>
  );
};

export const Board = () => {
  const [cards, setCards] = useState<CardType[]>(DEFAULT_CARDS);

  return (
    <div className="flex h-full w-full gap-3 overflow-scroll p-12">
      <Column
        title="Backlog"
        column="backlog"
        headingColor="text-neutral-500"
        cards={cards}
        setCards={setCards}
      />
      <Column
        title="TODO"
        column="todo"
        headingColor="text-yellow-200"
        cards={cards}
        setCards={setCards}
      />
      <Column
        title="In progress"
        column="doing"
        headingColor="text-blue-200"
        cards={cards}
        setCards={setCards}
      />
      <Column
        title="Complete"
        column="done"
        headingColor="text-red-200"
        cards={cards}
        setCards={setCards}
      />
      <BurnBarrel setCards={setCards} />
    </div>
  );
};

type ColumnType = {
  title: string;
  headingColor: string;
  column: string;
  cards: CardType[];
  setCards: React.Dispatch<React.SetStateAction<CardType[]>>;
};

function Column({ title, headingColor, column, cards, setCards }: ColumnType) {
  const [active, setActive] = useState(false);

  const filteredCards = cards.filter((c) => c.column === column);

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    card: CardType
  ) => {
    e.dataTransfer.setData("cardId", card.id);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    highlightIndicator(e);
    setActive(true);
  };

  const handleDragLeave = () => {
    clearHighlights();
    setActive(false);
  };

  const handleOnDrop = (e: React.DragEvent<HTMLDivElement>) => {
    clearHighlights();
    setActive(false);

    const cardId = e.dataTransfer.getData("cardId");
    const indicators = getIndicators();

    const { element } = getNearestIndicator(e, indicators);

    const before = element.dataset.before || "-1";

    if (before !== cardId) {
      let copy = [...cards];

      let cardToTransfer = copy.find((c) => c.id === cardId);
      if (!cardToTransfer) return;

      cardToTransfer = { ...cardToTransfer, column };

      copy = copy.filter((c) => c.id !== cardId);

      const moveToBack = before === "-1";

      if (moveToBack) {
        copy.push(cardToTransfer);
      } else {
        const insertAtIndex = copy.findIndex((el) => el.id === before);
        if (insertAtIndex === undefined) return;

        copy.splice(insertAtIndex, 0, cardToTransfer);
      }
    }
  };

  const highlightIndicator = (e: React.DragEvent<HTMLDivElement>) => {
    const indicators = getIndicators();
    clearHighlights(indicators);
    const el = getNearestIndicator(e, indicators);
    el.element.style.opacity = "1";
  };

  const getIndicators = () => {
    return Array.from(document.querySelectorAll(`[data-column="${column}"]`));
  };

  const clearHighlights = (els?: Element[] | undefined) => {
    const indicators = els || getIndicators();

    indicators.forEach((i) => {
      const el = i as HTMLElement;
      el.style.opacity = "0";
    });
  };

  const getNearestIndicator = (
    e: React.DragEvent<HTMLDivElement>,
    indicators: Element[]
  ) => {
    const DISTANCE_OFFSET = 50; //px

    const el = indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = e.clientY - (box.top + DISTANCE_OFFSET);

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      }
    );

    // COnvert element to a type HTMLElement
    return { ...el, element: el.element as HTMLElement };
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleOnDrop}
      className="w-56 shrink-0"
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className={`font-medium ${headingColor}`}>{title}</h3>
        <span className="rounded text-sm text-neutral-400">
          {filteredCards.length}
        </span>
      </div>
      <div
        className={`h-full w-full transition-colors ${
          active ? "bg-neutral-800/50" : "bg-neutral-800/0"
        }`}
      >
        {filteredCards.map((c) => {
          return <Card key={c.id} {...c} handleDragStart={handleDragStart} />;
        })}
        <DropIndicator beforeId={"-1"} column={column} />
        <AddCard column={column} setCards={setCards} />
      </div>
    </div>
  );
}

type CardProps = CardType & {
  handleDragStart: (e: React.DragEvent<HTMLDivElement>, card: CardType) => void;
};

function Card({ id, title, column, handleDragStart }: CardProps) {
  return (
    <>
      <DropIndicator beforeId={id} column={column} />
      <motion.div
        layout
        layoutId={id}
        draggable={true}
        onDragStart={(e) => handleDragStart(e, { title, id, column })}
        className="cursor-grab rounded border border-neutral-700 bg-neutral-800 p-3 active:cursor-grabbing"
      >
        <p className="text-sm text-neutral-100">{title}</p>
      </motion.div>
    </>
  );
}

function DropIndicator({
  beforeId,
  column,
}: {
  beforeId: string;
  column: string;
}) {
  return (
    <div
      data-before={beforeId || "-1"}
      data-column={column}
      className="my-0.5 h-0.5 w-full bg-violet-400 opacity-0"
    />
  );
}

function BurnBarrel({
  setCards,
}: {
  setCards: React.Dispatch<React.SetStateAction<CardType[]>>;
}) {
  const [active, setActive] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setActive(true);
  };

  const handleDragLeave = () => {
    setActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    const cardId = e.dataTransfer.getData("cardId");
    console.log(cardId);

    setCards((pv) => pv.filter((c) => c.id !== cardId));

    setActive(false);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`mt-10 grid h-56 w-56 shrink-0 place-content-center rounded border text-3xl ${
        active
          ? "border-red-800 bg-red-800/20 text-red-500"
          : "border-neutral-500 bg-neutral-500/20 text-neutral-500"
      }`}
    >
      {active ? <Flame className="animate-bounce" /> : <Trash2 />}
    </div>
  );
}

type AddCardProps = {
  column: string;
  setCards: React.Dispatch<React.SetStateAction<CardType[]>>;
};

function AddCard({ column, setCards }: AddCardProps) {
  const [text, setText] = useState("");
  const [adding, setAdding] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!text.trim().length) return;

    const newCard = {
      column,
      title: text.trim(),
      id: Math.random().toString(),
    };

    setCards((pv) => [...pv, newCard]);
    setAdding(false);
    //setText("");
  };

  return (
    <>
      {adding ? (
        <motion.form layout onSubmit={handleSubmit}>
          <textarea
            onChange={(e) => setText(e.target.value)}
            autoFocus
            placeholder="Add a new task..."
            className="w-full rounded border border-violet-400 bg-violet-400/20 p-3 text-sm text-neutral-50 placeholder-violet-300 focus:outline-0"
          />

          <div className="mt-1.5 flex items-center justify-end gap-1.5">
            <button
              onClick={() => setAdding(false)}
              className="px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50"
            >
              Close
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded bg-neutral-50 px-3 py-1.5 text-xs text-neutral-950 transition-colors hover:bg-neutral-300"
            >
              Create
            </button>
          </div>
        </motion.form>
      ) : (
        <motion.button
          layout
          onClick={() => setAdding(true)}
          className="flex w-full items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50"
        >
          <span>Add card</span>
          <PlusIcon />
        </motion.button>
      )}
    </>
  );
}
