# MarkdownEditing

Công cụ soạn Markdown cho SubT (giống MarkdownEditing của Sublime). Xem trước Markdown đã có sẵn trong SubT.
*Markdown editing helpers for SubT, in the spirit of Sublime's MarkdownEditing.*

| Lệnh (Command Palette → `Markdown: …`) | Phím (trong tệp .md) |
|---|---|
| In đậm / In nghiêng — bật/tắt, không chọn gì thì áp cho từ tại con trỏ | `Ctrl+Alt+B` / `Ctrl+Alt+I` |
| Gạch ngang, Code trong dòng, Khối code | — |
| Chèn liên kết / ảnh (chọn sẵn một URL thì URL thành đích) | `Ctrl+Alt+K` |
| Tăng / giảm cấp tiêu đề, Đặt cấp tiêu đề… | `Ctrl+Alt+=` / `Ctrl+Alt+-` |
| Danh sách gạch đầu dòng / đánh số / việc cần làm, Trích dẫn — bật/tắt cho các dòng chọn | — |
| Đánh dấu việc xong `[ ]` ↔ `[x]` | `Ctrl+Alt+X` |
| Mục danh sách mới (tự thêm `- `, `2. `, `- [ ] `, `> `; mục rỗng thì kết thúc danh sách) | `Alt+Enter` |
| Đánh lại số danh sách (giữ số đầu, hỗ trợ lồng nhau, bỏ qua khối code) | — |
| Căn bảng tại con trỏ / Căn mọi bảng (giữ căn trái/giữa/phải, chữ CJK/emoji rộng 2 ô) | `Ctrl+Alt+F` |
| Chèn bảng… (`3x2`) | — |
| Chèn / cập nhật mục lục — giữa `<!-- TOC -->` và `<!-- /TOC -->`, anchor kiểu GitHub | — |
| Tới tiêu đề… | `Ctrl+Alt+R` |

- Mục lục tự cập nhật khi lưu (tắt bằng cài đặt `autoUpdateToc`).
- Snippet (gõ rồi **Tab**): `code`, `link`, `img`, `table`, `task`, `details`, `fn`, `hr`, `front`, `note`.
- Cài đặt: `boldMarker` (`**`), `italicMarker` (`*`), `bullet` (`-`), `tocMinLevel`, `tocMaxLevel`, `autoUpdateToc`.

Giới hạn: API plugin không bắt được phím Enter thường, nên tự nối danh sách dùng `Alt+Enter`.
