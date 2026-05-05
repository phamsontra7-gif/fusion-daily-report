document.addEventListener('DOMContentLoaded', () => {
    // Select all inputs
    const reportDate = document.getElementById('reportDate');
    const dayType = document.getElementById('dayType');
    const preparedBy = document.getElementById('preparedBy');

    // ── Recipients Manager ──────────────────────────────────────
    const STORAGE_KEY = 'fg_recipients';
    const newRecipientInput = document.getElementById('newRecipientInput');
    const addRecipientBtn = document.getElementById('addRecipientBtn');
    const recipientsList = document.getElementById('recipientsList');

    function getRecipients() {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : null; // null = chưa có, sẽ dùng từ config
    }

    function saveRecipients(list) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    }

    function renderRecipients(list) {
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

    addRecipientBtn.addEventListener('click', addRecipient);
    newRecipientInput.addEventListener('keydown', e => { if (e.key === 'Enter') addRecipient(); });
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

    const copyBtn = document.getElementById('copyMarkdown');

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
        const roasStatus = roasVal < 5.5 ? '🔴 Critical (< 5.5)' : '🟢 Healthy';

        let md = `# Daily Report — FusionGroup
**Date:** ${dateStr} | **Type:** ${typeStr} | **Prepared by:** ${author}

---

## 📊 SECTION 1 — PERFORMANCE SUMMARY
| Metric | Value | Comparison |
| :--- | :--- | :--- |
| **Revenue** | ${revenue.value || '0'} VND | ${revenueVs.value || '-'} |
| **Ad Spend** | ${adSpend.value || '0'} VND | ${adSpendVs.value || '-'} |
| **ROAS** | **${roasVal.toFixed(2)}** | ${roasStatus} |
| **Orders** | ${orders.value || '0'} | ${ordersVs.value || '-'} |
| **CS Response** | ${csResponse.value || '-'} | |
| **KOC Recruited** | ${kocRecruited.value || '0'} | ${kocNote.value || ''} |

**Performance Notes:**
${perfNotes.value || 'No additional notes.'}

---

## 🔗 SECTION 2 — CROSS-DEPARTMENT COORDINATION
- **Media → Marketing / Sales:**
  ${coordMedia.value || 'N/A'}
- **Marketing → Online Sales:**
  ${coordMkt.value || 'N/A'}
- **Online Sales → Media / Marketing:**
  ${coordSales.value || 'N/A'}
- **CS Team → All relevant teams:**
  ${coordCS.value || 'N/A'}

---

## ✅ SECTION 3 — ACTION ITEMS FOR TOMORROW
- **Media Marketing:**
  ${actionMedia.value || 'N/A'}
- **Marketing (HN / HCM):**
  ${actionMkt.value || 'N/A'}
- **Online Sales:**
  ${actionSales.value || 'N/A'}
- **CS Team:**
  ${actionCS.value || 'N/A'}

**Escalation / Decisions Needed:**
${managementNotes.value || 'None.'}

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
        const roasStatus = roasVal < 5.5 ? '🔴 Critical (< 5.5)' : '🟢 Healthy';
        const roasColor = roasVal < 5.5 ? '#ef4444' : '#10b981';

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
            <h1 style="color:white;margin:0;font-size:22px;">📊 Daily Report — FusionGroup</h1>
            <p style="color:#bfdbfe;margin:6px 0 0 0;font-size:14px;">📅 ${dateStr} &nbsp;|&nbsp; ${typeStr} &nbsp;|&nbsp; Prepared by: <strong style="color:white;">${author}</strong></p>
          </div>
          <div style="background:#fff;border:1px solid #e2e8f0;padding:24px 32px;">
            <h2 style="color:#1e3a8a;font-size:15px;border-bottom:2px solid #3b82f6;padding-bottom:8px;margin-top:0;">📊 SECTION 1 — PERFORMANCE SUMMARY</h2>
            <table style="width:100%;border-collapse:collapse;margin-top:12px;">
              <thead><tr style="background:#eff6ff;">
                <th style="text-align:left;padding:10px 12px;color:#1e40af;font-size:13px;border:1px solid #dbeafe;">Metric</th>
                <th style="text-align:left;padding:10px 12px;color:#1e40af;font-size:13px;border:1px solid #dbeafe;">Value</th>
                <th style="text-align:left;padding:10px 12px;color:#1e40af;font-size:13px;border:1px solid #dbeafe;">Comparison</th>
              </tr></thead>
              <tbody>
                <tr><td style="padding:9px 12px;border:1px solid #e2e8f0;font-weight:600;">Revenue</td><td style="padding:9px 12px;border:1px solid #e2e8f0;">${revenue.value || '0'} VND</td><td style="padding:9px 12px;border:1px solid #e2e8f0;">${revenueVs.value || '-'}</td></tr>
                <tr style="background:#f8fafc;"><td style="padding:9px 12px;border:1px solid #e2e8f0;font-weight:600;">Ad Spend</td><td style="padding:9px 12px;border:1px solid #e2e8f0;">${adSpend.value || '0'} VND</td><td style="padding:9px 12px;border:1px solid #e2e8f0;">${adSpendVs.value || '-'}</td></tr>
                <tr><td style="padding:9px 12px;border:1px solid #e2e8f0;font-weight:600;">ROAS</td><td style="padding:9px 12px;border:1px solid #e2e8f0;color:${roasColor};font-weight:700;">${roasVal.toFixed(2)}</td><td style="padding:9px 12px;border:1px solid #e2e8f0;">${roasStatus}</td></tr>
                <tr style="background:#f8fafc;"><td style="padding:9px 12px;border:1px solid #e2e8f0;font-weight:600;">Orders</td><td style="padding:9px 12px;border:1px solid #e2e8f0;">${orders.value || '0'}</td><td style="padding:9px 12px;border:1px solid #e2e8f0;">${ordersVs.value || '-'}</td></tr>
                <tr><td style="padding:9px 12px;border:1px solid #e2e8f0;font-weight:600;">CS Response</td><td style="padding:9px 12px;border:1px solid #e2e8f0;">${csResponse.value || '-'}</td><td style="padding:9px 12px;border:1px solid #e2e8f0;"></td></tr>
                <tr style="background:#f8fafc;"><td style="padding:9px 12px;border:1px solid #e2e8f0;font-weight:600;">KOC Recruited</td><td style="padding:9px 12px;border:1px solid #e2e8f0;">${kocRecruited.value || '0'}</td><td style="padding:9px 12px;border:1px solid #e2e8f0;">${kocNote.value || ''}</td></tr>
              </tbody>
            </table>
            ${perfNotes.value ? `<div style="margin-top:14px;padding:12px 16px;background:#f0f9ff;border-left:4px solid #3b82f6;border-radius:4px;font-size:13px;color:#334155;">${perfNotes.value.replace(/\n/g,'<br>')}</div>` : ''}
          </div>
          <div style="background:#fff;border:1px solid #e2e8f0;border-top:none;padding:24px 32px;">
            <h2 style="color:#92400e;font-size:15px;border-bottom:2px solid #f59e0b;padding-bottom:8px;margin-top:0;">🔗 SECTION 2 — CROSS-DEPARTMENT COORDINATION</h2>
            <table style="width:100%;border-collapse:collapse;margin-top:12px;">${coordRows}</table>
          </div>
          <div style="background:#fff;border:1px solid #e2e8f0;border-top:none;padding:24px 32px;">
            <h2 style="color:#1e3a8a;font-size:15px;border-bottom:2px solid #6366f1;padding-bottom:8px;margin-top:0;">✅ SECTION 3 — ACTION ITEMS FOR TOMORROW</h2>
            <table style="width:100%;border-collapse:collapse;margin-top:12px;">${actionRows}</table>
            ${managementNotes.value ? `<div style="margin-top:14px;padding:12px 16px;background:#fef3c7;border-left:4px solid #f59e0b;border-radius:4px;font-size:13px;color:#78350f;">${managementNotes.value.replace(/\n/g,'<br>')}</div>` : ''}
          </div>
          <div style="background:#1e3a8a;padding:16px 32px;border-radius:0 0 12px 12px;text-align:center;">
            <p style="color:#93c5fd;margin:0;font-size:12px;">🤖 Automated report from FusionGroup Daily Dashboard</p>
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



    copyBtn.addEventListener('click', () => {
        const md = generateMarkdown();
        navigator.clipboard.writeText(md).then(() => {
            const originalHTML = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i data-lucide="check"></i> Copied to Clipboard!';
            lucide.createIcons();
            copyBtn.style.background = '#10b981';
            
            setTimeout(() => {
                copyBtn.innerHTML = originalHTML;
                lucide.createIcons();
                copyBtn.style.background = '';
            }, 2000);
        });
    });

    // Auto-update ROAS warning color
    roas.addEventListener('input', () => {
        const val = parseFloat(roas.value) || 0;
        const warning = document.getElementById('roasWarning');
        if (val < 5.5) {
            warning.style.color = '#ef4444';
            warning.textContent = 'Critical (< 5.5)';
        } else {
            warning.style.color = '#10b981';
            warning.textContent = 'Healthy (≥ 5.5)';
        }
    });
});
