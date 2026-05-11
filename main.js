document.addEventListener('DOMContentLoaded', () => {
    // Select all inputs
    const reportDate = document.getElementById('reportDate');
    const dayType = document.getElementById('dayType');
    const preparedBy = document.getElementById('preparedBy');

    // ── Recipients Manager (chỉ chạy trên settings.html) ───────
    const STORAGE_KEY = 'fg_recipients';
    const newRecipientInput = document.getElementById('newRecipientInput');
    const addRecipientBtn = document.getElementById('addRecipientBtn');
    const recipientsList = document.getElementById('recipientsList');

    function getRecipients() {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : null;
    }

    function saveRecipients(list) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    }

    function renderRecipients(list) {
        if (!recipientsList) return;
        recipientsList.innerHTML = '';
        if (list.length === 0) {
            recipientsList.innerHTML = '<span style="color:#94a3b8;font-size:13px;">Chưa có email nào. Hãy thêm người nhận.</span>';
            return;
        }
        list.forEach((email, idx) => {
            const tag = document.createElement('div');
            tag.style.cssText = 'display:inline-flex;align-items:center;gap:6px;background:#ede9fe;color:#5b21b6;padding:6px 12px;border-radius:20px;font-size:13px;font-weight:500;';
            tag.innerHTML = `<i data-lucide="mail" style="width:14px;height:14px;"></i>${email}
                <button data-idx="${idx}" style="background:none;border:none;cursor:pointer;color:#7c3aed;padding:0;display:flex;align-items:center;" title="Xóa">
                    <i data-lucide="x" style="width:14px;height:14px;"></i>
                </button>`;
            tag.querySelector('button').addEventListener('click', () => {
                const current = getRecipients() || [];
                current.splice(idx, 1);
                saveRecipients(current);
                renderRecipients(current);
                lucide.createIcons();
            });
            recipientsList.appendChild(tag);
        });
        lucide.createIcons();
    }

    function addRecipient() {
        if (!newRecipientInput) return;
        const email = newRecipientInput.value.trim();
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newRecipientInput.style.borderColor = '#ef4444';
            setTimeout(() => newRecipientInput.style.borderColor = '#e2e8f0', 1500);
            return;
        }
        const current = getRecipients() || [];
        if (current.includes(email)) {
            alert('Email này đã có trong danh sách!');
            return;
        }
        current.push(email);
        saveRecipients(current);
        renderRecipients(current);
        newRecipientInput.value = '';
        newRecipientInput.focus();
    }

    if (addRecipientBtn) addRecipientBtn.addEventListener('click', addRecipient);
    if (newRecipientInput) newRecipientInput.addEventListener('keydown', e => { if (e.key === 'Enter') addRecipient(); });
    // ────────────────────────────────────────────────────────────

    // Section 1
    const revenue = document.getElementById('revenue');
    const revenueVs = document.getElementById('revenueVs');
    const adSpend = document.getElementById('adSpend');
    const adSpendVs = document.getElementById('adSpendVs');
    const roas = document.getElementById('roas');
    const orders = document.getElementById('orders');
    const ordersVs = document.getElementById('ordersVs');
    const csResponse = document.getElementById('csResponse');
    const kocRecruited = document.getElementById('kocRecruited');
    const kocNote = document.getElementById('kocNote');
    const perfNotes = document.getElementById('perfNotes');

    // Section 2
    const coordMedia = document.getElementById('coordMedia');
    const coordMkt = document.getElementById('coordMkt');
    const coordSales = document.getElementById('coordSales');
    const coordCS = document.getElementById('coordCS');

    // Section 3
    const actionMedia = document.getElementById('actionMedia');
    const actionMkt = document.getElementById('actionMkt');
    const actionSales = document.getElementById('actionSales');
    const actionCS = document.getElementById('actionCS');
    const managementNotes = document.getElementById('managementNotes');

    const exportPDFBtn = document.getElementById('exportPDF');

    // Set today's date
    const today = new Date().toLocaleDateString('vi-VN');
    reportDate.valueAsDate = new Date();

    function formatVND(val) {
        if (!val) return '0';
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    function generateMarkdown() {
        const dateStr = reportDate.value || 'N/A';
        const typeStr = dayType.value;
        const author = preparedBy.value || 'N/A';

        const roasVal = parseFloat(roas.value) || 0;
        const roasStatus = roasVal < 10 ? '🔴 Critical (< 10)' : '🟢 Healthy';

        let md = `# Báo cáo hàng ngày (Daily Report) — FusionGroup
**Ngày (Date):** ${dateStr} | **Loại (Type):** ${typeStr} | **Người lập (Prepared by):** ${author}

---

## 📊 SECTION 1 — PERFORMANCE SUMMARY (TÓM TẮT HIỆU SUẤT)
| Metric (Chỉ số) | Value (Giá trị) | Comparison (So sánh) |
| :--- | :--- | :--- |
| **Revenue (Doanh thu)** | ${revenue.value || '0'} VND | ${revenueVs.value || '-'} |
| **Ad Spend (Chi phí QC)** | ${adSpend.value || '0'} VND | ${adSpendVs.value || '-'} |
| **ROAS** | **${roasVal.toFixed(2)}** | ${roasStatus} |
| **Orders (Số đơn hàng)** | ${orders.value || '0'} | ${ordersVs.value || '-'} |
| **CS Response (Phản hồi CSKH)** | ${csResponse.value || '-'} | |
| **KOC Recruited (Số KOC tuyển được)** | ${kocRecruited.value || '0'} | ${kocNote.value || ''} |

**Ghi chú hiệu suất (Performance Notes):**
${perfNotes.value || 'Không có ghi chú thêm.'}

---

## 🔗 SECTION 2 — CROSS-DEPARTMENT COORDINATION (PHỐI HỢP LIÊN PHÒNG BAN)
- **Media → Marketing / Sales:**
  ${coordMedia.value || 'N/A'}
- **Marketing → Online Sales:**
  ${coordMkt.value || 'N/A'}
- **Online Sales → Media / Marketing:**
  ${coordSales.value || 'N/A'}
- **CS Team → All relevant teams:**
  ${coordCS.value || 'N/A'}

---

## ✅ SECTION 3 — ACTION ITEMS FOR TOMORROW (HÀNH ĐỘNG CHO NGÀY MAI)
- **Media Marketing:**
  ${actionMedia.value || 'N/A'}
- **Marketing (HN / HCM):**
  ${actionMkt.value || 'N/A'}
- **Online Sales:**
  ${actionSales.value || 'N/A'}
- **CS Team:**
  ${actionCS.value || 'N/A'}

**Vấn đề cần báo cáo / Quyết định (Escalation):**
${managementNotes.value || 'Không có.'}

---
*Report generated via FusionGroup Daily Dashboard*`;

        return md;
    }

    const sendEmailBtn = document.getElementById('sendEmail');

    function generateHTML() {
        const dateStr = reportDate.value || 'N/A';
        const typeStr = dayType.value;
        const author = preparedBy.value || 'N/A';
        const roasVal = parseFloat(roas.value) || 0;
        const roasStatus = roasVal < 10 ? '🔴 Critical (< 10)' : '🟢 Healthy';
        const roasColor = roasVal < 10 ? '#ef4444' : '#10b981';

        const coordRows = [
            ['#3b82f6', 'Media → Marketing / Sales', coordMedia.value],
            ['#10b981', 'Marketing → Online Sales', coordMkt.value],
            ['#f59e0b', 'Online Sales → Media / Marketing', coordSales.value],
            ['#ec4899', 'CS Team → All relevant teams', coordCS.value],
        ].map(([color, label, val]) => `
            <tr>
              <td style="padding:10px 12px;border:1px solid #e2e8f0;width:35%;vertical-align:top;">
                <span style="display:inline-block;background:${color}22;color:${color};padding:3px 10px;border-radius:20px;font-size:12px;font-weight:600;">${label}</span>
              </td>
              <td style="padding:10px 12px;border:1px solid #e2e8f0;font-size:13px;color:#334155;">${(val || 'N/A').replace(/\n/g, '<br>')}</td>
            </tr>`).join('');

        const actionRows = [
            ['#3b82f6', 'Media Marketing', actionMedia.value],
            ['#10b981', 'Marketing (HN / HCM)', actionMkt.value],
            ['#f59e0b', 'Online Sales', actionSales.value],
            ['#ec4899', 'CS Team', actionCS.value],
        ].map(([color, label, val]) => `
            <tr>
              <td style="padding:10px 12px;border:1px solid #e2e8f0;width:25%;vertical-align:top;">
                <span style="display:inline-block;background:${color}22;color:${color};padding:3px 10px;border-radius:20px;font-size:12px;font-weight:600;">${label}</span>
              </td>
              <td style="padding:10px 12px;border:1px solid #e2e8f0;font-size:13px;color:#334155;">${(val || 'N/A').replace(/\n/g, '<br>')}</td>
            </tr>`).join('');

        return `<div style="font-family:Arial,sans-serif;max-width:700px;margin:0 auto;background:#f8fafc;">
          <div style="background:linear-gradient(135deg,#1e3a8a,#2563eb);padding:28px 32px;border-radius:12px 12px 0 0;">
            <h1 style="color:white;margin:0;font-size:22px;">📊 Báo cáo hàng ngày — FusionGroup</h1>
            <p style="color:#bfdbfe;margin:6px 0 0 0;font-size:14px;">📅 ${dateStr} &nbsp;|&nbsp; ${typeStr} &nbsp;|&nbsp; Người lập (Prepared by): <strong style="color:white;">${author}</strong></p>
          </div>
          <div style="background:#fff;border:1px solid #e2e8f0;padding:24px 32px;">
            <h2 style="color:#1e3a8a;font-size:15px;border-bottom:2px solid #3b82f6;padding-bottom:8px;margin-top:0;">📊 SECTION 1 — PERFORMANCE SUMMARY (TÓM TẮT HIỆU SUẤT)</h2>
            <table style="width:100%;border-collapse:collapse;margin-top:12px;">
              <thead><tr style="background:#eff6ff;">
                <th style="text-align:left;padding:10px 12px;color:#1e40af;font-size:13px;border:1px solid #dbeafe;">Metric (Chỉ số)</th>
                <th style="text-align:left;padding:10px 12px;color:#1e40af;font-size:13px;border:1px solid #dbeafe;">Value (Giá trị)</th>
                <th style="text-align:left;padding:10px 12px;color:#1e40af;font-size:13px;border:1px solid #dbeafe;">Comparison (So sánh)</th>
              </tr></thead>
              <tbody>
                <tr><td style="padding:9px 12px;border:1px solid #e2e8f0;font-weight:600;">Revenue (Doanh thu)</td><td style="padding:9px 12px;border:1px solid #e2e8f0;">${revenue.value || '0'} VND</td><td style="padding:9px 12px;border:1px solid #e2e8f0;">${revenueVs.value || '-'}</td></tr>
                <tr style="background:#f8fafc;"><td style="padding:9px 12px;border:1px solid #e2e8f0;font-weight:600;">Ad Spend (Chi phí QC)</td><td style="padding:9px 12px;border:1px solid #e2e8f0;">${adSpend.value || '0'} VND</td><td style="padding:9px 12px;border:1px solid #e2e8f0;">${adSpendVs.value || '-'}</td></tr>
                <tr><td style="padding:9px 12px;border:1px solid #e2e8f0;font-weight:600;">ROAS</td><td style="padding:9px 12px;border:1px solid #e2e8f0;color:${roasColor};font-weight:700;">${roasVal.toFixed(2)}</td><td style="padding:9px 12px;border:1px solid #e2e8f0;">${roasStatus}</td></tr>
                <tr style="background:#f8fafc;"><td style="padding:9px 12px;border:1px solid #e2e8f0;font-weight:600;">Orders (Số đơn hàng)</td><td style="padding:9px 12px;border:1px solid #e2e8f0;">${orders.value || '0'}</td><td style="padding:9px 12px;border:1px solid #e2e8f0;">${ordersVs.value || '-'}</td></tr>
                <tr><td style="padding:9px 12px;border:1px solid #e2e8f0;font-weight:600;">CS Response (Phản hồi CSKH)</td><td style="padding:9px 12px;border:1px solid #e2e8f0;">${csResponse.value || '-'}</td><td style="padding:9px 12px;border:1px solid #e2e8f0;"></td></tr>
                <tr style="background:#f8fafc;"><td style="padding:9px 12px;border:1px solid #e2e8f0;font-weight:600;">KOC Recruited (Số KOC tuyển được)</td><td style="padding:9px 12px;border:1px solid #e2e8f0;">${kocRecruited.value || '0'}</td><td style="padding:9px 12px;border:1px solid #e2e8f0;">${kocNote.value || ''}</td></tr>
              </tbody>
            </table>
            ${perfNotes.value ? `<div style="margin-top:14px;padding:12px 16px;background:#f0f9ff;border-left:4px solid #3b82f6;border-radius:4px;font-size:13px;color:#334155;">${perfNotes.value.replace(/\n/g,'<br>')}</div>` : ''}
          </div>
          <div style="background:#fff;border:1px solid #e2e8f0;border-top:none;padding:24px 32px;">
            <h2 style="color:#92400e;font-size:15px;border-bottom:2px solid #f59e0b;padding-bottom:8px;margin-top:0;">🔗 SECTION 2 — CROSS-DEPARTMENT COORDINATION (PHỐI HỢP LIÊN PHÒNG BAN)</h2>
            <table style="width:100%;border-collapse:collapse;margin-top:12px;">${coordRows}</table>
          </div>
          <div style="background:#fff;border:1px solid #e2e8f0;border-top:none;padding:24px 32px;">
            <h2 style="color:#1e3a8a;font-size:15px;border-bottom:2px solid #6366f1;padding-bottom:8px;margin-top:0;">✅ SECTION 3 — ACTION ITEMS FOR TOMORROW (HÀNH ĐỘNG CHO NGÀY MAI)</h2>
            <table style="width:100%;border-collapse:collapse;margin-top:12px;">${actionRows}</table>
            ${managementNotes.value ? `<div style="margin-top:14px;padding:12px 16px;background:#fef3c7;border-left:4px solid #f59e0b;border-radius:4px;font-size:13px;color:#78350f;">${managementNotes.value.replace(/\n/g,'<br>')}</div>` : ''}
          </div>
          <div style="background:#1e3a8a;padding:16px 32px;border-radius:0 0 12px 12px;text-align:center;">
            <p style="color:#93c5fd;margin:0;font-size:12px;">🤖 Báo cáo tự động từ FusionGroup Daily Dashboard</p>
          </div>
        </div>`;
    }

    // Initialize EmailJS + Recipients
    fetch('email_config.json')
        .then(res => res.json())
        .then(config => {
            if (config.emailjs && config.emailjs.public_key !== "YOUR_PUBLIC_KEY") {
                emailjs.init(config.emailjs.public_key);
            }
            window.emailConfig = config;

            // Load recipients: localStorage > config defaults
            let stored = getRecipients();
            if (stored === null) {
                stored = config.recipients || [];
                saveRecipients(stored);
            }
            renderRecipients(stored);
        })
        .catch(err => console.error('Failed to load email_config.json:', err));

    sendEmailBtn.addEventListener('click', async () => {
        const config = window.emailConfig;

        if (!config || !config.emailjs || config.emailjs.public_key === "YOUR_PUBLIC_KEY") {
            alert("Vui lòng cấu hình EmailJS trong file email_config.json trước khi gửi.");
            return;
        }

        const originalHTML = sendEmailBtn.innerHTML;
        sendEmailBtn.innerHTML = '<i data-lucide="loader"></i> Đang gửi...';
        lucide.createIcons();
        sendEmailBtn.disabled = true;

        const htmlContent = generateHTML();
        const recipients = getRecipients() || config.recipients || [];
        const reportDateVal = reportDate.value || new Date().toLocaleDateString('vi-VN');
        const subjectVal = `${config.subject || 'FusionGroup Daily Report'} - ${reportDateVal}`;

        if (recipients.length === 0) {
            alert('Chưa có email người nhận! Hãy thêm ít nhất 1 email vào danh sách.');
            sendEmailBtn.innerHTML = originalHTML;
            sendEmailBtn.disabled = false;
            lucide.createIcons();
            return;
        }

        try {
            // Gửi đồng loạt cho từng người trong danh sách
            const sendPromises = recipients.map(email =>
                emailjs.send(config.emailjs.service_id, config.emailjs.template_id, {
                    to_email: email,
                    to_name: email,
                    html_message: htmlContent,
                    report_date: reportDateVal,
                    prepared_by: preparedBy.value || 'N/A',
                    subject: subjectVal
                })
            );

            await Promise.all(sendPromises);

            sendEmailBtn.innerHTML = `<i data-lucide="check"></i> Đã gửi cho ${recipients.length} người!`;
            sendEmailBtn.style.background = '#10b981';
        } catch (error) {
            console.error('EmailJS Error:', error);
            sendEmailBtn.innerHTML = '<i data-lucide="x"></i> Lỗi';
            sendEmailBtn.style.background = '#ef4444';
            alert('Gửi email thất bại: ' + (error.text || JSON.stringify(error)));
        }

        lucide.createIcons();
        setTimeout(() => {
            sendEmailBtn.innerHTML = originalHTML;
            sendEmailBtn.style.background = '';
            sendEmailBtn.disabled = false;
            lucide.createIcons();
        }, 4000);
    });



    async function copyToClipboard(text) {
        if (navigator.clipboard && window.isSecureContext) {
            try {
                await navigator.clipboard.writeText(text);
                return true;
            } catch (err) {
                console.error('navigator.clipboard failed, trying fallback:', err);
            }
        }

        // Fallback for non-secure contexts or failed promise
        try {
            const textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.position = "fixed";
            textArea.style.left = "-9999px";
            textArea.style.top = "0";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);
            return successful;
        } catch (err) {
            console.error('Fallback copy failed:', err);
            return false;
        }
    }

    exportPDFBtn.addEventListener('click', () => {
        const htmlContent = generateHTML();
        const dateStr = reportDate.value || new Date().toLocaleDateString('vi-VN');

        // Inject nội dung báo cáo vào trang hiện tại
        const printDiv = document.createElement('div');
        printDiv.id = 'pdf-print-overlay';
        printDiv.innerHTML = htmlContent;
        document.body.appendChild(printDiv);

        // CSS chỉ hiện printDiv khi in, ẩn mọi thứ khác
        const printStyle = document.createElement('style');
        printStyle.id = 'pdf-print-style';
        printStyle.textContent = `
            @media print {
                body > *:not(#pdf-print-overlay) { display: none !important; }
                #pdf-print-overlay { display: block !important; }
            }
            @page { size: A4; margin: 12mm 14mm; }
            #pdf-print-overlay { display: none; }
        `;
        document.head.appendChild(printStyle);

        // Gọi in, sau đó dọn dẹp
        setTimeout(() => {
            window.print();
            setTimeout(() => {
                document.body.removeChild(printDiv);
                document.head.removeChild(printStyle);
            }, 500);
        }, 150);

        const originalHTML = exportPDFBtn.innerHTML;
        exportPDFBtn.innerHTML = '<i data-lucide="check"></i> Đang in...';
        exportPDFBtn.style.background = '#10b981';
        lucide.createIcons();
        setTimeout(() => {
            exportPDFBtn.innerHTML = originalHTML;
            exportPDFBtn.style.background = '';
            lucide.createIcons();
        }, 3000);
    });

    // Auto-update ROAS warning color
    roas.addEventListener('input', () => {
        const val = parseFloat(roas.value) || 0;
        const warning = document.getElementById('roasWarning');
        if (val < 10) {
            warning.style.color = '#ef4444';
            warning.textContent = 'Critical (< 10)';
        } else {
            warning.style.color = '#10b981';
            warning.textContent = 'Bình thường (Healthy ≥ 10)';
        }
    });

    // ── Auto Scheduler ──────────────────────────────────────────
    let lastSentDate = null;
    setInterval(() => {
        const schedule = JSON.parse(localStorage.getItem('fg_schedule') || '{}');
        if (!schedule.enabled || !schedule.time) return;

        const now = new Date();
        const currentHourMin = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
        const currentDate = now.toLocaleDateString('vi-VN');

        if (currentHourMin === schedule.time && lastSentDate !== currentDate) {
            console.log('Triggering auto-send at', currentHourMin);
            lastSentDate = currentDate; // Ngăn gửi nhiều lần trong cùng 1 phút
            
            // Hiện thông báo nhỏ góc màn hình
            const notif = document.createElement('div');
            notif.style.cssText = 'position:fixed;bottom:20px;left:20px;background:#1e3a8a;color:white;padding:12px 20px;border-radius:8px;font-size:14px;z-index:9999;box-shadow:0 4px 12px rgba(0,0,0,0.2);';
            notif.innerHTML = '🤖 Đang chạy tự động gửi báo cáo...';
            document.body.appendChild(notif);
            setTimeout(() => notif.remove(), 5000);

            sendEmailBtn.click();
        }
    }, 60000); // Check mỗi 60 giây
});
