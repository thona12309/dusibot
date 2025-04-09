import { Client, Events, GatewayIntentBits } from "discord.js";
import axios from "axios";
import cheerio from "cheerio";
import dotenv from "dotenv";
import cron from "node-cron";
import { extractJsonArray } from "./utils.js";
import { readFile } from "fs/promises";
const characterObject = JSON.parse(
  await readFile(new URL("./character.json", import.meta.url), "utf-8")
);
const traitObject = JSON.parse(
  await readFile(new URL("./trait.json", import.meta.url), "utf-8")
);
dotenv.config();

function getSkillBuildStats(rawText) {
  const extractedArrayString = extractJsonArray(rawText, '"skillBuildStats":');

  if (extractedArrayString) {
    try {
      const skillBuildStats = JSON.parse(extractedArrayString);
      return skillBuildStats;
    } catch (error) {
      console.error("JSON 파싱 에러:", error);
      return null;
    }
  } else {
    console.error("skillBuildStats 배열 추출 실패");
    return null;
  }
}

function getTraitStats(rawText) {
  const extractedArrayString = extractJsonArray(rawText, '"traitStats":');

  if (extractedArrayString) {
    try {
      const traitStats = JSON.parse(extractedArrayString);
      return traitStats;
    } catch (error) {
      console.error("JSON 파싱 에러:", error);
      return null;
    }
  } else {
    console.error("traitStats 배열 추출 실패");
    return null;
  }
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);

  cron.schedule("0 2 * * *", async () => {
    try {
      const channel = await client.channels.fetch("1002905414859493426");
      if (!channel || !channel.isTextBased()) return;

      channel.send("2시!!!");
    } catch (error) {
      console.error("메시지 전송 중 오류 발생:", error);
    }
  });
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  if (commandName == "코발트") {
    const character = interaction.options.getString("실험체", true);
    const { data } = await axios.get(
      `https://dak.gg/er/characters/${characterObject[character]}?teamMode=COBALT`
    );
    const rawText = cheerio.load(data).html();
    const skillBuildStats = getSkillBuildStats(rawText);
    const traitStats = getTraitStats(rawText);

    await interaction.reply(
      `스킬 순서 : ${skillBuildStats[0].key.split("").join(", ")}\n특성 : ${
        traitObject[traitStats[0].key[0]]
      }`
    );
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
