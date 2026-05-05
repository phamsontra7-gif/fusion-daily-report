document.addEventListener('DOMContentLoaded', () => {
    // Select all inputs
    const reportDate = document.getElementById('reportDate');
    const dayType = document.getElementById('dayType');
    const preparedBy = document.getElementById('preparedBy');

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

    // Initialize EmailJS with your Public Key
    // You'll need to fetch this from config or hardcode it
    fetch('email_config.json')
        .then(res => res.json())
        .then(config => {
            emailjs.init(config.emailjs.public_key);
            window.emailConfig = config;
        });

    sendEmailBtn.addEventListener('click', async () => {
        const markdown = generateMarkdown();
        const config = window.emailConfig;

        if (!config || config.emailjs.public_key === "YOUR_PUBLIC_KEY") {
            alert("Please configure email_config.json with your EmailJS credentials.");
            return;
        }

        const originalHTML = sendEmailBtn.innerHTML;
        sendEmailBtn.innerHTML = '<i data-lucide="loader"></i> Sending...';
        lucide.createIcons();

        const templateParams = {
            to_name: "FusionGroup Managers",
            message: markdown,
            report_date: reportDate.value,
            prepared_by: preparedBy.value,
            recipients: config.recipients.join(', ')
        };

        try {
            await emailjs.send(
                config.emailjs.service_id,
                config.emailjs.template_id,
                templateParams
            );

            sendEmailBtn.innerHTML = '<i data-lucide="check"></i> Sent via Web!';
            sendEmailBtn.style.background = '#10b981';
        } catch (error) {
            console.error('EmailJS Error:', error);
            sendEmailBtn.innerHTML = '<i data-lucide="x"></i> Error';
            sendEmailBtn.style.background = '#ef4444';
            alert('Failed to send: ' + JSON.stringify(error));
        }

        lucide.createIcons();
        setTimeout(() => {
            sendEmailBtn.innerHTML = originalHTML;
            sendEmailBtn.style.background = '';
            lucide.createIcons();
        }, 3000);
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
