import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-site-card',
  templateUrl: './site-card.component.html',
  styleUrls: ['./site-card.component.scss'],
})
export class SiteCardComponent  implements OnInit {

    
  @Input() company: String | undefined;
  @Input() site: String | undefined;
  @Input() startdate: String | undefined;
  @Input() enddate: String | undefined;
  @Input() image: String | undefined;
  constructor() { }

  ngOnInit() {}

}
