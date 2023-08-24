export interface OnAfterReady {
    onAfterReady: () => void;
}

export interface BotClientEvents
    extends OnAfterReady {}