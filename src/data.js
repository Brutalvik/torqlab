export const services = {
 oil: [
 {id:'o1',name:'Labour only',sub:'Your oil. Our expertise.',price:39,features:['You supply the oil & filter','Professional oil & filter change','Oil level check & reminder reset']},
 {id:'o2',name:'Full synthetic',sub:'Everyday care. Exceptional quality.',price:89,popular:true,features:['Up to 5L full synthetic oil','New oil filter & installation','Oil level check & reminder reset']},
 {id:'o3',name:'Premium / European',sub:'Precision care for your performance car.',price:139,from:true,features:['Premium, vehicle-spec synthetic oil','OEM or equivalent filter','Oil level check & reminder reset']}],
 brakes: [
 {id:'b1',name:'Brake pads',sub:'Confidence at every stop.',price:80,from:true,unit:'/ axle',features:['Brake pad replacement','Rotor, caliper & hardware inspection','Fluid level check & road test']},
 {id:'b2',name:'Pads + rotors',sub:'A complete refresh for your brakes.',price:130,from:true,unit:'/ axle',popular:true,features:['Brake pad & rotor replacement','Caliper & hardware inspection','Fluid level check & road test']},
 {id:'b3',name:'Full brake service',sub:'Front to rear. Peace of mind.',price:260,from:true,unit:'/ 4 wheels',features:['Front & rear pads and rotors','Caliper & hardware inspection','Fluid check & road test']}]
};
export const allServices=Object.values(services).flat();
