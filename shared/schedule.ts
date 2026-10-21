import {DateTime} from 'luxon';
export const TIME_ZONE='America/Edmonton';
export const timeSlots=Array.from({length:23},(_,i)=>{const minutes=9*60+i*30;return `${String(Math.floor(minutes/60)).padStart(2,'0')}:${String(minutes%60).padStart(2,'0')}`;});
export function localToday(now=DateTime.now()){return now.setZone(TIME_ZONE).toISODate()!;}
export function slotInstant(date:string,time:string){return DateTime.fromISO(`${date}T${time}`,{zone:TIME_ZONE});}
export function validDate(date:string,now=DateTime.now()){
 const parsed=DateTime.fromISO(date,{zone:TIME_ZONE});const today=now.setZone(TIME_ZONE).startOf('day');
 return /^\d{4}-\d{2}-\d{2}$/.test(date)&&parsed.isValid&&parsed.toISODate()===date&&parsed>=today&&parsed<=today.plus({days:90});
}
export function availableTimes(date:string,blocked:ReadonlySet<string>,now=DateTime.now()){
 if(!validDate(date,now))return [];
 return timeSlots.filter(t=>!blocked.has(t)&&slotInstant(date,t).toMillis()>now.toMillis());
}
export function labelTime(time:string){const [h,m]=time.split(':').map(Number);return `${h%12||12}:${String(m).padStart(2,'0')} ${h>=12?'PM':'AM'}`;}
