export interface IUser{
    name:string;
    email:string;
    password?:string;
    chapter:string;
    region:string;
    phonenumber:number
    _id:any
    isVerified:boolean;
    isBlocked:false;
    createdAt:Date;
    updatedAt:any
}