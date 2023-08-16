import { Emoji } from '@/types/business';
import { Locale, GuildEmoji } from 'discord.js';

export class DiscordService {
    static limitAutoCompletion(list: any[]): any[] {
        if (list.length >= 25) return list.slice(0, 25)
        return list;
    }
    static limitText(text: string, limit: number = 1999): string {
        if (text.length > limit) return text.slice(0, limit);
        return text;
    }
    static get languages(): string[] {
        const choices: string[] = [];
        for (const key in Locale) {
            choices.push(key);
        }
        choices.sort((a, b) => a.localeCompare(b));
        return choices;
    }
    static toEmojiType(...emojis: GuildEmoji[]): Emoji[] {
        return emojis.map((emoji): Emoji => ({
            id: emoji.id,
            name: emoji.name ?? '',
            animated: emoji.animated ?? false,
        }))
    }
}