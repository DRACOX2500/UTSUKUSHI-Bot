export interface BotUserData {
    keywords: string[];
}

export const initBotUserData: BotUserData = {
	keywords: [ ],
};

export type BotUserDataKeyword = { keyword: string }

export type BotUserDataTypes = BotUserDataKeyword;