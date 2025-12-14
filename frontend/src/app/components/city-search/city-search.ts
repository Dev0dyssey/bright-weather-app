import { Component, output, inject, DestroyRef } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';



@Component({
    selector: 'app-city-search',
    templateUrl: './city-search.html',
    styleUrls: ['./city-search.scss'],
    imports: [MatIconModule, MatButtonModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatSelectModule]
})
export class CitySearch {
    private readonly destroyRef = inject(DestroyRef);
    readonly countries = [
        { name: 'United Kingdom', code: 'GB' },
        { name: 'Canada', code: 'CA' },
        { name: 'Germany', code: 'DE' },
        { name: 'France', code: 'FR' },
        { name: 'Australia', code: 'AU' },
        { name: 'New Zealand', code: 'NZ' },
        { name: 'South Africa', code: 'ZA' },
    ]
    protected readonly searchControl = new FormControl('');
    protected readonly countryControl = new FormControl('GB');
    readonly onSearch = output<{ cityName: string, country: string }>();
    readonly onClearSearch = output<void>();

    constructor() {
        this.searchControl.valueChanges.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            takeUntilDestroyed(this.destroyRef)
        )
            .subscribe(value => {
                const query = (value || '').trim();
                if (query) {
                    this.onSearch.emit({
                        cityName: query,
                        country: this.countryControl.value || 'GB'
                    });
                } else {
                    this.onClearSearch.emit();
                }
            });
        this.countryControl.valueChanges.subscribe(value => {
            const cityQuery = (this.searchControl.value || '').trim();
            if (cityQuery) {
                this.onSearch.emit({
                    cityName: cityQuery,
                    country: value || 'GB'
                });
            }
        })
    }
    onClear(): void {
        this.searchControl.setValue('');
        this.countryControl.setValue('GB');
        this.onClearSearch.emit();
    }
}

