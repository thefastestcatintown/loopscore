const b=()=>{const n=document.querySelector(".faq-list .faq-item");n&&(n.open=!0)};window.location.hash==="#faq"&&b();document.querySelectorAll('a[href="#faq"]').forEach(n=>{n.addEventListener("click",()=>{window.setTimeout(b,80)})});window.addEventListener("hashchange",()=>{window.location.hash==="#faq"&&b()});const q=({rootSelector:n,itemSelector:g,triggerSelector:c,toggleSelector:f,toggleName:u})=>{const a=document.querySelector(n);if(!a)return;const l=Array.from(a.querySelectorAll(c)),e=Array.from(a.querySelectorAll(g)),r=a.querySelector(f);let o=0,m,s=!1;const p=i=>{o=(i+e.length)%e.length,l.forEach((d,w)=>{const h=w===o;d.classList.toggle("is-active",h),d.setAttribute("aria-pressed",String(h))}),e.forEach((d,w)=>{const h=w===o;d.hidden=!h,d.classList.toggle("is-active",h)})},y=()=>{r&&(r.classList.toggle("is-paused",s),r.setAttribute("aria-pressed",String(s)),r.setAttribute("aria-label",s?`${u}-Slider starten`:`${u}-Slider pausieren`))},v=()=>{m&&(window.clearInterval(m),m=void 0)},E=()=>{v(),!window.matchMedia("(prefers-reduced-motion: reduce)").matches&&(m=window.setInterval(()=>{p(o+1)},4200))},S=()=>{s=!0,v(),y()},A=()=>{s=!1,E(),y()};l.forEach((i,d)=>{i.addEventListener("click",()=>{S(),p(d)})}),a.addEventListener("click",i=>{i.target instanceof HTMLElement&&i.target.closest(`${f}, ${c}`)||S()}),r?.addEventListener("click",i=>{if(i.stopPropagation(),s){A();return}S()}),p(0),A()};q({rootSelector:"[data-journey-slider]",itemSelector:"[data-journey-slide]",triggerSelector:"[data-journey-dot]",toggleSelector:"[data-journey-toggle]",toggleName:"Journey"});q({rootSelector:"[data-process-switcher]",itemSelector:"[data-process-card]",triggerSelector:"[data-process-tab]",toggleSelector:"[data-process-toggle]",toggleName:"Ablauf"});const t=document.querySelector("[data-contact-form]");if(t){const n=t.querySelector("[data-contact-status]"),g=t.querySelector('button[type="submit"]'),c=t.querySelector('textarea[name="message"]'),f={demo:`Hallo,

ich interessiere mich für Loopscore und möchte gerne eine Demo anfragen.

Viele Grüße`,start:`Hallo,

ich interessiere mich für das Start Paket von Loopscore und möchte gerne mehr darüber erfahren.

Viele Grüße`,brand:`Hallo,

ich interessiere mich für das Brand Paket von Loopscore und möchte gerne besprechen, wie die App im Look unserer Anlage aussehen könnte.

Viele Grüße`,premium:`Hallo,

ich interessiere mich für das Premium Paket von Loopscore und möchte gerne über Sponsorenintegration, Erweiterungen und die nächsten Schritte sprechen.

Viele Grüße`,pilotpartner:`Hallo,

ich interessiere mich dafür, Loopscore 14 Tage unverbindlich als zusätzliche Option neben unserer Papier-Scorecard zu testen.

Viele Grüße`},u=(l,e)=>{n&&(n.textContent=l,n.dataset.status=e)},a=()=>{const e=new URLSearchParams(window.location.search).get("anfrage")??"demo",r=f[e];!r||!c||(c.value.trim()||(c.value=r),window.setTimeout(()=>{c.focus({preventScroll:!0})},180))};a(),window.addEventListener("hashchange",a),t.addEventListener("submit",l=>{if(l.preventDefault(),!t.reportValidity())return;const e=new FormData(t),r=t.dataset.contactEndpoint??"";g?.setAttribute("disabled","true"),u("Nachricht wird gesendet ...","idle"),fetch(r,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:e.get("name")??"",course:e.get("course")??"",email:e.get("email")??"",phone:e.get("phone")??"",message:e.get("message")??""})}).then(o=>{if(!o.ok)throw new Error("contact-request-failed");t.reset(),u("Danke. Deine Nachricht wurde verschickt.","success")}).catch(()=>{const o=t.dataset.contactEmail??"chris@loopscore.app",m=t.dataset.contactSubject??"Neue Anfrage",s=[`Name: ${e.get("name")??""}`,`Anlage: ${e.get("course")??""}`,`E-Mail: ${e.get("email")??""}`,`Telefon: ${e.get("phone")??""}`,"","Nachricht:",`${e.get("message")??""}`].join(`
`);u(`Das direkte Senden hat nicht geklappt. Bitte schreibe an ${o}.`,"error"),window.setTimeout(()=>{window.location.href=`mailto:${o}?subject=${encodeURIComponent(m)}&body=${encodeURIComponent(s)}`},900)}).finally(()=>{g?.removeAttribute("disabled")})})}
