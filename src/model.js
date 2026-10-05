export const BASE_KEYS=['population','population_density','gdp','gdp_per_capita'];
export const LEARNING_KEYS=['aging','life_expectancy','secondary_completion','co2_per_capita'];
export const KEYS=[...BASE_KEYS,...LEARNING_KEYS];
export const METRICS={population:{label:'人口',unit:'人',short:'人口規模',hint:'這裡住了多少人？人口多，不代表每平方公里都擁擠。'},population_density:{label:'人口密度',unit:'人／平方公里陸地',short:'居住密度',hint:'每平方公里平均有多少人？這是全境平均，城市與鄉村可能差很多。'},gdp:{label:'GDP 總量',unit:'現價美元',short:'經濟規模',hint:'一年內生產的最終商品與服務價值。規模大，不代表每個人都更富有。'},gdp_per_capita:{label:'人均 GDP',unit:'現價美元／人',short:'平均產出',hint:'GDP 除以人口的平均值，不是薪資，也看不出所得分配。'}};
Object.assign(METRICS,{
 aging:{label:'高齡人口占比',unit:'％（65歲及以上）',short:'人口年齡結構',hint:'每100人中，有多少人年滿65歲？高齡化是人口結構，不等於每位長者的健康或工作能力。'},
 life_expectancy:{label:'預期壽命',unit:'歲（出生時）',short:'健康與生活',hint:'如果當年的各年齡死亡率持續，一名新生兒預期能活多久？這不是已死亡者的平均年齡，也不是對個人壽命的預言。'},
 secondary_completion:{label:'初中完成率',unit:'％（模型估計）',short:'教育機會 · UIS',hint:'UNESCO模型估計：比初中末年級預定年齡大3–5歲的族群，已完成該階段的比例。初中相當於國中階段；不是考試成績，也不是末年級入學比率。小差距可能落在模型不確定性內。'},
 co2_per_capita:{label:'每人CO₂排放',unit:'噸CO₂e／人／年',short:'排放與環境',hint:'每人平均的生產端CO₂排放，涵蓋能源、工業、農業與廢棄物，排除土地利用／林業。不含其他溫室氣體，不等於個人的消費碳足跡。'}
});
// Fixed, labeled thresholds: colors always mean the same range within a metric.
export const COLORS=['#5941a9','#287dd1','#21b6b6','#f4db58','#ff962f','#ef4444'];
export const MISSING_COLOR='#626a7b';
export const SCALES={population:[1e6,1e7,5e7,1e8,1e9],population_density:[10,50,100,300,1000],gdp:[1e10,1e11,5e11,1e12,1e13],gdp_per_capita:[2000,5000,10000,30000,60000]};
export const RANGE_LABELS={population:['少於100萬','100萬–1000萬','1000萬–5000萬','5000萬–1億','1億–10億','10億以上'],population_density:['少於10','10–50','50–100','100–300','300–1000','1000以上'],gdp:['少於100億','100億–1000億','1000億–5000億','5000億–1兆','1兆–10兆','10兆以上'],gdp_per_capita:['少於2000','2000–5000','5000–1萬','1萬–3萬','3萬–6萬','6萬以上']};
export const LEARNING_COLORS=['#303f78','#4264a6','#438dbb','#4fb5c4','#8ed7d0','#dbf4d4'];
export function palette(k){return LEARNING_KEYS.includes(k)?LEARNING_COLORS:COLORS;}
Object.assign(SCALES,{aging:[5,10,15,20,25],life_expectancy:[60,65,70,75,80],secondary_completion:[40,60,80,90,95],co2_per_capita:[.5,2,5,10,20]});
Object.assign(RANGE_LABELS,{aging:['少於5%','5–10%','10–15%','15–20%','20–25%','25%以上'],life_expectancy:['少於60歲','60–65歲','65–70歲','70–75歲','75–80歲','80歲以上'],secondary_completion:['少於40%','40–60%','60–80%','80–90%','90–95%','95%以上'],co2_per_capita:['少於0.5噸','0.5–2噸','2–5噸','5–10噸','10–20噸','20噸以上']});
export function legendGradient(k){return `linear-gradient(90deg,${palette(k).map((c,i)=>`${c} ${i/6*100}%,${c} ${(i+1)/6*100}%`).join(',')})`;}
export function valid(v){return Number.isFinite(v)&&v>=0;}
export function metricValue(c,k){return c?.metrics?.[k]?.value??null;}
export function extent(countries,k){const a=countries.map(c=>metricValue(c,k)).filter(valid);return a.length?[Math.min(...a),Math.max(...a)]:[1,1];}
export function normalized(v,min,max){return valid(v)?max===min?.5:Math.max(0,Math.min(1,(Math.log10(v)-Math.log10(min))/(Math.log10(max)-Math.log10(min)))):null;}
export function band(v,k){return valid(v)?SCALES[k].filter(bound=>v>=bound).length:null;}
export function color(v,k='population'){const i=band(v,k);return i===null?MISSING_COLOR:palette(k)[i];}
export function rangeLabel(v,k){const i=band(v,k);return i===null?'無資料':RANGE_LABELS[k][i];}
export function mergeSupplement(base,supplement){const result=structuredClone(base);for(const extra of supplement.countries??[]){let c=result.find(c=>c.iso3===extra.iso3);if(!c){c={...extra,metrics:Object.fromEntries(KEYS.map(k=>[k,{value:null,year:null,note_zh:'尚無可核實資料。'}]))};result.push(c);}for(const k of KEYS){const m=extra.metrics?.[k];if(!valid(c.metrics[k]?.value)&&m)c.metrics[k]={...m,supplementary:valid(m.value)};}}return result;}
export function provenance(m){return m?.source_name||(m?.supplementary?'Wikipedia 補值':'World Bank WDI');}
export function compact(v){if(!valid(v))return '無資料';return new Intl.NumberFormat('zh-TW',{notation:'compact',maximumFractionDigits:1}).format(v);}
export function exact(v){return valid(v)?new Intl.NumberFormat('zh-TW',{maximumFractionDigits:2}).format(v):'無資料';}
export function searchCountries(cs,q){const s=q.trim().toLocaleLowerCase().replace(/臺/g,'台');return cs.filter(c=>[c.name_zh,c.name_en,c.iso3,c.iso2].some(v=>String(v??'').toLocaleLowerCase().replace(/臺/g,'台').includes(s)));}
export function toVector(lon,lat,r=1){const a=lon*Math.PI/180,b=lat*Math.PI/180;return [r*Math.cos(b)*Math.cos(a),r*Math.sin(b),-r*Math.cos(b)*Math.sin(a)];}
export function fromVector({x,y,z}){const r=Math.hypot(x,y,z);return [Math.atan2(-z,x)*180/Math.PI,Math.asin(y/r)*180/Math.PI];}
export function featureCode(f){const p=f.properties;return ({KOS:'XKX',SAH:'ESH',SDS:'SSD'}[p.ADM0_A3]??(p.ISO_A3&&p.ISO_A3!=='-99'?p.ISO_A3:p.ADM0_A3));}

export function referenceOnly(m){return !valid(m?.value)&&valid(m?.alternative_value);}
export function displayValue(m){return referenceOnly(m)?m.alternative_value:m?.value;}
export function displayUnit(m,k){return referenceOnly(m)?(m.alternative_unit_zh||'人／平方公里總面積'):METRICS[k].unit;}
export function displayYear(m){return referenceOnly(m)?(m.alternative_year_label||m.year||'年份未定'):(m?.year??'年份未定');}

export function addLearning(countries,data){const extra=new Map(data.countries.map(c=>[c.iso3,c]));return countries.map(c=>({...c,metrics:{...c.metrics,...Object.fromEntries(LEARNING_KEYS.map(k=>[k,extra.get(c.iso3)?.metrics[k]??{value:null,year:2023,note_zh:'本次同口徑資料無可用值。'}]))}}));}
