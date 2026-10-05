export const KEYS=['population','population_density','gdp','gdp_per_capita'];
export const METRICS={population:{label:'人口',unit:'人',short:'人口規模',hint:'這裡住了多少人？人口多，不代表每平方公里都擁擠。'},population_density:{label:'人口密度',unit:'人／平方公里陸地',short:'居住密度',hint:'每平方公里平均有多少人？這是全境平均，城市與鄉村可能差很多。'},gdp:{label:'GDP 總量',unit:'現價美元',short:'經濟規模',hint:'一年內生產的最終商品與服務價值。規模大，不代表每個人都更富有。'},gdp_per_capita:{label:'人均 GDP',unit:'現價美元／人',short:'平均產出',hint:'GDP 除以人口的平均值，不是薪資，也看不出所得分配。'}};
export const COLORS=['#173b52','#226379','#32948f','#80bd94','#ef4444'];
export function legendGradient(){return `linear-gradient(90deg,${COLORS.map((c,i)=>`${c} ${i/(COLORS.length-1)*100}%`).join(',')})`;}
export function valid(v){return Number.isFinite(v)&&v>0;}
export function metricValue(c,k){return c?.metrics?.[k]?.value??null;}
export function extent(countries,k){const a=countries.map(c=>metricValue(c,k)).filter(valid);return a.length?[Math.min(...a),Math.max(...a)]:[1,1];}
export function normalized(v,min,max){return valid(v)?max===min?.5:Math.max(0,Math.min(1,(Math.log10(v)-Math.log10(min))/(Math.log10(max)-Math.log10(min)))):null;}
export function color(v,min,max){let t=normalized(v,min,max);if(t===null)return '#626a7b';const p=t*4,i=Math.min(3,Math.floor(p)),f=p-i;const a=COLORS[i].match(/\w\w/g).map(x=>parseInt(x,16)),b=COLORS[i+1].match(/\w\w/g).map(x=>parseInt(x,16));return '#'+a.map((x,j)=>Math.round(x+(b[j]-x)*f).toString(16).padStart(2,'0')).join('');}
export function compact(v){if(!valid(v))return '無資料';return new Intl.NumberFormat('zh-TW',{notation:'compact',maximumFractionDigits:1}).format(v);}
export function exact(v){return valid(v)?new Intl.NumberFormat('zh-TW',{maximumFractionDigits:2}).format(v):'無資料';}
export function searchCountries(cs,q){const s=q.trim().toLocaleLowerCase().replace(/臺/g,'台');return cs.filter(c=>[c.name_zh,c.name_en,c.iso3,c.iso2].some(v=>String(v??'').toLocaleLowerCase().replace(/臺/g,'台').includes(s)));}
export function toVector(lon,lat,r=1){const a=lon*Math.PI/180,b=lat*Math.PI/180;return [r*Math.cos(b)*Math.cos(a),r*Math.sin(b),-r*Math.cos(b)*Math.sin(a)];}
export function fromVector({x,y,z}){const r=Math.hypot(x,y,z);return [Math.atan2(-z,x)*180/Math.PI,Math.asin(y/r)*180/Math.PI];}
export function featureCode(f){const p=f.properties;return ({KOS:'XKX',SAH:'ESH',SDS:'SSD'}[p.ADM0_A3]??(p.ISO_A3&&p.ISO_A3!=='-99'?p.ISO_A3:p.ADM0_A3));}
