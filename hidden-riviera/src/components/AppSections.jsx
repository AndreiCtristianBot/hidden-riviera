import { useEffect, useState } from "react";
import { CRW, HERO_IMAGES, TI } from "../data/itineraryData";

function CrowdPill({ crowd }) {
  const crowdData = CRW[crowd] || CRW.low;
  return (
    <span className="p" style={{ background: crowdData.bg, color: crowdData.c }}>
      {crowdData.l}
    </span>
  );
}

export function Splash({ onStart }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setIndex((current) => (current + 1) % HERO_IMAGES.length),
      5000
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="splash">
      <div className="s-bg">
        {HERO_IMAGES.map((source, imageIndex) => (
          <img key={source} src={source} alt="" className={imageIndex === index ? "act" : ""} />
        ))}
        <div className="s-ov" />
        <div className="s-gr" />
      </div>
      <div className="s-c">
        <div className="s-ey">Côte d'Azur · AI-Powered</div>
        <h1 className="s-t">
          Discover
          <br />
          the <em>Hidden</em>
          <br />
          Riviera
        </h1>
        <p className="s-d">
          Skip the crowds. AI-crafted itineraries to places locals love but tourists never reach.
        </p>
        <div className="s-sts">
          <div>
            <div className="s-sv">50+</div>
            <div className="s-sl">Hidden spots</div>
          </div>
          <div>
            <div className="s-sv">0</div>
            <div className="s-sl">Tourist traps</div>
          </div>
          <div>
            <div className="s-sv">AI</div>
            <div className="s-sl">Powered</div>
          </div>
        </div>
        <button className="btn btn-g" onClick={onStart}>
          Plan my escape →
        </button>
      </div>
    </div>
  );
}

export function LoadingScreen() {
  const [index, setIndex] = useState(0);
  const messages = [
    "Scanning hidden gems…",
    "Checking crowd levels…",
    "Avoiding tourist traps…",
    "Crafting your perfect day…",
  ];

  useEffect(() => {
    const interval = setInterval(
      () => setIndex((current) => (current + 1) % messages.length),
      1100
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="ld">
      <div className="ld-r" />
      <div className="ld-t">{messages[index]}</div>
      <div className="ld-s">AI is exploring the Riviera for you</div>
    </div>
  );
}

function StopModal({ stop, onClose }) {
  if (!stop) return null;
  const signals = stop.recommendationSignals || [];

  return (
    <div className="mbg" onClick={onClose}>
      <div className="m" onClick={(event) => event.stopPropagation()}>
        <img className="m-i" src={stop.img} alt={stop.name} />
        <div className="m-b">
          <div className="m-h" />
          <h3>
            {TI[stop.type] || "📍"} {stop.name}
          </h3>
          <div className="m-mt">
            <CrowdPill crowd={stop.crowd} />
            <span className="p p-d">⏱ {stop.dur}</span>
            <span className="p p-d">🕐 {stop.time}</span>
          </div>
          <p>{stop.desc}</p>
          {signals.length ? (
            <div className="rec">
              <div className="rec-t">Recommended today because:</div>
              <div className="rec-s">{signals.join(" · ")}</div>
            </div>
          ) : null}
          <button className="btn btn-d" onClick={onClose}>
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}

export function ResultView({ itinerary, onReset }) {
  const [dayIndex, setDayIndex] = useState(0);
  const [selectedStop, setSelectedStop] = useState(null);

  const hasMultipleDays = itinerary.days.length > 1;
  const currentDay = itinerary.days[dayIndex];
  const allStops = itinerary.days.flatMap((day) => day.stops);
  const hiddenGems = allStops.filter(
    (stop) => stop.type !== "transit" && (stop.crowd === "very low" || stop.crowd === "low")
  ).length;

  return (
    <div className="res">
      <div className="rh">
        <img src={itinerary.hero} alt="" />
        <div className="rh-o">
          <div className="rh-b">✨ Your AI itinerary</div>
          <h1 className="rh-t">{itinerary.title}</h1>
          <p className="rh-s">{itinerary.sub}</p>
        </div>
      </div>

      {hasMultipleDays ? (
        <div className="dt">
          {itinerary.days.map((day, index) => (
            <div
              key={day.label}
              className={`dt-t ${dayIndex === index ? "on" : ""}`}
              onClick={() => setDayIndex(index)}
            >
              {day.label}
            </div>
          ))}
        </div>
      ) : null}

      <div className="sts">
        <div className="st">
          <div className="st-v">{allStops.length}</div>
          <div className="st-l">Stops</div>
        </div>
        <div className="st">
          <div className="st-v">{hiddenGems}</div>
          <div className="st-l">Hidden gems</div>
        </div>
        <div className="st">
          <div className="st-v">{hasMultipleDays ? itinerary.days.length : 1}</div>
          <div className="st-l">{hasMultipleDays ? "Days" : "Day"}</div>
        </div>
      </div>

      <div className="tl">
        {currentDay.stops.map((stop, index) => (
          <div key={`${dayIndex}-${index}`} className="ti" style={{ animationDelay: `${index * 0.07}s` }}>
            <div className="ti-r">
              <div className="ti-tm">{stop.time}</div>
              <div className="ti-dt">{TI[stop.type] || "📍"}</div>
              {index < currentDay.stops.length - 1 ? <div className="ti-ln" /> : null}
            </div>
            <div className="tc" onClick={() => setSelectedStop(stop)}>
              <img className="tc-img" src={stop.img} alt={stop.name} loading="lazy" />
              <div className="tc-b">
                <div className="tc-n">
                  {stop.name}
                  <span style={{ fontSize: 12, opacity: 0.25 }}>→</span>
                </div>
                <div className="tc-d">{stop.desc}</div>
                {stop.recommendationSignals?.length ? (
                  <div className="tc-rec">
                    <span>Recommended today because:</span>
                    {stop.recommendationSignals.join(" · ")}
                  </div>
                ) : null}
                <div className="tc-f">
                  <CrowdPill crowd={stop.crowd} />
                  <span className="p p-d">⏱ {stop.dur}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", padding: "0 var(--pad) 12px" }}>
        <button className="btn btn-o" onClick={onReset}>
          ↻ Try different vibes
        </button>
      </div>
      <div className="wm">
        Built by a <b>17 y/o builder from Romania</b> 🇷🇴❤️🇫🇷
      </div>

      <StopModal stop={selectedStop} onClose={() => setSelectedStop(null)} />
    </div>
  );
}
