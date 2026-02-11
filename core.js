/* * EDUTECH CORE LIBRARY v1.0
 * Hệ thống nộp bài kiểm tra tập trung.
 * Bản quyền: Admin Trường.
 * Vui lòng không chỉnh sửa các thông số cấu hình bên dưới.
 */

(function(window) {
    'use strict';

    // 1. CẤU HÌNH HỆ THỐNG (BÍ MẬT)
    const _CONFIG = {
        // URL Google Apps Script của bạn
        ENDPOINT: "https://script.google.com/macros/s/AKfycbw1eNz2FzJAblDvygSOm-qOnW-_eTEN2j1zsjvyVlg-XwaYYS7DrGFg0Qn-EUDiUfbPFg/exec",
        // ID Google Spreadsheet của bạn
        SHEET_ID: "1RVd9SqnypaZbBUvkCcX3sre2HoyEc8dZ1hhnHmHeh8g"
    };

    class EduTechSystem {
        constructor() {
            console.log("%c EduTech Core Ready ", "background: #2ecc71; color: #fff; border-radius: 3px;");
        }

        /**
         * Gửi kết quả về Google Sheet
         * @param {Object} data - Dữ liệu bài thi { tenBai, hoTen, lop, diemTong }
         * @param {Function} onSuccess - Hàm chạy khi thành công
         * @param {Function} onError - Hàm chạy khi lỗi
         */
        submitResult(data, onSuccess, onError) {
            // Validate dữ liệu cơ bản
            if (!data.tenBai || !data.hoTen || !data.lop || data.diemTong === undefined) {
                console.error("EduTech Error: Thiếu thông tin bắt buộc (tenBai, hoTen, lop, diemTong)");
                if (onError) onError("Thiếu thông tin nộp bài.");
                return;
            }

            const formData = new FormData();
            
            // Dữ liệu người dùng
            formData.append('Ten_Bai', data.tenBai);
            formData.append('Ho_Ten', data.hoTen);
            formData.append('Lop', data.lop);
            formData.append('Diem_Tong', data.diemTong);

            // Tham số hệ thống (Ẩn với người dùng cuối)
            formData.append('TARGET_ID', _CONFIG.SHEET_ID);
            formData.append('TARGET_SHEET', ''); // Mặc định sheet đầu tiên

            // Gửi request
            fetch(_CONFIG.ENDPOINT, {
                method: 'POST',
                mode: 'no-cors', // Quan trọng để bypass lỗi CORS của Google
                body: formData
            })
            .then(() => {
                // Vì no-cors không trả về status 200, ta mặc định thành công nếu fetch chạy xong
                if (onSuccess) onSuccess();
            })
            .catch((error) => {
                console.error("EduTech Error:", error);
                if (onError) onError(error);
            });
        }
    }

    // Xuất ra biến toàn cục để file HTML gọi được
    window.EduTech = new EduTechSystem();

})(window);
