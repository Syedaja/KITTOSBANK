import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BankserviceService {
  userID:any;
  // for spinner loading on the loginpage
  private loginRequestPending$ = new BehaviorSubject<boolean>(false);

  

  private apiUrl = 'http://localhost:3000/';
  private apiUrl1 = 'http://localhost:3000/api/alldata';
  private apiUrl2 = 'http://localhost:3000/api/transaction_history1';

  constructor(private http: HttpClient,private router:Router) {}
   getLoginRequestPending$() {
    return this.loginRequestPending$.asObservable();
  }
  deposit(userId: number, amount: number): Observable<any> {
    const body = { userId, amount };
    return this.http.post(`${this.apiUrl}deposit`, body);
  }

  withdraw(userId: number, amount: number): Observable<any> {
    const body = { userId, amount };
    return this.http.post(`${this.apiUrl}withdraw`, body);
  }
  getTransactionHistory(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/transaction-history1/${userId}`);
  }
  //API FIREBASE START
  isAuthenticated():boolean{
    if (sessionStorage.getItem('token')!==null) {
        return true;
    }
    return false;
  }
  isAuthenticatedSuc():boolean{
    if (sessionStorage.getItem('token')!==null) {
        return true;
    }
    return false;
  }

  canAccess(){
    if (!this.isAuthenticated()) {
        //redirect to login
        this.router.navigate(['/login']);
    }
  }
  canAuthenticate(){
    if (this.isAuthenticated()) {
      //redirect to dashboard
      this.router.navigate(['/dashboard']);
    }
  }
  // Register Verification
  RegistercanAuthenticate(){
  if(this.isAuthenticatedSuc()){
    this.router.navigate(['/registerSuccess'])
  }
  }

  register(name:string,email:string,password:string){
    //send data to register api (firebase)
   return this.http
    .post<{idToken:string}>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDHGO5fEozZx8Z03kXdyhxzki23kTXRee4',
        {displayName:name,email,password}
    );
}

  storeToken(token:string){
      sessionStorage.setItem('token',token);
  }

  login(email:string,password:string){
    this.userEmail = email;
    console.log(this.userEmail);
    this.loginRequestPending$.next(true);
    //send data to login api (firebase)
      return this.http
      .post<{idToken:string}>(
          'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDHGO5fEozZx8Z03kXdyhxzki23kTXRee4',
            {email,password}
         
            
      );
  }

  detail(){
    let token = sessionStorage.getItem('token');

    return this.http.post<{users:Array<{localId:string,displayName:string}>}>(
        'https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=[API_KEY]',
        {idToken:token}
    );
  }

  removeToken(){
    sessionStorage.removeItem('token');
  }
   //create data mysql table
   registerUser(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}register`, { data: userData });
  }
  // Random Acc number
  storeAccountNumber(accountNumber: number): Observable<any> {
    return this.http.post(`${this.apiUrl}storeAccountNumber`, { accountNumber });
  }
 
  getUserDataByEmail(email: string): Observable<any> {
    const params = new HttpParams().set('email', email);
    return this.http.get(`${this.apiUrl}dashboard`, { params });
  }
  
// get single user in mysql
private userEmail: string = '';

setUserEmail(email: string) {
  this.userEmail = email;
 
}

getUserEmail() {
  return this.userEmail;
}
// single data
getDataById(email:string): Observable<any> {
return this.http.get(`http://localhost:3000/api/data/${email}`);
}
//transaction display
getDatatrans(user_id:any): Observable<any> {
  
  return this.http.get(`http://localhost:3000/api/datatransaction/${user_id}`);
}

// get all data
getAllData(): Observable<any[]> {
  return this.http.get<any[]>(this.apiUrl1);
}
// get all data
getAllDatatransaction(): Observable<any[]> {
  return this.http.get<any[]>(this.apiUrl2);
}

// check aahar and mobile is there or not 
// Example service method in BankserviceService
checkDatabase( mobilenumber: string): Observable<any> {
  const body = { mobilenumber };
  return this.http.post<any>(`${this.apiUrl}check`, body);
}
checkDatabasea( adhar_number: string): Observable<any> {
  const body = { adhar_number};
  return this.http.post<any>(`${this.apiUrl}checka`, body);
}


}





