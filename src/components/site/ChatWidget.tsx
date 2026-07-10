import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { useUI } from "@/lib/store";

const suggestions = [
  "Подобрать коляску по возрасту",
  "Оптовые цены и условия",
  "Сроки доставки в мой город",
];

type Msg = { role: "bot" | "user"; text: string };

export function ChatWidget() {
  const { chatOpen, setChatOpen } = useUI();
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "bot",
      text: "Здравствуйте! Я ИИ-консультант «Заказ с YouDo». Помогу подобрать товары, рассчитать оптовую цену или оформить заказ. О чём поговорим?",
    },
  ]);
  const [input, setInput] = useState("");

  const send = (text: string) => {
    if (!text.trim()) return;
    setMsgs((m) => [...m, { role: "user", text }]);
    setInput("");
    setTimeout(() => {
      setMsgs((m) => [
        ...m,
        {
          role: "bot",
          text: "Спасибо! Наш специалист уточнит детали и вернётся с рекомендацией в течение нескольких минут. А пока — посмотрите бестселлеры в каталоге.",
        },
      ]);
    }, 700);
  };

  return (
    <>
      <button
        onClick={() => setChatOpen(!chatOpen)}
        className="fixed z-40 bottom-5 right-5 md:bottom-8 md:right-8 size-14 md:size-16 rounded-full bg-gradient-primary text-primary-foreground shadow-float grid place-items-center hover:scale-105 transition-transform"
        aria-label="Открыть чат"
      >
        <AnimatePresence mode="wait">
          {chatOpen ? (
            <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="size-6" />
            </motion.div>
          ) : (
            <motion.div key="msg" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
              <MessageCircle className="size-6" />
            </motion.div>
          )}
        </AnimatePresence>
        {!chatOpen && (
          <>
            <span className="absolute inset-0 rounded-full bg-primary/40 animate-ping opacity-30" />
            <span className="absolute -top-1 -right-1 size-3 rounded-full bg-cream border-2 border-background" />
          </>
        )}
      </button>

      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
            className="fixed z-40 bottom-24 right-4 md:right-8 w-[calc(100vw-32px)] sm:w-[380px] h-[520px] max-h-[70vh] rounded-3xl bg-background shadow-float border border-border overflow-hidden flex flex-col origin-bottom-right"
          >
            <div className="p-5 bg-gradient-primary text-primary-foreground relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_60%)]" />
              <div className="relative flex items-center gap-3">
                <div className="size-11 rounded-2xl bg-white/15 backdrop-blur grid place-items-center border border-white/20">
                  <Sparkles className="size-5" />
                </div>
                <div>
                  <div className="font-extrabold text-lg leading-tight">ИИ-консультант</div>
                  <div className="text-xs opacity-90 inline-flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-green-400" /> Онлайн · Заказ с YouDo
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-soft">
              {msgs.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-2.5 text-sm leading-snug rounded-2xl ${
                      m.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-background text-foreground border border-border rounded-bl-md"
                    }`}
                  >
                    {m.text}
                  </div>
                </motion.div>
              ))}

              {msgs.length <= 1 && (
                <div className="pt-2 flex flex-wrap gap-2">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="text-xs px-3 py-1.5 rounded-full bg-background border border-border text-foreground/80 hover:border-primary/40 hover:text-primary transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="p-3 border-t border-border bg-background flex gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Напишите сообщение…"
                className="flex-1 h-11 px-4 rounded-full bg-secondary/70 text-sm outline-hidden focus:bg-background border border-transparent focus:border-primary/30"
              />
              <button
                type="submit"
                className="size-11 grid place-items-center rounded-full bg-gradient-primary text-primary-foreground shadow-soft hover:shadow-float"
                aria-label="Отправить"
              >
                <Send className="size-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
