import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable, Subject } from 'rxjs/Rx';

// TODO inject service

@Injectable()
export class PatientResourceService {

  public v: string = 'custom:(uuid,display,' +
    'identifiers:(identifier,uuid,preferred,location:(uuid,name),' +
    'identifierType:(uuid,name,format,formatDescription,validator)),' +
    'person:(uuid,display,gender,birthdate,dead,age,deathDate,birthdateEstimated,' +
    'causeOfDeath,preferredName:(uuid,preferred,givenName,middleName,familyName),'
    + 'attributes,preferredAddress:(uuid,preferred,address1,address2,cityVillage,' +
    'stateProvince,country,postalCode,countyDistrict,address3,address4,address5,address6)))';

  constructor(protected http: Http, protected appSettingsService: AppSettingsService) {
  }

  public getUrl(): string {

    return this.appSettingsService.getOpenmrsRestbaseurl().trim() + 'patient';
  }

  public searchPatient(searchText: string, cached: boolean = false, v: string = null):
   Observable<any> {

    let url = this.getUrl();
    let params: URLSearchParams = new URLSearchParams();

    params.set('q', searchText);

    params.set('v', (v && v.length > 0) ? v : this.v);

    return this.http.get(url, {
      search: params
    })
      .map((response: Response) => {
        return response.json().results;
      });
  }

  public getPatientByUuid(uuid: string, cached: boolean = false, v: string = null):
  Observable<any> {

    let url = this.getUrl();
    url += '/' + uuid;

    let params: URLSearchParams = new URLSearchParams();

    params.set('v', (v && v.length > 0) ? v : this.v);

    return this.http.get(url, {
      search: params
    }).map((response: Response) => {
      return response.json();
    });
  }
  public saveUpdatePatientIdentifier(uuid, identifierUuid, payload): Observable<any> {
    if (!payload || !uuid) {
      return null;
    }
    let url = this.getUrl() + '/' + uuid + '/' + 'identifier' + '/' + identifierUuid;
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(url, JSON.stringify(payload), options)
      .map((response: Response) => {
        return response.json().patient;
      });
  }
}
