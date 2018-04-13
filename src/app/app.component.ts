import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  lat = 19.3906797;
  lng = -99.2840397;
  zoom = 5;
  iconRed = '../assets/dot_red.png';
  iconGreen = '../assets/dot_green.png';

  points;
  pointsArr;

  locations;
  locationsArr = [];

  toggled = false;
  url = 'https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyBnXl-DDwNzfujUTk509A_mJG-EDD1iHO8&address=';

  constructor(private http: HttpClient) {
    this.getJSON();
    this.getReport();
  }

  getJSON() {
    this.http.get('../assets/locations/locations_filtered.json')
      .subscribe((res: any) => {
        this.pointsArr = res;
        this.points = res;
      });
  }

  getReport() {
    this.http.get('../assets/locations/reportito.csv', {responseType: 'text'})
      .toPromise()
      .then((res: any) => {
        const arr = res.split('\n');
        for (let i = 0; i < arr.length; i++) {
          try {
            const row = arr[i].split(',');
            console.log(row)
            const loc = row[2].replace(/"/, '');
            this.getLocation(loc);
          } catch (e) {
          }
        }
      });
  }

  getLocation(loc) {
    if (loc === '') {}
    const url = this.url + loc;
    this.http.get(url)
      .toPromise()
      .then(r => {
        const res: any = r;
        console.log(res.results[0]);
        const position = {
          lat: res.results[0].geometry.location.lat,
          lng: res.results[0].geometry.location.lng
        };
        this.locationsArr.push(position);
      });
  }

  onToggle() {
    if (this.toggled) {
      this.toggled = false;
      this.points = this.pointsArr;
    } else {
      this.toggled = true;
      this.points = [];
    }
  }
}
