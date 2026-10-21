import 'dotenv/config';
import {resolve} from 'node:path';
import {createApp} from './app.js';
import {openDatabase} from './database.js';
const db=openDatabase(resolve(process.env.DATABASE_PATH||'server/data/torqlab.sqlite'));
const app=createApp(db,{staticDirectory:process.env.NODE_ENV==='production'?resolve('dist'):undefined});
const server=app.listen(Number(process.env.PORT||3001),process.env.HOST||'127.0.0.1',()=>console.log(`TorqLab API: http://${process.env.HOST||'127.0.0.1'}:${process.env.PORT||3001} (local delivery)`));
for(const signal of ['SIGINT','SIGTERM'] as const)process.on(signal,()=>server.close(()=>{db.close();process.exit(0);}));
