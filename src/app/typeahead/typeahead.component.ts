import { Component, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-typeahead',
  templateUrl: './typeahead.component.html',
  styleUrls: ['./typeahead.component.scss'],
})
export class TypeaheadComponent implements OnChanges {
  @Input() dataSource$: Observable<any>;
  @Input() bindValue: string;
  @Input() searchField: string;
  @Input() placeholder: string;
  @Input() value: any;

  @Output() search = new EventEmitter<string>();
  @Output() itemSelected = new EventEmitter<any>();

  public searchValue: string;
  public selectedOption: any;

  public get showList() {
    return !this.selectedOption && (
      !!this.searchValue && this.searchValue.length > 0
    );
  };

  constructor(
    protected translateService: TranslateService,
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
    this.itemSelected.emit(this.selectedOption);
  }

  public searchTermChanged() {
    this.selectedOption = undefined;
    this.search.emit(this.searchValue);
    this.itemSelected.emit(this.selectedOption);
  }
}
