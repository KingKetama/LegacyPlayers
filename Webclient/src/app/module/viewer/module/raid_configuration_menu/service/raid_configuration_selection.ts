import {Injectable, OnDestroy} from "@angular/core";
import {Observable, Subject, Subscription} from "rxjs";
import {RaidConfigurationService} from "./raid_configuration";
import {debounceTime} from "rxjs/operators";

@Injectable({
    providedIn: "root",
})
export class RaidConfigurationSelectionService implements OnDestroy {

    private subscription: Subscription;

    private source_selection$: Subject<Array<number>> = new Subject();
    private active_event_types: Map<number, number> = new Map<number, number>();
    private event_type_selection_changed: Subject<void> = new Subject();

    constructor(
        private raidConfigurationService: RaidConfigurationService
    ) {
        this.subscription = this.event_type_selection_changed.pipe(debounceTime(50))
            .subscribe(() => this.raidConfigurationService.select_event_types([...this.active_event_types.entries()]
                .filter(([evt_type, num]) => num > 0).map(([evt_type, _num]) => evt_type)));
    }

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }

    get source_selection(): Observable<Array<number>> {
        return this.source_selection$.asObservable();
    }

    select_sources(sources: Array<number>): void {
        this.source_selection$.next(sources);
        this.raidConfigurationService.update_source_filter(sources, true);
    }

    register_event_type(event_type: number): void {
        if (this.active_event_types.has(event_type))
            this.active_event_types.set(event_type, this.active_event_types.get(event_type) + 1);
        else
            this.active_event_types.set(event_type, 1);
        this.event_type_selection_changed.next();
    }

    unregister_event_type(event_type: number): void {
        if (!this.active_event_types.has(event_type))
            return;

        const current_amount = this.active_event_types.get(event_type);
        if (current_amount - 1 <= 0)
            this.active_event_types.delete(event_type);
        else
            this.active_event_types.set(event_type, current_amount - 1);
        this.event_type_selection_changed.next();
    }
}
