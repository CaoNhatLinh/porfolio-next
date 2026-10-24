# Orange Protocol — đề xuất Easter egg

Status: **đã triển khai phiên bản op-1**. Chi tiết vận hành thực tế ở [orange-protocol.md](orange-protocol.md); phần bên dưới giữ lại ý tưởng thiết kế ban đầu, không phải checklist chức năng đã triển khai. Không sửa text CV, thông tin dự án, form liên hệ hoặc navigation để làm câu đố.

## Chất riêng và trải nghiệm

Một người chỉ xem CV sẽ thấy portfolio bình thường. Người vào Góc riêng biết có một câu đố; người soi kỹ mới nhận ra vài chi tiết nhỏ trên các trang thuộc cùng một hệ thống. Motif: trái cam Kamling, pixel art, mở khóa gợi Gaim. Không cần đưa model 3D trở lại hoặc lấy một nhân vật khác làm toàn bộ thương hiệu.

Khó ở việc nhận ra quy luật và ghép manh mối, không phải thử mọi tổ hợp hoặc đoán sở thích của tác giả. Mỗi bước có đủ dữ kiện, đường giải duy nhất và cách tự kiểm tra. Không sao chép đáp án/cơ chế độc quyền từ video giải đố.

Ở cuối `/playroom`: panel nhỏ **Orange Protocol**, dòng “Có vài chi tiết không nằm ở đây. Nếu tìm thấy, bạn sẽ biết nhập gì.”, input “Mã bạn tìm được” và nút “Thử mã”. VI/EN tương đương; mã dùng ASCII/ký hiệu, không phụ thuộc dịch. Thêm hướng dẫn an toàn: chỉ đọc, không cần đăng nhập, tải file hoặc chạy lệnh console.

Không popup, badge đỏ, notification, quảng bá trên homepage, âm thanh hoặc leaderboard công khai. Game chơi độc lập; không bắt đạt điểm cao để tìm clue.

## Chuỗi giải đề xuất

1. **Nhận ra dấu hiệu:** motif cam tám múi rất nhỏ trong panel Góc riêng, một múi có nét đứt riêng. Đây là khóa để nhận ra cùng dấu trên trang khác.
2. **Tìm mảnh:** tám route có tám mảnh, mỗi mảnh gồm chỉ số 3 bit và payload 8 bit. Chỉ số viết bằng Gray code; một bảng cặp nhỏ ở Góc riêng cho phép suy ra cách chuyển, không chỉ ghi tên “Gray code”.
3. **Sắp thứ tự:** chuyển chỉ số về nhị phân, đặt mảnh theo vị trí 0–7. Có thể nhận ra mảnh thiếu; không phụ thuộc thứ tự menu hoặc DOM có thể đổi.
4. **Mở khóa:** dấu `⊕` cùng một dãy bit cho phép suy ra XOR. Khóa liên hệ trái cam bằng quy tắc được thể hiện ngay trong motif, không lấy ngày sinh riêng tư hoặc số Rider không được giải thích. XOR từng byte rồi chuyển ASCII để nhận một câu ngắn.
5. **Chốt:** câu đó trỏ tới một chi tiết pixel trong Góc riêng để tìm checksum/mảnh cuối. Nhập mã đúng mở animation cam bung múi + GIF Gaim hoặc palette arcade đặc biệt. Reward chỉ ở Góc riêng, có đóng/reset.

Mã thật và payload chỉ chốt sau playtest. Không đưa đáp án vào client bundle, source map hoặc tài liệu public. Puzzle không phải mật mã an toàn: dữ liệu client thì máy cũng đọc được.

## Vị trí dự kiến

