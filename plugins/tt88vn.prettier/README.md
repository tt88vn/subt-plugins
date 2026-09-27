# Prettier (JsPrettier)

Định dạng code bằng **[Prettier](https://prettier.io) 3.9.9** chạy ngay trong sandbox plugin của SubT — không cần Node.js,
npm hay mạng (khác JsPrettier của Sublime vốn gọi `prettier` bên ngoài).

| Lệnh (`Prettier: …`) | Phím |
|---|---|
| Định dạng tệp (giữ vị trí con trỏ, chỉ sửa phần thay đổi → một lần hoàn tác) | `Ctrl+Shift+I` |
| Định dạng vùng chọn | — |
| Bật/tắt định dạng khi lưu | — |
| Xem cấu hình đang dùng | — |

**Ngôn ngữ:** JavaScript/JSX (`babel`), TypeScript/TSX, CSS, SCSS, LESS, JSON/JSONC (`package.json` dùng `json-stringify`
như Prettier CLI), HTML (kèm `<script>`/`<style>`), Markdown, YAML, GraphQL.

**Cấu hình:** tệp `.prettierrc` (JSON hoặc YAML phẳng), `.prettierrc.json`, `.prettierrc.yaml`/`.yml`, hoặc khóa `"prettier"`
trong `package.json` — tìm từ thư mục của tệp lên tới gốc thư mục đang mở, hỗ trợ `overrides`. Không có tệp cấu hình thì
dùng cài đặt của plugin (`printWidth`, `tabWidth` (0 = theo SubT), `useTabs`, `semi`, `singleQuote`, `trailingComma`,
`bracketSpacing`, `arrowParens`, `proseWrap`, …). Chưa hỗ trợ `.prettierrc.js`/`.toml`, `.prettierignore` và plugin Prettier bên ngoài.

**Giới hạn:** plugin SubT có 3 giây CPU cho mỗi lần gọi, vượt quá thì plugin bị dừng. Vì vậy tệp lớn hơn `maxFileSize`
(50 000 ký tự) bị bỏ qua, và định dạng khi lưu chỉ chạy với tệp ≤ `maxSizeOnSave` (30 000 ký tự). Máy mạnh có thể tăng
hai giá trị này. Plugin nạp Prettier (~4,5 MB mã) khi bạn mở tệp thuộc các ngôn ngữ trên.

**Quyền:** `workspace.read` — để đọc `.prettierrc` / `package.json` trong thư mục đang mở.

## Mã nguồn Prettier đi kèm

Thư mục [`prettier/`](prettier/) là bản build **không minify** của Prettier 3.9.9 (MIT, © James Long và cộng sự — xem
[`prettier/LICENSE`](prettier/LICENSE), giấy phép các thư viện bên trong ở
[`prettier/THIRD-PARTY-NOTICES.md`](prettier/THIRD-PARTY-NOTICES.md): chủ yếu MIT, ngoài ra Apache-2.0 (TypeScript), BSD, ISC, BlueOak), không chỉnh sửa gì. Cách tạo lại:

```sh
git clone --depth 1 --branch 3.9.9 https://github.com/prettier/prettier.git   # commit cdd17f2288b28b170a76416c72dac56e3ea5daff
cd prettier && yarn install && node scripts/build/build.js --no-minify
cp dist/prettier/{standalone.mjs,LICENSE,THIRD-PARTY-NOTICES.md} <plugin>/prettier/
cp dist/prettier/plugins/{babel,estree,typescript,postcss,html,markdown,yaml,graphql}.mjs <plugin>/prettier/plugins/
```
