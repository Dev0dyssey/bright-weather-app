import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
    selector: 'app-city-search',
    templateUrl: './city-search.html',
    styleUrls: ['./city-search.scss'],
    imports: [MatIconModule, MatButtonModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule]
})
export class CitySearch {
    protected readonly searchControl = new FormControl('');

    constructor() {
        this.searchControl.valueChanges.pipe(
            debounceTime(300),
            distinctUntilChanged()
        )
            .subscribe(value => {
                const query = value || '';
                if (query.trim()) {
                    this.performSearch(query);
                }
            });
    }

    private performSearch(query: string) {
        console.log('Searching for:', query);
    }

    onClear(): void {
        this.searchControl.setValue('');
    }
}

