import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { Phase } from '../../store/settings';

@Component({
  selector: 'app-typeahead',
  templateUrl: './typeahead.component.html',
  styleUrls: ['./typeahead.component.scss'],
})
export class TypeaheadComponent implements OnChanges {
  @Input() public dataSource: any;
  @Input() public loading: Phase;
  @Input() public bindValue: string;
  @Input() public searchField: string;
  @Input() public placeholder: string;
  @Input() public value: any;

  @Output() public search = new EventEmitter<string>();
  @Output() public itemSelected = new EventEmitter<any>();

  public Phase = Phase;
  public searchValue: string;
  public selectedOption: any;
  public valueSelected: boolean = false;

  constructor(
    protected translateService: TranslateService,
    public cd: ChangeDetectorRef,
  ) {
  }

  public ngOnChanges(changes: SimpleChanges): void {
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
