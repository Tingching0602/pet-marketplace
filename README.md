# 毛孩市集 (Pet Market)

寵物二手拍賣平台。ASP.NET Core (C#) + EF Core + SQL Server 後端,React + TypeScript + Vite 前端。

視覺與互動設計源自先前製作的原型:`../pet-marketplace-design/Main.dc.html`。

## 專案結構

```
backend/PetMarketplace.Api/   ASP.NET Core Web API (Controllers, EF Core, Identity + JWT)
frontend/                     React + TypeScript + Vite SPA
```

## 本機開發設定

### 後端

需求:.NET SDK 9、SQL Server LocalDB(或任何 SQL Server 執行個體)。

```powershell
cd backend/PetMarketplace.Api
dotnet restore
dotnet ef database update      # 套用 migration、建立 PetMarketplaceDb
dotnet run
```

開發模式下啟動時會自動填入種子資料(5 個分類、2 個示範帳號、10+ 件商品、1 筆對話)。
API 預設監聽 `http://localhost:5045`。

示範帳號:
- `demo@petmarket.test` / `Passw0rd!1`(買家視角,擁有 1 件自售商品)
- `shop@petmarket.test` / `Passw0rd!1`(賣家視角,擁有大部分示範商品)

連線字串、JWT 金鑰、CORS 允許來源都在 `appsettings.Development.json` /
`appsettings.json` 設定,正式環境請改用環境變數(`ConnectionStrings__DefaultConnection`、
`Jwt__Key`、`Cors__AllowedOrigins__0`),部署到 Azure 時只需調整設定,不需改程式碼。

### 前端

需求:Node.js 18+。

```powershell
cd frontend
npm install
npm run dev
```

預設監聽 `http://localhost:5173`,`.env.development` 中的 `VITE_API_BASE_URL`
指向本機後端 API。

## 目前範圍與已知限制

- 商品圖片為手繪 SVG 插畫,尚未支援真實照片上傳(`Product.ImageUrl` 欄位已預留)。
- 對話功能採輪詢(每 5-15 秒重新拉取),尚未使用 SignalR 做即時推播。
- 商品評分為展示用的固定欄位,尚未有真實評價/評論系統。
- 尚未建立自動化測試;驗證方式詳見開發過程中使用的手動 curl 走查(見 git 歷史或直接
  以 `dotnet run` + `npm run dev` 實際操作)。

## 部署到 Azure(尚未執行,交由使用者處理)

1. 建立 Azure SQL Database,套用相同的 EF Core migration(`dotnet ef database update`
   指向 Azure SQL 連線字串,或改用 `dotnet ef migrations script` 產生 SQL 由 DBA 執行)。
2. 後端部署到 Azure App Service,設定環境變數覆寫連線字串、JWT 金鑰、CORS 允許來源。
3. 前端 `npm run build` 產出的 `dist/` 可部署到 Azure Static Web Apps,或直接讓後端
   服務靜態檔案(需另外調整 `Program.cs` 加上 `UseStaticFiles`/`MapFallbackToFile`)。
