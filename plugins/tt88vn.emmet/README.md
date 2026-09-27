# Emmet

Viết tắt [Emmet](https://docs.emmet.io/) cho SubT, viết lại bằng JavaScript thuần (không cần mạng).
*Emmet abbreviations for SubT, a small pure-JS implementation.*

| Lệnh | Phím | Ví dụ |
|---|---|---|
| Emmet: Bung viết tắt | `Ctrl+E` | `ul>li.item$*3>a{Mục $}` · `!` · `table>tr*2>td*3` · `p>lorem10` · `m10-20` · `dib` · `c#f` |
| Emmet: Bọc bằng viết tắt | `Ctrl+Shift+E` | chọn vài dòng → `ul>li*` (mỗi dòng một `<li>`) hoặc `div.box` |
| Emmet: Chọn thẻ bao quanh | `Ctrl+Shift+A` | bấm nhiều lần: nội dung thẻ → cả thẻ → thẻ cha… |
| Emmet: Tới thẻ tương ứng | `Ctrl+Alt+T` | nhảy giữa `<div>` và `</div>` |
| Emmet: Xóa thẻ / Đổi tên thẻ | — | giữ nguyên nội dung bên trong |

**Hỗ trợ:** `>` `+` `^` `()` `*N` `$`/`$$`/`$@-`/`$@3`, `#id`, `.class`, `[attr=val bool.]`, `{text}`, tên thẻ ngầm định
(`ul>.x` → `li`, `tr>.x` → `td`), bí danh (`a:link`, `input:email`, `btn:s`, `link:css`, `script:src`, `ul+`, `c` (comment)…),
`lorem`/`loremN`. JSX (`.jsx`/`.tsx`) dùng `className` và `<br />`.

**CSS** (tệp CSS/SCSS/LESS, hoặc trong `<style>` / `style="…"`): `m10` → `margin: 10px;`, `p10-20`, `w100p` → `width: 100%;`,
`m-10`, `lh1.5`, `fz14!` → `!important`, `db`/`dib`/`df`/`posa`/`tac`/`fwb`/`jcsb`, `pos:a`, `c#3`, `bgc#fff`, `bd+`, `m10+p5`, `@m`.

Kết quả chèn dưới dạng snippet: **Tab** / **Shift+Tab** di chuyển giữa các chỗ cần điền.
Phím Tab một mình không dùng được để bung (API plugin yêu cầu phím tắt có phím bổ trợ).
