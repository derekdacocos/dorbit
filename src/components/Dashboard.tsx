"use client";

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMounted } from "@/hooks/useMounted";
import { WIDGETS } from "@/components/widgets";
import { toEmbedUrl } from "@/lib/embeds";
import { useMusicStore } from "@/stores/useMusicStore";
import { useSettingsStore } from "@/stores/useSettingsStore";

type SortableWidgetProps = {
  id: string;
  wide: boolean; // true = take up 2 columns
  children: React.ReactNode;
};

function SortableWidget({ id, wide, children }: SortableWidgetProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`relative ${isDragging ? "z-10 opacity-80" : ""} ${wide ? "sm:col-span-2" : ""}`}
    >
      {children}
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label="Drag to move"
        className="absolute right-4 top-4 cursor-grab touch-none rounded px-1 text-slate-500 hover:text-slate-200 active:cursor-grabbing"
      >
        ⠿
      </button>
    </div>
  );
}

export default function Dashboard() {
  const savedOrder = useSettingsStore((state) => state.order);
  const hidden = useSettingsStore((state) => state.hidden);
  const isCustomizing = useSettingsStore((state) => state.isCustomizing);
  const setOrder = useSettingsStore((state) => state.setOrder);
  const toggleHidden = useSettingsStore((state) => state.toggleHidden);
  const musicLink = useMusicStore((state) => state.link);

  const mounted = useMounted();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  if (!mounted) return null;

  // Saved order first, then any widgets that are new since you last arranged them
  const allIds = WIDGETS.map((widget) => widget.id);
  const order = [
    ...savedOrder.filter((id) => allIds.includes(id)),
    ...allIds.filter((id) => !savedOrder.includes(id)),
  ];
  const visibleIds = order.filter((id) => !hidden.includes(id));
  const musicIsSpotify = toEmbedUrl(musicLink)?.includes("spotify") ?? false;

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = order.indexOf(String(active.id));
    const newIndex = order.indexOf(String(over.id));
    setOrder(arrayMove(order, oldIndex, newIndex));
  }

  return (
    <div className="mt-12">
      {isCustomizing && (
        <div className="mb-5 flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-4">
          <span className="mr-2 text-sm text-slate-400">Show widgets:</span>
          {WIDGETS.map((widget) => {
            const isShown = !hidden.includes(widget.id);
            return (
              <button
                key={widget.id}
                type="button"
                onClick={() => toggleHidden(widget.id)}
                className={
                  isShown
                    ? "rounded-lg bg-violet-400 px-3 py-1.5 text-sm font-medium text-slate-950"
                    : "rounded-lg bg-white/10 px-3 py-1.5 text-sm text-slate-400 line-through"
                }
              >
                {widget.name}
              </button>
            );
          })}
        </div>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={visibleIds} strategy={rectSortingStrategy}>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {visibleIds.map((id) => {
              const widget = WIDGETS.find((w) => w.id === id);
              if (!widget) return null;
              const { Component } = widget;
              return (
                <SortableWidget key={id} id={id} wide={id === "music" && musicIsSpotify}>
                  <Component />
                </SortableWidget>
              );
            })}
          </div>
        </SortableContext>
      </DndContext>

      <p className="mt-8 text-center text-xs text-slate-500">
        Drag the ⠿ handles to rearrange widgets
      </p>
    </div>
  );
}