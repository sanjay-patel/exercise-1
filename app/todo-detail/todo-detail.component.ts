import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import * as app from "application";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { PageRoute, RouterExtensions } from "nativescript-angular/router";
import { switchMap } from "rxjs/operators";
import { RadDataFormComponent } from "nativescript-ui-dataform/angular";
import { alert } from "tns-core-modules/ui/dialogs";
import { TodoService } from '../services/todo.service';
import { DataItem } from "./dataItem";
import * as Toast from "nativescript-toast";

@Component({
    selector: "todo-detail",
    moduleId: module.id,
    templateUrl: "./todo-detail.component.html"
})
export class TodoDetailComponent implements OnInit, AfterViewInit {
    public todoId: string;
    private _dataItems: DataItem;
    private _text: string;
    public todoDetail = <DataItem>{};
    @ViewChild('dataform') myCustomDataFormComp: RadDataFormComponent;
    
    constructor( private _pageRoute: PageRoute, private _routerExtensions: RouterExtensions, private todoService: TodoService ) {
        // Use the component constructor to inject providers.
    }

    ngOnInit(): void {
        
        this._pageRoute.activatedRoute.pipe(switchMap(activatedRoute => activatedRoute.queryParams)).forEach((params) => { 
            this.todoId = params.id;
            if(this.todoId == undefined) {
                this._dataItems = new DataItem();
            } else {
                this.loadTodoDetailData(this.todoId); 
            }
        });        
    }
    
    ngAfterViewInit() {}
    
    get dataItems(): DataItem {
        return this._dataItems;
    }
    get text(): string {
        return this._text;
    }

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }
    
    gotoListPage(): void {
        this._routerExtensions.navigate(["/todo-list"]);
    }
    
    loadTodoDetailData(id) {
        console.log(id);
        this.todoService.fetchByID(this.todoId).then((res) => {
            this._dataItems = res.data;                
        });
    }
    
    onTap(): void {
        let isValid = true;
       
        var firstname = this.myCustomDataFormComp.dataForm.getPropertyByName("firstname");
        var lastname = this.myCustomDataFormComp.dataForm.getPropertyByName("lastname");
        var organization = this.myCustomDataFormComp.dataForm.getPropertyByName("organization");
        console.log(firstname.valueCandidate.toLowerCase());
        if (firstname.valueCandidate.toLowerCase() == "") {
            this.myCustomDataFormComp.dataForm.notifyValidated("firstname", false);
            firstname.errorMessage = "Please enter a firstname.";
            isValid = false;
        } else {
            this.myCustomDataFormComp.dataForm.notifyValidated("firstname", true);
        }

        if (lastname.valueCandidate.toLowerCase() == "") {
            this.myCustomDataFormComp.dataForm.notifyValidated("lastname", false);
            lastname.errorMessage = "Please enter a lastname.";
            isValid = false;
        } else {
            this.myCustomDataFormComp.dataForm.notifyValidated("lastname", true);
        }
        
        if (organization.valueCandidate.toLowerCase() == "") {
            this.myCustomDataFormComp.dataForm.notifyValidated("organization", false);
            organization.errorMessage = "Please enter a organization.";
            isValid = false;
        } else {
            this.myCustomDataFormComp.dataForm.notifyValidated("organization", true);
        }

        this._text = null;

        if (!isValid) {
            this._text = "filed does not allowed blank.";
        } else {
            this._text = "";
            this.myCustomDataFormComp.dataForm.commitAll();
            
            if(this.todoId == undefined) {
                this.todoService.insert(this._dataItems).then((res) => {
                    console.log(res);
                    if(res.success) {
                        this._routerExtensions.navigate(["/todo-list"]);
                        Toast.makeText(res['message']).show();
                    }
                });
            } else {
                this.todoService.update(this.todoId, this._dataItems).then((res) => {
                    console.log(res);
                    if(res.success) {
                        this._routerExtensions.navigate(["/todo-list"]);
                        Toast.makeText(res['message']).show();
                    }
                });
            }
        }
        
    }
}
