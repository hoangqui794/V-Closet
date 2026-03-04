Để đạt được mục tiêu "thử đồ ảo" chân thực nhất mà không làm người dùng cảm thấy phiền phức (đặc biệt là Gen Z rất ngại nhập số liệu khô khan), bạn nên thiết kế quy trình thu thập dữ liệu cơ thể theo 3 cấp độ từ dễ đến khó.

Dưới đây là chiến lược thu thập dữ liệu tối ưu cho **V-Closet**:

---

### 1. Cấp độ 1: Trắc nghiệm thị giác (Visual Quiz) - Nhanh nhất

Đây là bước bắt buộc trong quá trình Onboarding (mở ứng dụng lần đầu). Thay vì bắt nhập số đo, hãy cho họ chọn hình ảnh.

* **Cách làm:** Hiển thị 5 hình ảnh đại diện cho 5 dáng người (Đồng hồ cát, Quả lê, v.v.) kèm mô tả ngắn gọn bằng ngôn ngữ Gen Z.
* **Dữ liệu thu về:** Nhãn dáng người cơ bản.
* **Ưu điểm:** Hoàn thành trong 5 giây, tạo cảm giác app rất "hiểu chuyện".

### 2. Cấp độ 2: Scan cơ thể qua AI (AI Body Scanning) - "Wow" nhất

Vì bạn đã có **Gemini 3.1 Flash**, đây là lúc tận dụng tối đa sức mạnh của nó.

* **Cách làm:** 1.  Người dùng đứng trước gương hoặc nhờ bạn bè chụp một tấm ảnh toàn thân (khuyên dùng quần áo ôm sát để chính xác nhất).
2.  Hệ thống gửi ảnh này lên Server.
3.  **Gemini 3.1 Flash** sẽ phân tích các điểm chốt (Keypoints) như độ rộng vai, vòng eo, độ nở của hông để tự động tính toán tỷ lệ.
* **Dữ liệu thu về:** Tỷ lệ cơ thể thực tế mà không cần thước dây.
* **Ưu điểm:** Tính năng này cực kỳ viral trên TikTok, giúp người dùng cảm thấy app rất công nghệ.

### 3. Cấp độ 3: Nhập số đo thủ công - Chính xác nhất

Dành cho những người dùng kỹ tính hoặc muốn đặt may/mua đồ chuẩn size nhất.

* **Cách làm:** Cung cấp một giao diện hình người 2D. Khi người dùng chạm vào phần nào (ngực, eo, hông, chiều cao, cân nặng), một ô nhập liệu sẽ hiện ra.
* **Dữ liệu thu về:** Chỉ số chính xác đến từng centimet.

---

### 4. Quy trình đề xuất (The Golden Path)

Để tối ưu tỷ lệ giữ chân người dùng, bạn nên áp dụng quy trình "Hybrid":

1. **Mới vào app:** Cho chọn dáng người bằng hình ảnh (Cấp độ 1).
2. **Khi muốn dùng tính năng "Phối đồ ảo":** Gợi ý người dùng "Hãy để AI scan cơ thể bạn để xem outfit chuẩn nhất" (Cấp độ 2).
3. **Trong phần Profile:** Luôn có mục "Số đo cá nhân" để họ cập nhật thủ công nếu muốn (Cấp độ 3).

---

### Lưu ý quan trọng về Quyền riêng tư (Privacy)

Khi thu thập ảnh chụp cơ thể, người dùng sẽ rất lo lắng về bảo mật. Nhóm **Sentinels** cần cam kết:

* Ảnh chụp chỉ dùng để AI trích xuất thông số, sau đó sẽ được xóa ngay lập tức hoặc mã hóa tuyệt đối trên **Viettel vStorage**.
* Hiển thị thông báo: *"Chúng tôi chỉ lưu trữ các chỉ số tỷ lệ, không lưu trữ hình ảnh nhạy cảm của bạn"*.

**Bạn có muốn tôi thiết kế một sơ đồ luồng (Flowchart) từ lúc người dùng mở app đến lúc nhận được kết quả phối đồ dựa trên vóc dáng không?**