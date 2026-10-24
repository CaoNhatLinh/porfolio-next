# Góc riêng

Route: `/playroom?lang=vi` hoặc `/playroom?lang=en`.

- Giữ GIF Gaim, có dừng/chạy và ảnh tĩnh khi reduced motion.
- Thay game xếp phòng bằng **Flappy Orange**, gameplay kiểu Flappy Bird. Bản 2026-10-11 dùng cảnh marker vẽ tay trên Canvas, cam phi công lái máy bay làm skin mặc định; skin Cam giáp pixel vẫn là phần thưởng. Không dùng asset gốc của Flappy Bird.
- Xóa component, CSS, model và unit test của game xếp phòng cũ. Ảnh nguồn cũ không còn được route nào tải; giữ nguyên vì đây là asset, không phải code.
- Click/chạm hoặc Space/↑ khi focus màn chơi để bay; P/Escape và nút Tạm dừng để nghỉ. Có Tiếp tục và Chơi lại.
- Không tự chạy. Tạm dừng khi đổi tab, browser mất focus hoặc màn chơi cuộn khỏi viewport. Không tự tiếp tục khi trở lại.
- Physics dùng bước cố định 1/120 giây, giới hạn catch-up để tránh nhảy quãng sau khi máy chậm. Canvas scale theo device pixel ratio (tối đa 2), React chỉ cập nhật khi score/phase đổi.
- Kỷ lục lưu localStorage có version, không tài khoản/leaderboard hoặc request backend. Nếu storage bị chặn vẫn chơi bình thường.
- Canvas chỉ là phần hình; điểm và trạng thái có HTML, controls có focus/keyboard. Game phản xạ thị giác chưa có chế độ gameplay cho người không nhìn màn hình; không tuyên bố game hoàn toàn accessible.

## Kiểm tra

`tests/flappy-orange-model.test.ts`: idle/pause, flap/reset, trọng lực, sàn/trần/ống, đi qua khe, điểm một lần, sinh ống.

`tests/e2e/flappy-orange.spec.ts`: bắt đầu, pause/resume, thua/retry, keyboard, mobile, 320/768/1024/1440, reduced-motion, offscreen pause, lỗi runtime.

Easter egg đã triển khai: xem `docs/orange-protocol.md` để biết cách khám phá, bàn giải mã, phần thưởng và yêu cầu cấu hình production. Tài liệu `easter-egg-proposal.md` giữ lại ý tưởng ban đầu.

Kết quả 2026-10-04: 43 unit tests pass; typecheck và targeted ESLint pass; 3 game E2E pass, 4 playroom/GIF/navigation checks pass. Production build chưa hoàn tất vì môi trường không tải được DM Mono/Space Grotesk từ Google Fonts (không phải lỗi game). Screenshot nằm ở `test-results/flappy-orange-desktop.png` và `test-results/flappy-orange-mobile.png`.

## Marker flight — 2026-10-11

### Manh mối mốc 20

Khi một lượt đạt ít nhất 20 điểm, lưu kỷ lục ngay tại mốc đó. Ghi chú trong buồng lái xuất hiện bên dưới màn chơi khi không bay (ready/pause/over), không bật popup hay che vật cản. Ghi chú là gợi ý về vòng cam/chiếc lá, không thay đổi tám fragment hoặc mã giải hiện tại. Dùng kỷ lục đã lưu để xem lại ở lần truy cập sau; không có leaderboard hoặc bằng chứng thành tích server. Nếu localStorage bị chặn, giữ kỷ lục trong phiên và hiển thị cảnh báo lưu thất bại. Kill switch Orange Protocol cũng ẩn ghi chú. E2E `flappy-clue.spec.ts` kiểm tra ngưỡng 19/20/24, ẩn khi chơi, xem lại và VI/EN.

- Art direction đã duyệt: nét to, ít chi tiết, đường viền đứt và vẽ chồng; không quay lại vector trơn hoặc ký họa chi chít.
- Mây xa/gần, hai lớp đồi, vườn cam và đất chạy theo hệ số khoảng cách khác nhau. Tất cả sau ống và máy bay; reduced motion tắt parallax trang trí, giữ chuyển động cần thiết để chơi.
- Máy bay có half-width 20 và half-height 14 đơn vị; qua hẳn đuôi mới ghi điểm. Hai skin dùng chung bounds, không có lợi thế riêng. Nét mép ống nằm trong rectangle va chạm.
- Ready/pause/fail dùng tờ ghi chú; fail có điểm/kỷ lục, focus về Chơi lại. Không thêm timer hoặc hiệu ứng làm chậm retry.
- Caveat Brush chỉ cho tên game/ghi chú tiếng Anh và số; Nunito hỗ trợ tiếng Việt cho nội dung và controls. Fonts scope trong Playroom, tải qua next/font, không đổi CV.
- Asset từ công cụ imagegen tích hợp: `public/media/playroom/orange-pilot-marker.png` (1.55 MB). Không tải ảnh từ dịch vụ ngoài khi chơi. Có fallback Canvas nếu ảnh không tải được. Bản gốc được giữ nguyên trong thư mục generated_images.
- Prompt: “Create a game sprite asset: side-on view of a small orange fruit pilot sitting in an extremely simple stubby blue propeller airplane, airplane nose points RIGHT. One coherent compact subject, entire plane and orange visible, centered, generous transparent margin. Orange round head with one olive leaf, two crude black dots and crooked smile, one simple aviator goggle band. Fuselage one squat sky-blue shape, off-white wing a single broad diagonal stroke, propeller one short charcoal vertical stroke at right. Warm orange head, muted blue plane, charcoal outlines. CRITICAL STYLE: rough human doodle drawn in 10 seconds with almost-dry FAT FELT-TIP MARKER. Chunky SCRAWLY BROKEN outlines, 4 or 5 disconnected awkward arcs for the orange, occasional overshooting corrective strokes. Flat rough marker swipes for fills, leaving tiny unpainted gaps and slight overspill. Very few marks; no polished smooth vector contours, no clean geometric circles, no neat uniform curves. Big simple shapes read well at small game size. The face and plane should look hand-scrawled and imperfect, NOT a professional glossy cartoon mascot. No shading, gradients, 3D, pixel art, drop shadows, white sticker border, text, background, scenery, motion trails, extra objects. Genuinely transparent background. This is a standalone sprite, not a mockup.”
- Kiểm tra: 7 physics tests, 3 game browser tests + luồng giải đố mở skin/ngày đêm; TypeScript, targeted ESLint và production build pass trong lượt cập nhật. Screenshots: `flappy-marker-ready.png`, `flappy-marker-fail.png`, `flappy-marker-fail-mobile.png` trong test-results.
