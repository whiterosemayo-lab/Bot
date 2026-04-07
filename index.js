const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  ChannelType,
  PermissionsBitField
} = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("interactionCreate", async (interaction) => {

  // ================= BUTTONS =================

  if (interaction.isButton()) {

    // CREATE TICKET
    if (interaction.customId === "create_ticket") {
      const channel = await interaction.guild.channels.create({
        name: `ticket-${interaction.user.username}`,
        type: ChannelType.GuildText,
        permissionOverwrites: [
          {
            id: interaction.guild.id,
            deny: [PermissionsBitField.Flags.ViewChannel]
          },
          {
            id: interaction.user.id,
            allow: [PermissionsBitField.Flags.ViewChannel]
          }
        ]
      });

      const embed = new EmbedBuilder()
        .setTitle("🎫 Support Ticket")
        .setDescription("Staff will assist you shortly.\n\nUse the buttons below.")
        .setColor("Red");

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("claim_ticket")
          .setLabel("Claim")
          .setStyle(ButtonStyle.Primary),

        new ButtonBuilder()
          .setCustomId("close_ticket")
          .setLabel("Close")
          .setStyle(ButtonStyle.Danger)
      );

      await channel.send({ embeds: [embed], components: [row] });
      interaction.reply({ content: `Ticket created: ${channel}`, ephemeral: true });
    }

    // CLAIM
    if (interaction.customId === "claim_ticket") {
      interaction.reply({ content: `✅ Claimed by ${interaction.user}`, ephemeral: false });
    }

    // CLOSE
    if (interaction.customId === "close_ticket") {
      await interaction.reply("Closing ticket...");
      setTimeout(() => interaction.channel.delete(), 3000);
    }

    // RULES BUTTON
    if (interaction.customId === "rules_button") {
      const embed = new EmbedBuilder()
        .setTitle("📜 Server Rules")
        .setDescription("Select which rules you want to view below.")
        .setColor("Blue");

      const row = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId("rules_menu")
          .setPlaceholder("Select Rules")
          .addOptions([
            { label: "In-Game Rules", value: "ingame_rules" },
            { label: "Discord Rules", value: "discord_rules" }
          ])
      );

      interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
    }

  }

  // ================= DROPDOWNS =================

  if (interaction.isStringSelectMenu()) {

    // RULES DROPDOWN
    if (interaction.customId === "rules_menu") {

      if (interaction.values[0] === "ingame_rules") {
        interaction.reply({
          content: `📜 **In-Game Rules**

1. No RDM
2. No VDM
3. No LTAP
4. Realistic RP only
5. FearRP required
6. No cuff rushing
7. NLR applies
8. Realistic avatars
9. Respect safe zones
10. Do not evade staff
11. No cop baiting
12. No GTA driving
13. Do not interfere
14. No exploiting
15. Use proper uniforms
16. No fake departments
17. Follow Roblox TOS`,
          ephemeral: true
        });
      }

      if (interaction.values[0] === "discord_rules") {
        interaction.reply({
          content: `📜 **Discord Rules**

1. No excessive pinging
2. Use Roblox username
3. Respect everyone
4. Mild profanity only
5. No spam
6. No malicious links
7. Use correct channels
8. No alt accounts
9. No NSFW
10. No advertising
11. Stay in VC when required`,
          ephemeral: true
        });
      }
    }

    // BOOSTER PERKS
    if (interaction.customId === "booster_menu") {

      if (interaction.values[0] === "cars") {
        interaction.reply({
          content: `🚗 **Exclusive Vehicles**

Averon Q8 2022  
Averon R8 2017  
Averon RS3 2020  
Averon S5 2010  
BKM Munich 2020  
Chevlon Corbeta 8 2023  
Chevlon Corbeta RZR 2014  
Chevlon Corbeta X08 2014  
Falcon Heritage 2021  
Falcon Heritage Track 2022  
Falcon Traveller 2022  
Ferdinand Jalapeno Turbo 2022  
Leland LTS5-V Blackwing 2023  
Leland Vault 2020  
Ferrari F8 Tributo 2020  
Strugatti Ettore 2020  
Stuttgart Executive 2021  
Surrey 650S 2016  
Takeo Experience 2021  
Terrain Traveller 2022`,
          ephemeral: true
        });
      }

      if (interaction.values[0] === "weapons") {
        interaction.reply({
          content: `🔫 **Exclusive Weapons**

M249  
Remington MSR`,
          ephemeral: true
        });
      }

      if (interaction.values[0] === "perks") {
        interaction.reply({
          content: `✨ **Booster Perks**

• Exclusive vehicles & weapons  
• Priority support  
• Special Discord role  
• 2 raffle entries in giveaways`,
          ephemeral: true
        });
      }
    }

  }

});

// ================= COMMAND =================

client.on("messageCreate", async (message) => {
  if (message.content === "!panel") {

    const embed = new EmbedBuilder()
      .setTitle("📌 Server Panel")
      .setDescription("Use the buttons and menus below.")
      .setColor("Red");

    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("create_ticket")
        .setLabel("Create Ticket")
        .setStyle(ButtonStyle.Success),

      new ButtonBuilder()
        .setCustomId("rules_button")
        .setLabel("Rules")
        .setStyle(ButtonStyle.Primary)
    );

    const dropdown = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("booster_menu")
        .setPlaceholder("Booster Perks")
        .addOptions([
          { label: "Exclusive Vehicles", value: "cars" },
          { label: "Exclusive Weapons", value: "weapons" },
          { label: "Perks", value: "perks" }
        ])
    );

    message.channel.send({
      embeds: [embed],
      components: [buttons, dropdown]
    });
  }
});

// ================= LOGIN =================

client.login(process.env.TOKEN);
