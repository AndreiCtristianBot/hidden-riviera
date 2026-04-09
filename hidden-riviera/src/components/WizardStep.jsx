export function WizardStep({
  stepLabel,
  title,
  subtitle,
  items,
  selected,
  onSelect,
  variant,
}) {
  return (
    <div className="stp">
      <div className="stp-n">{stepLabel}</div>
      <h2 className="stp-t">{title}</h2>
      <p className="stp-s">{subtitle}</p>

      {variant === "tiles" ? (
        <div className="vg">
          {items.map((item) => (
            <div
              key={item.id}
              className={`v ${selected.includes(item.id) ? "on" : ""}`}
              onClick={() => onSelect(item.id)}
            >
              <img src={item.img} alt={item.label} loading="lazy" />
              <div className="v-o">
                <span className="v-l">
                  {item.emoji} {item.label}
                </span>
              </div>
              <div className="v-ck">✓</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="os">
          {items.map((item) => (
            <div
              key={item.id}
              className={`o ${selected === item.id ? "on" : ""}`}
              onClick={() => onSelect(item.id)}
            >
              <div className="o-i">{item.icon}</div>
              <div>
                <div className="o-l">{item.label}</div>
                {item.sub ? <div className="o-s">{item.sub}</div> : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
