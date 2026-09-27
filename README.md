# SubT Plugins

Kho plugin chính thức cho **[SubT](https://github.com/tt88vn/SubT)** — trình soạn thảo mã phong cách Sublime Text trên Android.
*The official plugin registry for SubT, a Sublime Text style code editor for Android.*

## Cài plugin / Installing

Trong SubT: **⋮ → Quản lý plugin → Kho plugin**, tìm và bấm **Cài**. SubT tải file từ GitHub Releases của repo này,
kiểm tra **SHA-256** với `index.json` rồi mới cài, và hiện danh sách quyền plugin cần trước khi cài.

*In SubT: ⋮ → Plugin Manager → Plugin Registry. Downloads are verified against the SHA-256 in `index.json`.*

| Plugin | Mô tả |
|---|---|
| [`tt88vn.text-tools`](plugins/tt88vn.text-tools) | camelCase / snake_case / kebab-case…, Base64, URL, JSON escape, thống kê văn bản |
| [`tt88vn.dracula`](plugins/tt88vn.dracula) | Bảng màu Dracula |

## Cách hoạt động / How it works

```
plugins/<id>/            mã nguồn plugin (plugin.json, main.js, …)
scripts/registry.mjs     kiểm tra + đóng gói (không cần npm install)
index.json               danh sách plugin cho SubT — do CI tạo, đừng sửa tay
```

- **Pull request** → workflow *Validate plugins* chạy `node scripts/registry.mjs check`: manifest hợp lệ, file tồn tại,
  đường dẫn an toàn, `engines.subt` phù hợp, và **phải tăng `version`** khi sửa plugin đã phát hành.
- **Merge vào `main`** → workflow *Publish registry* đóng gói mỗi plugin thành `<id>-<version>.subt-plugin`
  (zip cố định → SHA-256 ổn định), tạo **GitHub Release** `<id>-v<version>` cho phiên bản mới và cập nhật `index.json`.
- SubT đọc `https://raw.githubusercontent.com/tt88vn/subt-plugins/main/index.json`.

## Gửi plugin / Submitting a plugin

1. Đọc hướng dẫn API: [SubT docs/PLUGIN_API.md](https://github.com/tt88vn/SubT/blob/main/docs/PLUGIN_API.md)
   và bắt đầu từ [plugin mẫu](https://github.com/tt88vn/SubT/tree/main/docs/plugin-template).
2. Fork repo này, thêm thư mục `plugins/<tên-github-của-bạn>.<tên-plugin>/` (tên thư mục = `id`).
3. Bắt buộc trong `plugin.json`: `id`, `version`, `engines.subt`, `displayName` và `description` (nên có `vi` + `en`),
   `author`, `license`.
4. Thử trên điện thoại: SubT → Quản lý plugin → **Cài từ thư mục (dev)**.
5. Chạy `node scripts/registry.mjs check`, rồi mở Pull Request.
6. Cập nhật plugin: sửa file **và tăng `version`** (semver) trong cùng PR.

**Quy tắc / Rules:** id bắt đầu bằng tên GitHub của bạn · chỉ xin quyền thật sự cần · không nộp code đã minify / làm rối ·
mọi file phải được phép phân phối theo `license` · plugin độc hại sẽ bị gỡ và phiên bản đó bị xóa khỏi index.

## Định dạng `index.json` (schema 1)

```json
{
  "schema": 1,
  "registry": "tt88vn/subt-plugins",
  "plugins": [{
    "id": "tt88vn.text-tools", "version": "1.0.0",
    "displayName": { "vi": "…", "en": "…" }, "description": { "vi": "…", "en": "…" },
    "author": "tt88vn", "license": "MIT", "engines": { "subt": "^1.0.0" },
    "permissions": [], "hasCode": true, "contributes": { "commands": 12 },
    "homepage": "https://github.com/tt88vn/subt-plugins/tree/main/plugins/tt88vn.text-tools",
    "tag": "tt88vn.text-tools-v1.0.0",
    "download": { "url": "https://github.com/…/releases/download/…/tt88vn.text-tools-1.0.0.subt-plugin",
                  "sha256": "…", "size": 4321 }
  }]
}
```
