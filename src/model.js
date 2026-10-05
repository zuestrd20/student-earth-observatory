export const KEYS=['population','population_density','gdp','gdp_per_capita'];
export const METRICS={population:{label:'人口',unit:'人',short:'人口規模',hint:'這裡住了多少人？人口多，不代表每平方公里都擁擠。'},population_density:{label:'人口密度',unit:'人／平方公里陸地',short:'居住密度',hint:'每平方公里平均有多少人？這是全境平均，城市與鄉村可能差很多。'},gdp:{label:'GDP 總量',unit:'現價美元',short:'經濟規模',hint:'一年內生產的最終商品與服務價值。規模大，不代表每個人都更富有。'},gdp_per_capita:{label:'人均 GDP',unit:'現價美元／人',short:'平均產出',hint:'GDP 除以人口的平均值，不是薪資，也看不出所得分配。'}};
// Fixed, labeled thresholds: colors always mean the same range within a metric.
export const COLORS=['#5941a9','#287dd1','#21b6b6','#f4db58','#ff962f','#ef4444'];
export const MISSING_COLOR='#626a7b';
export const SCALES={population:[1e6,1e7,5e7,1e8,1e9],population_density:[10,50,100,300,1000],gdp:[1e10,1e11,5e11,1e12,1e13],gdp_per_capita:[2000,5000,10000,30000,60000]};
export const RANGE_LABELS={population:['少於100萬','100萬–1000萬','1000萬–5000萬','5000萬–1億','1億–10億','10億以上'],population_density:['少於10','10–50','50–100','100–300','300–1000','1000以上'],gdp:['少於100億','100億–1000億','1000億–5000億','5000億–1兆','1兆–10兆','10兆以上'],gdp_per_capita:['少於2000','2000–5000','5000–1萬','1萬–3萬','3萬–6萬','6萬以上']};
export function legendGradient(){return `linear-gradient(90deg,${COLORS.map((c,i)=>`${c} ${i/6*100}%,${c} ${(i+1)/6*100}%`).join(',')})`;}
export function valid(v){return Number.isFinite(v)&&v>0;}
export function metricValue(c,k){return c?.metrics?.[k]?.value??null;}
export function extent(countries,k){const a=countries.map(c=>metricValue(c,k)).filter(valid);return a.length?[Math.min(...a),Math.max(...a)]:[1,1];}
export function normalized(v,min,max){return valid(v)?max===min?.5:Math.max(0,Math.min(1,(Math.log10(v)-Math.log10(min))/(Math.log10(max)-Math.log10(min)))):null;}
export function band(v,k){return valid(v)?SCALES[k].filter(bound=>v>=bound).length:null;}
export function color(v,k='population'){const i=band(v,k);return i===null?MISSING_COLOR:COLORS[i];}
export function rangeLabel(v,k){const i=band(v,k);return i===null?'無資料':RANGE_LABELS[k][i];}
export function mergeSupplement(base,supplement){const result=structuredClone(base);for(const extra of supplement.countries??[]){let c=result.find(c=>c.iso3===extra.iso3);if(!c){c={...extra,metrics:Object.fromEntries(KEYS.map(k=>[k,{value:null,year:null,note_zh:'尚無可核實資料。'}]))};result.push(c);}for(const k of KEYS){const m=extra.metrics?.[k];if(!valid(c.metrics[k]?.value)&&m)c.metrics[k]={...m,supplementary:valid(m.value)};}}return result;}
export function provenance(m){return m?.supplementary?'Wikipedia 補值':'World Bank WDI';}
export function compact(v){if(!valid(v))return '無資料';return new Intl.NumberFormat('zh-TW',{notation:'compact',maximumFractionDigits:1}).format(v);}
export function exact(v){return valid(v)?new Intl.NumberFormat('zh-TW',{maximumFractionDigits:2}).format(v):'無資料';}
export function searchCountries(cs,q){const s=q.trim().toLocaleLowerCase().replace(/臺/g,'台');return cs.filter(c=>[c.name_zh,c.name_en,c.iso3,c.iso2].some(v=>String(v??'').toLocaleLowerCase().replace(/臺/g,'台').includes(s)));}
export function toVector(lon,lat,r=1){const a=lon*Math.PI/180,b=lat*Math.PI/180;return [r*Math.cos(b)*Math.cos(a),r*Math.sin(b),-r*Math.cos(b)*Math.sin(a)];}
export function fromVector({x,y,z}){const r=Math.hypot(x,y,z);return [Math.atan2(-z,x)*180/Math.PI,Math.asin(y/r)*180/Math.PI];}
export function featureCode(f){const p=f.properties;return ({KOS:'XKX',SAH:'ESH',SDS:'SSD'}[p.ADM0_A3]??(p.ISO_A3&&p.ISO_A3!=='-99'?p.ISO_A3:p.ADM0_A3));}
