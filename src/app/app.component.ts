import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
 
  constructor(private breakpointObserver: BreakpointObserver) {}

  showMenu: boolean = true;
  isSmallScreen: boolean = false;


  public ngOnInit(): void {
    this.setResponsive();
  }

  private setResponsive() {
    this.breakpointObserver
      .observe(['(max-width: 1350px)'])
      .subscribe((result) => {
        this.isSmallScreen = result.matches;
        this.showMenu = !result.matches;
      });
  }
}
