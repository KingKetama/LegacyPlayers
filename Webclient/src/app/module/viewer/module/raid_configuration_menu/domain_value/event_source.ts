import {DelayedLabel} from "../../../../../stdlib/delayed_label";

export interface EventSource {
    id: number;
    label: DelayedLabel;
    is_player: boolean;
}