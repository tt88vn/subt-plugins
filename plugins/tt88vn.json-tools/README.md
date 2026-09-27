# Pretty JSON mở rộng / Pretty JSON Extras

SubT đã có sẵn **Pretty JSON** (định dạng, thu gọn, sắp xếp khóa, kiểm tra lỗi — `Ctrl+Alt+J`). Plugin này thêm phần còn lại
của Pretty JSON bản Sublime và vài chuyển đổi hay dùng. Làm việc trên vùng chọn, hoặc cả tệp nếu không chọn gì.

| Lệnh (`JSON: …`) | Ghi chú |
|---|---|
| Chuyển sang YAML / XML | kết quả mở ở tab mới (đổi bằng cài đặt `output`) |
| Chuyển mảng đối tượng sang CSV · CSV sang JSON | đối tượng lồng nhau ↔ cột `a.b`; tự nhận dấu phân cách `,` `;` tab `\|` |
| Mảng ↔ JSON Lines | |
| Truy vấn JSONPath… (`Ctrl+Alt+Q`) | `$.store.book[0].title`, `$.items[*].name`, `..id`, `[-1]`, `[0:3]`, `["tên có dấu cách"]` |
| Đường dẫn tại con trỏ (`Ctrl+Alt+P`) | vd `$.users[2].email` — cũng được dùng làm gợi ý cho lần truy vấn sau |
| JSONC/JSON5 → JSON | bỏ `//`, `/* */`, dấu phẩy cuối, đổi `'…'` thành `"…"` |
| Định dạng (mảng ngắn trên một dòng) | `[1, 2, 3]` giữ trên một dòng nếu ≤ `maxLineWidth` |

Cài đặt: `indent` (2), `output` (`newTab` / `replace`), `csvTypes` (true), `maxLineWidth` (80).
