import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { User } from 'src/app/_models/user';
import { Member } from 'src/app/_modules/member';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-editor',
  templateUrl: './member-editor.component.html',
  styleUrls: ['./member-editor.component.css']
})
export class MemberEditorComponent implements OnInit {
    @ViewChild('editForm') editForm: NgForm;
    member:Member;
    user:User;
    @HostListener('window:beforeunload',['$event']) unloadNotification($event:any){
      if(this.editForm.dirty){
        $event.returnValue = true;
      }
    }

  constructor(private memberService:MembersService, 
    private accountService:AccountService, private toastrService: ToastrService) { 
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
  }

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember(){
    this.memberService.getMember(this.user.username).subscribe(member =>  {this.member = member;});
  }
  updateMember(){
    this.memberService.updateMember(this.member).subscribe(()=>{
      this.toastrService.success('Member Update Success!');
      this.editForm.reset(this.member);
    });
  }
}
