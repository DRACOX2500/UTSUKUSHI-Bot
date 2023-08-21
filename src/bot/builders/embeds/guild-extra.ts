import { DiscordService } from "../../../services/discord-service";
import { EmbedBuilder, Guild, GuildEmoji, Role, Sticker, bold, roleMention } from "discord.js";

export class GuildExtraEmbed extends EmbedBuilder {

	constructor(
        guild: Guild,
        emojis: GuildEmoji[],
        stickers: Sticker[],
        roles: Role[],
    ) {
        super();

        const descs: string[] = [];

        descs.push(
            bold(`Emojis (${emojis.length}) :\n`) +
            emojis?.map(_emoji => `<${_emoji.animated ? 'a' : ''}:${_emoji.name}:${_emoji.id}>`).join(' ')
        );

        descs.push(
            bold(`Stickers (${stickers.length}) :\n`) +
            stickers.map((_sticker) => `- ${_sticker.name}`).join('\n')
        );

        descs.push(
            bold(`Roles (${roles.length}) :\n`) +
            roles.map((_role) => roleMention(_role.id)).join(' ')
        )

        this
            .setColor(0xf9ff00)
			.setTitle(`${guild.name}'s Extra Data`)
            .setDescription(DiscordService.limitText(descs.join('\n\n'), 1950));
	}
}