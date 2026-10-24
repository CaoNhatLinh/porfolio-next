# Orange Protocol / op-1

## Nâng cấp — 2026-10-11

- Đã chuyển particle canvas sang layout public dùng chung; bỏ các canvas lặp ở Home/Hire/Contact. Layer đứng sau nội dung và bị ẩn khi in.
- Đã xóa collector tự động. Chế độ khám phá opt-in cho phép mở dấu khắc, xoay khớp rồi ghi mảnh vào sổ. Phím Escape đóng và trả focus về dấu; có nút đóng trên mobile. Không tự thu thập khi chỉ mở trang.
- Bản soi có bàn giải mã: kéo-thả hoặc nút lên/xuống để sắp mảnh, tám công tắc XOR và preview ASCII. Không tự sắp đúng hoặc tự điền đáp án.
- Game có sprite cam và Cam giáp dùng cùng dữ liệu cho canvas/ảnh xem trước, phong cảnh vườn cam, nông trại, hàng rào, mây và parallax. Màn chờ phóng mascot; khi chơi giữ nguyên hitbox và tốc độ.
- Phần thưởng có skin, ngày/đêm và lựa chọn lưu localStorage, schema version 1. Đóng panel không xóa phần thưởng. Không có tài khoản hoặc đồng bộ thiết bị; phần thưởng cosmetic không phải tài sản được bảo vệ, người sửa localStorage có thể tự mở.
- Khi storage bị chặn, UI thông báo không lưu được thay vì báo thành công; game và đọc manh mối vẫn hoạt động.

## Trải nghiệm đã triển khai

- Tám mảnh độc lập với CMS trên Home, Work, About, Journal, Resume, Hire, Contact và Playroom. Dấu nhỏ có `data-op-fragment`; mặc định chỉ trang trí. Bật khám phá mới có button/tab stop và bảng mở mảnh theo yêu cầu. Không âm thanh; không in dấu khi in CV.
- Góc riêng có nơi nhập mã, ba gợi ý mở theo mức và Bản soi cho người dùng điện thoại. Bản soi chỉ ghi tám mảnh trong sessionStorage của tab, không gửi lịch sử duyệt lên server.
- Quy luật gồm Gray code, tám múi cam, XOR, ASCII và chiếc lá. Không ghi đáp án nguyên văn trong client bundle hoặc tài liệu này. Đây là trò chơi khám phá, không phải biện pháp bảo mật.
- Mã đúng mở palette vườn cam ban đêm và Cam giáp; có xem trước, chọn skin, đổi ngày/đêm và đóng/mở lại panel. Mở khóa và lựa chọn lưu trên thiết bị.
- Game dùng canvas pixel, cảnh parallax, không autoplay, tự dừng khi đổi tab/rời màn chơi; hỗ trợ chạm, click, Space, mũi tên lên, P/Escape. Không có leaderboard hoặc âm thanh.

## API và vận hành

`POST /api/orange-protocol/attempts`: JSON `{ code, version: "op-1" }`, body tối đa 512 byte. Phản hồi không cache. Kiểm tra origin, phiên bản, định dạng và digest trên server. Mã sai trả 422; 429 có Retry-After; lỗi hạ tầng trả 503, không giả vờ mã sai.

Giới hạn 5 lượt/phút/IP theo cửa sổ cố định. Development chưa có service key dùng bộ đếm trong process. Production bắt buộc có Supabase cấu hình và RPC `consume_contact_attempt` hiện có; key HMAC được phân namespace và theo phút, không chia quota với contact. Chưa cấu hình thì fail closed (503). Proxy triển khai phải cung cấp header IP đáng tin cậy (Vercel).

Ngày 2026-10-11 đã kiểm tra server `next start` riêng với cấu hình Supabase đã lưu: mã đúng trả 200/night-orchard, mã sai trả 422/INCORRECT, lượt thứ sáu trả 429/RATE_LIMITED kèm Retry-After. Đây là kiểm tra production runtime + Supabase thật, **không phải đã deploy Vercel**. File cấu hình được loại khỏi Git, không ghi khóa trong tài liệu/log.

