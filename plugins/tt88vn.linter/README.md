# Linter (SublimeLinter rút gọn)

Kiểm tra tệp mỗi khi lưu và báo trên thanh trạng thái, vd `Linter: ✗ 1 lỗi · ⚠ 2 cảnh báo — dòng 12: Ngoặc "{" chưa được đóng`.
Không cần chương trình ngoài: mọi quy tắc viết bằng JavaScript và chạy ngay trong SubT.

| Lệnh (`Linter: …`) | Phím |
|---|---|
| Kiểm tra tệp và hiện danh sách lỗi (chọn để nhảy tới, vùng lỗi được bôi chọn) | `Ctrl+Alt+L` |
| Tới lỗi tiếp theo / trước | `F8` / `Shift+F8` |
| Xóa khoảng trắng thừa, thêm dòng cuối | — |
| Bật/tắt kiểm tra khi lưu | — |

| Quy tắc | Áp dụng cho |
|---|---|
| `json` — lỗi cú pháp JSON với vị trí chính xác (dấu phẩy thừa, thiếu nháy, comment…) · `json-duplicate-key` | `.json` (`.jsonc` cho phép comment, dấu phẩy cuối) |
| `js-syntax` — lỗi cú pháp JavaScript (mã chỉ được biên dịch, **không chạy**; bỏ qua tệp có JSX) | `.js` |
| `unmatched-bracket` — ngoặc `( [ {` không khớp, bỏ qua chuỗi và comment | JS/TS, Java, Kotlin, C/C++, C#, Go, Rust, Swift, Dart, PHP, CSS/SCSS/LESS, Python, Lua, SQL… |
| `yaml-tab` — tab trong thụt lề | `.yaml` |
| `trailing-whitespace`, `mixed-indent`, `indent-style`, `final-newline`, `conflict-marker`, `max-line-length`, `todo` | mọi tệp |

Cài đặt: `lintOnSave` (true), `lintOnOpen` (false), `maxLineLength` (0 = tắt), `showTodos` (false), `javascriptSyntax` (true),
`disabledRules` (vd `["final-newline"]`).

Giới hạn: API plugin chưa cho gạch chân / vẽ biểu tượng ở gutter, nên lỗi được báo qua thanh trạng thái và danh sách.
