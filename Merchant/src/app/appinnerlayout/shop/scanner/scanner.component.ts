import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ThrowStmt } from '@angular/compiler';
declare var angular:any;
@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss']
})
export class ScannerComponent implements OnInit {
registerArr=[];
rate:any;
minspend:any;
price:any;
todayDate:any;
public membername:any;
public voucherid:any;
message:any;
scanArr = [];
convertArr=[];
public srch=[];
memberArr =[];

  constructor(private modalService: NgbModal, private http: HttpClient,private route: ActivatedRoute,private activatedRoute: ActivatedRoute, private router: Router) { 
    this.srch = [...this.scanArr];
  }

  public voucherscan={
    id:'',
    type:'',
    title: '',
    detail:'',
    discount:0,
    minspend:0,
    sdate:'',
    edate:'',
    termsandcondition:'',
    voucherid:'',
    status:'',
    quantity:'',
    createddate:'',
    memberid:'',
    codetype:'',
     };

     public points={
      memberid:'',
      pointsget:0,
      merchantid: '',
      createddate:'',
      productname:'',
      membername:'',
      type:'',
      price:0,
      subtotal:0,
      pointsused:0,
      outletid:'',
      voucherid:''
     


     }
     public outlet={
       shoptitle:''
     }
     public pointsconvert={
       oneRM:0.00
     }
       public member ={
         name:'',
         tierlevel:'',
         
       }
public uservoucher={
  voucherid:'',
  memberid:''
}
     public  id:any;
     public register ={
      _id:'',
             pointscollect:0,
             totalpoints:0
           }
  ngOnInit(): void {
  

    var url= document.URL;
    console.log(url)
    const myArray = url.split("=");
    this.id = myArray[1];
    
    this.getScanner()
    
  }
  getScanner() {
    
    this.http.get('http://165.22.50.213:3001/getvoucherscan').subscribe((res:any) => {

      var moutlet =JSON.parse(localStorage.getItem('Moutlet') !);
    
     this. outlet.shoptitle = moutlet.shopname

     this.scanArr = res['data']
    
        
        console.log(this.scanArr)
     for(var i=0;i<this.scanArr.length;i++){
      if(this.scanArr[i]['id'] == this.id ){


      this.voucherid = this.scanArr[i]['voucherid']
      console.log(this.voucherid)
      this.http.post('http://165.22.50.213:3001/getoneofvoucher',this.voucherid).subscribe((res:any) => {
        console.log(res)

      });

           console.log(this.scanArr[i]['voucherid'])
           console.log(this.scanArr[i]['memberid'])

    this.voucherscan = this.scanArr[i]
    console.log(this.voucherscan)
  console.log(this.voucherscan['type'])

    
    this.http.get('http://165.22.50.213:3001/getmember').subscribe((res:any) => {
      console.log(res)
      this.memberArr = res['data'] ;
      console.log(this.memberArr)
     
      for(var i=0; i<this.memberArr.length;i++){
         console.log(this.memberArr[i]['_id'] )
         console.log(this.voucherscan['memberid'])
        if(this.memberArr[i]['_id'] == this.voucherscan['memberid']){
      
          console.log(this.memberArr[i])
            this.points.memberid = this.memberArr[i]['_id'];
           
           this.member.name = this.memberArr[i]['username'];
           this.points.membername = this.member.name;
           console.log(this.member.name)
           this.member.tierlevel =this.memberArr[i]['tierlevel']
        }
      }

    }); 
           console.log(this.voucherscan['title'])
      }
      }
    });
  }


 backnav(){
  this.router.navigate(['/scan'])
 }

  calculate(){
    console.log(this.voucherscan['minspend'])
   console.log(this.points.price)
   this.minspend =this.voucherscan['minspend']
   this.price = this.points.price
   if(parseInt(this.minspend) >parseInt( this.price)){
    alert("Please buy atleast RM" +this.voucherscan['minspend'] )
  
  }
  else {
      this.http.get('http://165.22.50.213:3001/getpointsconvert').subscribe((res:any) =>{
        console.log(res);
        this.convertArr = res['data'];
         console.log(this.points.price)
         console.log(this.voucherscan.discount)
      this.rate =(this.convertArr[0][this.member.tierlevel])
      if(this.voucherscan['type'] == "FixAmount"){
        this.points.subtotal = (this.points.price - this.voucherscan.discount)
        
        this.points.pointsget = (this.points.subtotal)/(this.rate)
      }
   else {
    this.points.subtotal = (this.points.price -(this.points.price*(this.voucherscan.discount*0.01 ) ))
    this.points.pointsget = (this.points.subtotal)/(this.rate)
   }
    });
  }
}

  sendData(){
    var moutlet =JSON.parse(localStorage.getItem('Moutlet') !);
    console.log(moutlet)
    this.points.merchantid = moutlet.merchantid;
    this.points.outletid = moutlet._id;
    this.points.createddate = this.voucherscan.createddate
    this.points.voucherid = this.voucherid

    console.log(this.points)

      this.points.type = "voucher"
      var today = new Date();
      
      var dd = today.getDate();
  var mm = today.getMonth() + 1

  var day = "";
  var month = "";

  var yyyy = today.getFullYear();
  if (dd < 10) {
    day = '0' + dd.toString();
  } else {
    day = dd.toString();
  }
  if (mm < 10) {
    month = '0' + mm.toString();
  } else {
    month = mm.toString();
  }
  this.todayDate = yyyy + '-' + month + '-' + day;
      this.registerpoints(this.points);

  }
  registerpoints(points:any){

    console.log(this.points)
   console.log(this.voucherid)
   this.points.voucherid = this.voucherid
   this.points.membername = this.member.name;
   console.log(this.points.membername)
   console.log(this.points.voucherid)
   console.log(this.points)
    this.http.post('http://165.22.50.213:3001/addpoints', points).subscribe(res =>{
        console.log(res);
        this.register._id = this.points.memberid
        this.http.post('http://165.22.50.213:3001/getpoints',this.register).subscribe(res =>{
         console.log(res);
        this.registerArr =res['data']
        console.log(res['data']['pointscollect'])
        console.log(this.points.pointsget)
        console.log(res['data']['pointscollect'])
         this.register.pointscollect =parseInt(res['data']['pointscollect'])+this.points.pointsget
           
         this.register.totalpoints =parseInt(res['data']['totalpoints'])+this.points.pointsget
          this.http.post('http://165.22.50.213:3001/editmcpoints', this.register).subscribe(res =>{
              console.log(res);
              this.message = res ;
              if(this.message['success']== false){
                alert("Save Failed");
              }
              else{
                this.uservoucher.voucherid = this.voucherid
                this.uservoucher.memberid =this.register._id
                console.log(this.uservoucher)
                this.http.post('http://165.22.50.213:3001/edituserVoucher', this.uservoucher).subscribe(res =>{
                  this.message = res;
                console.log(res)
                console.log(res['data1'])
              });
               if(this.message['success'] == true){
                 console.log("sucess")

                    this.router.navigate(['/home'])
               }
              }
          });
     
         
     });
    });
 
   
  }
}
