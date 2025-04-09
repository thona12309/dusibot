import { REST, Routes, SlashCommandBuilder } from "discord.js";
import dotenv from 'dotenv';

dotenv.config();

const guildId = "1002905414859493426";

const commands = [
  new SlashCommandBuilder()
    .setName("코발트")
    .setDescription("코발트 프로토콜 실험체 빌드")
    .addStringOption((option) => option.setName("실험체").setDescription("실험체 이름").setRequired(true)),
].map((command) => command.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_BOT_TOKEN);

(async () => {
  try {
    console.log("슬래시 커맨드를 등록하는 중입니다...");

    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId),
      { body: commands }
    );

    console.log("✅ 슬래시 커맨드 등록 완료!");
  } catch (error) {
    console.error(error);
  }
})();
