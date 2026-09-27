# Change Tracker (GitGutter rút gọn)

Plugin SubT không chạy được `git` và chưa vẽ được lên gutter, nên plugin này làm phần còn lại của GitGutter: theo dõi thay đổi
so với **lần lưu cuối** (hoặc **lúc mở tệp**, cài đặt `compareWith`) và cho di chuyển / hoàn tác theo từng đoạn thay đổi.

| Lệnh (`Thay đổi: …` / `Changes: …`) | Phím |
|---|---|
| Tới thay đổi tiếp theo / trước (đoạn thay đổi được bôi chọn) | `Ctrl+Alt+.` / `Ctrl+Alt+,` |
| Xem diff — mở tab mới dạng unified diff (tô màu cú pháp Diff) | `Ctrl+Alt+D` |
| Danh sách thay đổi (chọn để nhảy tới) | — |
| Hoàn tác đoạn thay đổi tại con trỏ | — |
| Đặt mốc so sánh = nội dung hiện tại (như "commit" tạm) | — |
| So sánh với tệp khác trong thư mục… / với clipboard | — |

Khi ngừng gõ, thanh trạng thái hiện tóm tắt kiểu `+3 −1 · 2 đoạn thay đổi` (tắt bằng `showSummary`).

**Quyền:** `workspace.read` (so sánh với tệp khác), `clipboard` (so sánh với clipboard).
Mốc so sánh chỉ lưu trong bộ nhớ: khởi động lại SubT thì bắt đầu theo dõi lại từ nội dung lúc đó.
