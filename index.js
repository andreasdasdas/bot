const express = require('express');
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const app = express();
const PORT = process.env.PORT || 3000;

// Endpoint básico pra manter o Render ativo
app.get('/', (req, res) => {
  res.send('Bot está rodando!');
});

app.listen(PORT, () => {
  console.log(`🌐 Servidor Express rodando na porta ${PORT}`);
});

// Pegando o token do ambiente
const TOKEN = process.env.TOKEN;

// IDs de canais e roles
const CANAL_BRUXA_ID = '1372214285039829022';
const CANAL_BOSSES_ID = '1372215553189623878';
const ROLE_BRUXA = '1372615547509805066';
const ROLE_BOSSES = '1372615661091819683';

// Lista de bosses e horários
const bosses = [
  { nome: "Bruxa do Gelo", horario: "00:00" },
  { nome: "Boss de Mapa", horario: "01:00" },
  { nome: "Bruxa do Gelo", horario: "03:00" },
  { nome: "Boss de Mapa", horario: "04:00" },
  { nome: "Bruxa do Gelo", horario: "06:00" },
  { nome: "Boss de Mapa", horario: "07:00" },
  { nome: "Bruxa do Gelo", horario: "09:00" },
  { nome: "Boss de Mapa", horario: "10:00" },
  { nome: "Bruxa do Gelo", horario: "12:00" },
  { nome: "Boss de Mapa", horario: "13:00" },
  { nome: "Bruxa do Gelo", horario: "15:00" },
  { nome: "Boss de Mapa", horario: "16:00" },
  { nome: "Bruxa do Gelo", horario: "18:00" },
  { nome: "Boss de Mapa", horario: "19:00" },
  { nome: "Bruxa do Gelo", horario: "21:00" },
  { nome: "Boss de Mapa", horario: "22:00" }
];

client.once('ready', () => {
  console.log(`✅ Bot logado como ${client.user.tag}`);

  const verificarBosses = () => {
    const agora = new Date();
    const horaAgora = agora.getHours();
    const minutoAgora = agora.getMinutes();

    for (const boss of bosses) {
      const [horaBoss, minutoBoss] = boss.horario.split(':').map(Number);

      const dataBoss = new Date(agora);
      dataBoss.setHours(horaBoss);
      dataBoss.setMinutes(minutoBoss);
      dataBoss.setSeconds(0);

      const diffMinutos = Math.round((dataBoss - agora) / (60 * 1000));

      if (diffMinutos === 5) {
        const horaFormatada = agora.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit'
        });

        const embed = new EmbedBuilder()
          .setColor(0xff0000)
          .setTitle("⚠️ Boss Imminente!")
          .setDescription(`**${boss.nome}** aparecerá em **5 minutos!**`)
          .addFields(
            { name: "⏰ Agora", value: horaFormatada, inline: true },
            { name: "📅 Horário do Boss", value: boss.horario, inline: true }
          )
          .setFooter({ text: "Prepare-se para a batalha!" })
          .setTimestamp();

        // Definir canal e role corretos
        const canalID = boss.nome === "Bruxa do Gelo" ? CANAL_BRUXA_ID : CANAL_BOSSES_ID;
        const roleID = boss.nome === "Bruxa do Gelo" ? ROLE_BRUXA : ROLE_BOSSES;
        const canal = client.channels.cache.get(canalID);

        if (!canal) {
          console.error(`❌ Canal para ${boss.nome} não encontrado. Verifique o ID.`);
          return;
        }

        canal.send({ content: `<@&${roleID}>`, embeds: [embed] })
          .then(() => console.log(`✅ Notificação enviada para ${boss.nome}`))
          .catch(err => console.error("❌ Erro ao enviar notificação:", err));
      }
    }
  };

  setInterval(verificarBosses, 60 * 1000);
});

// Login com o token de ambiente
client.login(TOKEN);
