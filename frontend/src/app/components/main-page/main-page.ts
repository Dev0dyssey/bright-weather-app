import { Component } from '@angular/core';
import { CitySearch } from '../city-search/city-search';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.html',
    styleUrls: ['./main-page.scss'],
    imports: [CitySearch]
})
export class MainPage {
}