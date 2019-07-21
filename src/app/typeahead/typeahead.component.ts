import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { Phase } from '../store/settings';

@Component({
  selector: 'app-typeahead',
  templateUrl: './typeahead.component.html',
  styleUrls: ['./typeahead.component.scss'],
})
export class TypeaheadComponent implements OnChanges {
  @Input() dataSource$: Observable<any>;
  @Input() loading: Phase;
  @Input() bindValue: string;
  @Input() searchField: string;
  @Input() placeholder: string;
  @Input() value: any;

  @Output() search = new EventEmitter<string>();
  @Output() itemSelected = new EventEmitter<any>();

  public Phase = Phase;
  public searchValue: string;
  public selectedOption: any;
  public valueSelected: boolean = false;

  constructor(
    protected translateService: TranslateService,
    public cd: ChangeDetectorRef,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']) {
      this.selectedOption = {
        [this.searchField]: changes.value.currentValue
      };
      this.searchValue = changes.value.currentValue;
    }
  }

  public selectValue(option: any) {
    this.selectedOption = option;
    this.searchValue = option[this.searchField];
    this.valueSelected = true;
    this.itemSelected.emit(this.selectedOption);
  }

  public searchTermChanged() {
    this.selectedOption = undefined;
    this.valueSelected = false;
    this.search.emit(this.searchValue);
    this.itemSelected.emit(undefined);
  }

  public get isEmpty() {
    return !this.searchValue;
  }
}
