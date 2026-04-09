import { useEffect, useState } from "react";
import { LoadingScreen, ResultView, Splash } from "./components/AppSections";
import { WizardStep } from "./components/WizardStep";
import { COMPS, DURS, VIBES, getItinerary } from "./data/itineraryData";
import { ensureAppStyles, ensureFonts } from "./styles/appStyles";

// ─── APP ────────────────────────────────────────────────────────────
export default function App(){
  useEffect(() => {
    ensureFonts();
    ensureAppStyles();
  }, []);

  const[sc,setSc]=useState("splash");
  const[vibes,setVibes]=useState([]);
  const[dur,setDur]=useState(null);
  const[comp,setComp]=useState(null);
  const[it,setIt]=useState(null);
  const pr={splash:0,vibe:25,duration:50,companion:75,loading:90,result:100}[sc];
  const tog=id=>setVibes(p=>p.includes(id)?p.filter(v=>v!==id):[...p,id]);
  const gen=()=>{setSc("loading");setTimeout(()=>{setIt(getItinerary(vibes,dur));setSc("result")},3000)};
  const rst=()=>{setVibes([]);setDur(null);setComp(null);setIt(null);setSc("splash")};

  return(
    <div className="shell">
      <div className="side-info">
        <div className="side-tag">Civic Tech × AI</div>
        <h2>Discover the<br/><em>Hidden</em> Riviera</h2>
        <p>An AI-powered trip planner that fights overtourism on the Côte d'Azur by redirecting visitors to hidden gems — away from the crowds.</p>
        <p style={{fontSize:13,color:"rgba(255,255,255,.35)"}}>Built by a 17 y/o from Romania 🇷🇴❤️🇫🇷<br/>React · Vite · Vanilla CSS</p>
      </div>
      <div className="app">
        {sc!=="splash"&&sc!=="result"&&<div className="prog"><div className="prog-f" style={{width:`${pr}%`}}/></div>}
        {sc==="splash"&&<Splash onStart={()=>setSc("vibe")}/>}
        {sc==="vibe"&&<>
          <WizardStep
            stepLabel="Step 1 / 3"
            title="What's your vibe?"
            subtitle="Pick one or more — we'll blend them"
            items={VIBES}
            selected={vibes}
            onSelect={tog}
            variant="tiles"
          />
          {vibes.length>0&&<div className="bot"><button className="btn btn-g" onClick={()=>setSc("duration")}>Continue →</button></div>}
        </>}
        {sc==="duration"&&<>
          <WizardStep
            stepLabel="Step 2 / 3"
            title="How much time?"
            subtitle="We'll optimize every minute"
            items={DURS}
            selected={dur}
            onSelect={setDur}
            variant="list"
          />
          {dur&&<div className="bot"><button className="btn btn-g" onClick={()=>setSc("companion")}>Continue →</button></div>}
        </>}
        {sc==="companion"&&<>
          <WizardStep
            stepLabel="Step 3 / 3"
            title="Who's coming?"
            subtitle="Every group has a different perfect day"
            items={COMPS}
            selected={comp}
            onSelect={setComp}
            variant="list"
          />
          {comp&&<div className="bot"><button className="btn btn-g" onClick={gen}>✨ Generate my itinerary</button></div>}
        </>}
        {sc==="loading"&&<LoadingScreen/>}
        {sc==="result"&&it&&<ResultView itinerary={it} onReset={rst}/>}
      </div>
    </div>
  );
}
