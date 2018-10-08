import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

const routes: Routes = [
    { path: "", redirectTo: "/todo-detail", pathMatch: "full" },
    { path: "todo-detail", loadChildren: "./todo-detail/todo-detail.module#TodoDetailModule" },
    { path: "todo-list", loadChildren: "./todo-list/todo-list.module#TodoListModule" }
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
