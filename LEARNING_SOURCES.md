# 健康、教育與環境指標

查核／擷取：2026-10-05。主年份統一為2023；使用既有218個國家與地區，不加入區域聚合。舊四指標和Wikipedia原資料未修改。新資料在 `public/data/learning_indicators.json`，官方數值摘錄在 `learning_source_extract.json`；可執行 `python3 scripts/build-learning.py` 由快照重建。

## 指標與覆蓋

- **高齡人口占比：217/218**。WDI `SP.POP.65UP.TO.ZS`，UN World Population Prospects，65歲及以上人口占總人口百分比。https://data.worldbank.org/indicator/SP.POP.65UP.TO.ZS
- **出生時預期壽命：218/218**。WDI `SP.DYN.LE00.IN` 217筆，加台灣內政部2023簡易生命表80.23歲。定義為假設當年年齡別死亡率持續，一名新生兒的預期年數，不是死亡人口平均年齡。https://data.worldbank.org/indicator/SP.DYN.LE00.IN ；台灣：https://www.moi.gov.tw/News_Content.aspx?n=4&s=320039
- **初中完成率：160/218**。UNESCO UIS SDG 2026-02官方資料包，`CR.MOD.2`，男女合計模型估計。対象為比初中末年級預定年齡大3–5歲的族群，其已完成該階段的比例；不是WDI `SE.SEC.CMPT.LO.ZS`末年級粗入學比率。台灣未找到同口徑值，不用在校生畢業率代替。模型存在不確定性，不能把微小差距當作確定排名。
  - 官方資料包：https://download.uis.unesco.org/bdds/202602/SDG.zip
  - 官方下載頁：https://databrowser.uis.unesco.org/resources/bulk
  - 定義：https://www.uis.unesco.org/sites/default/files/medias/fichiers/2025/07/Metadata-4.1.2.pdf
  - 模型方法／展示：https://www.unesco.org/en/education/view/completion/estimates
- **每人CO₂排放：203/218**。WDI `EN.GHG.CO2.PC.CE.AR5`，EDGAR／JRC及IEA。噸CO₂e／人／年，包含能源、工業、農業、廢棄物的CO₂，排除土地利用、土地利用變更與林業（LULUCF）；不是六種溫室氣體加總，也不是消費端碳足跡。https://data.worldbank.org/indicator/EN.GHG.CO2.PC.CE.AR5 ；方法來源：https://edgar.jrc.ec.europa.eu/dataset_ghg2024

## 年份選取與缺值

先檢查2020–2023：WDI高齡與壽命各年均217筆，CO₂各年均203筆；UIS `CR.MOD.2`各年均160筆。選2023以銜接既有主資料，不為填色挪用另一年。教育未混入35筆2023觀察值；所有地區一致採模型序列。

台灣65歲以上占比18.35%來自2023年底戶籍人口，與UN人口估計口徑不同，因此只顯示參考，不進入色階、比例或猜題。官方依據：https://service.mohw.gov.tw/ebook/dopl/113/03/files/basic-html/page18.html 。台灣預期壽命是官方同概念的單独來源，明確標示且不放入猜題。台灣教育及排放未核實同口徑值，維持null。台灣密度644既有參考值維持不變。

null不是0。合法0值可顯示，無資料排除色階與題目。新四色階只表達大小，不附帶好壞分數。

## 猜題規則

8題分別涵蓋四個新增指標，各2題；只使用相同年份、相同指標與資料序列、非參考值的兩國。教育題明講模型估計。答案從資料即時計算，不手寫固定答案。揭曉後顯示雙方數值、單位、年份、來源與解讀限制；無帳號、無後台、不保存分數。鍵盤可用Tab、Enter或空白鍵操作原生按鈕。

## 授權與限制

WDI採CC BY 4.0及World Bank附加條款；UNESCO資料包README列CC BY-SA 3.0 IGO（https://creativecommons.org/licenses/by-sa/3.0/igo/），保留來源與版本。本網站不代表資料提供機構背書。行政區界不一定完全等同統計母體。數值可隨官方修訂而改變，本次為可重建的固定快照。
