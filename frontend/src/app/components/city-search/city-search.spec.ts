import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { CitySearch } from './city-search';

describe('CitySearch', () => {
  let component: CitySearch;
  let fixture: ComponentFixture<CitySearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitySearch],
      providers: [provideZonelessChangeDetection()]
    }).compileComponents();

    fixture = TestBed.createComponent(CitySearch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty search query', () => {
    expect(component['searchControl'].value).toBe('');
  });

  it('should initialize country control with GB', () => {
    expect(component['countryControl'].value).toBe('GB');
  });

  it('should update searchControl when input value changes', (done) => {
    const input = fixture.nativeElement.querySelector('input');
    input.value = 'London';
    input.dispatchEvent(new Event('input'));
    component['searchControl'].setValue('London');

    setTimeout(() => {
      fixture.detectChanges();
      expect(component['searchControl'].value).toBe('London');
      done();
    }, 350); // Wait slightly longer than debounce (300ms)
  });

  it('should debounce search input by 300ms', (done) => {
    const onSearchSpy = spyOn(component.onSearch, 'emit');

    // Type multiple characters quickly
    component['searchControl'].setValue('L');
    setTimeout(() => {
      component['searchControl'].setValue('Lo');
      setTimeout(() => {
        component['searchControl'].setValue('Lon');
        setTimeout(() => {
          component['searchControl'].setValue('Lond');
          
          // Should not have emitted yet (only 100ms passed)
          expect(onSearchSpy).not.toHaveBeenCalled();

          // After 300ms of no changes, should trigger search
          setTimeout(() => {
            expect(onSearchSpy).toHaveBeenCalledTimes(1);
            expect(onSearchSpy).toHaveBeenCalledWith({ cityName: 'Lond', country: 'GB' });
            done();
          }, 350); // Wait for debounce
        }, 100);
      }, 100);
    }, 100);
  });

  it('should emit onSearch with cityName and country when query has content', (done) => {
    const onSearchSpy = spyOn(component.onSearch, 'emit');

    component['countryControl'].setValue('FR');
    component['searchControl'].setValue('Paris');
    
    setTimeout(() => {
      fixture.detectChanges();
      expect(onSearchSpy).toHaveBeenCalledWith({ cityName: 'Paris', country: 'FR' });
      done();
    }, 350);
  });

  it('should not emit onSearch for empty or whitespace-only queries', (done) => {
    const onSearchSpy = spyOn(component.onSearch, 'emit');

    component['searchControl'].setValue('');
    setTimeout(() => {
      expect(onSearchSpy).not.toHaveBeenCalled();

      component['searchControl'].setValue('   ');
      setTimeout(() => {
        expect(onSearchSpy).not.toHaveBeenCalled();
        done();
      }, 350);
    }, 350);
  });

  it('should only trigger search for distinct values', (done) => {
    const onSearchSpy = spyOn(component.onSearch, 'emit');

    component['searchControl'].setValue('Berlin');
    setTimeout(() => {
      expect(onSearchSpy).toHaveBeenCalledTimes(1);

      // Same value should not trigger again
      component['searchControl'].setValue('Berlin');
      setTimeout(() => {
        expect(onSearchSpy).toHaveBeenCalledTimes(1);

        // Different value should trigger
        component['searchControl'].setValue('Munich');
        setTimeout(() => {
          expect(onSearchSpy).toHaveBeenCalledTimes(2);
          done();
        }, 350);
      }, 350);
    }, 350);
  });

  it('should clear search control, reset country, and emit onClearSearch when onClear is called', () => {
    const onClearSearchSpy = spyOn(component.onClearSearch, 'emit');
    component['searchControl'].setValue('Tokyo');
    component['countryControl'].setValue('DE');

    component.onClear();

    expect(component['searchControl'].value).toBe('');
    expect(component['countryControl'].value).toBe('GB');
    expect(onClearSearchSpy).toHaveBeenCalled();
  });

  it('should render clear button when searchControl has value', () => {
    component['searchControl'].setValue('Madrid');
    fixture.detectChanges();

    const clearButton = fixture.nativeElement.querySelector('button[aria-label="Clear"]');
    expect(clearButton).toBeTruthy();
  });

  it('should not render clear button when searchControl is empty', () => {
    component['searchControl'].setValue('');
    fixture.detectChanges();

    const clearButton = fixture.nativeElement.querySelector('button[aria-label="Clear"]');
    expect(clearButton).toBeFalsy();
  });

  it('should call onClear when clear button is clicked', () => {
    component['searchControl'].setValue('Vienna');
    fixture.detectChanges();

    const clearButton = fixture.nativeElement.querySelector('button[aria-label="Clear"]');
    const onClearSpy = spyOn(component, 'onClear');

    clearButton.click();
    expect(onClearSpy).toHaveBeenCalled();
  });

  it('should render input field with correct label', () => {
    const label = fixture.nativeElement.querySelector('mat-label');
    expect(label?.textContent?.trim()).toBe('Search city weather');
  });

  it('should bind formControl to input element', () => {
    const input = fixture.nativeElement.querySelector('input');
    expect(input).toBeTruthy();
    expect(input?.getAttribute('type')).toBe('text');
  });

  it('should render country select dropdown', () => {
    const select = fixture.nativeElement.querySelector('mat-select');
    expect(select).toBeTruthy();
  });

  it('should emit search with new country when country changes and city has value', (done) => {
    const onSearchSpy = spyOn(component.onSearch, 'emit');
    component['searchControl'].setValue('Berlin');

    // Wait for debounce, then change country
    setTimeout(() => {
      onSearchSpy.calls.reset();
      component['countryControl'].setValue('DE');

      expect(onSearchSpy).toHaveBeenCalledWith({ cityName: 'Berlin', country: 'DE' });
      done();
    }, 350);
  });

  it('should not emit search when country changes but city is empty', () => {
    const onSearchSpy = spyOn(component.onSearch, 'emit');
    component['searchControl'].setValue('');

    component['countryControl'].setValue('DE');

    expect(onSearchSpy).not.toHaveBeenCalled();
  });
});
