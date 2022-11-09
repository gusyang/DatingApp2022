import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { MemberEditorComponent } from '../members/member-editor/member-editor.component';

@Injectable({
  providedIn: 'root'
})
export class PreventUnsaveChangesGuard implements CanDeactivate<unknown> {
  canDeactivate(component: MemberEditorComponent): boolean  {
    if(component.editForm.dirty){
      return confirm('Are you sure you want to continue? Any unsaved changes will be lost!')
    }
    return true;
  }
 
  
}
