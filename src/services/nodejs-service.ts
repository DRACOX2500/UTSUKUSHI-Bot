export class NodeJsService {
    /**
     * Return argument by argument prefix, if not found return null
     */
    static getArg(prefix: string, args: string[]): string | null {
        const index = args.findIndex(_arg => _arg === prefix);
        if (index !== -1) return args[index + 1] ?? null;
        else return null;
    }
}