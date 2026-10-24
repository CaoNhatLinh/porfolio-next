# Interface X-Ray

## Mục tiêu

Tạo một interactive signature ngắn trong portfolio để người xem nhận ra năng lực frontend, motion và system thinking mà không nhầm đây là một dự án game.

## Trải nghiệm cốt lõi

1. Người xem gặp một product surface hoàn chỉnh.
2. Khi rê chuột hoặc kéo trên màn hình cảm ứng, một thấu kính hé lộ lớp bên dưới đúng tại vị trí đang xem.
3. Ba chế độ cung cấp ba góc nhìn: hệ thống bố cục, trạng thái sản phẩm và accessibility.
4. Người dùng có thể rời thử nghiệm bất kỳ lúc nào; không có score, timer hoặc flow bắt buộc.

## Phạm vi MVP

- Route riêng `/lab/interface-x-ray` với tiếng Việt và tiếng Anh.
- Pointer interaction cho mouse, pen và touch.
- Điều khiển bằng phím mũi tên khi focus vào stage.
- Ba lớp: System, States, Accessibility.
- Responsive tại 320, 768, 1024 và 1440px.
- `prefers-reduced-motion` giữ nguyên thông tin và bỏ transition không cần thiết.
- Không tải ảnh, WebGL hoặc thư viện runtime mới.

## Art direction

- **Ý đồ:** làm lộ phần kỹ thuật bằng một cử chỉ trực tiếp, không dùng lời quảng cáo.
- **Layout:** editorial intro kết hợp một product surface có cấu trúc bất đối xứng.
- **Màu:** ink/paper hiện tại; cam Kamling chỉ dành cho focus và thấu kính; mint/blue phân biệt lớp kỹ thuật.
- **Typography:** display face hiện tại cho nhịp lớn, mono cho metadata và annotation.
- **Motif:** một vòng tròn duy nhất đóng vai trò công cụ, không dùng particle, glow dày hoặc nền công nghệ giả.

## Interaction states

| Surface | Default | Hover/drag | Keyboard | Reduced motion |
| --- | --- | --- | --- | --- |
| Stage | Lens tại vùng dữ liệu | Lens đi theo pointer | Arrow keys dịch 24px | Không nội suy chuyển động |
| Layer control | System được chọn | Hover tăng contrast | Tab + Enter/Space | Không transition |
| Lens | System blueprint | Đổi nội dung theo layer | Giữ vị trí hiện tại | Nội dung vẫn đầy đủ |

## Lộ trình triển khai

### Phase 1 — Prototype

- [x] Dựng route thử nghiệm tách biệt.
- [x] Tạo surface và ba underlay không phụ thuộc dữ liệu thật.
- [x] Hoàn thiện pointer, touch và keyboard interaction.
- [x] Thêm responsive và reduced-motion fallback.

### Phase 2 — Review với người dùng

- [x] Kiểm tra interaction và visual hierarchy trong browser ở desktop/mobile.
- [x] Chốt art direction nền giấy sáng + workbench tối.
- [x] Chọn release/deployment surface làm nội dung minh họa.
- [x] Chốt vị trí xuất hiện trong About/Lab, không đưa lên homepage.

### Phase 3 — Production integration

- [x] Tách product surface, technical underlay và inspection model thành component thật.
- [x] Liên kết từ About/Lab tới route độc lập.
- [x] Ghi analytics cho lần tương tác đầu và mỗi lần đổi layer.
- [x] Giữ client component trong route độc lập để không tăng JavaScript cho homepage/About.
- [ ] Thêm entry quản trị Supabase Lab nếu cần quản lý trạng thái publish từ admin.
- [ ] Thêm ảnh preview tĩnh cho metadata/social sharing.

### Phase 4 — Hardening

- [x] Browser smoke desktop/mobile và kiểm tra console.
- [x] Kiểm tra heading, group label, `aria-pressed`, `aria-live` và keyboard instructions.
- [x] Không render React theo từng pixel; chỉ cập nhật state khi vùng inspection thay đổi.
- [x] Kiểm tra responsive trực quan ở desktop và mobile.
- [ ] Device matrix thật: Safari iOS, Chrome Android, Firefox và NVDA/VoiceOver.

## Tiêu chí chấp nhận

- Người thử nghiệm bắt đầu tương tác trong tối đa 3 giây mà không cần đọc hướng dẫn dài.
- Pointer giữ phản hồi ổn định và không làm React render lại trên mỗi frame.
- Touch không chặn cuộn trang dọc ngoài lúc người dùng trực tiếp kéo thấu kính.
- Tất cả chế độ dùng được bằng bàn phím.
- Không có console error, lỗi type, lint hoặc build.
- Trải nghiệm không làm chậm các trang portfolio chính khi chưa được mở.

## Không làm

- Score, timer, level, achievement hoặc leaderboard.
- Physics, particle system, âm thanh hoặc WebGL.
- Hiện code dài chỉ để tạo cảm giác kỹ thuật.
- Bắt người dùng hoàn thành tương tác trước khi xem portfolio.
- Tự động chèn vào homepage trước khi prototype được duyệt.

## Câu hỏi cần chốt sau prototype

- Surface cuối sẽ dùng project thật nào để chứng minh năng lực mạnh nhất?
- Nên để thử nghiệm như một route độc lập hay preview trực tiếp trong About?
- Có cần nút dẫn tới case study tương ứng sau khi người xem khám phá đủ ba lớp không?
