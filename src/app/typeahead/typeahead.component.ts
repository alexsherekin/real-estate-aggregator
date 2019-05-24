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
  @Input() placeholder: string;
  @Input() value: string;

  @Output() search = new EventEmitter<string>();
  @Output() select = new EventEmitter<any>();

  public searchValue: string;
  public selectedOption: string;

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
      this.selectedOption = changes.value.currentValue;
      this.searchValue = changes.value.currentValue;
    }
  }

  public selectValue(option: any) {
    this.searchValue = this.selectedOption = option[this.bindValue];
    this.select.emit(this.selectedOption);
  }

  public searchTermChanged() {
    this.selectedOption = undefined;
    this.search.emit(this.searchValue);
    this.select.emit(this.selectedOption);
  }
}
