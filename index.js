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
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// ================= INTERACTIONS =================

client.on("interactionCreate", async (interaction) => {
  try {

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

        return interaction.reply({
          content: `Ticket created: ${channel}`,
          ephemeral: true
        });
      }

      // CLAIM
      if (interaction.customId === "claim_ticket") {
        return interaction.reply({
          content: `✅ Claimed by ${interaction.user}`,
          allowedMentions: { users: [] }
        });
      }

      // CLOSE
      if (interaction.customId === "close_ticket") {
        await interaction.reply("Closing ticket...");
        setTimeout(() => interaction.channel.delete().catch(() => {}), 3000);
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

        return interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
      }
    }

    // ================= DROPDOWNS =================

    if (interaction.isStringSelectMenu()) {

      if (interaction.customId === "rules_menu") {

        if (interaction.values[0] === "ingame_rules") {
          return interaction.reply({
            content: `📜 **In-Game Rules**

1. No RDM
2. No VDM
3. No LTAP
4. Realistic RP only
5. FearRP required
6. No exploiting
7. Follow server rules`,
            ephemeral: true
          });
        }

        if (interaction.values[0] === "discord_rules") {
          return interaction.reply({
            content: `📜 **Discord Rules**

1. No spam
2. No NSFW
3. No advertising
4. Respect others`,
            ephemeral: true
          });
        }
      }

      if (interaction.customId === "booster_menu") {

        if (interaction.values[0] === "cars") {
          return interaction.reply({
            content: `🚗 Exclusive Vehicles list...`,
            ephemeral: true
          });
        }

        if (interaction.values[0] === "weapons") {
          return interaction.reply({
            content: `🔫 Exclusive Weapons: M249, MSR`,
            ephemeral: true
          });
        }

        if (interaction.values[0] === "perks") {
          return interaction.reply({
            content: `✨ Booster Perks list...`,
            ephemeral: true
          });
        }
      }
    }

  } catch (err) {
    console.log("Interaction error:", err);
  }
});

// ================= PANEL COMMAND =================

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

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
