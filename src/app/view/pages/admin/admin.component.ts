import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { AdminSidebarComponent } from '../../layout/admin-side-bar/admin-side-bar.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterOutlet,AdminSidebarComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent implements OnInit, OnDestroy {
  pageTitle: string = '';
  private subscription: Subscription = new Subscription();

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.subscription.add(
      this.router.events
        .pipe(
          filter((event) => event instanceof NavigationEnd),
          map(() => this.getRouteData())
        )
        .subscribe((data) => {
          this.pageTitle = data?.title || 'Admin Dashboard';
        })
    );

    // Set initial title
    this.pageTitle = this.getRouteData()?.title || 'Admin Dashboard';
  }

  private getRouteData(): any {
    let child = this.activatedRoute.firstChild;
    while (child) {
      if (child.snapshot.data && Object.keys(child.snapshot.data).length > 0) {
        return child.snapshot.data;
      }
      child = child.firstChild;
    }
    return null;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
