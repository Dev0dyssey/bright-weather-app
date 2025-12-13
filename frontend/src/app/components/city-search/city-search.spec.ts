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
    expect(component['searchQuery']()).toBe('');
    expect(component['searchControl'].value).toBe('');
  });

  it('should update searchQuery signal when input value changes', (done) => {
    const input = fixture.nativeElement.querySelector('input');
    input.value = 'London';
    input.dispatchEvent(new Event('input'));
    component['searchControl'].setValue('London');

    setTimeout(() => {
      fixture.detectChanges();
      expect(component['searchQuery']()).toBe('London');
      done();
    }, 350); // Wait slightly longer than debounce (300ms)
  });

  it('should debounce search input by 300ms', (done) => {
    const input = fixture.nativeElement.querySelector('input');
    const performSearchSpy = spyOn(component as any, 'performSearch');

    // Type multiple characters quickly
    component['searchControl'].setValue('L');
    setTimeout(() => {
      component['searchControl'].setValue('Lo');
      setTimeout(() => {
        component['searchControl'].setValue('Lon');
        setTimeout(() => {
          component['searchControl'].setValue('Lond');
          
          // Should not have called performSearch yet (only 100ms passed)
          expect(performSearchSpy).not.toHaveBeenCalled();

          // After 300ms of no changes, should trigger search
          setTimeout(() => {
            expect(performSearchSpy).toHaveBeenCalledTimes(1);
            expect(performSearchSpy).toHaveBeenCalledWith('Lond');
            done();
          }, 350); // Wait for debounce
        }, 100);
      }, 100);
    }, 100);
  });

  it('should call performSearch when query has content', (done) => {
    const performSearchSpy = spyOn(component as any, 'performSearch');

    component['searchControl'].setValue('Paris');
    
    setTimeout(() => {
      fixture.detectChanges();
      expect(performSearchSpy).toHaveBeenCalledWith('Paris');
      done();
    }, 350);
  });

  it('should not call performSearch for empty or whitespace-only queries', (done) => {
    const performSearchSpy = spyOn(component as any, 'performSearch');

    component['searchControl'].setValue('');
    setTimeout(() => {
      expect(performSearchSpy).not.toHaveBeenCalled();

      component['searchControl'].setValue('   ');
      setTimeout(() => {
        expect(performSearchSpy).not.toHaveBeenCalled();
        done();
      }, 350);
    }, 350);
  });

  it('should only trigger search for distinct values', (done) => {
    const performSearchSpy = spyOn(component as any, 'performSearch');

    component['searchControl'].setValue('Berlin');
    setTimeout(() => {
      expect(performSearchSpy).toHaveBeenCalledTimes(1);

      // Same value should not trigger again
      component['searchControl'].setValue('Berlin');
      setTimeout(() => {
        expect(performSearchSpy).toHaveBeenCalledTimes(1);

        // Different value should trigger
        component['searchControl'].setValue('Munich');
        setTimeout(() => {
          expect(performSearchSpy).toHaveBeenCalledTimes(2);
          done();
        }, 350);
      }, 350);
    }, 350);
  });

  it('should clear search query and control when onClear is called', () => {
    component['searchControl'].setValue('Tokyo');
    component['searchQuery'].set('Tokyo');

    component.onClear();

    expect(component['searchControl'].value).toBe('');
    expect(component['searchQuery']()).toBe('');
  });

  it('should render clear button when searchQuery has value', () => {
    component['searchQuery'].set('Madrid');
    fixture.detectChanges();

    const clearButton = fixture.nativeElement.querySelector('button[aria-label="Clear"]');
    expect(clearButton).toBeTruthy();
  });

  it('should not render clear button when searchQuery is empty', () => {
    component['searchQuery'].set('');
    fixture.detectChanges();

    const clearButton = fixture.nativeElement.querySelector('button[aria-label="Clear"]');
    expect(clearButton).toBeFalsy();
  });

  it('should call onClear when clear button is clicked', () => {
    component['searchQuery'].set('Vienna');
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
});

