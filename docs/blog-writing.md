# Viết và quản lý blog

## Trạng thái hiện tại

Blog có editor Markdown song ngữ, preview, upload/chèn ảnh, lưu bản nháp, sửa, xuất bản, ẩn và lưu trữ. Các thao tác cần đăng nhập bằng tài khoản admin đã cấu hình trong Supabase. Không có chế độ bỏ qua đăng nhập.

Đã bỏ ba bài mock khỏi public fallback và khỏi script seed/import. Việc này không tự xóa record đã có trong một Supabase project. Nếu đã seed trước đây, kiểm tra ba slug sau trong admin, chuyển sang Lưu trữ rồi Xóa sau khi xác nhận đó vẫn là bài mẫu, không phải bài đã được sửa thành nội dung của bạn:

- `clarity-in-complex-systems`
- `type-safety-as-a-design-tool`
- `animations-that-serve-function`

Không xóa bài khác chỉ vì nội dung ngắn hoặc chưa có ảnh.

## Bắt đầu một bài

1. Mở `/admin/articles/new` sau khi đăng nhập.
2. Chọn Trang trắng hoặc một trong ba gợi ý: booking/state, TypeScript union, UI motion.
3. Chỉnh nội dung, đặc biệt những đoạn kể trải nghiệm cá nhân. Gợi ý là ví dụ kỹ thuật, chưa phải record trong database và chưa được xuất bản.
4. Kiểm tra cả tiếng Việt và English trong Xem trước.
5. Bấm Tạo bản nháp. Sau khi lưu thành công, mở bài từ danh sách để chỉnh tiếp.
6. Chỉ chọn Xuất bản khi đã kiểm tra nội dung, code và ảnh. Ngày xuất bản do CMS ghi nhận, không dùng ngày giả từ bài mẫu.

Các gợi ý nằm trong `app/features/content/article-starters.ts`. Sơ đồ SVG riêng nằm trong `public/media/journal/`: sắc nét ở nhiều kích thước, không lấy screenshot của dự án khác làm ảnh cho bài.

## Giọng viết

Blog dùng “mình”, như đang giải thích cho một dev khác. Không giả vờ kể một sự cố production chưa từng xảy ra. Có thể viết “vd”, “ok”, “btw”, “:D” hoặc “=))” khi thực sự hợp ngữ cảnh. Không chèn vào mọi đoạn và không dùng trong hướng dẫn lỗi quan trọng. Emoji là tùy chọn, không phải thành phần bắt buộc của bài.

Ví dụ: “Mảng rỗng ở đây đang có hai nghĩa: chưa tải xong hoặc không còn lịch. Mình tách hai case ra, để UI không báo hết lịch khi request thực ra đang lỗi.”

Tránh: “Giải pháp kiến tạo trải nghiệm liền mạch, thể hiện năng lực tư duy hệ thống vượt trội.”

Giữ thuật ngữ IT khi nó tự nhiên: request, state, transaction, query key. Giải thích bằng tình huống, không dịch thành những cụm lạ. English cũng viết như lời giải thích trực tiếp, không dịch từng từ từ bản Việt.

Không ép bài vào một số từ hoặc một dàn ý chung. Một lỗi nhỏ có thể chỉ cần vài đoạn; một quyết định kiến trúc cần thêm ngữ cảnh và trade-off. Những phần thường có ích: tình huống, ví dụ, giải thích code, hạn chế, cách thử lại. Dùng khi cần, không biến chúng thành tiêu đề bắt buộc.

## Ảnh và code

Upload ảnh bằng bộ chọn ảnh trong editor. Thay chữ “Nội dung” trong Markdown ảnh bằng mô tả cụ thể, rồi viết chú thích ở dòng riêng:

```markdown
![Đổi chuyến từ 08:00 sang 10:00 sẽ bỏ ghế B5 đã chọn](/media/journal/booking-seat-state.svg)

*Sơ đồ minh họa state, không phải screenshot của app đang chạy.*
```

Code có tên ngôn ngữ, ví dụ `ts` hoặc `css`. Sau code, nói rõ input/output, vì sao cần nhánh kiểm tra, và điều snippet chưa giải quyết. Ghi rõ các hàm phụ giả định như `getSlots` hoặc `setState` nếu đoạn code không phải một chương trình đầy đủ.

Trước khi đăng: không chứa key, mật khẩu, dữ liệu khách hàng hay thông tin công ty chưa được phép chia sẻ. Ảnh có người, logo hoặc screenshot từ bên thứ ba cần kiểm tra quyền sử dụng và thông tin nhạy cảm.

## Cấu hình lần đầu

Supabase dashboard cần tài khoản riêng; tài khoản admin của portfolio được tạo trong Auth của project, không tự động là tài khoản dashboard. Người dùng tự nhập mật khẩu và chấp nhận điều khoản nếu có. Các biến URL/anon key/service role key lưu trong `.env.local` (không commit); service role key chỉ ở server. Áp dụng migration theo thứ tự và kiểm tra RLS trước khi sử dụng CMS.

Không chạy seed cũ hoặc tự xuất bản các gợi ý để lấp trang trống.
