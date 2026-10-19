const $ = id => document.getElementById(id);
const erro = msg => $("totais").innerHTML = `<p class="msg-erro">${msg}</p>`;

fetch("dados.json")
  .then(r => r.json())
  .then(({ geral }) => {
    if (!geral) return erro('Faltou a chave "geral" no dados.json.');

    $("totais").innerHTML = geral.totais.map(t => `
      <div class="total-card">
        <div class="total-icone"><i class="fas ${t.icone}"></i></div>
        <div>
          <div class="total-rotulo">${t.rotulo}</div>
          <div class="total-valor">${t.valor}</div>
          <div class="total-sub">${t.sub || ""}</div>
        </div>
      </div>`).join("");

    $("lideres-grid").innerHTML = geral.lideres.map(c => `
      <article class="lider-card">
        <h3 class="lider-titulo"><i class="fas ${c.icone}"></i> ${c.titulo}</h3>
        <ol class="lider-lista">
          ${c.itens.map((it, i) => `
            <li class="lider-item ${i ? "" : "primeiro"}">
              <span class="lider-pos">${i + 1}</span>
              <img class="lider-foto" src="${it.foto || ""}" alt="" onerror="this.style.visibility='hidden'">
              <div class="lider-nome"><strong>${it.nome}</strong><small>${it.time}</small></div>
              <span class="lider-valor">${it.valor}</span>
            </li>`).join("")}
        </ol>
      </article>`).join("");
  })
  .catch(() => erro("Não foi possível carregar os dados. Abra o site com o Live Server."));