import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app/auth/services/auth.service';
import { JsonEditorService } from '@app/services/json-editor.service';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  openSideBarMenu = false;
  displayBarMenu = false;
  menu: MenuItem[] = [
    {
      label: 'Data',
      icon: 'fa fa-database',
      items: [
        
      ]
    },
    {
      label: 'Run Cypress',
      icon: 'fa-solid fa-gear',
      //url: 'runCypress',
      command: () => { this.router.navigate(['runCypress']); this.openSideBarMenu = false;}
      //command: (event: any) => this.open(event.item)
    },
    {
      label: 'Statistical Details',
      icon: 'fa-solid fa-chart-simple',
      //url: 'runCypress',
      command: () => { this.router.navigate(['statistical-details']); this.openSideBarMenu = false;}
      //command: (event: any) => this.open(event.item)
    }
  ];
  Roles: any[] = []
  showMenu: boolean = false;
  constructor(private service: JsonEditorService, private router: Router, private authService: AuthService) { }


  ngOnInit() {
    this.getMenu()
  }
  goToHome() {
    this.router.navigate(['/']) 
  }
  getMenu() {
    let count = 0;
    this.service.getFolders().subscribe((folders: any) => {
      folders.forEach((element: any) => {
        this.service.getListFilesName(element).subscribe((data: any) => {
          count++;
          this.menu[0].items?.push({
            label: element.replace(/-/g, " "),
            icon: 'fa-solid fa-folder-open',
            items: data.map((item: any) => {
              return {
                label: item.replace(/-/g, " ").replace(".json", " "),
                icon: 'fa-solid fa-file',
                //url: [`editor/${element}/${item}`],
                disabled:false,
                command: () => { this.router.navigate([`editor`,`${element}`,`${item}`]); this.openSideBarMenu = false;}
                //command: (event: any) => this.open(event.item)
              }
            })
          })
          if (count === folders.length) this.showMenu = true;
        })

      });
    })

  }
  open(menu: any) {
    menu.url && Array.isArray(menu.url)  ? this.router.navigate(menu.url) : this.router.navigate([menu.url])
  }

  /**
   * Open the side bar region
   */
  openSidebar() {
    this.openSideBarMenu = true;
  }
  activeMenu(event: any) {
    let node;
    if (event.target.tagName === "A") {
      node = event.target;
    } else {
      node = event.target.parentNode;
    }
    let menuitem = null;
    menuitem = document.getElementsByClassName("ui-menuitem-link");
    for (let i = 0; i < menuitem.length; i++) {
      menuitem[i].classList.remove("menuitem-active");
    }
    node.classList.add("menuitem-active")
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }
}
export interface Menu {
  label: string;
  roles?: string[];
  styleName?: string;
  icon?: string;
  items?: Menu[];
  link?: string[];
  command?: any;
}