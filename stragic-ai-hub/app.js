const form=document.getElementById("chatForm");
const input=document.getElementById("userInput");
const messages=document.getElementById("messages");
const agentSelect=document.getElementById("agentSelect");
const jurisdiction=document.getElementById("jurisdiction");
const API_URL=window.STRAGIC_API_URL||"/api/chat";

const labels={core:"STRAGIC Core",tech:"Tech Agent",legal:"Legal Intelligence",research:"Research Agent",innovation:"Innovation Agent"};
function addMessage(role,text,meta=""){
  const row=document.createElement("div"); row.className=`message ${role}`;
  if(role==="assistant"){const mark=document.createElement("div");mark.className="mini-mark";mark.textContent="✳";row.appendChild(mark);}
  const bubble=document.createElement("div");bubble.className="bubble";
  const p=document.createElement("p");p.textContent=text;bubble.appendChild(p);
  if(meta){const small=document.createElement("small");small.textContent=meta;bubble.appendChild(small);}
  row.appendChild(bubble);messages.appendChild(row);messages.scrollTop=messages.scrollHeight;
}
function demoReply(agent,q,country){
  const pre={
    core:"Puedo ayudarte a estructurar este desafío. Primero definamos el objetivo, las personas beneficiarias, el resultado esperado y cómo mediremos el impacto.",
    tech:"Ruta tecnológica sugerida: 1) define el problema y los usuarios; 2) diseña una arquitectura mínima; 3) crea un prototipo; 4) prueba seguridad, accesibilidad y rendimiento; 5) documenta y despliega.",
    legal:`Para analizarlo correctamente necesitamos delimitar la jurisdicción (${country}), el tipo de actividad y la fecha relevante. Identifica la norma aplicable, revisa su versión vigente en una fuente oficial y registra obligaciones, responsables y evidencias. Esta orientación no sustituye asesoría legal.`,
    research:"Convierte la consulta en una pregunta investigable. Define población o contexto, variables, metodología, criterios de inclusión de fuentes y una estrategia de búsqueda en repositorios académicos. Separa evidencia comprobada de hipótesis.",
    innovation:"Trabajemos con un canvas breve: problema verificable, segmento usuario, propuesta de valor, solución mínima, diferenciación, modelo de sostenibilidad, riesgos y métricas de impacto."
  };
  return `${pre[agent]||pre.core}\n\nHe recibido tu consulta: “${q}”. En la versión conectada podré desarrollar un análisis más específico, con fuentes y próximos pasos verificables.`;
}
async function send(text){
  const q=text.trim();if(!q)return;
  addMessage("user",q);input.value="";
  const agent=agentSelect.value,country=jurisdiction.value;
  const pending=document.createElement("div");pending.className="message assistant";pending.id="pending";
  const mark=document.createElement("div");mark.className="mini-mark";mark.textContent="✳";
  const bubble=document.createElement("div");bubble.className="bubble";bubble.textContent="Analizando tu consulta…";pending.append(mark,bubble);messages.appendChild(pending);messages.scrollTop=messages.scrollHeight;
  try{
    const res=await fetch(API_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:q,agent,jurisdiction:country})});
    if(!res.ok)throw new Error("API unavailable");
    const data=await res.json();pending.remove();addMessage("assistant",data.answer||"No se recibió una respuesta.");
  }catch(e){
    pending.remove();addMessage("assistant",demoReply(agent,q,country),"Modo demostración: conecta el backend para habilitar IA generativa.");
  }
}
form.addEventListener("submit",e=>{e.preventDefault();send(input.value);});
document.querySelectorAll("[data-prompt]").forEach(b=>b.addEventListener("click",()=>send(b.dataset.prompt)));
document.querySelectorAll("[data-agent]").forEach(b=>b.addEventListener("click",()=>{agentSelect.value=b.dataset.agent;document.getElementById("assistant").scrollIntoView({behavior:"smooth"});input.focus();}));
