export class DiscordService {
    static limitAutoCompletion(list: any[]): any[] {
        if (list.length >= 25) return list.slice(0, 25)
        return list;
    }
}