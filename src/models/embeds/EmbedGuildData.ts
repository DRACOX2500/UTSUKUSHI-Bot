import {
	GuildChannelManager,
	GuildBanManager,
	RoleManager,
	GuildScheduledEventManager,
	GuildEmojiManager,
	GuildStickerManager,
	GuildMemberManager,
} from 'discord.js';

export interface EmbedGuildData {
	id: string;
	name: string;
	ownerId: string;
	iconUrl: string;
    bannerUrl: string;
	memberCount: number;
	preferredLocale: string;
	premiumSubscriptionCount: number;
	roles: RoleManager;
	bans: GuildBanManager;
	emojis: GuildEmojiManager;
	members: GuildMemberManager;
	channels: GuildChannelManager;
	stickers: GuildStickerManager;
	scheduledEvents: GuildScheduledEventManager;
	createdAt: Date;
	joinedAt: Date;
}
