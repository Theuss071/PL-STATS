fetch('dados.json')
  .then(r => r.json())
  .then(data => {

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

    if (data.destaques) {
      document.getElementById("card1-nome").innerText = data.destaques.lider || "";
      document.getElementById("card1-info").innerText = data.destaques.liderInfo || "";
      document.getElementById("card2-nome").innerText = data.destaques.melhorAproveitamento || "";
      document.getElementById("card2-info").innerText = data.destaques.melhorAproveitamentoInfo || "";
    }

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