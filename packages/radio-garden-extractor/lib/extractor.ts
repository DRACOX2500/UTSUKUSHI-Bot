import { BaseExtractor, ExtractorExecutionContext, ExtractorInfo, ExtractorSearchContext, SearchQueryType, Track } from 'discord-player';
import { Readable } from 'stream';
import { RadioGarden } from "radio-garden-api";

export class RadioGardenExtractor extends BaseExtractor {
    static identifier = 'radio-garden-extractor' as const;

    private api: RadioGarden;

    constructor(context: ExtractorExecutionContext, options?: object) {
        super(context, options);
        this.api = new RadioGarden();
    }

    public override createBridgeQuery = (track: Track) => `${track.title} by ${track.author} official audio`;

    // discord-player calls this method when it wants some metadata from you. When you return true, discord-player will use you for further processing. If you return false here, discord-player will query another extractor from its registry.
    override async validate(query: string, type?: SearchQueryType | null | "RADIO_GARDEN"): Promise<boolean> {
        return query.startsWith('https://radio.garden/api');
    }

    // discord-player calls this method when it wants a search result. It is called with the search query and a context parameter (options passed to player.search() method)
    override async handle(query: string, context: ExtractorSearchContext): Promise<ExtractorInfo> {
        return this.createResponse(null, []);
    }

    // discord-player calls this method when it wants you to stream a track. You can either return raw url pointing at a stream or node.js readable stream object. Note: this method wont be called if onBeforeCreateStream was used. It is called with discord-player track object.
    override async stream(track: Track): Promise<Readable | string> {
        return track.url;
    }

    // discord-player calls this method when it wants some tracks for autoplay mode.
    override async getRelatedTracks(track: Track): Promise<ExtractorInfo> {
        return this.createResponse(null, [track]);
    }
}