let DADOS = {}, j1 = null, j2 = null, cardAtivo = 1;

// 1. Carrega dados do JSON e preenche a tela
fetch('dados.json')
  .then(r => r.json())
  .then(data => {
    DADOS = data;

    // Tabela Lateral
    const corpo = document.getElementById("corpo-tabela");
    if (corpo && data.tabela) {
      corpo.innerHTML = data.tabela.map(i => `
        <tr style="border-bottom: 1px solid #2a2a40;">
          <td>${i.rank}</td>
          <td style="text-align: left; font-weight: bold;">${i.name}</td>
          <td>${i.played}</td>
          <td>${i.w ?? 0}</td>
          <td>${i.d ?? 0}</td>
          <td>${i.l ?? 0}</td>
          <td>${i.goalsDiff ?? 0}</td>
          <td><strong>${i.points}</strong></td>
        </tr>
      `).join('');
    }

    // Destaques
    if (data.destaques) {
      document.getElementById("card1-nome").innerText = data.destaques.lider || "";
      document.getElementById("card1-info").innerText = data.destaques.liderInfo || "";
      document.getElementById("card2-nome").innerText = data.destaques.melhorAproveitamento || "";
      document.getElementById("card2-info").innerText = data.destaques.melhorAproveitamentoInfo || "";
    }

    // Artilharia
    const artBox = document.getElementById("container-artilharia");
    if (artBox && data.artilharia) {
      artBox.innerHTML = data.artilharia.map((a, idx) => `
        <div style="flex: 1; min-width: 100px; background: #0d0d15; border: 1px solid #2a2a40; border-radius: 8px; padding: 10px; text-align: center;">
          <small style="color: #7000ff; font-weight: bold;">#${idx + 1}</small>
          <img src="${a.foto || a.photo || ''}" alt="${a.nome || a.name}" onerror="this.style.display='none'" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; margin: 4px auto; display: block;" />
          <p style="margin: 4px 0; font-size: 11px; font-weight: bold; color: #fff;">${a.nome || a.name}</p>
          <span style="background: #7000ff; color: #fff; font-size: 10px; padding: 2px 6px; border-radius: 4px; font-weight: bold;">${a.gols || a.goals}</span>
        </div>
      `).join('');
    }
  });
  
// 2. Navegação de Abas
function navegarPara(aba) {
  document.getElementById("aba-inicio").style.display = aba === 'inicio' ? 'block' : 'none';
  document.getElementById("aba-comparar").style.display = aba === 'comparar' ? 'block' : 'none';
  document.getElementById("btn-inicio")?.classList.toggle("ativo", aba === 'inicio');
  document.getElementById("btn-comparar")?.classList.toggle("ativo", aba === 'comparar');
}

// 3. Modal de Pesquisa
function abrirModal(card) {
  cardAtivo = card;
  document.getElementById("modal-pesquisa").style.display = "flex";
  document.getElementById("resultado-busca").innerHTML = "";
  document.getElementById("input-busca-jogador").value = "";
}

function fecharModal() {
  document.getElementById("modal-pesquisa").style.display = "none";
}

function buscarJogadorAPI() {
  const t = document.getElementById("input-busca-jogador").value.toLowerCase().trim();
  const k = Object.keys(DADOS.jogadores || {}).find(key => 
    key.includes(t) || DADOS.jogadores[key].name.toLowerCase().includes(t)
  );
  const p = DADOS.jogadores?.[k];

  document.getElementById("resultado-busca").innerHTML = p 
    ? `<div onclick="selecionar('${k}')" style="padding: 8px; background: #1a1a2e; color: #fff; cursor: pointer; border-radius: 6px; margin-top: 5px;">${p.name} (${p.team})</div>`
    : "<p style='color: #ff3b30; font-size: 12px;'>Não encontrado!</p>";
}

// 4. Comparação
function selecionar(k) {
  const p = DADOS.jogadores[k];
  if (cardAtivo === 1) j1 = p; else j2 = p;
  document.getElementById(`j${cardAtivo}-nome-card`).innerText = `${p.name} (${p.team})`;
  fecharModal();
  if (j1 && j2) renderizarComparacaoDetalhada();
}

function renderizarComparacaoDetalhada() {
  const vence = (j1.score || 0) >= (j2.score || 0) ? j1 : j2;

  document.getElementById("tabela-estatisticas-detalhadas").innerHTML = `
    <table style="width: 100%; color: #fff; font-size: 12px; text-align: left; border-collapse: collapse; margin-bottom: 15px;">
      <tr style="border-bottom: 1px solid #2a2a40; color: #888;">
        <th>Métrica</th><th>${j1.name}</th><th>${j2.name}</th>
      </tr>
      <tr><td>Jogos</td><td>${j1.games}</td><td>${j2.games}</td></tr>
      <tr><td>Gols</td><td>${j1.goals}</td><td>${j2.goals}</td></tr>
      <tr><td>Assistências</td><td>${j1.assists}</td><td>${j2.assists}</td></tr>
      <tr><td>Finalizações</td><td>${j1.shots}</td><td>${j2.shots}</td></tr>
      <tr><td>Precisão Passe</td><td>${j1.passAcc}</td><td>${j2.passAcc}</td></tr>
    </table>
    <div style="padding: 10px; background: #1a1a2e; border-radius: 6px; color: #fff;">
      Melhor desempenho: <strong style="color: #7000ff;">${vence.name}</strong> (${vence.score}%).
    </div>
  `;
}