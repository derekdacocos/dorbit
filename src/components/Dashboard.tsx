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
import { useState } from "react";
import AddWidgetModal from "@/components/AddWidgetModal";
import { useMounted } from "@/hooks/useMounted";
import { WIDGETS } from "@/components/widgets";
import { toEmbedUrl } from "@/lib/embeds";
import { useMusicStore } from "@/stores/useMusicStore";
import { useSettingsStore } from "@/stores/useSettingsStore";

type SortableWidgetProps = {
  id: string;
  wide: boolean; // true = take up 2 columns
  onHide?: () => void; // only given while customizing: shows a Hide button
  children: React.ReactNode;
};

function SortableWidget({ id, wide, onHide, children }: SortableWidgetProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`relative ${isDragging ? "z-10 opacity-80" : ""} ${wide ? "sm:col-span-2" : ""}`}
    >
      {children}
      {onHide && (
        <button
          type="button"
          onClick={onHide}
          className="absolute right-11 top-3.5 rounded-lg bg-red-500/15 px-2 py-0.5 text-xs text-red-300 ring-1 ring-red-400/30 hover:bg-red-500/30"
        >
          Hide
        </button>
      )}
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
  const [showAddWidget, setShowAddWidget] = useState(false);
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
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={visibleIds} strategy={rectSortingStrategy}>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {visibleIds.map((id) => {
              const widget = WIDGETS.find((w) => w.id === id);
              if (!widget) return null;
              const { Component } = widget;
              return (
                <SortableWidget
                  key={id}
                  id={id}
                  wide={id === "music" && musicIsSpotify}
                  onHide={isCustomizing ? () => toggleHidden(id) : undefined}
                >
                  <Component />
                </SortableWidget>
              );
            })}

            {/* The "Add widget" tile is always last. It isn't draggable. */}
            <button
              type="button"
              onClick={() => setShowAddWidget(true)}
              className="flex min-h-28 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-white/15 text-slate-400 sm:min-h-40 hover:border-violet-400/60 hover:bg-white/5 hover:text-slate-200"
            >
              <span className="text-3xl">＋</span>
              <span className="text-sm">Add widget</span>
            </button>
          </div>
        </SortableContext>
      </DndContext>

      <p className="mt-8 text-center text-xs text-slate-500">
        {isCustomizing
          ? "Drag the ⠿ handles to rearrange, or Hide widgets you don't need"
          : "Drag the ⠿ handles to rearrange widgets"}
      </p>

      {showAddWidget && <AddWidgetModal onClose={() => setShowAddWidget(false)} />}
    </div>
  );
}