import React from "react";

export default function EmptyState({ title, text }) {
  return (
    <section className="panel empty-state">
      <p className="eyebrow">No signal</p>
      <h2>{title}</h2>
      <p>{text}</p>
    </section>
  );
}
