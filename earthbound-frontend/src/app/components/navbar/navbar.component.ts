import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  searchQuery: string = '';
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  userName: string = '';
  cartItemCount: number = 0;
  wishlistCount: number = 0;

  constructor(
    private authService: AuthService, 
    private themeService: ThemeService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private router: Router
  ) { }

  ngOnInit() {
    this.authService.currentUser.subscribe(user => {
      this.isLoggedIn = !!user;
      this.isAdmin = this.authService.isAdmin();
      this.userName = user?.username || user?.name || '';
    });

    this.cartService.cart$.subscribe(items => {
      this.cartItemCount = items.length;
    });

    this.wishlistService.wishlist$.subscribe(items => {
      this.wishlistCount = items.length;
    });
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  isDarkMode() {
    return this.themeService.isDarkMode();
  }

  onSearchInput(event: any) {
    this.searchQuery = event.target.value;
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/shop'], { queryParams: { search: this.searchQuery } });
    }
  }

  startVoiceSearch() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.start();
      recognition.onresult = (event: any) => {
        this.searchQuery = event.results[0][0].transcript;
        this.onSearch();
      };
    } else {
      alert('Voice search is not supported in this browser.');
    }
  }

  onLogout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.isAdmin = false;
  }
}
