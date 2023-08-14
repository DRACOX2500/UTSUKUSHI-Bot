import { ProgProfile } from '@/core/types/business';

const PROFILE_ARG = '--profile';

export class ProfileService {

    static profile: ProgProfile = 'prod';

    private static isProgProfile(value: string): boolean {
        return !!value && (
            value === 'dev' ||
            value === 'prod' ||
            value === 'test'
        );
    }

    static initProfile(args: string[]) {
        ProfileService.profile = ProfileService.getProfile(args);
    }

    /**
     * Return profile in arguments app (default: prod)
     * profile: `prod` | `dev` | `test`
     * @param {string[]} args
     * @returns {progProfile}
     */
    static getProfile(args: string[]): ProgProfile {
        const index = args.findIndex(_arg => _arg === PROFILE_ARG);
        if (index !== -1 && ProfileService.isProgProfile(args[index + 1])) {
            return args[index + 1] as ProgProfile;
        }
        else return 'prod';
    }

    static get envPath(): string {
        const profile = ProfileService.getProfile(process.argv);
        if (profile === 'prod') return '.env'
        return `.env.${profile}`;
    }

    static get isProd(): boolean {
        return ProfileService.profile === 'prod';
    }

    static get isDev(): boolean {
        return ProfileService.profile === 'dev';
    }
}