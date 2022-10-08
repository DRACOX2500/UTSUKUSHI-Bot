/* eslint-disable @typescript-eslint/no-explicit-any */
export interface YtVideoItem {
    type: string,
    title: string,
    id: string,
    url: string,
    bestThumbnail: [],
    thumbnails: [][],
    isUpcoming: boolean,
    upcoming: null,
    isLive: boolean,
    badges: [],
    author: [],
    description?: string,
    views: number,
    duration: string,
    uploadedAt: string
}