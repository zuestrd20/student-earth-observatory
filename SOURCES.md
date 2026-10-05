# 資料、方法與授權

## 數字

World Bank World Development Indicators，API https://api.worldbank.org/v2/ ，下載2026-10-04，資料所報lastupdated 2026-07-13。固定2023年，因下載時2024人口密度皆缺值。排除所有區域、收入組、世界等aggregate，僅留217個經濟體＋台灣獨立缺值條目。

- 人口：SP.POP.TOTL，217筆有值。https://data.worldbank.org/indicator/SP.POP.TOTL
- 人口密度：EN.POP.DNST，215筆有值。https://data.worldbank.org/indicator/EN.POP.DNST
- GDP總量：NY.GDP.MKTP.CD，204筆有值。https://data.worldbank.org/indicator/NY.GDP.MKTP.CD
- 人均GDP：NY.GDP.PCAP.CD，204筆有值。https://data.worldbank.org/indicator/NY.GDP.PCAP.CD

授權：CC BY 4.0及World Bank附加條款：https://data.worldbank.org/summary-terms-of-use 。原資料供應機構詳見data/country_indicators.json的indicators.source_organizations；本站是選擇年份、排除aggregate、翻譯標籤的改作，不代表來源機構背書。

台灣補充人口：內政部戶政司，民國112年12月戶口統計資料分析，2024-01-10發布。2023-12-31年底戶籍登記人口23,420,442人。https://www.ris.gov.tw/info-liferay/app/channel/newsDetail/24010757 。只摘錄事實數字，不重刊新聞全文。定義不同，不參與WDI比較。

中文名稱與六洲教學分組：Unicode CLDR zh-Hant及territoryContainment；海峽群島中文／洲別人工補標。Unicode License v3全文隨附。

## 地圖

Natural Earth v5.1.2，1:110m admin 0 countries，177個簡化polygon/multipolygon。
原始檔：https://raw.githubusercontent.com/nvkelso/natural-earth-vector/v5.1.2/geojson/ne_110m_admin_0_countries.geojson
首頁：https://www.naturalearthdata.com/downloads/110m-cultural-vectors/110m-admin-0-countries/
公眾領域：https://www.naturalearthdata.com/about/terms-of-use/

使用ISO_A3（有效時）或ADM0_A3做join，KOS→XKX、SAH→ESH、SDS→SSD。無匹配統計的地塊保留灰色；若不在218條資料選單，點選不會捏造數值。微型國家及一些領地未有可見polygon，但仍可搜尋統計。國界為來源簡化後的視覺呈現，不是主權定論；不同機構統計涵蓋範圍不一定等於地圖polygon。

地球紋理為4096×2048等距圓柱投影canvas，貼在Three.js球面；Raycaster取球面點，再經緯度與d3-geo geoContains查國。緯經轉換與原始圖形已做純邏輯測試。搜尋定位優先WDI首府座標，無座標時用polygon球面中心。

## 軟體

Three.js 0.180.0 MIT。d3-geo 3.1.1、d3-array、internmap為ISC。完整license於public/licenses；內嵌離線HTML亦收錄。

## SHA-256快照

- countries.geojson: 6866c877d39cba9c357620878839b336d569f8c662d3cfab4cb1dbe2d39c977f
- country_indicators.json: 0e4e195e4ea77448393c1684b1327a533e2e870eecd7161ebf137f3ba8a7297e
- taiwan_supplementary.json: ec3019b8503b24f7acca0fac7fdb749d6f7293e18ee9e7fa9a6eca1323fd5e0e

## Wikipedia補值（2026-10-05）
原WDI 2023快照所有有效值保持不變。原32個缺欄中27項補入可追溯資料，另外5項主值仍缺；科索沃2024總面積人口密度146僅附註，不混入陸地密度。每筆實際年份、來源及限制見 `public/data/wikipedia_supplementary.json` 與 `WIKIPEDIA_SOURCES.md`。Wikipedia文字內容採CC BY-SA 4.0；原始來源連結逐筆保留。
