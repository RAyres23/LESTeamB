import { Component, OnInit } from '@angular/core';

import { TalkService } from '../../../services/api/talk.service';
import { Talk } from '../../../services/api/talk';
import { UserService } from "../../../services/auth/user.service";

declare var Materialize: any;

@Component({
    selector: 'db-home-employee-cmp',
    templateUrl: './employee.component.html',
})

export class EmployeeComponent implements OnInit {

    public talksApproved: Talk[] = null;
    public talksLive: Talk[] = null;

    constructor(private auth: UserService, private talkService: TalkService) { }

    /**
     * When view is initializing, let's fetch the talks (only happens once)
     */
    ngOnInit() {
        let send = { state : 3 };
        this.talkService.getPrivate("talks/all", this.auth.getToken(), send).subscribe(
            data => {
                this.talksApproved = data;
                let send = { state : 5 };
                this.talkService.getPrivate("talks/all", this.auth.getToken(), send).subscribe(
                    data => {
                        this.talksLive = data;
                    },
                    err => {
                        console.log("Error: " + err);
                    });
            },
            err => {
                console.log("Error: " + err);
            });
    }

    /**
     * Helper function to parse a date string into date object
     * @param date
     * @returns {Date}
     */
    public parse(date: string) {
        return new Date(Date.parse(date));
    }

    public submitRoom(id : number, room : string) {
        if(!room)
            return;
        var data = {};
        data['room'] = room;
        this.talkService.put("talks/" + id + "/SetRoom", this.auth.getToken(), data).subscribe(
            data => {
                Materialize.toast('Success! The room was changed.', 4000);
            },
            err => {
                console.log("Error: " + err);
                Materialize.toast('Error! Not possible to change the room.', 4000);
            });
    }

    /**
     * Helper function to update the room in the database for a certain talk (id)
     * @param id
     * @param room
     */
    public changeState(id : number, room : string) {
        if(!room) {
            Materialize.toast('Error! There is no room set.', 4000);
            return;
        }
        var data = {};
        data['state'] = 4;
        this.talkService.put("talks/" + id + "/SetState", this.auth.getToken(), data).subscribe(
            data => {
                Materialize.toast('Success! The talk was forwarded.', 4000);
                this.removeTalk(id);
            },
            err => {
                console.log("Error: " + err);
                Materialize.toast('Error! The talk was not forwarded.', 4000);
            });
    }

    /**
     * Helper function that bundles everything needed to remove a talk from the View, which means the table
     * It doesn't include removing from the database
     * @param id
     */
    removeTalk(id : number) {
        for(let i=0; i<this.talksApproved.length; i++) {
            if(this.talksApproved[i]['talkID'] == id) {
                this.talksApproved.splice(i, 1);
                return;
            }
        }
    }
}
