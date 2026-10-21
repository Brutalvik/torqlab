import 'dotenv/config';
import {resolve} from 'node:path';
import {openDatabase} from './database.js';
import {timeSlots,validDate} from '../shared/schedule.js';
const [action,date,time]=process.argv.slice(2);const db=openDatabase(resolve(process.env.DATABASE_PATH||'server/data/torqlab.sqlite'));
try{if(action==='list'){const rows=db.prepare('SELECT id,created_at,payload,estimate FROM quotes ORDER BY created_at DESC LIMIT 100').all();console.log(JSON.stringify(rows.map(row=>({...row,payload:JSON.parse(String(row.payload))})),null,2));}
else if(['block','unblock'].includes(action)&&date&&time&&validDate(date)&&timeSlots.includes(time)){if(action==='block')db.prepare('INSERT OR IGNORE INTO blocked_slots(date,time) VALUES(?,?)').run(date,time);else db.prepare('DELETE FROM blocked_slots WHERE date=? AND time=?').run(date,time);console.log(`${action}: ${date} ${time} America/Edmonton`);}
else{console.error('Usage: npm run quotes:list OR npm run slots -- block|unblock YYYY-MM-DD HH:mm');process.exitCode=1;}}finally{db.close();}
