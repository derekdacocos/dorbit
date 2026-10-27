"use client";

import { useState, type FormEvent } from "react";
import WidgetCard from "@/components/WidgetCard";
import { useMounted } from "@/hooks/useMounted";
import { useTodoStore } from "@/stores/useTodoStore";

export default function TodoWidget() {
  const todos = useTodoStore((state) => state.todos);
  const addTodo = useTodoStore((state) => state.addTodo);
  const toggleTodo = useTodoStore((state) => state.toggleTodo);
  const removeTodo = useTodoStore((state) => state.removeTodo);
  const clearDone = useTodoStore((state) => state.clearDone);

  const mounted = useMounted();
  const [text, setText] = useState("");

  const doneCount = todos.filter((todo) => todo.done).length;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (text.trim() === "") return;
    addTodo(text.trim());
    setText("");
  }

  return (
    <WidgetCard title="To-do">
      {mounted && (
        <ul className="flex flex-1 flex-col gap-2">
          {todos.length === 0 && (
            <li className="text-sm text-slate-500">Nothing to do yet. Add a task below.</li>
          )}
          {todos.map((todo) => (
            <li key={todo.id} className="group flex items-center gap-3">
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => toggleTodo(todo.id)}
                className="h-4 w-4 accent-violet-400"
              />
              <span
                className={
                  todo.done
                    ? "flex-1 text-sm text-slate-500 line-through"
                    : "flex-1 text-sm text-slate-200"
                }
              >
                {todo.text}
              </span>
              <button
                type="button"
                onClick={() => removeTodo(todo.id)}
                className="text-xs text-slate-500 opacity-0 group-hover:opacity-100 hover:text-red-400"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      {doneCount > 0 && (
        <button
          type="button"
          onClick={clearDone}
          className="mt-3 self-start text-xs text-slate-500 hover:text-slate-300"
        >
          Clear {doneCount} done
        </button>
      )}

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Add a task..."
          className="min-w-0 flex-1 rounded-lg bg-slate-900 px-3 py-2 text-sm outline-none ring-1 ring-white/10 focus:ring-violet-400"
        />
        <button
          type="submit"
          className="rounded-lg bg-violet-400 px-3 text-lg font-medium text-slate-950 hover:bg-violet-300"
        >
          +
        </button>
      </form>
    </WidgetCard>
  );
}