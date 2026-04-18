import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";

export default function ActivityFeed({
  items,
  title,
  eyebrow = "Live feed",
  description = "",
  compact = false,
  tone = "default",
  filterOptions = [],
}) {
  const [activeFilter, setActiveFilter] = useState(() => filterOptions[0]?.id ?? "all");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const activeFilterLabel =
    filterOptions.find((option) => option.id === activeFilter)?.label ?? "All";
  const visibleItems = useMemo(() => {
    const selectedFilter = filterOptions.find((option) => option.id === activeFilter);

    if (!selectedFilter?.predicate) {
      return items;
    }

    return items.filter(selectedFilter.predicate);
  }, [activeFilter, filterOptions, items]);

  return (
    <section
      className={`panel activity-feed ${
        compact ? "activity-feed--compact" : ""
      } ${tone === "alert" ? "activity-feed--alert" : ""}`}
    >
      <div className="panel__header">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
          {description ? <p className="activity-feed__description">{description}</p> : null}

          {filterOptions.length ? (
            <div className="activity-feed__filter-shell">
              <button
                type="button"
                className={filtersOpen ? "activity-feed__filter-trigger activity-feed__filter-trigger--active" : "activity-feed__filter-trigger"}
                aria-expanded={filtersOpen}
                aria-haspopup="dialog"
                onClick={() => setFiltersOpen((current) => !current)}
              >
                <span>Filter</span>
                <small>{activeFilterLabel}</small>
              </button>

              {filtersOpen ? (
                <div
                  className="activity-feed__filters-popover"
                  role="dialog"
                  aria-label={`${title} filters`}
                  onMouseLeave={() => setFiltersOpen(false)}
                >
                  <div className="activity-feed__filters">
                    {filterOptions.map((option) => {
                      const count = items.filter(option.predicate).length;
                      const selected = option.id === activeFilter;

                      return (
                        <button
                          key={option.id}
                          type="button"
                          className={
                            selected
                              ? "activity-feed__filter activity-feed__filter--active"
                              : "activity-feed__filter"
                          }
                          onClick={() => {
                            setActiveFilter(option.id);
                            setFiltersOpen(false);
                          }}
                        >
                          <span>{option.label}</span>
                          <small>{count}</small>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      <ul className="activity-feed__list" aria-label={title}>
        {visibleItems.map((item) => (
          <li
            key={item.id}
            className={item.missionId ? "activity-feed__item activity-feed__item--interactive" : "activity-feed__item"}
          >
            {item.missionId ? (
              <Link className="activity-feed__item-link" to={`/missions/${item.missionId}`}>
                <div>
                  <strong>{item.title}</strong>
                  {"type" in item ? (
                    <p>
                      {item.type} channel
                      <span>
                        {item.timestamp}
                        <em>Open mission</em>
                      </span>
                    </p>
                  ) : (
                    <p>
                      {item.source}
                      <span>
                        {item.status}
                        <em>Open mission</em>
                      </span>
                    </p>
                  )}
                </div>

                {"severity" in item ? <StatusBadge label={item.severity} /> : null}
              </Link>
            ) : (
              <>
                <div>
                  <strong>{item.title}</strong>
                  {"type" in item ? (
                    <p>
                      {item.type} channel
                      <span>{item.timestamp}</span>
                    </p>
                  ) : (
                    <p>
                      {item.source}
                      <span>{item.status}</span>
                    </p>
                  )}
                </div>

                {"severity" in item ? <StatusBadge label={item.severity} /> : null}
              </>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
