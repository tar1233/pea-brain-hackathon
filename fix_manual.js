const fs = require('fs');
let content = fs.readFileSync('src/app/components/TopBar.tsx', 'utf8');

const targetStr = `            {[
              {
                step: "1",
                title: "เปิด Dashboard",
                desc: "เห็น KPI \\"พัสดุ Critical = 2\\" และตารางแจ้งเตือนด่วน รายการ 10067",
                action: "กดปุ่ม \\"ให้ AI สร้างแผนจัดซื้อด่วน\\"",
              },
              {
                step: "2",
                title: "AI วิเคราะห์ (5 วินาที)",
                desc: "เห็น Executive Summary + TCO เปรียบเทียบ: ซื้อทีเดียว ฿520M vs ทยอยซื้อ ฿492M → ประหยัด ฿28M/ปี",
                action: "กด \\"เลือกแผน A → วางแผนจัดซื้อ\\"",
              },
              {
                step: "3",
                title: "หน้า Tracking & Monitoring",
                desc: "เห็นสถานะ 2/4 (อนุมัติแผน) พร้อมดูตาราง Deep Analysis (Demand/Warehouse/Financial)",
                action: "กดปุ่ม \\"ดำเนินการต่อ (จำลอง)\\"",
              },
              {
                step: "4",
                title: "หน้า E-Bidding & PO Generator",
                desc: "AI ร่าง TOR และตรวจสอบ Vendor อัตโนมัติ (ผ่าน 5/5 ราย)",
                action: "กด \\"สร้างใบสั่งซื้อ (PO) อัตโนมัติ\\"",
              },
              {
                step: "5",
                title: "เสร็จสิ้น!",
                desc: "ระบบสร้าง PO (PDF) พร้อมลายเซ็นอนุมัติ และบันทึกเข้าสู่ระบบ SAP",
                action: "กด \\"พิมพ์เอกสาร\\" หรือตรวจสอบได้ใน Tracking สถานะเป็น 3/4",
              }
            ].map((s, i) => (
              <div key={i} className="relative flex items-start gap-4 md:gap-6">
                <div className="sticky top-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-600 text-white font-bold text-[14px] shadow-sm z-10">
                  {s.step}
                </div>
                <div className="flex-1 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:border-purple-200 transition-colors">
                  <h4 className="text-[14px] font-bold text-slate-900">{s.title}</h4>
                  <p className="mt-1 text-[14px] text-slate-600 leading-relaxed">{s.desc}</p>
                  <div className="text-[14px] text-purple-600 font-bold mt-2">👆 {s.action}</div>
                </div>
              </div>
            ))}`;

const replacementStr = `            {[
              {
                step: "1",
                title: "เปิดหน้า Dashboard",
                desc: "เห็น KPI \\"พัสดุ Critical = 2\\" และตารางแจ้งเตือนด่วน รายการ 10067",
                action: "กดปุ่ม \\"ให้ AI สร้างแผนจัดซื้อด่วน\\"",
                img: "01_dashboard.png"
              },
              {
                step: "2",
                title: "AI วิเคราะห์ (5 วินาที)",
                desc: "เห็น Executive Summary + TCO เปรียบเทียบ: ซื้อทีเดียว ฿520M vs ทยอยซื้อ ฿492M → ประหยัด ฿28M/ปี",
                action: "กด \\"เลือกแผน A → วางแผนจัดซื้อ\\"",
                img: "02_ai_analysis.png"
              },
              {
                step: "3",
                title: "ไปหน้า Tracking",
                desc: "เห็น Stepper: ✅ วิเคราะห์ → ✅ อนุมัติแผน → 🔵 จัดซื้อ PO → ⬜ ส่งมอบ",
                action: "กดขยายรายการ 10067",
                img: "03_tracking.png"
              },
              {
                step: "4",
                title: "ดู Deep Analysis",
                desc: "AI เฝ้าระวังการจัดส่งให้ด้วย หาก Supplier เสี่ยงส่งช้า AI จะสร้าง Decision Matrix",
                action: "กดปุ่ม \\"AI วิเคราะห์แผนสำรอง\\"",
                img: "04_ai_alert.png"
              },
              {
                step: "5",
                title: "เปรียบเทียบ Emergency Decision",
                desc: "AI เทียบให้ว่า จะยืมของจากคลังอื่น หรือจะเร่งรัด Supplier เดิม อันไหนคุ้มกว่ากัน",
                action: "กด \\"ยืนยันแผน A (ยืมคลังใกล้เคียง)\\"",
                img: "05_emergency.png"
              }
            ].map((s, i) => (
              <div key={i} className="relative flex items-start gap-4 md:gap-6">
                <div className="sticky top-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-600 text-white font-bold text-[14px] shadow-sm z-10">
                  {s.step}
                </div>
                <div className="flex-1 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:border-purple-200 transition-colors">
                  <h4 className="text-[14px] font-bold text-slate-900">{s.title}</h4>
                  <p className="mt-1 text-[14px] text-slate-600 leading-relaxed">{s.desc}</p>
                  <div className="text-[14px] text-purple-600 font-bold mt-2 mb-2">👆 {s.action}</div>
                  {s.img && (
                    <div className="mt-3 overflow-hidden rounded-lg border border-slate-200 shadow-sm">
                      <img src={\`/manual/\${s.img}\`} alt={s.title} className="w-full h-auto object-cover object-top" />
                    </div>
                  )}
                </div>
              </div>
            ))}`;

content = content.replace(targetStr, replacementStr);
fs.writeFileSync('src/app/components/TopBar.tsx', content);
console.log("Replaced Case Study section");
