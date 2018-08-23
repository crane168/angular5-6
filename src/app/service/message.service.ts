import {Injectable, NgZone} from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable ,  Subject } from 'rxjs';
import {Context} from "./context.service";
import {HttpClient} from "@angular/common/http";
import {HttpService} from "./http.service";

@Injectable()
export class MessageService extends HttpService {
    private subject = new Subject<any>();
    private keepAfterNavigationChange = false;

    constructor(protected context: Context, protected http: HttpClient,public zone: NgZone,private router: Router) {
        super(context,http);
        router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                if (this.keepAfterNavigationChange) {
                    // only keep for a single location change
                    this.keepAfterNavigationChange = false;
                } else {
                    // clear alert
                    this.subject.next();
                }
            }
        });
    }


    success(message: string, keepAfterNavigationChange = false) {
        this.keepAfterNavigationChange = keepAfterNavigationChange;
        this.subject.next({ type: 'success', text: message });
    }

    error(message: string, keepAfterNavigationChange = false) {
        this.keepAfterNavigationChange = keepAfterNavigationChange;
        this.subject.next({ type: 'error', text: message });
    }

    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }
}