Website development vẫn dùng nội dung hiện có, chưa chuyển toàn bộ sang CMS: các bảng projects/articles trong Supabase còn trống. Không sao chép cấu hình đầy đủ vào `.env.local` khi chưa nhập nội dung vì sẽ làm danh sách dự án hiện tại trống. Khi triển khai Vercel, cấu hình biến môi trường trong dashboard và nhập nội dung CMS là công việc triển khai riêng.

`NEXT_PUBLIC_ORANGE_PROTOCOL_ENABLED=false` tắt clue, panel và API. Đây là biến build-time: build/deploy lại khi đổi. Không đưa service key vào biến NEXT_PUBLIC.

## Kiểm tra

Unit tests: input, origin, giới hạn body, phiên bản, rate limit, hạ tầng lỗi và dữ liệu phần thưởng hỏng. E2E: tương tác đủ tám mảnh (xác nhận không tự thu thập), mở phần thưởng, đổi skin/palette, đóng và tải lại; bàn giải mã bằng keyboard/drag; tám route có duy nhất một nền tĩnh khi reduced motion; game khởi động, pause, resume, thua, retry và mobile.

Khi đổi câu đố: cập nhật version, các fragment, dial, verifier digest và tests cùng lúc. Không cài mã giải hay thông tin quản trị vào manh mối.

## Nghiệm thu giao diện

### Art direction A — arcade công nghiệp (2026-10-11)

Theo lựa chọn của chủ portfolio: thay composition của Orange Protocol, không đổi game hay contract giải mã. Nền than trải ngang, chữ display đậm, rotor có vòng thép và vạch chia; giữ nguyên dữ liệu tám múi và chiếc lá. Phần thưởng dùng một sprite lớn và thanh chọn skin theo hàng thay cho hai card bằng nhau. Bàn giải mã dùng cùng token màu; hiệu ứng đổi skin ngắn và tắt khi reduced motion. Không thêm thư viện, font hoặc ảnh raster.

Kiểm tra bổ sung: `protocol-industrial.spec.ts` kiểm tra trạng thái mở thưởng, chọn skin bằng bàn phím, không tràn ngang ở 320/768/1024/1440px, cả VI/EN và không có page error. Ảnh nằm trong `test-results/protocol-industrial-{locale}-{width}.png`. Test này giả lập phản hồi mở khóa để kiểm tra UI; luồng giải mã thật vẫn do `orange-protocol.spec.ts` kiểm chứng.

Kết quả cuối 2026-10-11: 50 unit tests, 25 Playwright tests toàn dự án, TypeScript, ESLint trên phần thay đổi và `next build` đều thành công. Đã xem ảnh desktop/mobile, nền sáng/tối, panel phần thưởng và CV print. Server kiểm tra production tạm thời đã dừng; dev server vẫn ở cổng 3002.

| Yêu cầu | Bằng chứng |
| --- | --- |
| Nền dùng chung, không chặn link, hoạt động khi cuộn | `particle-network.spec.ts`, ảnh work/contact |
| Tám trang, giảm chuyển động | `protocol-workbench.spec.ts` |
| Manh mối không tự lưu, giải và mở thưởng thật | `orange-protocol.spec.ts` |
| Sắp mảnh bằng kéo/thả và bàn phím, khóa XOR | `protocol-workbench.spec.ts` |
| Skin/ngày đêm giữ sau tải lại | `orange-protocol.spec.ts`, `orange-reward.test.ts` |
| Lưu trữ bị chặn không báo lưu thành công | `protocol-workbench.spec.ts` |
| Tắt khám phá đồng bộ tab, panel màn hình thấp | `protocol-regressions.spec.ts` |
| Escape và focus sau xoay/lưu/đóng | `protocol-regressions.spec.ts`, `protocol-workbench.spec.ts` |
| Không hiện nền/manh mối trong bản in CV; nền ở chi tiết dự án | `protocol-regressions.spec.ts` |
| Game pause/resume/retry, responsive 320–1440 | `flappy-orange.spec.ts` |
