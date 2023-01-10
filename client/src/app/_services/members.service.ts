import { JsonPipe } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { PaginatedResult } from '../_models/Pagination';
import { User } from '../_models/user';
import { Member } from '../_modules/member';
import { AccountService } from './account.service';
import { UserParams } from './userParams';

/* const httpOptions = {
  headers: new HttpHeaders({
    Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token
  })
}; */

@Injectable({
  providedIn: 'root'
})

export class MembersService {
  baseUrl = environment.apiUrl;
  members:Member[] = [];
  memberCache = new Map();
  user:User;
  userParams:UserParams;
  
  constructor(private http:HttpClient,private acctService:AccountService) {
    this.acctService.currentUser$.pipe(take(1)).subscribe({
      next: user=>{
        if(user){
          this.userParams = new UserParams(user);
          this.user = user;        
        }
      }
    });
   }

   getUserParams(){
    return this.userParams;
   }

   setUserParams(params:UserParams){
    this.userParams = params;
   }
   resetUserParams(){
    if(this.user){
      this.userParams = new UserParams(this.user);
      return this.userParams;
    }
   }
  getMembers(userParams:UserParams){
    /* old version
    if(this.members.length > 0) return of(this.members);
    return this.http.get<Member[]>(this.baseUrl + 'users').pipe(
      map(members =>{
        this.members = members;
        return members;
      })
    ); */
    const response = this.memberCache.get(Object.values(userParams).join('-'));
    if (response) return of(response);
    let params = this.getPaginationHeaders(userParams.pageNumber, userParams.pageSize);
    params = params.append('minAge',userParams.minAge);
    params = params.append('maxAge',userParams.maxAge);
    params = params.append('gender',userParams.gender);
    params = params.append('orderBy',userParams.orderBy);

    return this.getPaginationResult<Member[]>(this.baseUrl + 'users',params).pipe(
      map(response => {
        this.memberCache.set(Object.values(userParams).join('-'),response);
        return response;
      })
    );

  }
  
  setMainPhoto(photoId: number) {
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + photoId, {});
  }

  deletePhoto(photoId: number) {
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId);
  }
  getMember(username:string){
    //const member = this.members.find(m => m.username == username);
    const member = [...this.memberCache.values()]
      .reduce((arr,elem) => arr.concat(elem.result),[])
      .find((member:Member) => member.username === username);
    if (member !== undefined) return of(member);
    return this.http.get<Member>(this.baseUrl + 'users/' + username);
  }
  updateMember(member:Member){
    return this.http.put(this.baseUrl + 'users/',member).pipe(
      map(() =>{
        const index = this.members.indexOf(member);
        this.members[index] = member;
      })
    );
  }

  private getPaginationResult<T>(url:string, params: HttpParams) {
    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();
    return this.http.get<T>(url, { observe: 'response', params }).pipe(
      map(response => {
        if (response.body) {
          paginatedResult.result = response.body;
        }
        const pagination = response.headers.get("Pagination");
        if (pagination) {
          paginatedResult.pagination = JSON.parse(pagination);
        }
        return paginatedResult;
      })
    );
  }

  private getPaginationHeaders(pageNumber:number, pageSize:number) {
    let params = new HttpParams();    
    params = params.append('pageNumber', pageNumber);
    params = params.append('pageSize', pageSize);   
    return params;
  }

}
