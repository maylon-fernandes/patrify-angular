import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BackendService } from 'src/app/service/backend.service';

@Component({
  selector: 'app-userpage',
  templateUrl: './userpage.component.html',
  styleUrls: ['./userpage.component.css']
})
export class UserpageComponent implements OnInit {

  constructor(private http: HttpClient,
    private BackendService: BackendService
  ) { }

  ngOnInit(): void { }
}