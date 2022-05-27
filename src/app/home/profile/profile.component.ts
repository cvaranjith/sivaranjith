import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  days:any;
  mySidenav:any;
 
  constructor() {
    var day = new Date();
    var hr = day.getHours();
    if (hr >= 0 && hr < 12) {
      this.days="Good Morning!";
  } else if (hr == 12) {
    this.days= "Good Noon!";
  } else if (hr >= 12 && hr <= 17) {
    this.days="Good Afternoon!";
  } else {
    this.days="Good Evening!";
  }
   }

  Skill :any[] = [
    {
      "name":'HTML',
      "datapre": '90%'
    },{
      "name":'CSS',
      "datapre": '78%'
    },
    {
      "name":'JS',
      "datapre": '75%'
    },
    {
      "name":'JQuery',
      "datapre": '66%'
    },
    {
      "name":'AJAX',
      "datapre": '66%'
    },
    {
      "name":'Wordpress',
      "datapre": '60%'
    },
    {
      "name":'PHP',
      "datapre": '82%'
    },
    {
      "name":'Python',
      "datapre": '60%'
    },
    {
      "name":'MySQL',
      "datapre": '80%'
    },
    {
      "name":'MongoDB',
      "datapre": '55%'
    },
    {
      "name":'Docker',
      "datapre": '55%'
    },
  ];

  ngOnInit(): void {
   
        
}




}