| Route | Clue kín đáo | Không đụng tới |
| --- | --- | --- |
| Home | Nét cắt nhỏ ở chi tiết trang trí sẵn có + SVG attribute | Hero/CTA |
| Work | Attribute ở phần minh họa trang | Filter, cards, thông tin dự án |
| About | Metadata/nét của motif | Kinh nghiệm, năng lực nghề nghiệp |
| Journal | Dấu ở archive, không trong bài CMS | Bài viết; blog trống vẫn có clue |
| Resume | `data-*` ở wrapper, không hiện trên màn hình/bản in | Nội dung CV, PDF |
| Hire | CSS custom property không dùng để layout | Input/error/budget |
| Contact | Attribute trên chi tiết trang trí | Form và dữ liệu liên hệ |
| Playroom | Mảnh cuối + quy tắc + form giải mã | Gameplay độc lập |

Khi triển khai phải xem DOM thật rồi chốt slot. Không gắn clue vào dữ liệu CMS có thể bị sửa/xóa. Header/footer shared không sinh tất cả mảnh trên mọi route. Các trang chi tiết work/blog có thể dùng một clue phụ để kiểm tra quy tắc, không bắt khách mở mọi bài hoặc mọi project.

## DevTools: có thể, nhưng phải sạch

Dùng `data-*` trong Elements, CSS custom property, metadata SVG site thực sự tải. Chọn 2–3 loại, không trộn mười cipher chỉ để tăng độ khó. Nếu dùng console thì chỉ hiện dữ liệu sau thao tác chủ động trong Góc riêng, không console spam.

Không giả lỗi network/stacktrace/cảnh báo bảo mật; không mời paste JS vào console, không đọc cookie/token. Không đổi robots.txt/SEO/structured data thành đáp án. Clue là dữ liệu public có chủ đích, không phải cách bảo vệ admin.

Mobile khó dùng DevTools: cần “bản soi” tùy chọn trong Góc riêng, xem cùng loại dữ liệu của trang đã ghé nhưng không tự liệt kê payload chưa tìm ra. Nếu không làm bản soi thì nói rõ puzzle dành cho desktop, không quảng cáo trải nghiệm ngang nhau.

## Thiết kế kỹ thuật

- Allowlist public routes; không clue ở admin, login, API, preview hoặc trang lỗi.
- Manifest chỉ chứa payload public và version, render theo route; không query DB mỗi clue.
- Xác nhận mã trên server; đáp án trong server-only/env, không truyền vào React props. Giới hạn độ dài/charset, normalize có quy tắc.
- Rate limit bằng store bền vững khi deploy Vercel, không Map trong RAM để giả bảo vệ phân tán. Phản hồi sai chung, không tiết lộ ký tự đúng.
- Không hỏi tên/email, lưu mã nhập, lịch sử duyệt hoặc fingerprint. Nếu đo số lần giải đúng chỉ dùng thống kê tổng hợp.
- Reward là asset vui public; validation tránh lộ đáp án quá dễ, không coi URL phần thưởng là secret.
- Hints ba cấp, bấm mới mở. Không timer ép người dùng ở lại.
- Không hidden focusable element, chữ tương phản cực thấp, zero-width text trong nội dung hoặc alt text phá screen reader. Clue không vào CV/PDF/bản in.
- Có kill switch và puzzle version; sửa CMS không vô tình phá chuỗi giải.

## Roadmap / checklist

- [ ] Chốt chuỗi, mã/checksum; solution sheet nằm ngoài public repo. Hai người playtest độc lập giải được từ clue, không hỏi tác giả.
- [ ] Panel giải mã, server validation, rate limit, reward trước; chưa rải clue.
- [ ] Rải tám mảnh vào slot ổn định. Screenshot trước/sau desktop/mobile và print CV: không dịch layout, không giảm khả năng đọc, không thêm request nặng.
- [ ] Unit test encode/decode/checksum; E2E đúng/sai/rate-limit/version/hints/reset/reduced-motion/keyboard/locale. Không dùng đáp án production trong frontend test public.
- [ ] HR vẫn xem/tải CV, đọc project, gửi liên hệ không cần biết puzzle. DevTools/source không có credential hoặc đáp án.

Khởi đầu với **một puzzle 4–5 lớp có logic chặt**, không năm mươi dấu bí hiểm không nối được với nhau.
