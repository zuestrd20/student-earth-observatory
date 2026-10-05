import json,hashlib,csv,io,zipfile
from pathlib import Path
dest=Path(__file__).resolve().parents[1]/'public/data';raw=json.loads((dest/'learning_source_extract.json').read_text());base=json.loads((dest/'country_indicators.json').read_text())
codes={'aging':'SP.POP.65UP.TO.ZS','life_expectancy':'SP.DYN.LE00.IN','secondary_completion':'CR.MOD.2','co2_per_capita':'EN.GHG.CO2.PC.CE.AR5'}
notes={'aging':'65歲及以上人口占總人口百分比；UN人口估計，非退休人口或失能比例。','life_expectancy':'出生時預期壽命：假設當年各年齡死亡率持續，一名新生兒預期可活的年數；不是已死亡者的平均年齡或個人壽命預言。','secondary_completion':'UNESCO UIS／GEM模型估計：比初中末年級預定入學年齡大3–5歲的族群，已完成該教育階段的比例。涵蓋男女；不是末年級入學比率。模型估計有不確定性，小差距不宜解讀為確定排名。','co2_per_capita':'每人每年CO₂排放，涵蓋能源、工業、農業及廢棄物，排除土地利用、土地利用變更與林業（LULUCF）。只計CO₂，不是全部溫室氣體；生產端排放不等於個人消費碳足跡。'}
indicators={k:{'code':v,'year':2023,'source_url':'https://data.worldbank.org/indicator/'+v,'source_name':'World Bank WDI','definition_zh':notes[k]} for k,v in codes.items()}
indicators['secondary_completion'].update(source_url='https://www.unesco.org/en/education/view/completion/estimates',source_name='UNESCO UIS／GEM',download_url='https://download.uis.unesco.org/bdds/202602/SDG.zip',release='2026-02',definition_url='https://www.uis.unesco.org/sites/default/files/medias/fichiers/2025/07/Metadata-4.1.2.pdf',modelled=True)
lookup={}
for key in ['aging','life_expectancy','co2_per_capita']:
 rows=raw[key]['rows'];lookup[key]={r['countryiso3code']:r for r in rows if r['date']=='2023'}
rows=raw['secondary_completion']['rows'];lookup['secondary_completion']={r['COUNTRY_ID']:r for r in rows if r['YEAR']=='2023' and r['INDICATOR_ID']=='CR.MOD.2'}
cs=[]
for c in base['countries']:
 ms={}
 for key in codes:
  r=lookup[key].get(c['iso3']);v=(float(r['VALUE']) if r and r['VALUE'] and r['MAGNITUDE'] not in ['NA','SUPP','LOWREL','INCLUDED'] else None) if key=='secondary_completion' else (r['value'] if r else None)
  ms[key]={'value':v,'year':2023,'indicator':codes[key],'source_url':indicators[key]['source_url'],'source_name':indicators[key]['source_name'],'source_kind':'unesco' if key=='secondary_completion' else 'wdi','modelled':key=='secondary_completion','note_zh':notes[key] if v is not None else '本次2023同口徑資料沒有可用值；不等於零。','comparison_group':codes[key]+':2023','quiz_eligible':v is not None}
 cs.append({'iso3':c['iso3'],'metrics':ms})
tw=next(c for c in cs if c['iso3']=='TWN')['metrics']
tw['life_expectancy'].update(value=80.23,source_kind='official',source_name='台灣內政部統計處',source_url='https://www.moi.gov.tw/News_Content.aspx?n=4&s=320039',note_zh='2023年簡易生命表，出生時平均餘命80.23歲；內政部官方補充，非WDI資料。資料編製方法可能不同，不列入猜題。',quiz_eligible=False)
tw['aging'].update(value=None,alternative_value=18.35,alternative_unit_zh='％（年底戶籍人口）',alternative_year_label='2023年底',source_kind='official',source_name='台灣衛福部／內政部',source_url='https://service.mohw.gov.tw/ebook/dopl/113/03/files/basic-html/page18.html',note_zh='2023年底65歲以上人口占戶籍人口18.35%。年底戶籍口徑與UN年中人口不同，僅供參考，不納入色階、比例或猜題。',quiz_eligible=False)
d={'metadata':{'retrieved_at':'2026-10-05','base_year':2023,'country_count':218,'education_release':'UIS SDG 2026-02','education_archive_sha256':'8f68d5d01e2f3d8cdb20dd5149da126fc21d7915f86a003cf56e88a40e1bfce5','policy_zh':'新指標另存，不改既有四項WDI或Wiki數據。原始缺值保持null，官方異口徑僅參考；教育統一用CR.MOD.2模型估計。'},'indicators':indicators,'countries':cs}
for k in codes:
 d['indicators'][k]['coverage']=sum(c['metrics'][k]['value'] is not None for c in cs)
(dest/'learning_indicators.json').write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
