import { FONT_URL } from "../data/itineraryData";

export const APP_STYLE_ID = "hr4";

export const appCss = `
*{margin:0;padding:0;box-sizing:border-box}
:root{
  --gold:#C8A44E;--ink:#111318;--ink2:#2a2d35;--smoke:#6b7084;
  --ghost:#f2f1ee;--cream:#FAFAF7;--r:14px;
  --fd:'Cormorant Garamond',serif;--fb:'Outfit',sans-serif;
  --max:480px;--pad:24px;
}
html{scroll-behavior:smooth}
body{font-family:var(--fb);background:var(--ink);color:var(--ink);-webkit-font-smoothing:antialiased;overflow-x:hidden}

.shell{min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--ink)}
#root {
width: 1326px;
max-width: 100%;
margin: 0 auto;
text-align: center;
border-inline: 1px solid var(--border);
min-height: 20svh;
display: flex;
max-height: 100vh;
flex-direction: column;
box-sizing: border-box;
}
.app{width:100%;max-width:var(--max);height:100vh;background:var(--cream);position:relative;overflow-x:hidden;display:flex;flex-direction:column}
@media(min-width:375px) and (max-height:667px) {
  .s-c{padding: 0 var(--pad) 44px !important;}
}
@media(min-width:360px) and (max-height:740px) {
  .s-c{padding: 0 var(--pad) 15vh !important;}
}
@media(min-width:769px){
  .shell{padding:32px 0;gap:60px}
  .app{min-height:92vh;max-height:92vh;overflow-y:auto;border-radius:28px;box-shadow:0 0 0 8px #222,0 0 0 10px #444,0 40px 80px rgba(0,0,0,.5);scrollbar-width:thin;scrollbar-color:var(--gold) transparent}
  .app::-webkit-scrollbar{width:4px}
  .app::-webkit-scrollbar-thumb{background:var(--gold);border-radius:4px}
  :root{--max:420px;--pad:24px}
}
@media (min-width: 1440px) {
  .side-info {
    width: 360px;
    margin-right: 5px;
  }
}
@media(min-width:1200px){
  .shell{background:var(--ink);padding:48px 60px;justify-content:flex-start}
  :root{--max:520px}
  .side-info{display:flex;flex-direction:column;justify-content:center;width:300px;flex-shrink:0;color:rgba(255,255,255,.7);margin-right:60px}
  .side-info h2{font-family:var(--fd);font-size:48px;color:#fff;font-weight:700;line-height:1.05;margin-bottom:16px;letter-spacing:-1px}
  .side-info h2 em{color:var(--gold);font-style:italic}
  .side-info p{font-size:15px;line-height:1.7;font-weight:300;margin-bottom:24px}
  .side-info .side-tag{display:inline-flex;align-items:center;gap:6px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--gold);font-weight:600}
  .side-info .side-tag::before{content:'';width:20px;height:1px;background:var(--gold)}
}
@media(max-width:1199px){.side-info{display:none}}
@media(min-width:1440px){
  .shell{padding:72px 80px}
  :root{--max:600px}
  .side-info{width:360px;}
  .side-info h2{font-size:56px}
}
@media(min-width:1920px){
  :root{--max:700px}
  .shell{padding:96px 120px;gap:70px}
  .side-info{width:480px}
  .side-info h2{font-size:64px}
}
@media(min-width:2560px){
  :root{--max:800px}
  .shell{padding:120px 160px;gap:160px}
  .side-info{width:540px}
  .side-info h2{font-size:72px}
}
@media(max-width:374px){:root{--pad:16px;--max:100%}.s-t{font-size:42px!important}.stp-t{font-size:28px!important}.rh{height:300px!important}.rh-t{font-size:34px!important}.vg{gap:8px}.v{height:120px!important}.tc-img{height:90px!important}}
@media(min-width:375px) and (max-width:413px){:root{--max:100%;--pad:22px}}
@media(min-width:414px) and (max-width:480px){:root{--max:100%;--pad:26px}.v{height:160px!important}}
@media(min-width:481px) and (max-width:768px){:root{--max:460px;--pad:28px}.app{margin:0 auto;border-radius:0;min-height:100vh;max-height:none}}

.splash{min-height:100vh;position:relative;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end;flex-grow:1}
@media(min-width:769px){.splash{flex-grow:0;min-height:auto;height:800px;padding-top:0;justify-content:center}}
@media(min-width:1200px){.splash{height:900px}}
@media(min-width:1440px){.splash{height:1000px}}
@media(min-width:1920px){.splash{height:1100px}}
.s-bg{position:absolute;inset:0}
.s-bg img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity 1.5s ease}
.s-bg img.act{opacity:1;animation:sZ 12s ease-in-out forwards}
.s-ov{position:absolute;inset:0;background:linear-gradient(180deg,rgba(17,19,24,.05) 0%,rgba(17,19,24,.35) 35%,rgba(17,19,24,.92) 72%,rgba(17,19,24,.98) 100%)}
.s-gr{position:absolute;inset:0;opacity:.2;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.5'/%3E%3C/svg%3E");background-size:100px;mix-blend-mode:overlay;pointer-events:none}
.s-c{position:relative;z-index:2;padding:0 var(--pad) 24vh;animation:fU .8s ease-out;display:flex;flex-direction:column;justify-content:flex-end;min-height:100%}
@media(min-width:769px){.s-c{justify-content:center;padding:var(--pad)}}
.s-ey{display:inline-flex;align-items:center;gap:8px;font-size:10.5px;letter-spacing:2.5px;text-transform:uppercase;color:var(--gold);font-weight:600;margin-bottom:20px}
.s-ey::before{content:'';width:24px;height:1px;background:var(--gold)}
.s-t{font-family:var(--fd);font-size:52px;font-weight:700;color:#fff;line-height:1;letter-spacing:-1.5px;margin-bottom:14px}
.s-t em{font-style:italic;color:var(--gold)}
.s-d{font-size:14.5px;color:rgba(255,255,255,.5);line-height:1.7;margin-bottom:28px;max-width:340px;font-weight:300;margin-left:41px;}
.s-sts{display:flex;gap:24px;margin-bottom:28px;margin-left:65px;}
.s-sv{font-family:var(--fd);font-size:26px;font-weight:700;color:#fff}
.s-sl{font-size:10px;color:rgba(255,255,255,.35);text-transform:uppercase;letter-spacing:1.2px;margin-top:2px;font-weight:500}

.btn{width:100%;padding:17px;border:none;border-radius:var(--r);font-size:15px;font-weight:600;font-family:var(--fb);cursor:pointer;transition:all .25s;letter-spacing:.2px}
.btn-g{background:var(--gold);color:var(--ink)}.btn-g:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(200,164,78,.3)}
.btn-d{background:var(--ink);color:#fff}.btn-d:hover{background:var(--ink2)}
.btn-o{background:0 0;border:1.5px solid rgba(107,112,132,.25);color:var(--smoke)}.btn-o:hover{border-color:var(--gold);color:var(--ink)}

.prog{position:sticky;top:0;width:100%;height:3px;background:rgba(0,0,0,.04);z-index:100}
.prog-f{height:100%;background:var(--gold);transition:width .5s;border-radius:0 3px 3px 0}

.stp{padding:52px var(--pad) 0;animation:fU .45s ease-out;display:flex;flex-direction:column;flex-grow:1;justify-content:flex-start}
@media(min-width:769px){.stp{padding-top:36px;padding-bottom:0}}
.stp-n{font-size:10.5px;letter-spacing:3px;text-transform:uppercase;color:var(--smoke);font-weight:500;margin-bottom:6px}
.stp-t{font-family:var(--fd);font-size:34px;font-weight:700;line-height:1.1;letter-spacing:-.5px;margin-bottom:6px}
.stp-s{color:var(--smoke);font-size:14px;margin-bottom:28px;font-weight:300}

.vg{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.v{position:relative;border-radius:var(--r);overflow:hidden;height:148px;cursor:pointer;transition:all .25s;border:3px solid transparent}
.v.on{border-color:var(--gold);transform:scale(1.03)}
.v img{width:100%;height:100%;object-fit:cover;transition:transform .5s}.v:hover img{transform:scale(1.06)}
.v-o{position:absolute;inset:0;background:linear-gradient(0deg,rgba(0,0,0,.72) 0%,rgba(0,0,0,.04) 55%);display:flex;align-items:flex-end;padding:14px}
.v-l{color:#fff;font-size:13px;font-weight:600;display:flex;align-items:center;gap:5px}
.v-ck{position:absolute;top:8px;right:8px;width:26px;height:26px;background:var(--gold);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;color:var(--ink);opacity:0;transform:scale(.4);transition:all .25s}
.v.on .v-ck{opacity:1;transform:scale(1)}

.os{display:flex;flex-direction:column;gap:10px}
.o{padding:17px 18px;background:#fff;border-radius:var(--r);cursor:pointer;transition:all .25s;border:2px solid #ebebeb;display:flex;align-items:center;gap:14px}
.o:hover{border-color:#ddd;transform:translateX(3px)}
.o.on{border-color:var(--gold);background:linear-gradient(135deg,#fffdf7,#fff8ec)}
.o-i{font-size:22px;width:46px;height:46px;display:flex;align-items:center;justify-content:center;background:var(--ghost);border-radius:11px;flex-shrink:0}
.o.on .o-i{background:rgba(200,164,78,.1)}
.o-l{font-size:15px;font-weight:600}.o-s{font-size:12px;color:var(--smoke);font-weight:300;margin-top:1px}

.bot{position:relative;width:100%;padding:14px var(--pad) 28px;background:linear-gradient(to top,var(--cream) 65%,transparent);z-index:50;flex-shrink:0;margin-top:auto}
@media(min-width:769px){.bot{padding-bottom:20px}}

.ld{min-height:60vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;animation:fU .4s;padding:80px 0;flex-grow:1}
@media(min-width:769px){.ld{min-height:auto;flex-grow:0}}
.ld-r{width:44px;height:44px;border:3px solid var(--ghost);border-top-color:var(--gold);border-radius:50%;animation:sp .9s linear infinite}
.ld-t{font-family:var(--fd);font-size:21px;font-weight:600}
.ld-s{color:var(--smoke);font-size:12.5px;font-weight:300}

.res{animation:fU .5s;display:flex;flex-direction:column;flex-grow:1}
@media(min-width:769px){.res{flex-grow:0}}
.rh{position:relative;height:360px;overflow:hidden}
@media(min-width:769px){.rh{height:320px}}
.rh>img{width:100%;height:100%;object-fit:cover}
.rh-o{position:absolute;inset:0;background:linear-gradient(180deg,transparent 15%,rgba(17,19,24,.45) 45%,rgba(17,19,24,.94) 78%,var(--cream) 100%);display:flex;flex-direction:column;justify-content:flex-end;padding:0 var(--pad) 24px}
.rh-b{display:inline-flex;align-items:center;gap:5px;background:rgba(200,164,78,.14);border:1px solid rgba(200,164,78,.22);padding:5px 11px;border-radius:100px;font-size:9.5px;color:var(--gold);letter-spacing:2px;text-transform:uppercase;font-weight:700;width:fit-content;margin-bottom:10px}
.rh-t{font-family:var(--fd);font-size:40px;font-weight:700;color:#fff;line-height:1.05;letter-spacing:-1px;margin-bottom:5px}
.rh-s{color:rgba(255,255,255,.5);font-size:13.5px;font-weight:300;font-style:italic}

.dt{display:flex;gap:0;margin:0 var(--pad) 20px;background:#fff;border-radius:11px;padding:3px;box-shadow:0 2px 10px rgba(0,0,0,.05)}
.dt-t{flex:1;text-align:center;padding:11px 6px;border-radius:9px;font-size:12.5px;font-weight:600;cursor:pointer;color:var(--smoke);transition:all .25s}
.dt-t.on{background:var(--ink);color:#fff}

.sts{display:flex;background:#fff;border-radius:var(--r);padding:3px;margin:0 var(--pad) 24px;box-shadow:0 2px 10px rgba(0,0,0,.05)}
.st{flex:1;text-align:center;padding:13px 6px;border-radius:11px}
.st:first-child{background:rgba(46,125,50,.05)}
.st-v{font-size:20px;font-weight:700;font-family:var(--fd)}
.st-l{font-size:9.5px;color:var(--smoke);text-transform:uppercase;letter-spacing:1px;margin-top:2px;font-weight:500}

.tl{padding:0 var(--pad) 28px}
.ti{display:flex;gap:12px;margin-bottom:4px;animation:fU .45s ease-out backwards}
.ti-r{display:flex;flex-direction:column;align-items:center;width:42px;flex-shrink:0}
.ti-tm{font-size:11.5px;font-weight:600;white-space:nowrap;margin-bottom:5px}
.ti-dt{width:34px;height:34px;border-radius:9px;background:#fff;border:2px solid #e6e6ec;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0}
.ti-ln{width:2px;flex:1;min-height:14px;background:linear-gradient(180deg,#e2e2ea,transparent);margin-top:5px}
.tc{flex:1;background:#fff;border-radius:var(--r);overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.04);margin-bottom:8px;cursor:pointer;transition:all .25s;border:1px solid rgba(0,0,0,.03)}
.tc:hover{box-shadow:0 4px 18px rgba(0,0,0,.08);transform:translateY(-1px)}
.tc-img{width:100%;height:110px;object-fit:cover;display:block}
.tc-b{padding:13px 15px}
.tc-n{font-size:14.5px;font-weight:600;margin-bottom:4px;display:flex;justify-content:space-between;align-items:center}
.tc-d{font-size:12px;color:#666;line-height:1.55;margin-bottom:9px;font-weight:300}
.tc-f{display:flex;gap:6px;flex-wrap:wrap}
.p{padding:3px 9px;border-radius:100px;font-size:9.5px;font-weight:600;letter-spacing:.2px}
.p-d{background:var(--ghost);color:var(--smoke)}

.mbg{position:fixed;inset:0;background:rgba(0,0,0,.5);backdrop-filter:blur(8px);z-index:200;display:flex;align-items:flex-end;justify-content:center;animation:fI .15s}
@media(min-width:769px){.mbg{align-items:center}}
.m{background:#fff;max-width:var(--max);width:100%;border-radius:20px 20px 0 0;animation:sU .25s;max-height:82vh;overflow-y:auto}
@media(min-width:769px){.m{border-radius:20px;max-height:80vh}}
.m-i{width:100%;height:200px;object-fit:cover;display:block}
@media(min-width:769px){.m-i{height:240px;border-radius:20px 20px 0 0}}
.m-b{padding:24px var(--pad) 36px}
.m-h{width:40px;height:4px;background:#ddd;border-radius:4px;margin:0 auto 16px}
@media(min-width:769px){.m-h{display:none}}
.m h3{font-family:var(--fd);font-size:24px;margin-bottom:8px}
.m p{color:#555;line-height:1.7;font-size:14px;margin-bottom:14px;font-weight:300}
.m-mt{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:14px}

.wm{text-align:center;padding:18px var(--pad) 44px;font-size:11.5px;color:var(--smoke);font-weight:300}
.wm b{color:var(--gold);font-weight:600}

@keyframes fU{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
@keyframes fI{from{opacity:0}to{opacity:1}}
@keyframes sU{from{transform:translateY(100%)}to{transform:translateY(0)}}
@keyframes sp{to{transform:rotate(360deg)}}
@keyframes sZ{from{transform:scale(1)}to{transform:scale(1.15)}}

/* --- Targeted Override for Portrait Tablets (iPad Mini, Air, Pro, Surface Pro, Zenbook Fold) --- */

@media (min-width: 768px) and (max-width: 1024px) and (min-height: 1000px) {
  :root {
    --max: 100%;
    --pad: 48px;
  }
  .shell {
    padding: 0;
    background: var(--ink);
  }
  .app {
    margin: 0 auto;
    border-radius: 0;
    min-height: 100vh;
    max-height: none;
    box-shadow: none;
    width: 100%;
  }
  .splash {
    height: 100vh;
    min-height: 100vh;
    justify-content: flex-end;
    padding-top: 0;
  }
  .s-c {
    padding: 0 var(--pad) 5vh !important;
  }
  .s-t {
    font-size: 64px !important;
  }
  .s-d {
    font-size: 16px;
    max-width: 580px;
    padding-left: 7vh;
  }
  .s-sts {
    margin-left: 18vh;
  }
  .side-info {
    display: none;
  }
  .tc-img {
    height: 200px;
  }
  .m-i {
    height: 600px;
  }
}

@media (min-width: 1024px) and (max-height: 1366px) {
  .btn-g {
    width: 100% !important;
  }
  .s-sts {
    margin-left: 23vh;
  }
  .s-d {
    font-size: 20px;
    width: 570px;
    margin-left: 14vh;
  }
  .s-t {
    font-size: 84px !important;
  }
}

@media (min-width: 768px) and (max-height: 1024px) and (max-width: 1440px) {
  .s-c {
    padding: 0 var(--pad) 25vh !important;
  }
}

@media (min-width: 1440px) and (min-height: 900px){
 .s-c {
  padding: var(--pad);
 }
 .s-t {
  font-size: 52px !important;
 }
 .s-d {
  font-size: 18px !important;
  margin-left: 41px !important;
 }
 .s-sts {
   margin-left: 7vh !important;
 }
}

@media (min-width: 1024px) and (max-height: 600px){
 .s-c {
  padding: var(--pad);
 }
 .s-t {
  font-size: 52px !important;
 }
 .s-d {
  font-size: 18px !important;
  margin-left: 41px !important;
 }
 .s-sts {
   margin-left: 7vh !important;
 }
}

`;

export function ensureFonts() {
  if (!document.querySelector('link[href*="Cormorant+Garamond"]')) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = FONT_URL;
    document.head.appendChild(link);
  }
}

export function ensureAppStyles() {
  const existing = document.querySelector(`#${APP_STYLE_ID}`);
  if (existing) existing.remove();

  const styleElement = document.createElement("style");
  styleElement.id = APP_STYLE_ID;
  styleElement.textContent = appCss;
  document.head.appendChild(styleElement);
}
