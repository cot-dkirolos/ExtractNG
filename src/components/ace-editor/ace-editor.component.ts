import { IAceEditorOption } from './../../model/interfaces';
import { AceEditorDirective } from 'ng2-ace-editor';
import { Component, Input, Output, EventEmitter,ViewChild, ElementRef, forwardRef, AfterViewInit, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

declare var ace: any;

@Component({
   selector: 'app-ace-editor',
  templateUrl: 'ace-editor.component.html',
  styleUrls: ['ace-editor.component.scss']
})
export class AceEditorComponent implements AfterViewInit {
 
  content = "SELECT * FROM tabs;";
  contentAutoUpdate = "SELECT * FROM autoUpdate;";
  myCode = "SELECT * FROM tabs;";
  @ViewChild('highlight') highlight;
  @ViewChild('editorInfinity') editorInfinity;

  onRuleChange(e) {
    console.log(e)
  }

  ngAfterViewInit() {
    var Range = ace.require('ace/range').Range

    this.highlight.getEditor().session.addMarker(
      new Range(0, 0, 2, 1), "myMarker", "fullLine"
    );

  }
}
