let DADOS = {}, slot = 1;
const sel = {};
const $ = id => document.getElementById(id);
const norm = s => String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const COR = { 1: "#7000ff", 2: "#00b0ff" };
const M = [["goals", "Gols"], ["assists", "Assistências"], ["shots", "Finalizações"], ["keyPasses", "Passes decisivos"], ["dribbles", "Dribles certos"], ["passAcc", "Precisão de passe", "%"]];
const v = (p, k) => Number(p[k]) || 0;

fetch("dados.json").then(r => r.json()).then(d => DADOS = d).catch(e => console.error("Erro no dados.json:", e));
document.addEventListener("keydown", e => e.key === "Escape" && fecharModal());

function abrirModal(n) {
  slot = n;
  $("modal-titulo").textContent = "Escolher jogador " + n;
  $("input-busca-jogador").value = "";
  $("modal-pesquisa").style.display = "flex";
  buscar();
}

const fecharModal = () => $("modal-pesquisa").style.display = "none";

function buscar() {
  const t = norm($("input-busca-jogador").value).trim();
  const lista = Object.entries(DADOS.jogadores || {}).filter(([k, p]) => norm(p.name + " " + p.team).includes(t)).slice(0, 8);
  $("resultado-busca").innerHTML = lista.map(([k, p]) => `
    <button type="button" class="resultado-item" onclick="escolher('${k}')">
      <img src="${p.foto || ""}" alt="" onerror="this.style.visibility='hidden'">
      <span>${p.name}<small>${p.team}</small></span>
    </button>`).join("") || '<p class="msg-erro">Jogador não encontrado.</p>';
}

function escolher(k) {
  const p = sel[slot] = DADOS.jogadores[k];
  const card = $(`j${slot}-card`);
  card.classList.add("preenchido");
  card.innerHTML = `
    <div class="slot-conteudo">
      <img class="slot-foto" src="${p.foto || ""}" alt="${p.name}" onerror="this.style.visibility='hidden'">
      <div>
        <div class="slot-nome">${p.name}</div>
        <ul class="slot-info">
          <li>Time: <b>${p.team}</b></li>
          <li>Posição: <b>${p.posicao || "-"}</b></li>
          <li>Idade: <b>${p.idade || "-"}</b></li>
          <li>País: <b>${p.pais || "-"}</b></li>
        </ul>
      </div>
    </div>`;
  fecharModal();
  if (sel[1] && sel[2]) comparar();
}

function comparar() {
  const [a, b] = [sel[1], sel[2]];

  const linhas = [["games", "Jogos"], ["minutes", "Minutos jogados"], ...M].map(([k, r, s = ""]) => {
    const x = v(a, k), y = v(b, k);
    return `<tr><td>${r}</td><td class="${x > y ? "melhor" : ""}">${x}${s}</td><td class="${y > x ? "melhor" : ""}">${y}${s}</td></tr>`;
  }).join("");
  $("tabela-detalhes").className = "";
  $("tabela-detalhes").innerHTML = `<table class="tabela-detalhes"><tr><th>Métrica</th><th>${a.name}</th><th>${b.name}</th></tr>${linhas}</table>`;

  let s1 = 0, qtd = 0;
  M.forEach(([k]) => { const t = v(a, k) + v(b, k); if (t) { s1 += v(a, k) / t; qtd++; } });
  const p1 = Math.round(s1 / (qtd || 1) * 100), p2 = 100 - p1;
  const texto = p1 === p2
    ? "Com base nas estatísticas detalhadas, os dois jogadores têm <strong>desempenho equivalente</strong>."
    : `Com base nas estatísticas detalhadas, é possível concluir que o melhor desempenho pertence a <strong>${(p1 > p2 ? a : b).name}</strong>, com <strong>${Math.max(p1, p2)}%</strong> de desempenho geral.`;
  $("resultado").className = "";
  $("resultado").innerHTML = `
    <p class="resultado-texto">${texto}</p>
    <div class="resultado-barra"><div style="width:${p1}%"></div><div style="width:${p2}%"></div></div>
    <div class="resultado-pct">
      <span style="color:${COR[1]}">${a.name.split(" ").pop()} ${p1}%</span>
      <span style="color:${COR[2]}">${p2}% ${b.name.split(" ").pop()}</span>
    </div>`;

  const W = 340, c = W / 2, R = 105, n = M.length;
  const pt = (i, f) => { const g = (-90 + 360 / n * i) * Math.PI / 180; return [c + R * f * Math.cos(g), c + R * f * Math.sin(g)]; };
  const poly = fs => fs.map((f, i) => pt(i, f)).join(" ");

  let svg = [.25, .5, .75, 1].map(l => `<polygon points="${poly(M.map(() => l))}" fill="none" stroke="#2a2a40"/>`).join("");
  M.forEach(([k, r], i) => {
    const [x, y] = pt(i, 1), [lx, ly] = pt(i, 1.2);
    svg += `<line x1="${c}" y1="${c}" x2="${x}" y2="${y}" stroke="#2a2a40"/>
      <text x="${lx}" y="${ly}" fill="#aaa" font-size="10" dominant-baseline="middle" text-anchor="${lx > c + 5 ? "start" : lx < c - 5 ? "end" : "middle"}">${r}</text>`;
  });
  [a, b].forEach((p, i) => {
    const f = M.map(([k]) => v(p, k) / (Math.max(v(a, k), v(b, k)) || 1));
    svg += `<polygon points="${poly(f)}" fill="${COR[i + 1]}" fill-opacity="0.25" stroke="${COR[i + 1]}" stroke-width="2"/>`;
  });
  $("radar").className = "";
  $("radar").innerHTML = `<svg viewBox="0 0 ${W} ${W}">${svg}</svg>`;
  $("legenda").innerHTML = [a, b].map((p, i) => `<span style="--cor:${COR[i + 1]}">${p.name}</span>`).join("");
}