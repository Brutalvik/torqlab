import {randomPaint} from './paints.js';
import {configureStore,createSlice} from '@reduxjs/toolkit';
const slice=createSlice({name:'booking',initialState:{paint:randomPaint(),mode:'oil',service:'o2',vehicleType:'Car / Sedan',vehicle:'',neighbourhood:'',axles:1},reducers:{setMode(s,a){s.mode=a.payload;s.service=a.payload==='oil'?'o2':'b2'},update(s,a){Object.assign(s,a.payload)}}});
export const {setMode,update}=slice.actions;
export const store=configureStore({reducer:{booking:slice.reducer}});
